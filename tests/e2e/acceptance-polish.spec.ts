import { expect, test } from '@playwright/test';
import { answerCurrent, quick } from './helpers';
import seed from '../../content/seed-pack.json' with { type: 'json' };

test('each question type has a non-answer hint while Reveal Answer remains explicit', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .999; }); await quick(page);
  for (let index = 0; index < 4; index++) {
    const question = seed.questions[index]!;
    await expect(page.locator('#question-prompt')).toHaveText(question.prompt);
    await page.getByRole('button', { name: 'Hint', exact: true }).click();
    const hint = page.locator('.assistance-note').filter({ hasText: 'Hint used' });
    await expect(hint).toBeVisible();
    const answer = question.type === 'preposition_cloze' ? question.acceptedAnswers![0]! : question.choices!.find(choice => choice.id === question.correctChoiceId)!.text;
    expect((await hint.innerText()).toLowerCase()).not.toContain(answer.toLowerCase());
    await page.getByRole('button', { name: 'Reveal answer', exact: true }).click();
    await expect(page.locator('.assistance-note').filter({ hasText: 'Answer revealed' })).toContainText(answer);
    await answerCurrent(page);
    await expect(page.locator('#feedback-title')).toHaveText('Assisted · correct answer');
    await page.getByRole('button', { name: 'Next question', exact: true }).click();
  }
});

test('revision construction, pending badge and action have separate responsive space', async ({ page }) => {
  await quick(page); await answerCurrent(page, false);
  await page.getByText('End this run', { exact: true }).click();
  await page.getByRole('button', { name: 'Abandon run', exact: true }).click();
  await page.goto('/#/progress');
  const row = page.locator('.revision-row').first(); await expect(row).toBeVisible();
  for (const width of [768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1080 });
    const name = (await row.locator('.revision-construction').boundingBox())!;
    const status = (await row.locator('.revision-pending').boundingBox())!;
    const action = (await row.getByRole('button', { name: 'Revise construction' }).boundingBox())!;
    for (const [a, b] of [[name, status], [status, action]]) {
      expect(b!.x >= a!.x + a!.width + 10 || b!.y >= a!.y + a!.height + 10).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await row.getByRole('button', { name: 'Revise construction' }).click();
  await expect(page.getByText('Question 1 of 1', { exact: true })).toBeVisible();
});
