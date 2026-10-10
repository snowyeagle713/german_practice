import { expect, it } from 'vitest';
import seed from '../../content/seed-pack.json';
import type { ContentPack } from '../../src/domain/content/types';
import { questionHint } from '../../src/domain/practice/hints';
import { correctAnswer } from '../../src/domain/practice/grading';
const pack = seed as ContentPack;
it.each(pack.questions)('$id hint provides retrieval cues without the requested answer', question => {
  const entry = pack.entries.find(item => item.id === question.entryId)!;
  const hint = questionHint(question, entry).join(' ').toLowerCase();
  if (question.type !== 'preposition_cloze') expect(hint).not.toContain(correctAnswer(question).toLowerCase());
  if (question.type === 'preposition_cloze') {
    for (const answer of question.acceptedAnswers) expect(hint).not.toMatch(new RegExp(`\\b${answer}\\b`, 'iu'));
    expect(hint).toContain(entry.meaningEn.toLowerCase());
    expect(hint).toContain(entry.governedCase);
  } else if (question.type === 'case_choice') {
    expect(hint).not.toContain(entry.governedCase);
    expect(hint).toContain(entry.meaningEn.toLowerCase());
  } else {
    expect(hint).not.toContain(entry.meaningEn.toLowerCase());
    expect(hint).toContain(entry.governedCase);
  }
});
