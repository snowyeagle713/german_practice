import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../../../content/content-v2.schema.json';
import type { ContentPackV2, VerbForm, VerbQuestion } from './v2';
import { principalSequence } from './v2';

const validator = new Ajv2020({ allErrors: true, strict: true }).compile<ContentPackV2>(schema);
const normalize = (value: string) => value.normalize('NFC').trim().replace(/\s+/gu, ' ').toLowerCase();
function requireValid(value: boolean, reason: string): asserts value { if (!value) throw new Error(`V2 content invalid: ${reason}`); }
function unique(values: string[], reason: string) { requireValid(new Set(values).size === values.length, reason); }
export function canonicalVerbAnswer(item: VerbForm, question: VerbQuestion): string {
  switch (question.facetId) {
    case 'sequence': return principalSequence(item);
    case 'infinitive': return item.properties.infinitive;
    case 'present': return item.properties.present3;
    default: return item.properties[question.facetId];
  }
}
export function hintLeaksAnswer(hints: string[], answer: string): boolean {
  // Compare whole words/phrases, not incidental substrings such as "sein" in a longer word.
  const words = normalize(hints.join(' ')).replace(/[^\p{L}\p{N}]+/gu, ' ');
  const target = normalize(answer).replace(/[^\p{L}\p{N}]+/gu, ' ');
  return ` ${words} `.includes(` ${target} `);
}
export function validateContentV2(input: unknown): ContentPackV2 {
  if (!validator(input)) throw new Error(`Content schema invalid (v2): ${validator.errors?.map(error => `${error.instancePath} ${error.message}`).join('; ')}`);
  const pack = input;
  unique(pack.items.map(item => item.id), 'duplicate item IDs');
  unique(pack.questions.map(question => question.id), 'duplicate question IDs');
  unique(pack.blocks.map(block => block.id), 'duplicate block IDs');
  unique(pack.items.flatMap(item => item.examples.map(example => example.id)), 'duplicate example IDs');
  for (const item of pack.items) {
    const form = item.properties;
    requireValid(item.title === form.infinitive && item.alphabeticalGroup === form.infinitive[0]!.toLocaleUpperCase('de'), `${item.id}: alphabetical/title mismatch`);
    requireValid(form.separability === 'none' ? form.prefix === null : Boolean(form.prefix && form.infinitive.startsWith(form.prefix)), `${item.id}: separability/prefix mismatch`);
    if (form.stemChange) requireValid(form.stemChange.from !== form.stemChange.to && form.infinitive.includes(form.stemChange.from) && form.present3.includes(form.stemChange.to), `${item.id}: stem-change mismatch`);
    requireValid(item.examples.some(example => example.de === form.auxiliaryContext), `${item.id}: auxiliary context must be an authored example`);
  }
  const facets = { 'past-recall': 'praeteritum', 'participle-recall': 'participle', 'auxiliary-choice': 'auxiliary', 'infinitive-recall': 'infinitive', 'present-recall': 'present', 'sentence-completion': 'participle', 'sequence-choice': 'sequence' };
  for (const question of pack.questions) {
    const item = pack.items.find(item => item.id === question.itemId);
    requireValid(Boolean(item), `${question.id}: unknown item`); if (!item) throw new Error('Unknown item');
    const example = item.examples.find(example => example.id === question.exampleId);
    requireValid(Boolean(example), `${question.id}: unknown example`);
    requireValid(question.facetId === facets[question.templateId], `${question.id}: template/facet mismatch`);
    const choiceTemplate = question.templateId === 'auxiliary-choice' || question.templateId === 'sequence-choice';
    requireValid((question.type === 'verb_form_choice') === choiceTemplate, `${question.id}: unsupported template response`);
    const answer = canonicalVerbAnswer(item, question);
    if (question.type === 'verb_form_text') {
      unique(question.acceptedAnswers.map(normalize), `${question.id}: equivalent answers`);
      requireValid(question.acceptedAnswers.every(value => normalize(value) === normalize(answer)), `${question.id}: answer not matching canonical form`);
      if (question.templateId === 'sentence-completion') requireValid(question.prompt.split('___').length === 2 && question.prompt.replace('___', answer) === example?.de, `${question.id}: completion/example mismatch`);
    } else {
      unique(question.choices.map(choice => choice.id), `${question.id}: duplicate choice IDs`);
      unique(question.choices.map(choice => normalize(choice.text)), `${question.id}: equivalent choice text`);
      requireValid(question.choices.find(choice => choice.id === question.correctChoiceId)?.text === answer, `${question.id}: correct choice/canonical mismatch`);
      if (question.templateId === 'auxiliary-choice') {
        const context = item.properties.auxiliaryContext.replace(item.properties.auxiliary === 'sein' ? ' ist ' : ' hat ', ' ___ ');
        requireValid(question.prompt === `Perfekt: ${context} Choose the infinitive of the auxiliary.`, `${question.id}: auxiliary context mismatch`);
      }
      if (question.templateId === 'auxiliary-choice') requireValid(question.choices.length === 2 && question.choices.some(choice => choice.text === 'haben') && question.choices.some(choice => choice.text === 'sein'), `${question.id}: auxiliary options`);
    }
    requireValid(!hintLeaksAnswer(question.hint, answer), `${question.id}: hint reveals answer`);
  }
  const covered = new Set<string>();
  const coveredItems = new Set<string>();
  for (const block of pack.blocks) {
    const questions = block.questionIds.map(id => pack.questions.find(question => question.id === id));
    requireValid(questions.every(Boolean), `${block.id}: unknown question`);
    requireValid(block.itemIds.every(id => pack.items.some(item => item.id === id)), `${block.id}: unknown block item`);
    requireValid(questions.every(question => question && block.itemIds.includes(question.itemId)), `${block.id}: question outside item membership`);
    requireValid(block.itemIds.every(id => questions.some(question => question?.itemId === id)), `${block.id}: item without questions`);
    block.questionIds.forEach(id => covered.add(id)); block.itemIds.forEach(id => coveredItems.add(id));
  }
  requireValid(covered.size === pack.questions.length && coveredItems.size === pack.items.length, 'uncovered items/questions');
  function checkText(value: unknown): void {
    if (typeof value === 'string') requireValid(value.trim().length > 0, 'blank text');
    else if (Array.isArray(value)) value.forEach(checkText);
    else if (value && typeof value === 'object') Object.values(value).forEach(checkText);
  }
  checkText(pack);
  return pack;
}
