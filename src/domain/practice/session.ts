import type { ContentPack } from '../content/types';
import { validateContent } from '../content/validate';
import { correctAnswer, gradeAnswer } from './grading';
import { selectQuestions } from './selection';
import { shuffle } from './shuffle';
import type { PracticeCommand, PracticeDependencies, PracticeSession } from './types';

export function createSession(input: ContentPack, blockId: string, dependencies: PracticeDependencies, options: { size?: 10 | 20; cursor?: number; questionIds?: string[] } = {}): PracticeSession {
  const pack = validateContent(input);
  const block = pack.blocks.find(item => item.id === blockId);
  if (!block) throw new Error('Block not found.');
  const selected = options.questionIds ?? selectQuestions(block.questionIds, options.size ?? 20, options.cursor ?? 0);
  if (!selected.length || selected.length > 20 || new Set(selected).size !== selected.length || selected.some(id => !block.questionIds.includes(id))) throw new Error('Invalid session selection.');
  const questionIds = new Set(selected);
  const questions = pack.questions.filter(question => questionIds.has(question.id));
  const entryIds = new Set(questions.map(question => question.entryId));
  const snapshot = structuredClone({ ...pack, blocks: [{ ...block, questionIds: selected }], questions, entries: pack.entries.filter(entry => entryIds.has(entry.id)) });
  return {
    sessionId: dependencies.id(), mode: options.questionIds ? 'revision' : (options.size === 10 ? 'quick' : 'standard'), sessionSize: selected.length, rotationNext: ((options.cursor ?? 0) + selected.length) % block.questionIds.length, deferredIds: [], states: {}, blockId, packId: pack.packId, packVersion: pack.packVersion,
    startedAt: dependencies.now(), completedAt: null, status: 'answering',
    order: shuffle(selected, dependencies.random),
    choiceOrders: Object.fromEntries(questions.filter(question => question.type !== 'preposition_cloze')
      .map(question => [question.id, shuffle(question.choices.map(choice => choice.id), dependencies.random)])),
    currentIndex: 0, response: null, hintUsed: false, revealed: false, guidance: null, feedback: null,
    contentSnapshot: snapshot, attempts: [], submittedAttemptIds: [],
  };
}

export function currentQuestion(session: PracticeSession) {
  return session.contentSnapshot.questions.find(question => question.id === session.order[session.currentIndex])!;
}
export function isActive(session: PracticeSession | null): session is PracticeSession {
  return session?.status === 'answering' || session?.status === 'feedback';
}

/** Immutable transitions, guarded by lifecycle AND question ID. No clocks/randomness/UI here. */
export function transition(session: PracticeSession, command: PracticeCommand): PracticeSession {
  if (!isActive(session) || session.order[session.currentIndex] !== command.questionId) return session;
  const question = currentQuestion(session);
  if (command.type === 'next' || command.type === 'previous' || command.type === 'skip') {
    if (command.type === 'next' && session.status !== 'feedback') return session;
    if (command.type === 'skip' && session.status !== 'answering') return session;
    if (command.type === 'previous' && session.currentIndex === 0) return session;
    const states = { ...session.states, [question.id]: { response: session.response, hintUsed: session.hintUsed, revealed: session.revealed, guidance: session.guidance, feedback: session.feedback } };
    if (command.type === 'next' && session.attempts.length === session.order.length && session.currentIndex === session.order.length - 1) return { ...session, states, status: 'completed', completedAt: command.at };
    let index = command.type === 'previous' ? session.currentIndex - 1 : session.currentIndex + 1;
    if (index >= session.order.length) {
      index = session.order.findIndex(id => !session.attempts.some(attempt => attempt.questionId === id));
      if (index < 0) return { ...session, states, status: 'completed', completedAt: command.at };
    }
    const state = states[session.order[index]!] ?? { response: null, hintUsed: false, revealed: false, guidance: null, feedback: null };
    return { ...session, ...state, states, status: state.feedback ? 'feedback' : 'answering', currentIndex: index,
      deferredIds: command.type === 'skip' ? [...new Set([...session.deferredIds, question.id])] : session.deferredIds };
  }
  if (session.status !== 'answering') return session;
  if (command.type === 'response') return { ...session, response: command.response, guidance: null };
  if (command.type === 'hint') return { ...session, hintUsed: true };
  if (command.type === 'reveal') return { ...session, revealed: true };
  if (command.type !== 'submit') return session;
  const result = gradeAnswer(question, session.response);
  if (result === null || !session.response) {
    return { ...session, guidance: question.type === 'preposition_cloze' ? 'Enter a preposition before checking your answer.' : 'Choose an answer before checking.' };
  }
  if (session.attempts.some(attempt => attempt.questionId === question.id || attempt.attemptId === command.attemptId)) return session;
  const entry = session.contentSnapshot.entries.find(item => item.id === question.entryId)!;
  const example = entry.examples.find(item => item.id === question.exampleId) ?? entry.examples[0]!;
  const attempt = {
    attemptId: command.attemptId, sessionId: session.sessionId, questionId: question.id,
    questionRevision: question.revision, entryId: question.entryId, submittedAt: command.submittedAt,
    response: structuredClone(session.response), isCorrect: result, hintUsed: session.hintUsed, revealed: session.revealed,
    isUnaidedCorrect: result && !session.hintUsed && !session.revealed,
  };
  return { ...session, status: 'feedback', guidance: null, deferredIds: session.deferredIds.filter(id => id !== question.id), attempts: [...session.attempts, attempt],
    submittedAttemptIds: [...session.submittedAttemptIds, attempt.attemptId],
    feedback: { attemptId: attempt.attemptId, correctAnswer: correctAnswer(question), explanation: question.explanation,
      exampleDe: example.de, exampleEn: example.en, meaningEn: entry.meaningEn } };
}
