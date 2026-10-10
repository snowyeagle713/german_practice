import { describe, expect, it } from 'vitest';
import seed from '../../content/seed-pack.json';
import { validateContent } from '../../src/domain/content/validate';
import { isTextQuestion, type AnyQuestion } from '../../src/domain/content/types';
import { gradeAnswer, normalizeAnswer } from '../../src/domain/practice/grading';
import { createSession, currentQuestion, transition } from '../../src/domain/practice/session';
import { shuffle } from '../../src/domain/practice/shuffle';
import { summarize } from '../../src/domain/practice/summary';
import type { PracticeSession, Response } from '../../src/domain/practice/types';

const pack = validateContent(seed);
const blockId = pack.blocks[0]!.id;
const at = '2026-10-04T12:00:00.000Z';
function dependencies(seedValue = 1) {
  let state = seedValue, id = 0;
  return { random: () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 2 ** 32; }, now: () => at, id: () => `session-${++id}` };
}
function answer(question: AnyQuestion, correct = true): Response {
  if (isTextQuestion(question)) return { kind: 'text', value: correct ? `  ${question.acceptedAnswers[0]!.toUpperCase()}  ` : 'wrong' };
  return { kind: 'choice', choiceId: correct ? question.correctChoiceId : question.choices.find(choice => choice.id !== question.correctChoiceId)!.id };
}
function submit(session: PracticeSession, correct = true) {
  const question = currentQuestion(session);
  const draft = transition(session, { type: 'response', questionId: question.id, response: answer(question, correct) });
  return transition(draft, { type: 'submit', questionId: question.id, attemptId: `attempt-${session.currentIndex}`, submittedAt: at });
}

describe('rotating authored sessions', () => {
  it.each(Array.from({ length: 30 }, (_, seedValue) => seedValue))('selects exactly 20 unique authored questions for random seed %i', seedValue => {
    const session = createSession(pack, blockId, dependencies(seedValue));
    expect(session.order).toHaveLength(20);
    expect(new Set(session.order).size).toBe(20);
    expect(new Set(session.order)).toEqual(new Set(pack.blocks[0]!.questionIds.slice(0, 20)));
    for (const question of session.contentSnapshot.questions) {
      if (!isTextQuestion(question)) expect(new Set(session.choiceOrders[question.id])).toEqual(new Set(question.choices.map(choice => choice.id)));
    }
  });
  it('produces different orders for known different sources without requiring every new order to differ', () => {
    expect(createSession(pack, blockId, dependencies(1)).order).not.toEqual(createSession(pack, blockId, dependencies(9)).order);
    expect(createSession(pack, blockId, dependencies(1)).order).toEqual(createSession(pack, blockId, dependencies(1)).order);
  });
  it('does not mutate source arrays and rejects invalid randomness', () => {
    const source = [1, 2, 3];
    expect(shuffle(source, () => 0)).toEqual([2, 3, 1]);
    expect(source).toEqual([1, 2, 3]);
    for (const value of [-1, 1, NaN, Infinity]) expect(() => shuffle(source, () => value)).toThrow();
  });
  it('snapshots content and metadata without using question positions as identity', () => {
    const input = structuredClone(pack);
    const session = createSession(input, blockId, dependencies());
    input.questions[0]!.prompt = 'Changed later';
    expect(session.contentSnapshot.questions[0]!.prompt).toBe(pack.questions[0]!.prompt);
    expect(session.startedAt).toBe(at);
    expect(session.packVersion).toBe(pack.packVersion);
    expect(() => createSession(pack, 'missing', dependencies())).toThrow();
    expect(JSON.parse(JSON.stringify(session))).toEqual(session);
  });
});

describe('authored grading', () => {
  it.each(pack.questions)('grades correct and wrong answers for $id', question => {
    expect(gradeAnswer(question, answer(question))).toBe(true);
    expect(gradeAnswer(question, answer(question, false))).toBe(false);
    expect(gradeAnswer(question, null)).toBeNull();
  });
  it('normalizes NFC/case/spacing, keeps diacritics and ß, and does not use fuzzy matches', () => {
    const question = { ...pack.questions.find(item => item.type === 'preposition_cloze')!, type: 'preposition_cloze' as const, acceptedAnswers: ['für', 'groß', 'in der'] };
    expect(normalizeAnswer('  FU\u0308R  ')).toBe('für');
    for (const value of [' FU\u0308R ', ' IN\t DER ', 'GROß']) expect(gradeAnswer(question, { kind: 'text', value })).toBe(true);
    for (const value of ['fur', 'gross', 'fuer', 'fürr']) expect(gradeAnswer(question, { kind: 'text', value })).toBe(false);
    expect(gradeAnswer(question, { kind: 'text', value: '  \t ' })).toBeNull();
  });
  it('grades stable choice IDs independent of display order and rejects invalid kinds/IDs', () => {
    const question = pack.questions.find(item => item.type === 'case_choice')!;
    if (question.type === 'preposition_cloze') throw new Error('Expected choice');
    const reordered = { ...question, choices: [...question.choices].reverse() };
    expect(gradeAnswer(reordered, { kind: 'choice', choiceId: question.correctChoiceId })).toBe(true);
    expect(gradeAnswer(question, { kind: 'choice', choiceId: 'missing' })).toBeNull();
    expect(gradeAnswer(question, { kind: 'text', value: question.correctChoiceId })).toBeNull();
  });
});

describe('session lifecycle and first-pass evidence', () => {
  it('guards unanswered Next, empty submits, duplicate submission, response changes after grading and stale Next', () => {
    const initial = createSession(pack, blockId, dependencies());
    const question = currentQuestion(initial);
    expect(transition(initial, { type: 'next', questionId: question.id, at })).toBe(initial);
    const empty = transition(initial, { type: 'submit', questionId: question.id, attemptId: 'empty', submittedAt: at });
    expect(empty.guidance).not.toBeNull();
    expect(empty.attempts).toHaveLength(0);
    const feedback = submit(initial);
    expect(feedback.status).toBe('feedback');
    expect(feedback.currentIndex).toBe(0);
    expect(feedback.feedback?.explanation).toBe(question.explanation);
    expect(feedback.feedback?.exampleDe).toBeTruthy();
    expect(feedback.response).toEqual(answer(question));
    expect(transition(feedback, { type: 'submit', questionId: question.id, attemptId: 'duplicate', submittedAt: at })).toBe(feedback);
    expect(transition(feedback, { type: 'response', questionId: question.id, response: answer(question, false) })).toBe(feedback);
    const next = transition(feedback, { type: 'next', questionId: question.id, at });
    expect(next.currentIndex).toBe(1);
    expect(next.response).toBeNull();
    expect(next.feedback).toBeNull();
    expect(transition(next, { type: 'next', questionId: question.id, at })).toBe(next);
    expect(transition(next, { type: 'submit', questionId: question.id, attemptId: 'stale', submittedAt: at })).toBe(next);
  });
  it.each(['hint', 'reveal'] as const)('%s never earns unaided credit and flags the question for later revision', type => {
    const initial = createSession(pack, blockId, dependencies());
    const assisted = transition(initial, { type, questionId: currentQuestion(initial).id });
    const graded = submit(assisted);
    expect(graded.attempts[0]!.isCorrect).toBe(true);
    expect(graded.attempts[0]!.isUnaidedCorrect).toBe(false);
    expect(summarize(graded).assisted).toBe(1);
    expect(summarize(graded).mistakes).toEqual([currentQuestion(initial).id]);
    const next = transition(graded, { type: 'next', questionId: currentQuestion(graded).id, at });
    expect(next.hintUsed).toBe(false);
    expect(next.revealed).toBe(false);
  });
  it('finishes only after all selected graded answers and calculates coverage, wrong/assisted overlap and first-pass score', () => {
    let session = createSession(pack, blockId, dependencies());
    for (let i = 0; i < 20; i++) {
      expect(session.currentIndex + 1).toBe(i + 1);
      expect(summarize(session).answered).toBe(i);
      expect(summarize(session).accuracy).toBeNull();
      const id = currentQuestion(session).id;
      if (i % 4 === 2) session = transition(session, { type: 'hint', questionId: id });
      if (i % 4 === 3) session = transition(session, { type: 'reveal', questionId: id });
      session = submit(session, i % 4 !== 1);
      expect(session.status).toBe('feedback');
      session = transition(session, { type: 'next', questionId: id, at });
    }
    const result = summarize(session);
    expect(session.status).toBe('completed');
    expect(result).toMatchObject({ total: 20, answered: 20, correct: 15, wrong: 5, assisted: 10, unaidedCorrect: 5, accuracy: .25, coverage: 1, completedAt: at });
    expect(result.mistakes).toHaveLength(15);
    expect(result.byType.map(item => item.total)).toEqual([10, 5, 5]);
    expect(new Set(result.attempts.map(item => item.questionId)).size).toBe(20);
    expect(session.submittedAttemptIds).toHaveLength(20);
    expect(transition(session, { type: 'next', questionId: currentQuestion(session).id, at })).toBe(session);
    expect(JSON.parse(JSON.stringify({ session, result }))).toEqual({ session, result });
  });
  it('counts wrong assisted answers in both labels without adding them twice to mistakes', () => {
    let session = createSession(pack, blockId, dependencies());
    session = transition(session, { type: 'hint', questionId: currentQuestion(session).id });
    session = submit(session, false);
    expect(summarize(session)).toMatchObject({ correct: 0, wrong: 1, assisted: 1, unaidedCorrect: 0 });
    expect(summarize(session).mistakes).toHaveLength(1);
  });
  it.each([true, false])('uses the full denominator for an all-correct=%s run', correct => {
    let session = createSession(pack, blockId, dependencies());
    for (let i = 0; i < 20; i++) {
      const id = currentQuestion(session).id;
      session = transition(submit(session, correct), { type: 'next', questionId: id, at });
    }
    expect(summarize(session)).toMatchObject({ accuracy: correct ? 1 : 0, coverage: 1, correct: correct ? 20 : 0, wrong: correct ? 0 : 20, assisted: 0 });
    expect(summarize(session).mistakes).toHaveLength(correct ? 0 : 20);
  });
});


describe('MVP practice navigation and rotation', () => {
  it('normalizes any valid saved rotation cursor before arithmetic', () => {
    const session = createSession(pack, blockId, dependencies(), { size: 10, cursor: Number.MAX_SAFE_INTEGER });
    expect(new Set(session.order).size).toBe(10);
    expect(session.rotationNext).toBe((Number.MAX_SAFE_INTEGER % 40 + 10) % 40);
  });
  it('rotates through all 40 questions in two standards or four quick runs', () => {
    for (const size of [10, 20] as const) {
      let cursor = 0;
      const seen: string[] = [];
      for (let i = 0; i < 40 / size; i++) {
        const session = createSession(pack, blockId, dependencies(i), { size, cursor });
        expect(session.order).toHaveLength(size);
        seen.push(...session.order); cursor = session.rotationNext;
      }
      expect(new Set(seen)).toEqual(new Set(pack.blocks[0]!.questionIds));
      expect(seen.length).toBe(40); expect(cursor).toBe(0);
    }
  });
  it('keeps order, returns to deferred questions and preserves graded feedback on Previous', () => {
    let session = createSession(pack, blockId, dependencies(), { size: 10 });
    const order = [...session.order];
    session = transition(session, { type: 'skip', questionId: order[0]!, at });
    expect(session.deferredIds).toEqual([order[0]]);
    session = submit(session);
    const originalAttempt = session.attempts[0];
    session = transition(session, { type: 'next', questionId: order[1]!, at });
    session = transition(session, { type: 'previous', questionId: order[2]!, at });
    expect(session.status).toBe('feedback');
    expect(session.attempts[0]).toEqual(originalAttempt);
    expect(transition(session, { type: 'response', questionId: order[1]!, response: { kind: 'text', value: 'changed' } })).toBe(session);
    session = transition(session, { type: 'next', questionId: order[1]!, at });
    for (let i = 2; i < 10; i++) session = transition(submit(session), { type: 'next', questionId: order[i]!, at });
    expect(session.currentIndex).toBe(0); expect(session.status).toBe('answering');
    expect(session.order).toEqual(order); expect(session.attempts).toHaveLength(9);
    session = submit(session); expect(session.deferredIds).toEqual([]);
    for (let i = 0; i < 10 && session.status !== 'completed'; i++) session = transition(session, { type: 'next', questionId: currentQuestion(session).id, at });
    expect(session.status).toBe('completed'); expect(session.attempts).toHaveLength(10);
  });
});
