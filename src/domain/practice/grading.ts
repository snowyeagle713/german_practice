import type { Question } from '../content/types';
import type { Response } from './types';

export function normalizeAnswer(text: string): string {
  return text.normalize('NFC').trim().replace(/\s+/gu, ' ').toLowerCase();
}
/** null means missing/invalid input: no graded submission should be recorded. */
export function gradeAnswer(question: Question, response: Response | null): boolean | null {
  if (question.type === 'preposition_cloze') {
    if (response?.kind !== 'text' || !normalizeAnswer(response.value)) return null;
    return question.acceptedAnswers.some(answer => normalizeAnswer(answer) === normalizeAnswer(response.value));
  }
  if (response?.kind !== 'choice' || !question.choices.some(choice => choice.id === response.choiceId)) return null;
  return response.choiceId === question.correctChoiceId;
}
export function correctAnswer(question: Question): string {
  return question.type === 'preposition_cloze' ? question.acceptedAnswers.join(' / ')
    : question.choices.find(choice => choice.id === question.correctChoiceId)!.text;
}
export function responseText(question: Question, response: Response): string {
  return response.kind === 'text' ? response.value
    : question.type === 'preposition_cloze' ? response.choiceId
      : question.choices.find(choice => choice.id === response.choiceId)?.text ?? response.choiceId;
}
