import { itemsForPack, questionItemId, type AnyContentPack, type Block, type LearningItem } from './types';
import type { VerbBlock } from './v2';

export function entriesForBlock(pack: AnyContentPack, block: Block | VerbBlock): LearningItem[] {
  if (pack.schemaVersion === 2 && 'itemIds' in block) {
    return block.itemIds.map(id => pack.items.find(item => item.id === id)!).sort((a, b) => a.title.localeCompare(b.title, 'de'));
  }
  const ids = new Set(block.questionIds);
  const entryIds = new Set(pack.questions.filter(question => ids.has(question.id)).map(questionItemId));
  return itemsForPack(pack).filter(entry => entryIds.has(entry.id));
}
