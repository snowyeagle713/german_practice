import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import pilot from '../../content/verb-forms-pilot.json';
import seed from '../../content/seed-pack.json';
import verified from '../../content/source/verb-forms-verification.json';
import legacy from '../fixtures/mvp-v1-backup.json';
import { validateAnyContent, validateCatalog, rotationKey, snapshotPack } from '../../src/domain/content/catalog';
import { canonicalVerbAnswer, hintLeaksAnswer, validateContentV2 } from '../../src/domain/content/validate-v2';
import { entriesForBlock } from '../../src/domain/content/selectors';
import { isTextQuestion, itemsForPack, questionItemId } from '../../src/domain/content/types';
import { gradeAnswer } from '../../src/domain/practice/grading';
import { questionHint } from '../../src/domain/practice/hints';
import { createSession, currentQuestion, transition } from '../../src/domain/practice/session';
import { revisionItems, revisionPlan } from '../../src/domain/practice/revision';
import { summarize } from '../../src/domain/practice/summary';
import { progressMetrics } from '../../src/domain/progress/metrics';
import { backupData, makeBackup, parseBackup, validateBackup } from '../../src/storage/backup';
import { IndexedDbRepository } from '../../src/storage/indexedDb';
import { emptyData } from '../../src/storage/types';
import type { PracticeSession, Response } from '../../src/domain/practice/types';
const pack = validateContentV2(pilot);
const at = '2026-10-10T12:00:00.000Z';
let serial = 0;
const deps = () => ({ random: () => .99, now: () => at, id: () => `v2-test-${++serial}` });
function response(session: PracticeSession, correct = true): Response {
  const q = currentQuestion(session);
  return isTextQuestion(q) ? { kind: 'text', value: correct ? q.acceptedAnswers[0]! : 'wrong' }
    : { kind: 'choice', choiceId: correct ? q.correctChoiceId : q.choices.find(choice => choice.id !== q.correctChoiceId)!.id };
}
function submit(session: PracticeSession, correct = true): PracticeSession {
  const id = currentQuestion(session).id;
  return transition(transition(session, { type: 'response', questionId: id, response: response(session, correct) }), { type: 'submit', questionId: id, attemptId: `answer-${++serial}`, submittedAt: at });
}
function finish(initial: PracticeSession, mistakes = false) {
  let session = initial;
  while (session.status !== 'completed') {
    const id = currentQuestion(session).id;
    if (mistakes && session.currentIndex === 1) session = transition(session, { type: 'hint', questionId: id });
    session = submit(session, !(mistakes && session.currentIndex === 0));
    session = transition(session, { type: 'next', questionId: id, at });
  }
  return session;
}

describe('v2 content and source facts', () => {
  it('coexists with untouched v1 content, two ten-item alphabetical blocks and 70-question pools', () => {
    expect(validateAnyContent(seed)).toEqual(seed);
    expect(validateCatalog([validateAnyContent(seed), pack])).toHaveLength(2);
    expect(pack.items).toHaveLength(20); expect(pack.questions).toHaveLength(140);
    expect(new Set(pack.questions.map(q => q.templateId)).size).toBe(7);
    for (const block of pack.blocks) {
      expect(block.itemIds).toHaveLength(10); expect(block.questionIds).toHaveLength(70);
      const labels = entriesForBlock(pack, block).map(item => 'title' in item ? item.title : item.lemma);
      expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b, 'de')));
    }
    expect(() => validateCatalog([pack, pack])).toThrow('conflicting');
    const revisionOnly = snapshotPack(pack, pack.blocks[0]!.id, [pack.questions[0]!.id]);
    expect(() => validateAnyContent(revisionOnly)).not.toThrow();
    expect(() => validateCatalog([revisionOnly])).toThrow('at least 20');
  });
  it('matches all twenty principal parts and auxiliaries against the fetched reference facts', () => {
    for (const item of pack.items) {
      const fact = verified.verifiedFacts.find(row => row.infinitive === item.properties.infinitive)!;
      expect(fact).toBeDefined();
      for (const field of ['present3', 'praeteritum', 'participle', 'auxiliary'] as const) expect(item.properties[field]).toBe(fact[field]);
    }
    expect(new Set(pack.items.map(item => item.properties.classification))).toEqual(new Set(['strong', 'weak', 'mixed', 'irregular']));
    expect(pack.items.some(item => item.properties.separability === 'separable')).toBe(true);
  });
  const invalid: [string, (copy: typeof pilot) => void][] = [
    ['unsupported version', p => { p.schemaVersion = 3; }],
    ['missing principal part', p => { p.items[0]!.properties.participle = ''; }],
    ['auxiliary', p => { p.items[0]!.properties.auxiliary = 'werden'; }],
    ['classification', p => { p.items[0]!.properties.classification = 'unknown'; }],
    ['duplicate item', p => { p.items[1]!.id = p.items[0]!.id; }],
    ['duplicate question', p => { p.questions[1]!.id = p.questions[0]!.id; }],
    ['duplicate membership', p => { p.blocks[0]!.itemIds.push(p.blocks[0]!.itemIds[0]!); }],
    ['missing membership', p => { p.blocks[0]!.itemIds.pop(); }],
    ['unknown item', p => { p.questions[0]!.itemId = 'missing'; }],
    ['unknown example', p => { p.questions[0]!.exampleId = 'missing'; }],
    ['unknown question', p => { p.blocks[0]!.questionIds[0] = 'missing'; }],
    ['incorrect canonical answer', p => { p.questions[0]!.acceptedAnswers = ['bad']; }],
    ['incorrect auxiliary option', p => { p.questions[2]!.correctChoiceId = 'sein'; }],
    ['invalid separation', p => { p.items[0]!.properties.separability = 'separable'; }],
    ['invalid stem change', p => { p.items[5]!.properties.stemChange = { from: 'e', to: 'e' }; }],
    ['wrong facet', p => { p.questions[0]!.facetId = 'participle'; }],
    ['unsupported template', p => { p.questions[0]!.templateId = 'free-writing'; }],
    ['hint answer leak', p => { p.questions[0]!.hint = ['The answer is arbeitete.']; }],
    ['completion mismatch', p => { p.questions[5]!.prompt = 'Er ___ falsch.'; }],
    ['auxiliary context mismatch', p => { p.questions[2]!.prompt = 'An unspecified context'; }],
    ['extra future category', p => { p.items[0]!.contentType = 'nouns'; }],
  ];
  it.each(invalid)('rejects %s', (_label, mutate) => {
    const copy = structuredClone(pilot); mutate(copy); expect(() => validateAnyContent(copy)).toThrow();
  });
  it.each(pack.questions)('grades authored $id deterministically with a retrieval-safe hint', q => {
    const item = pack.items.find(item => item.id === q.itemId)!;
    const answer = canonicalVerbAnswer(item, q);
    expect(hintLeaksAnswer(questionHint(q, item), answer)).toBe(false);
    const correct: Response = isTextQuestion(q) ? { kind: 'text', value: `  ${[...answer].map(letter => letter === 'ß' ? 'ẞ' : letter.toUpperCase()).join('')}  ` } : { kind: 'choice', choiceId: q.correctChoiceId };
    const wrong: Response = isTextQuestion(q) ? { kind: 'text', value: 'wrong' } : { kind: 'choice', choiceId: q.choices.find(choice => choice.id !== q.correctChoiceId)!.id };
    expect(gradeAnswer(q, correct)).toBe(true); expect(gradeAnswer(q, wrong)).toBe(false); expect(gradeAnswer(q, null)).toBeNull();
  });
  it('retains diacritics, ß and exact authored forms', () => {
    const q = pack.questions.find(q => q.id === 'forms-essen-past-recall')!;
    expect(gradeAnswer(q, { kind: 'text', value: 'ass' })).toBe(false);
    const present = pack.questions.find(q => q.id === 'forms-fahren-present-recall')!;
    expect(gradeAnswer(present, { kind: 'text', value: 'fa\u0308hrt' })).toBe(true);
    expect(gradeAnswer(present, { kind: 'text', value: 'fahrt' })).toBe(false);
  });
});

describe('v2 session evidence and persistence', () => {
  it.each([10, 20] as const)('rotates unique %i-question sessions and completes exact summaries', size => {
    const block = pack.blocks[0]!;
    let cursor = 0; const seen = new Set<string>();
    for (let n = 0; n < 7; n++) {
      const session = createSession(pack, block.id, deps(), { size, cursor });
      expect(session.order).toHaveLength(size); expect(new Set(session.order).size).toBe(size);
      session.order.forEach(id => seen.add(id)); cursor = session.rotationNext;
      const completed = finish(session); expect(summarize(completed)).toMatchObject({ total: size, answered: size, unaidedCorrect: size, accuracy: 1 });
      expect(validateBackup(makeBackup({ ...emptyData(), sessions: [completed] }, at)).sessions[0]).toEqual(completed);
    }
    expect(seen.size).toBe(70);
    expect(rotationKey(pack, block.id)).not.toBe(block.id);
    expect(rotationKey(validateAnyContent(seed), seed.blocks[0]!.id)).toBe(seed.blocks[0]!.id);
  });
  it('preserves draft, hint, reveal, defer, previous, feedback and duplicate-submit protection', () => {
    let session = createSession(pack, pack.blocks[0]!.id, deps(), { size: 10 });
    const id = currentQuestion(session).id;
    expect(transition(session, { type: 'next', questionId: id, at })).toBe(session);
    session = transition(session, { type: 'hint', questionId: id });
    session = transition(session, { type: 'reveal', questionId: id });
    session = transition(session, { type: 'response', questionId: id, response: response(session) });
    const draft = parseBackup(JSON.stringify(makeBackup({ ...emptyData(), currentId: session.sessionId, sessions: [session] }, at)));
    expect(draft.schemaVersion).toBe(2); expect(draft.sessions[0]).toEqual(session);
    session = submit(session);
    const feedback = session;
    expect(summarize(session).assisted).toBe(1);
    expect(transition(session, { type: 'submit', questionId: id, attemptId: 'double', submittedAt: at })).toBe(session);
    session = transition(session, { type: 'next', questionId: id, at });
    const second = currentQuestion(session).id;
    session = transition(session, { type: 'skip', questionId: second, at });
    expect(session.deferredIds).toEqual([second]);
    session = transition(session, { type: 'previous', questionId: currentQuestion(session).id, at });
    session = transition(session, { type: 'previous', questionId: currentQuestion(session).id, at });
    expect(session.feedback).toEqual(feedback.feedback);
    expect(parseBackup(JSON.stringify(makeBackup({ ...emptyData(), sessions: [session] }, at))).sessions[0]).toEqual(session);
  });
  it('revises wrong and assisted forms without altering original scores; reports both categories', () => {
    const session = finish(createSession(pack, pack.blocks[0]!.id, deps(), { size: 10 }), true);
    expect(summarize(session)).toMatchObject({ wrong: 1, assisted: 1, unaidedCorrect: 8, accuracy: .8 });
    const pending = revisionItems([session]); expect(pending).toHaveLength(2);
    const plan = revisionPlan(pending)!;
    const revision = finish(createSession(plan.pack, plan.blockId, deps(), { questionIds: plan.questionIds }));
    expect(revisionItems([session, revision])).toHaveLength(0);
    expect(summarize(session).accuracy).toBe(.8);
    const metrics = progressMetrics([validateAnyContent(seed), pack], [session, revision]);
    expect(metrics.blocks).toHaveLength(3);
    expect(metrics.blocks.find(block => block.blockId === session.blockId)?.answered).toBe(10);
    expect(metrics.constructions.find(item => item.entryId === questionItemId(currentQuestion(session)))?.label).toBeTruthy();
  });
  it('reads a real MVP-release v1 backup unchanged and writes mixed history in existing IndexedDB version 1', async () => {
    const imported = parseBackup(JSON.stringify(legacy));
    expect(imported).toEqual(legacy);
    const data = backupData(imported);
    expect(makeBackup(data, imported.exportedAt)).toEqual(legacy);
    const repo = new IndexedDbRepository(); const before = await repo.read();
    const restored = await repo.save(data, before.revision);
    expect((await new IndexedDbRepository().read()).sessions).toEqual(imported.sessions);
    const v2 = createSession(pack, pack.blocks[1]!.id, deps(), { size: 20 });
    const mixed = await repo.save({ ...restored, currentId: v2.sessionId, sessions: [...restored.sessions.map(session => ({ ...session, status: 'abandoned' as const })), v2] }, restored.revision);
    const read = await new IndexedDbRepository().read(); expect(read).toMatchObject(mixed);
    const backup = makeBackup(read, at); expect(backup.schemaVersion).toBe(2);
    expect(parseBackup(JSON.stringify(backup)).sessions).toEqual(mixed.sessions);
    expect(itemsForPack(backup.sessions[1]!.contentSnapshot)).toHaveLength(3);
    const downgraded = { ...backup, schemaVersion: 1 }; expect(() => validateBackup(downgraded)).toThrow('version 2');
    const future = { ...backup, schemaVersion: 3 }; expect(() => validateBackup(future)).toThrow('unsupported');
    const missingEnvelope = structuredClone(backup); delete missingEnvelope.sessions[1]!.snapshotVersion;
    expect(() => validateBackup(missingEnvelope)).toThrow('envelope');
    expect(await repo.read()).toMatchObject(mixed);
  });
});
