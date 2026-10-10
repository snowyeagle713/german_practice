import { itemsForPack, type AnyContentPack, type LearningItem, type AnyQuestion } from '../content/types';
import { snapshotPack } from '../content/catalog';
import type { Attempt, PracticeSession } from './types';
export interface RevisionItem { key: string; question: AnyQuestion; entry: LearningItem; attempt: Attempt; session: PracticeSession }
export function revisionItems(sessions: readonly PracticeSession[]): RevisionItem[] {
  const pending = new Map<string, RevisionItem>();
  const events = sessions.flatMap(session => session.attempts.map(attempt => ({ session, attempt })))
    .sort((a, b) => a.attempt.submittedAt.localeCompare(b.attempt.submittedAt));
  for (const { session, attempt } of events) {
    const key = `${session.packId}:${attempt.questionId}:${attempt.questionRevision}`;
    if (attempt.isUnaidedCorrect) { if (session.mode === 'revision') pending.delete(key); continue; }
    const question = session.contentSnapshot.questions.find(item => item.id === attempt.questionId)!;
    const entry = itemsForPack(session.contentSnapshot).find(item => item.id === attempt.entryId)!;
    pending.set(key, { key, question, entry, attempt, session });
  }
  return [...pending.values()];
}
/** One archived pack/version/block per run, at most 20. No content remapping. */
export function revisionPlan(items: readonly RevisionItem[]): { pack: AnyContentPack; blockId: string; questionIds: string[] } | null {
  const first = items[0]; if (!first) return null;
  const seen = new Set<string>();
  const selected = items.filter(item => item.session.packId === first.session.packId && item.session.packVersion === first.session.packVersion && item.session.blockId === first.session.blockId).filter(item => { if (seen.has(item.question.id)) return false; seen.add(item.question.id); return true; }).slice(0, 20);
  const questionIds = selected.map(item => item.question.id);
  const entries = [...new Map(selected.map(item => [item.entry.id, item.entry])).values()];
  const block = first.session.contentSnapshot.blocks.find(item => item.id === first.session.blockId)!;
  const original = first.session.contentSnapshot;
  // Revision may combine misses from several subset snapshots of the same immutable release.
  const combined: AnyContentPack = original.schemaVersion === 1
    ? { ...original, entries: entries.filter((item): item is import('../content/types').Entry => 'kind' in item), questions: selected.map(item => item.question).filter((question): question is import('../content/types').Question => 'entryId' in question), blocks: [{ ...block, questionIds }] }
    : { ...original, items: entries.filter((item): item is import('../content/v2').VerbForm => 'contentType' in item), questions: selected.map(item => item.question).filter((question): question is import('../content/v2').VerbQuestion => 'itemId' in question), blocks: [{ ...block, itemIds: entries.map(item => item.id), questionIds }] };
  return { blockId: block.id, questionIds, pack: snapshotPack(combined, block.id, questionIds) };
}
