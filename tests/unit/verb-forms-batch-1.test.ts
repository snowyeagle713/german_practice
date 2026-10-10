import { describe, expect, it } from 'vitest';
import batch from '../../content/verb-forms-batch-1.json';
import pilot from '../../content/verb-forms-pilot.json';
import seed from '../../content/seed-pack.json';
import facts from '../../content/source/verb-forms-batch-1-verification.json';
import { validateAnyContent, validateCatalog, rotationKey } from '../../src/domain/content/catalog';
import { canonicalVerbAnswer, hintLeaksAnswer, validateContentV2 } from '../../src/domain/content/validate-v2';
import { isTextQuestion, itemsForPack } from '../../src/domain/content/types';
import { gradeAnswer } from '../../src/domain/practice/grading';
import { createSession, currentQuestion, transition } from '../../src/domain/practice/session';
import { summarize } from '../../src/domain/practice/summary';
import { revisionItems, revisionPlan } from '../../src/domain/practice/revision';
import { progressMetrics } from '../../src/domain/progress/metrics';
import { makeBackup, parseBackup } from '../../src/storage/backup';
import { emptyData } from '../../src/storage/types';
import type { PracticeSession, Response } from '../../src/domain/practice/types';

const pack = validateContentV2(batch);
const catalog = validateCatalog([validateAnyContent(seed), validateAnyContent(pilot), pack]);
const at = '2026-10-10T15:00:00.000Z';
let serial = 0;
const deps = () => ({ now: () => at, random: () => .99, id: () => `batch-test-${++serial}` });
const normalized = (value: string) => value.normalize('NFC').trim().toLocaleLowerCase('de').replace(/\s+/gu, ' ');
function finish(initial: PracticeSession, mistakes = false): PracticeSession {
  let session = initial;
  while (session.status !== 'completed') {
    const q = currentQuestion(session);
    const correct = !mistakes || session.currentIndex !== 0;
    if (mistakes && session.currentIndex === 1) session = transition(session, { type: 'hint', questionId: q.id });
    const response: Response = isTextQuestion(q) ? { kind: 'text', value: correct ? q.acceptedAnswers[0]! : 'wrong' }
      : { kind: 'choice', choiceId: correct ? q.correctChoiceId : q.choices.find(c => c.id !== q.correctChoiceId)!.id };
    session = transition(session, { type: 'response', questionId: q.id, response });
    session = transition(session, { type: 'submit', questionId: q.id, attemptId: `grade-${++serial}`, submittedAt: at });
    session = transition(session, { type: 'next', questionId: q.id, at });
  }
  return session;
}

describe('Verb Forms batch 1 content audit', () => {
  it('adds exactly 80 canonical verbs, eight ten-verb blocks, 560 questions; catalog totals are 100 forms / 700 questions', () => {
    expect(pack.items).toHaveLength(80); expect(pack.blocks).toHaveLength(8); expect(pack.questions).toHaveLength(560);
    expect(catalog.flatMap(itemsForPack)).toHaveLength(110);
    const forms = catalog.filter(p => p.schemaVersion === 2);
    expect(forms.flatMap(p => p.items)).toHaveLength(100);
    expect(forms.flatMap(p => p.questions)).toHaveLength(700);
    expect(forms.flatMap(p => p.blocks)).toHaveLength(10);
    const titles = pack.items.map(i => i.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'de')));
    expect(pack.items.filter(i => i.level === 'B1')).toHaveLength(47);
    expect(pack.items.filter(i => i.level === 'B2')).toHaveLength(15);
    expect(pack.items.filter(i => i.level === 'A2')).toHaveLength(18);
  });
  it('has no duplicate IDs, normalized lemmas, examples or prompt/answer pairs across either forms pack', () => {
    const forms = [validateContentV2(pilot), pack];
    const items = forms.flatMap(p => p.items), questions = forms.flatMap(p => p.questions);
    const examples = items.flatMap(i => i.examples);
    for (const keys of [items.map(i => i.id), questions.map(q => q.id), examples.map(e => e.id),
      items.map(i => normalized(i.properties.infinitive)), examples.map(e => normalized(e.de)), questions.map(q => normalized(q.prompt)),
      questions.map(q => normalized(q.prompt) + '|' + normalized(canonicalVerbAnswer(items.find(i => i.id === q.itemId)!, q)))]) {
      expect(new Set(keys).size).toBe(keys.length);
    }
    expect(() => validateCatalog([...catalog, pack])).toThrow('conflicting');
    expect(pack.items.every(i => i.levelNote.includes('Editorial') && i.editorialStatus === 'source-checked')).toBe(true);
  });
  it.each(pack.items)('compares $title principal parts and context auxiliary with the captured external reference row', item => {
    const row = facts.verifiedFacts.find(f => f.infinitive === item.title);
    expect(row).toBeDefined();
    for (const key of ['present3', 'praeteritum', 'participle', 'auxiliary'] as const) expect(item.properties[key]).toBe(row![key]);
    expect(item.properties.auxiliaryNote).toBe(row!.editorialScope);
    expect(item.examples[0]!.de).toBe(item.properties.auxiliaryContext);
    const qs = pack.questions.filter(q => q.itemId === item.id);
    expect(qs).toHaveLength(7); expect(new Set(qs.map(q => q.templateId)).size).toBe(7);
    // Repeated isolated/contextual participle answers serve distinct tasks, not duplicated prompts.
    expect(new Set(qs.map(q => normalized(q.prompt))).size).toBe(7);
  });
  it.each(pack.blocks)('checks $id membership, alphabetical ordering, 70-question pool and exact Quick/Standard rotation', block => {
    const items = block.itemIds.map(id => pack.items.find(i => i.id === id)!);
    expect(items).toHaveLength(10); expect(block.questionIds).toHaveLength(70);
    const titles = items.map(i => i.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'de')));
    expect(block.questionIds.every(id => block.itemIds.includes(pack.questions.find(q => q.id === id)!.itemId))).toBe(true);
    for (const size of [10, 20] as const) {
      let cursor = 0; const seen = new Set<string>();
      for (let n = 0; n < 7; n++) {
        const session = createSession(pack, block.id, deps(), { size, cursor });
        expect(session.order).toHaveLength(size); expect(new Set(session.order).size).toBe(size);
        expect(session.order.every(id => block.questionIds.includes(id))).toBe(true);
        session.order.forEach(id => seen.add(id)); cursor = session.rotationNext;
      }
      expect(seen.size).toBe(70);
    }
    expect(rotationKey(pack, block.id)).toBe(`verb-forms-batch-1:1:${block.id}`);
  });
  it.each(pack.questions)('grades $id correctly and rejects each authored distractor with a retrieval-safe hint', q => {
    const item = pack.items.find(i => i.id === q.itemId)!;
    const answer = canonicalVerbAnswer(item, q);
    expect(hintLeaksAnswer(q.hint, answer)).toBe(false);
    if (q.type === 'verb_form_text') {
      expect(gradeAnswer(q, { kind: 'text', value: answer })).toBe(true);
      expect(gradeAnswer(q, { kind: 'text', value: 'wrong' })).toBe(false);
    } else {
      for (const choice of q.choices) expect(gradeAnswer(q, { kind: 'choice', choiceId: choice.id })).toBe(choice.id === q.correctChoiceId);
      if (q.templateId === 'auxiliary-choice') for (const option of ['haben', 'sein']) expect(hintLeaksAnswer(q.hint, option)).toBe(false);
    }
    if (q.templateId === 'sentence-completion') expect(q.prompt.replace('___', answer)).toBe(item.examples.find(e => e.id === q.exampleId)!.de);
    if (item.title === 'schaffen' && ['past-recall', 'participle-recall', 'sequence-choice'].includes(q.templateId)) expect(q.prompt).toContain('not accomplish');
  });
  it('preserves natural variant/sense boundaries without changing grading', () => {
    const q = pack.questions.find(q => q.id === 'forms-schaffen-past-recall')!;
    expect(gradeAnswer(q, { kind: 'text', value: 'schuf' })).toBe(true);
    expect(gradeAnswer(q, { kind: 'text', value: 'schaffte' })).toBe(false);
    expect(pack.items.find(i => i.title === 'ausziehen')!.properties.auxiliary).toBe('sein');
    expect(pack.items.find(i => i.title === 'ziehen')!.properties.auxiliary).toBe('haben');
    expect(pack.items.find(i => i.title === 'lassen')!.properties.auxiliaryNote).toContain('Ersatzinfinitiv');
  });
  it('round-trips new completed evidence, revision and mixed v1/pilot/new-block progress without regrading old sessions', () => {
    const old = finish(createSession(validateAnyContent(seed), seed.blocks[0]!.id, deps(), { size: 10 }));
    const pilotRun = finish(createSession(validateContentV2(pilot), pilot.blocks[0]!.id, deps(), { size: 10 }));
    const added = finish(createSession(pack, pack.blocks[7]!.id, deps(), { size: 20 }), true);
    expect(summarize(added)).toMatchObject({ total: 20, wrong: 1, assisted: 1, unaidedCorrect: 18, accuracy: .9 });
    const plan = revisionPlan(revisionItems([old, pilotRun, added]))!;
    expect(plan.pack.packId).toBe(pack.packId);
    const revision = finish(createSession(plan.pack, plan.blockId, deps(), { questionIds: plan.questionIds }));
    const sessions = [old, pilotRun, added, revision];
    expect(revisionItems(sessions)).toHaveLength(0); expect(summarize(added).accuracy).toBe(.9);
    const backup = makeBackup({ ...emptyData(), sessions }, at);
    expect(backup.schemaVersion).toBe(2); expect(parseBackup(JSON.stringify(backup)).sessions).toEqual(sessions);
    const metrics = progressMetrics(catalog, sessions);
    expect(metrics.blocks).toHaveLength(11); expect(metrics.constructions).toHaveLength(110);
    expect(metrics.blocks.find(b => b.blockId === added.blockId)!.answered).toBe(20);
  });
});
