import type { PracticeSession } from './types';

/** Serializable first-pass evidence. Assisted and wrong overlap; they are not additive. */
export function summarize(session: PracticeSession) {
  const total = session.order.length;
  const answered = session.attempts.length;
  const correct = session.attempts.filter(attempt => attempt.isCorrect).length;
  const wrong = answered - correct;
  const assisted = session.attempts.filter(attempt => attempt.hintUsed || attempt.revealed).length;
  const unaidedCorrect = session.attempts.filter(attempt => attempt.isUnaidedCorrect).length;
  return {
    sessionId: session.sessionId, blockId: session.blockId, packId: session.packId, packVersion: session.packVersion,
    startedAt: session.startedAt, completedAt: session.completedAt, total, answered, correct, wrong, assisted, unaidedCorrect,
    coverage: answered / total, accuracy: session.status === 'completed' ? unaidedCorrect / total : null,
    answeredAccuracy: answered ? unaidedCorrect / answered : null,
    mistakes: session.attempts.filter(attempt => !attempt.isUnaidedCorrect).map(attempt => attempt.questionId),
    byType: (['preposition_cloze', 'case_choice', 'meaning_choice'] as const).map(type => {
      const ids = new Set(session.contentSnapshot.questions.filter(question => question.type === type).map(question => question.id));
      const attempts = session.attempts.filter(attempt => ids.has(attempt.questionId));
      return { type, total: ids.size, answered: attempts.length, unaidedCorrect: attempts.filter(attempt => attempt.isUnaidedCorrect).length };
    }),
    attempts: session.attempts,
  };
}
