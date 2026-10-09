import type { ContentPack } from '../content/types';
import { constructionTheme } from '../content/themes';
import type { Attempt, PracticeSession } from '../practice/types';
import { revisionItems } from '../practice/revision';
export function progressMetrics(pack: ContentPack, sessions: readonly PracticeSession[]) {
  const completed = sessions.filter(session => session.status === 'completed');
  const latest = new Map<string, Attempt>();
  for (const session of [...completed].filter(session => session.mode !== 'revision' && session.packId === pack.packId).sort((a, b) => a.startedAt.localeCompare(b.startedAt))) {
    for (const attempt of session.attempts) {
      if (pack.questions.some(question => question.id === attempt.questionId && question.revision === attempt.questionRevision)) latest.set(attempt.questionId, attempt);
    }
  }
  const pending = revisionItems(sessions);
  function counts(ids: string[]) {
    const attempts = ids.flatMap(id => latest.has(id) ? [latest.get(id)!] : []);
    return { total: ids.length, answered: attempts.length, unaided: attempts.filter(item => item.isUnaidedCorrect).length,
      pending: pending.filter(item => item.session.packId === pack.packId && ids.includes(item.question.id)).length };
  }
  const constructions = pack.entries.map(entry => ({ entryId: entry.id, label: entry.construction, theme: constructionTheme(entry.id), ...counts(pack.questions.filter(question => question.entryId === entry.id).map(question => question.id)) }));
  return { completed, pending, constructions, blocks: pack.blocks.map(block => ({ blockId: block.id, label: block.title, ...counts(block.questionIds) })),
    themes: [...new Set(constructions.map(item => item.theme))].map(theme => ({ label: theme, ...counts(pack.questions.filter(question => constructionTheme(question.entryId) === theme).map(question => question.id)) })) };
}
