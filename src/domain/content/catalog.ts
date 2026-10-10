import type { AnyContentPack, AnyQuestion, LearningItem } from './types';
import { isVerbForm, itemLabel, itemsForPack } from './types';
import { constructionTheme } from './themes';
import { templateLabels } from './v2';
import { validateContent } from './validate';
import { validateContentV2 } from './validate-v2';

export function validateAnyContent(input: unknown): AnyContentPack {
  if (input && typeof input === 'object' && 'schemaVersion' in input && input.schemaVersion === 2) return validateContentV2(input);
  return validateContent(input);
}
export function itemTheme(item: LearningItem): string { return isVerbForm(item) ? 'Verb Forms · Alphabetical' : constructionTheme(item.id); }
export function questionLabel(question: AnyQuestion): string {
  if ('templateId' in question) return templateLabels[question.templateId];
  return question.type === 'preposition_cloze' ? 'Typed prepositions' : question.type === 'case_choice' ? 'Case choice' : 'Meaning choice';
}
export function revisionLabel(item: LearningItem, question: AnyQuestion): string {
  return isVerbForm(item) ? `${itemLabel(item)} · ${questionLabel(question)}` : itemLabel(item);
}
/** Preserve v1 raw snapshots; v2 subsets retain explicit item membership. */
export function snapshotPack(pack: AnyContentPack, blockId: string, questionIds: string[]): AnyContentPack {
  const block = pack.blocks.find(block => block.id === blockId)!;
  const ids = new Set(questionIds);
  if (pack.schemaVersion === 1) {
    const questions = pack.questions.filter(question => ids.has(question.id));
    const itemIds = new Set(questions.map(question => question.entryId));
    return structuredClone({ ...pack, questions, entries: pack.entries.filter(item => itemIds.has(item.id)), blocks: [{ ...block, questionIds }] });
  }
  const questions = pack.questions.filter(question => ids.has(question.id));
  const itemIds = [...new Set(questions.map(question => question.itemId))];
  return structuredClone({ ...pack, questions, items: pack.items.filter(item => itemIds.includes(item.id)), blocks: [{ ...block, itemIds, questionIds }] });
}
export function validateCatalog(packs: AnyContentPack[]): AnyContentPack[] {
  for (const pack of packs) if (pack.schemaVersion === 2 && pack.blocks.some(block => block.questionIds.length < 20)) throw new Error('Published v2 blocks need at least 20 eligible authored questions.');
  const keys = [packs.map(pack => pack.packId), packs.flatMap(pack => pack.blocks.map(block => block.id)), packs.flatMap(pack => itemsForPack(pack).map(item => item.id)), packs.flatMap(pack => pack.questions.map(question => question.id))];
  if (keys.some(ids => new Set(ids).size !== ids.length)) throw new Error('Catalog contains conflicting IDs.');
  return packs;
}
export function rotationKey(pack: AnyContentPack, blockId: string): string {
  // Existing v1 block keys must remain intact; released v2 pools are immutable per packVersion.
  return pack.schemaVersion === 1 ? blockId : `${pack.packId}:${pack.packVersion}:${blockId}`;
}
