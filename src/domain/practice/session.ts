import type { ContentPack } from '../content/types';
import { validateContent } from '../content/validate';
import { correctAnswer, gradeAnswer } from './grading';
import { shuffle } from './shuffle';
import type { PracticeCommand, PracticeDependencies, PracticeSession } from './types';

export function createSession(input: ContentPack, blockId: string, dependencies: PracticeDependencies): PracticeSession {
  const pack = validateContent(input);
  const block = pack.blocks.find(item => item.id === blockId);
  if (!block) throw new Error('Block not found.');
  const questionIds = new Set(block.questionIds);
  const questions = pack.questions.filter(question => questionIds.has(question.id));
  const entryIds = new Set(questions.map(question => question.entryId));
  const snapshot = structuredClone({ ...pack, blocks: [block], questions, entries: pack.entries.filter(entry => entryIds.has(entry.id)) });
  return {
    sessionId: dependencies.id(), mode: 'full', blockId, packId: pack.packId, packVersion: pack.packVersion,
    startedAt: dependencies.now(), completedAt: null, status: 'answering',
    order: shuffle(block.questionIds, dependencies.random),
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
  if (command.type === 'next') {
    if (session.status !== 'feedback') return session;
    if (session.currentIndex === session.order.length - 1) {
      return { ...session, status: 'completed', completedAt: command.at };
    }
    return { ...session, status: 'answering', currentIndex: session.currentIndex + 1,
      response: null, hintUsed: false, revealed: false, guidance: null, feedback: null };
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
  return { ...session, status: 'feedback', guidance: null, attempts: [...session.attempts, attempt],
    submittedAttemptIds: [...session.submittedAttemptIds, attempt.attemptId],
    feedback: { attemptId: attempt.attemptId, correctAnswer: correctAnswer(question), explanation: question.explanation,
      exampleDe: example.de, exampleEn: example.en, meaningEn: entry.meaningEn } };
}
