import { describe, expect, it } from 'vitest';
import seed from '../../content/seed-pack.json';
import { validateContent } from '../../src/domain/content/validate';
import { entriesForBlock } from '../../src/domain/content/selectors';

function fixture() { return structuredClone(seed); }
describe('seed contract and block lookups', () => {
  it('loads the full fixed 40-question pool without modifying the authored content', () => {
    const input = fixture();
    const before = structuredClone(input);
    const pack = validateContent(input);
    expect(pack.entries).toHaveLength(10);
    expect(pack.questions).toHaveLength(40);
    expect(pack.blocks).toHaveLength(1);
    const block = pack.blocks[0]!;
    expect(block.questionIds).toHaveLength(40);
    expect(new Set(block.questionIds)).toEqual(new Set(pack.questions.map(question => question.id)));
    expect(entriesForBlock(pack, block)).toEqual(pack.entries);
    expect(input).toEqual(before);
  });
  it('derives construction counts from referenced questions and retains authored entry order', () => {
    const pack = validateContent(fixture());
    const block = { ...pack.blocks[0]!, questionIds: [pack.questions[4]!.id, pack.questions[0]!.id, pack.questions[1]!.id] };
    expect(entriesForBlock(pack, block).map(entry => entry.id)).toEqual([pack.entries[0]!.id, pack.entries[1]!.id]);
  });
});

describe('reject malformed or inconsistent content before rendering', () => {
  const cases: [string, (pack: ReturnType<typeof fixture>) => void][] = [
    ['unsupported schema version', pack => { pack.schemaVersion = 2; }],
    ['nonpositive pack version', pack => { pack.packVersion = 0; }],
    ['invalid case', pack => { pack.entries[0]!.governedCase = 'nominative'; }],
    ['unknown question type', pack => { pack.questions[0]!.type = 'free_text'; }],
    ['blank text', pack => { pack.entries[0]!.meaningEn = '   '; }],
    ['unexpected fields', pack => { Object.assign(pack, { extra: true }); }],
    ['duplicate entry IDs', pack => { pack.entries[1]!.id = pack.entries[0]!.id; }],
    ['duplicate question IDs', pack => { pack.questions[1]!.id = pack.questions[0]!.id; }],
    ['duplicate block IDs', pack => { pack.blocks.push(structuredClone(pack.blocks[0]!)); }],
    ['duplicate example IDs', pack => { pack.entries[1]!.examples[0]!.id = pack.entries[0]!.examples[0]!.id; }],
    ['missing technical example', pack => { pack.entries[0]!.examples[1]!.domain = 'everyday'; }],
    ['unknown entry', pack => { pack.questions[0]!.entryId = 'missing'; }],
    ['cross-entry example reference', pack => { pack.questions[0]!.exampleId = pack.entries[1]!.examples[0]!.id; }],
    ['missing answers', pack => { pack.questions[0]!.acceptedAnswers = []; }],
    ['equivalent answers', pack => { pack.questions[0]!.acceptedAnswers = ['auf', ' AUF ']; }],
    ['missing preposition answer', pack => { pack.questions[0]!.acceptedAnswers = ['an']; }],
    ['missing blank', pack => { pack.questions[0]!.prompt = 'No blank here.'; }],
    ['multiple blanks', pack => { pack.questions[0]!.prompt = '___ ___'; }],
    ['cloze mismatch', pack => { pack.questions[0]!.prompt = 'Ich freue mich ___ ein anderes Beispiel.'; }],
    ['missing cloze example', pack => { pack.questions[0]!.exampleId = null; }],
    ['duplicate choice IDs', pack => { pack.questions[2]!.choices![1]!.id = pack.questions[2]!.choices![0]!.id; }],
    ['equivalent choice text', pack => { pack.questions[2]!.choices![1]!.text = ' ACCUSATIVE '; }],
    ['missing correct choice', pack => { pack.questions[2]!.correctChoiceId = 'missing'; }],
    ['incorrect governed-case reference', pack => { pack.questions[2]!.correctChoiceId = 'dative'; }],
    ['duplicate pool membership', pack => { pack.blocks[0]!.questionIds.push(pack.blocks[0]!.questionIds[0]!); }],
    ['unknown question in pool', pack => { pack.blocks[0]!.questionIds[0] = 'missing'; }],
    ['uncovered question', pack => { pack.blocks[0]!.questionIds.pop(); }],
    ['entry with no questions', pack => {
      const entry = structuredClone(pack.entries[0]!);
      entry.id = 'uncovered-entry';
      entry.examples.forEach(example => { example.id = `new-${example.id}`; });
      pack.entries.push(entry);
    }],
  ];
  it.each(cases)('rejects %s', (_name, mutate) => {
    const input = fixture();
    mutate(input);
    expect(() => validateContent(input)).toThrow();
  });
  it.each([null, [], {}, 'not a pack', 1])('rejects non-pack input %j', input => {
    expect(() => validateContent(input)).toThrow();
  });
});
