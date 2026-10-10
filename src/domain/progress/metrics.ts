import { itemLabel, itemsForPack, questionItemId, type AnyContentPack } from '../content/types';
import { itemTheme } from '../content/catalog';
import type { Attempt, PracticeSession } from '../practice/types';
import { revisionItems } from '../practice/revision';
export function progressMetrics(input: AnyContentPack | AnyContentPack[], sessions: readonly PracticeSession[]) {
  const packs = Array.isArray(input) ? input : [input];
  const completed = sessions.filter(session => session.status === 'completed');
  const latest = new Map<string, Attempt>();
  for (const session of [...completed].filter(session => session.mode !== 'revision').sort((a, b) => a.startedAt.localeCompare(b.startedAt))) {
    const pack = packs.find(pack => pack.packId === session.packId);
    for (const attempt of session.attempts) {
      if (pack?.questions.some(question => question.id === attempt.questionId && question.revision === attempt.questionRevision)) latest.set(`${pack.packId}:${attempt.questionId}`, attempt);
    }
  }
  const pending = revisionItems(sessions);
  function counts(pack: AnyContentPack, ids: string[]) {
    const attempts = ids.flatMap(id => latest.has(`${pack.packId}:${id}`) ? [latest.get(`${pack.packId}:${id}`)!] : []);
    return { total: ids.length, answered: attempts.length, unaided: attempts.filter(item => item.isUnaidedCorrect).length,
      pending: pending.filter(item => item.session.packId === pack.packId && ids.includes(item.question.id) && pack.questions.some(question => question.id === item.question.id && question.revision === item.question.revision)).length };
  }
  const constructions = packs.flatMap(pack => itemsForPack(pack).map(entry => ({ entryId: entry.id, label: itemLabel(entry), theme: itemTheme(entry), ...counts(pack, pack.questions.filter(question => questionItemId(question) === entry.id).map(question => question.id)) })));
  const themes = [...new Set(constructions.map(item => item.theme))].map(theme => {
    const values = packs.map(pack => counts(pack, pack.questions.filter(question => {
      const entry = itemsForPack(pack).find(item => item.id === questionItemId(question))!;
      return itemTheme(entry) === theme;
    }).map(question => question.id)));
    return { label: theme, total: values.reduce((n, v) => n + v.total, 0), answered: values.reduce((n, v) => n + v.answered, 0), unaided: values.reduce((n, v) => n + v.unaided, 0), pending: values.reduce((n, v) => n + v.pending, 0) };
  });
  return { completed, pending, constructions, blocks: packs.flatMap(pack => pack.blocks.map(block => ({ blockId: block.id, label: block.title, ...counts(pack, block.questionIds) }))), themes };
}
