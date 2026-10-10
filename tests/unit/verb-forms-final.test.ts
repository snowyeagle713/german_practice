import { describe, expect, it } from 'vitest';
import batch from '../../content/verb-forms-final.json';
import earlier from '../../content/verb-forms-batch-2.json';
import previous from '../../content/verb-forms-batch-1.json';
import pilot from '../../content/verb-forms-pilot.json';
import seed from '../../content/seed-pack.json';
import facts from '../../content/source/verb-forms-final-verification.json';
import pilotFacts from '../../content/source/verb-forms-verification.json';
import previousFacts from '../../content/source/verb-forms-batch-1-verification.json';
import earlierFacts from '../../content/source/verb-forms-batch-2-verification.json';
import review from '../../content/source/verb-forms-v1-review.json';
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
const catalog = validateCatalog([validateAnyContent(seed), validateAnyContent(pilot), validateAnyContent(previous), validateAnyContent(earlier), pack]);
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

describe('Verb Forms final batch content audit', () => {
  it('closes disjoint global block membership and compares all 960 fields with captured reference facts', () => {
    const forms = [validateContentV2(pilot), validateContentV2(previous), validateContentV2(earlier), pack];
    const items = forms.flatMap(p => p.items), questions = forms.flatMap(p => p.questions);
    const blocks = forms.flatMap(p => p.blocks);
    const captured = [pilotFacts, previousFacts, earlierFacts, facts].flatMap(f => f.verifiedFacts);
    expect(captured).toHaveLength(240);
    expect(new Set(captured.map(f => f.infinitive)).size).toBe(240);
    for (const item of items) {
      const row = captured.find(f => f.infinitive === item.title)!;
      for (const key of ['present3', 'praeteritum', 'participle', 'auxiliary'] as const) expect(item.properties[key]).toBe(row[key]);
    }
    expect(new Set(blocks.map(b => b.id)).size).toBe(24);
    expect(blocks.flatMap(b => b.itemIds).sort()).toEqual(items.map(i => i.id).sort());
    expect(blocks.flatMap(b => b.questionIds).sort()).toEqual(questions.map(q => q.id).sort());
  });
  it('provides one consolidated review entry per verb and explicitly retains important modal/variant gaps', () => {
    const items = [pilot, previous, earlier, batch].flatMap(p => p.items);
    expect(review.records.map(r => r.itemId).sort()).toEqual(items.map(i => i.id).sort());
    expect(review.records.every(r => r.routineReview.length === 2 && r.reviewStatus.includes('no independent'))).toBe(true);
    expect(review.records.filter(r => r.priority === 'focused')).toHaveLength(104);
    for (const lemma of ['sein', 'dürfen', 'müssen', 'sollen', 'senden', 'wenden', 'vorliegen']) expect(review.deferredCandidates.some(c => c.lemma === lemma)).toBe(true);
    expect(review.records.find(r => r.lemma === 'wollen')!.reviewFlags.some(f => f.category === 'modal-special-paradigm')).toBe(true);
  });
  it('rejects malformed/non-Latin example text and audits near-identical final-batch contexts globally', () => {
    const all = [pilot, previous, earlier, batch].flatMap(p => p.items.map(i => ({ ...i, packId: p.packId })));
    const stop = new Set('er die der das den dem des hat haben ist sind im in am an auf zu zur zum von vom mit eine einen einem einer ein und für bei nach als sich es'.split(' '));
    const examples = all.flatMap(i => i.examples.map(e => ({ itemId: i.id, packId: i.packId, text: e.de, words: new Set((e.de.toLowerCase().match(/[a-zäöüß]+/gu) ?? []).filter(w => !stop.has(w))) })));
    expect(examples).toHaveLength(400);
    for (const e of examples) {
      expect(e.text).toMatch(/[.!?]$/u);
      expect(e.text).not.toMatch(/___|[\p{Script=Cyrillic}\p{Script=Greek}]|\s{2,}/u);
    }
    const flagged: string[] = [];
    for (const [n, a] of examples.entries()) for (const b of examples.slice(0, n)) {
      if (a.itemId === b.itemId || (a.packId !== pack.packId && b.packId !== pack.packId)) continue;
      const shared = [...a.words].filter(w => b.words.has(w)).length;
      if (shared >= 3 && shared / new Set([...a.words, ...b.words]).size >= .6) flagged.push(`${a.itemId}/${b.itemId}`);
    }
    expect(flagged).toEqual([]);
  });
  it('adds 50 canonical verbs, five ten-verb blocks, 350 questions; catalog totals are 240 forms / 1680 questions', () => {
    expect(pack.items).toHaveLength(50); expect(pack.blocks).toHaveLength(5); expect(pack.questions).toHaveLength(350);
    expect(catalog.flatMap(itemsForPack)).toHaveLength(250);
    const forms = catalog.filter(p => p.schemaVersion === 2);
    expect(forms.flatMap(p => p.items)).toHaveLength(240);
    expect(forms.flatMap(p => p.questions)).toHaveLength(1680);
    expect(forms.flatMap(p => p.blocks)).toHaveLength(24);
    const titles = pack.items.map(i => i.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'de')));
    expect(pack.items.filter(i => i.level === 'B1')).toHaveLength(12);
    expect(pack.items.filter(i => i.level === 'B2')).toHaveLength(29);
    expect(pack.items.filter(i => i.level === 'A2')).toHaveLength(1);
    expect(pack.items.filter(i => i.level === 'C1')).toHaveLength(8);
    expect(pack.items.filter(i => i.levelNote.includes('B2+/C1-oriented'))).toHaveLength(12);
    expect(facts.verifiedFacts.filter(f => f.productiveBand === 'b2-core')).toHaveLength(25);
    expect(pack.items.filter(i => i.properties.classification === 'strong')).toHaveLength(26);
    expect(pack.items.filter(i => i.properties.classification === 'mixed')).toHaveLength(0);
    expect(pack.items.filter(i => i.properties.classification === 'irregular')).toHaveLength(1);
    expect(pack.items.filter(i => i.properties.classification === 'weak')).toHaveLength(23);
    expect(pack.items.filter(i => i.properties.separability === 'separable')).toHaveLength(8);
    expect(pack.items.filter(i => i.properties.separability === 'inseparable')).toHaveLength(18);
    expect(pack.items.filter(i => i.properties.separability === 'none')).toHaveLength(24);
  });
  it('has no duplicate IDs, normalized lemmas, examples or prompt/answer pairs across all four forms packs', () => {
    const forms = [validateContentV2(pilot), validateContentV2(previous), validateContentV2(earlier), pack];
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
    expect(rotationKey(pack, block.id)).toBe(`verb-forms-final:1:${block.id}`);
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
    if (['past-recall', 'participle-recall', 'present-recall', 'sequence-choice'].includes(q.templateId)) expect(q.prompt).toContain(item.meaningEn);
  });
  it('scopes standalone wanting, abstract sein, transitive stoßen, weak veranlassen and excluded modal templates', () => {
    const item = pack.items.find(i => i.title === 'wollen')!;
    expect(item.meaningEn).toContain('standalone');
    expect(item.properties.auxiliaryNote).toContain('Ersatzinfinitiv');
    const q = pack.questions.find(q => q.id === 'forms-wollen-participle-recall')!;
    expect(gradeAnswer(q, { kind: 'text', value: 'gewollt' })).toBe(true);
    expect(gradeAnswer(q, { kind: 'text', value: 'wollen' })).toBe(false);
    for (const lemma of ['gelingen', 'entfallen', 'hervorgehen', 'sinken', 'steigen']) expect(pack.items.find(i => i.title === lemma)!.properties.auxiliary).toBe('sein');
    expect(pack.items.find(i => i.title === 'stoßen')!.properties.auxiliaryNote).toContain('Intransitive');
    expect(pack.items.find(i => i.title === 'stoßen')!.properties.auxiliary).toBe('haben');
    expect(pack.items.find(i => i.title === 'veranlassen')!.properties).toMatchObject({ classification: 'weak', praeteritum: 'veranlasste', participle: 'veranlasst' });
    for (const lemma of ['dürfen', 'müssen', 'sollen']) {
      expect(facts.deferredCandidates.map(c => c.lemma)).toContain(lemma);
      expect(pack.items.some(i => i.title === lemma)).toBe(false);
    }
  });
  it('round-trips new completed evidence, revision and mixed v1/pilot/new-block progress without regrading old sessions', () => {
    const old = finish(createSession(validateAnyContent(seed), seed.blocks[0]!.id, deps(), { size: 10 }));
    const pilotRun = finish(createSession(validateContentV2(pilot), pilot.blocks[0]!.id, deps(), { size: 10 }));
    const previousRun = finish(createSession(validateContentV2(previous), previous.blocks[0]!.id, deps(), { size: 10 }));
    const added = finish(createSession(pack, pack.blocks[4]!.id, deps(), { size: 20 }), true);
    expect(summarize(added)).toMatchObject({ total: 20, wrong: 1, assisted: 1, unaidedCorrect: 18, accuracy: .9 });
    const plan = revisionPlan(revisionItems([old, pilotRun, previousRun, added]))!;
    expect(plan.pack.packId).toBe(pack.packId);
    const revision = finish(createSession(plan.pack, plan.blockId, deps(), { questionIds: plan.questionIds }));
    const sessions = [old, pilotRun, previousRun, added, revision];
    expect(revisionItems(sessions)).toHaveLength(0); expect(summarize(added).accuracy).toBe(.9);
    const backup = makeBackup({ ...emptyData(), sessions }, at);
    expect(backup.schemaVersion).toBe(2); expect(parseBackup(JSON.stringify(backup)).sessions).toEqual(sessions);
    const metrics = progressMetrics(catalog, sessions);
    expect(metrics.blocks).toHaveLength(25); expect(metrics.constructions).toHaveLength(250);
    expect(metrics.blocks.find(b => b.blockId === added.blockId)!.answered).toBe(20);
  });
});
