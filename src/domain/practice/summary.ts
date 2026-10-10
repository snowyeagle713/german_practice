import { itemLabel, itemsForPack } from '../content/types';
import { questionLabel } from '../content/catalog';
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
    byType: [...new Set(session.contentSnapshot.questions.map(question => 'templateId' in question ? question.templateId : question.type))].map(type => {
      const ids = new Set(session.contentSnapshot.questions.filter(question => session.order.includes(question.id) && ('templateId' in question ? question.templateId : question.type) === type).map(question => question.id));
      const attempts = session.attempts.filter(attempt => ids.has(attempt.questionId));
      return { type, label: questionLabel(session.contentSnapshot.questions.find(question => ids.has(question.id))!), total: ids.size, answered: attempts.length, unaidedCorrect: attempts.filter(attempt => attempt.isUnaidedCorrect).length };
    }),
    byConstruction: itemsForPack(session.contentSnapshot).map(entry => {
      const attempts = session.attempts.filter(attempt => attempt.entryId === entry.id);
      return { entryId: entry.id, construction: itemLabel(entry), answered: attempts.length, unaidedCorrect: attempts.filter(attempt => attempt.isUnaidedCorrect).length };
    }),
    attempts: session.attempts,
  };
}
