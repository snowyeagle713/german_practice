export const constructionThemes = [
  { title: 'Interest & anticipation', entryIds: ['verb-interessieren-fuer', 'verb-freuen-auf', 'verb-warten-auf', 'verb-hoffen-auf'] },
  { title: 'Thoughts & memory', entryIds: ['verb-glauben-an', 'verb-erinnern-an'] },
  { title: 'Communication & reaction', entryIds: ['verb-antworten-auf', 'verb-diskutieren-ueber', 'verb-freuen-ueber'] },
  { title: 'Structure & composition', entryIds: ['verb-bestehen-aus'] },
];
export function constructionTheme(entryId: string): string {
  return constructionThemes.find(theme => theme.entryIds.includes(entryId))?.title ?? 'Other constructions';
}
