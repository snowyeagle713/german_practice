import { isVerbForm, type LearningItem, type AnyQuestion } from '../content/types';

/** Retrieval cues omit the information that this question asks the learner to supply. */
export function questionHint(question: AnyQuestion, entry: LearningItem): string[] {
  if ('hint' in question) return question.hint;
  if (isVerbForm(entry)) throw new Error('Question/item type mismatch.');
  switch (question.type) {
    case 'preposition_cloze':
      return [`Construction meaning: ${entry.meaningEn}`, `Governed case: ${entry.governedCase}`];
    case 'case_choice':
      return [`Construction meaning: ${entry.meaningEn}`, 'Recall the fixed case governed by this verb–preposition construction; it is not chosen from location or movement alone.'];
    case 'meaning_choice':
      return [`Governed case: ${entry.governedCase}`, 'Use the German sentence to identify the relationship expressed by the verb and preposition. Compare the options in that context.'];
  }
}
