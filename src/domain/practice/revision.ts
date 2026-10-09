import type { ContentPack, Entry, Question } from '../content/types';
import type { Attempt, PracticeSession } from './types';
export interface RevisionItem { key: string; question: Question; entry: Entry; attempt: Attempt; session: PracticeSession }
export function revisionItems(sessions: readonly PracticeSession[]): RevisionItem[] {
  const pending = new Map<string, RevisionItem>();
  const events = sessions.flatMap(session => session.attempts.map(attempt => ({ session, attempt })))
    .sort((a, b) => a.attempt.submittedAt.localeCompare(b.attempt.submittedAt));
  for (const { session, attempt } of events) {
    const key = `${session.packId}:${attempt.questionId}:${attempt.questionRevision}`;
    if (attempt.isUnaidedCorrect) { if (session.mode === 'revision') pending.delete(key); continue; }
    const question = session.contentSnapshot.questions.find(item => item.id === attempt.questionId)!;
    const entry = session.contentSnapshot.entries.find(item => item.id === attempt.entryId)!;
    pending.set(key, { key, question, entry, attempt, session });
  }
  return [...pending.values()];
}
/** One archived pack/version/block per run, at most 20. No content remapping. */
export function revisionPlan(items: readonly RevisionItem[]): { pack: ContentPack; blockId: string; questionIds: string[] } | null {
  const first = items[0]; if (!first) return null;
  const selected = items.filter(item => item.session.packId === first.session.packId && item.session.packVersion === first.session.packVersion && item.session.blockId === first.session.blockId).slice(0, 20);
  const questionIds = selected.map(item => item.question.id);
  const entries = [...new Map(selected.map(item => [item.entry.id, item.entry])).values()];
  const block = first.session.contentSnapshot.blocks.find(item => item.id === first.session.blockId)!;
  return { blockId: block.id, questionIds, pack: { ...first.session.contentSnapshot, entries, questions: selected.map(item => item.question), blocks: [{ ...block, questionIds }] } };
}
