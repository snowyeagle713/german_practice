import type { Block, ContentPack, Entry } from './types';

/** Keep the authored entry order, including only constructions referenced by this block. */
export function entriesForBlock(pack: ContentPack, block: Block): Entry[] {
  const questionIds = new Set(block.questionIds);
  const entryIds = new Set(pack.questions.filter(question => questionIds.has(question.id)).map(question => question.entryId));
  return pack.entries.filter(entry => entryIds.has(entry.id));
}
