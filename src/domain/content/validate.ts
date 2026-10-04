import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../../../content/content.schema.json';
import type { ContentPack } from './types';

export class ContentValidationError extends Error {
  override name = 'ContentValidationError';
}
const validator = new Ajv2020({ allErrors: true, strict: true }).compile<ContentPack>(schema);
function requireValid(condition: boolean, message: string): asserts condition {
  if (!condition) throw new ContentValidationError(message);
}
function normalize(text: string): string {
  return text.normalize('NFC').trim().toLowerCase().replace(/\s+/gu, ' ');
}
function index<T extends { id: string }>(items: T[], label: string): Map<string, T> {
  const indexed = new Map(items.map(item => [item.id, item]));
  requireValid(indexed.size === items.length, `${label}: duplicate ID`);
  return indexed;
}

/** Validate all content before any screen receives it; no partial pack is returned. */
export function validateContent(input: unknown): ContentPack {
  if (!validator(input)) {
    const details = validator.errors?.map(error => `${error.instancePath || '/'} ${error.message}`).join('; ');
    throw new ContentValidationError(`Content schema invalid: ${details}`);
  }
  const pack = input;
  const entries = index(pack.entries, 'entries');
  const questions = index(pack.questions, 'questions');
  index(pack.blocks, 'blocks');
  const exampleIds = new Set<string>();
  for (const entry of pack.entries) {
    index(entry.examples, entry.id);
    requireValid(entry.examples.some(example => example.domain === 'everyday') &&
      entry.examples.some(example => example.domain === 'technical'), `${entry.id}: needs both example domains`);
    for (const example of entry.examples) {
      requireValid(!exampleIds.has(example.id), 'example IDs must be globally unique');
      exampleIds.add(example.id);
    }
  }
  for (const question of pack.questions) {
    const entry = entries.get(question.entryId);
    requireValid(Boolean(entry), `${question.id}: unknown entry`);
    if (!entry) throw new ContentValidationError('Unknown entry');
    const example = entry.examples.find(item => item.id === question.exampleId);
    requireValid(question.exampleId === null || Boolean(example), `${question.id}: unknown example`);
    if (question.type === 'preposition_cloze') {
      requireValid(Boolean(example) && question.prompt.split('___').length === 2,
        `${question.id}: cloze needs one blank and example`);
      const answers = question.acceptedAnswers.map(normalize);
      requireValid(new Set(answers).size === answers.length, `${question.id}: equivalent duplicate answers`);
      requireValid(answers.includes(normalize(entry.preposition)), `${question.id}: expected preposition missing`);
      requireValid(question.prompt.replace('___', entry.preposition) === example?.de,
        `${question.id}: cloze does not reconstruct example`);
    } else {
      const choices = index(question.choices, question.id);
      requireValid(choices.has(question.correctChoiceId), `${question.id}: correct choice missing`);
      requireValid(new Set(question.choices.map(choice => normalize(choice.text))).size === question.choices.length,
        `${question.id}: duplicate choice text`);
      if (question.type === 'case_choice') {
        requireValid(question.correctChoiceId === entry.governedCase, `${question.id}: case mismatch`);
      }
    }
  }
  const covered = new Set<string>();
  for (const block of pack.blocks) {
    for (const id of block.questionIds) {
      requireValid(questions.has(id), `${block.id}: unknown question ${id}`);
      covered.add(id);
    }
  }
  requireValid(covered.size === questions.size, 'every question must belong to a block');
  requireValid(new Set(pack.questions.map(question => question.entryId)).size === entries.size,
    'every entry needs questions');
  // The structural schema permits whitespace-only strings; the supplied Python validator rejects them.
  function checkText(value: unknown): void {
    if (typeof value === 'string') requireValid(value.trim().length > 0, 'content contains blank text');
    else if (Array.isArray(value)) value.forEach(checkText);
    else if (value && typeof value === 'object') Object.values(value).forEach(checkText);
  }
  checkText(pack);
  return pack;
}
