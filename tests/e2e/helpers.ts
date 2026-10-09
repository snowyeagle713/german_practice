import { expect, type Page } from '@playwright/test';
import seed from '../../content/seed-pack.json' with { type: 'json' };
export async function answerCurrent(page: Page, correct = true) {
  const prompt = await page.locator('#question-prompt').textContent();
  const question = seed.questions.find(item => item.prompt === prompt)!;
  if (question.type === 'preposition_cloze') await page.getByRole('textbox', { name: 'Your preposition' }).fill(correct ? question.acceptedAnswers![0]! : 'wrong');
  else await page.getByRole('radio', { name: question.choices!.find(choice => correct ? choice.id === question.correctChoiceId : choice.id !== question.correctChoiceId)!.text, exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('#feedback-title')).toBeVisible();
  return question;
}
export async function quick(page: Page) {
  await page.goto('/#/blocks');
  await page.getByRole('radio', { name: 'Quick Practice · 10 questions' }).check();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible();
}
export async function finish(page: Page, size: number, wrong = 0) {
  for (let i = 0; i < size; i++) {
    await expect(page.getByText(`Question ${i + 1} of ${size}`, { exact: true })).toBeVisible();
    await answerCurrent(page, i >= wrong);
    await page.getByRole('button', { name: i === size - 1 ? 'View summary' : 'Next question', exact: true }).click();
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Session summary');
}
