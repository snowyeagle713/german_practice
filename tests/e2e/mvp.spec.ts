import { expect, test } from '@playwright/test';
import { quick, finish, answerCurrent } from './helpers';

test('wrong and assisted revision clears pending while original summary remains unchanged', async ({ page }) => {
  await quick(page);
  await answerCurrent(page, false);
  await page.getByRole('button', { name: 'Next question', exact: true }).click();
  await expect(page.getByText('Question 2 of 10', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Hint', exact: true }).click();
  await answerCurrent(page);
  await page.getByRole('button', { name: 'Next question', exact: true }).click();
  for (let i = 2; i < 10; i++) {
    await expect(page.getByText(`Question ${i + 1} of 10`, { exact: true })).toBeVisible();
    await answerCurrent(page);
    await page.getByRole('button', { name: i === 9 ? 'View summary' : 'Next question', exact: true }).click();
  }
  await expect(page.locator('.summary-score strong')).toHaveText('80%');
  await page.getByRole('link', { name: 'Revision & progress', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Awaiting revision (2)' })).toBeVisible();
  await page.getByRole('button', { name: 'Start revision', exact: true }).click();
  await finish(page, 2);
  await page.getByRole('link', { name: 'Revision & progress', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Awaiting revision (0)' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Awaiting revision (0)' })).toBeVisible();
});

test('deferred question returns before completion and Previous retains first feedback', async ({ page }) => {
  await quick(page);
  const first = await page.locator('#question-prompt').textContent();
  await page.getByRole('button', { name: 'Skip for now' }).click();
  await expect(page.getByText('Question 2 of 10', { exact: true })).toBeVisible();
  await answerCurrent(page);
  await page.getByRole('button', { name: 'Next question', exact: true }).click();
  await expect(page.getByText('Question 3 of 10', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Previous question' }).click();
  await expect(page.getByText('Question 2 of 10', { exact: true })).toBeVisible();
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Next question', exact: true }).click();
  for (let i = 2; i < 10; i++) { await expect(page.getByText(`Question ${i + 1} of 10`, { exact: true })).toBeVisible(); await answerCurrent(page); await page.getByRole('button', { name: 'Next question', exact: true }).click(); }
  await expect(page.locator('#question-prompt')).toHaveText(first!);
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '9');
  await answerCurrent(page);
  for (let i = 0; i < 9; i++) { await expect(page.getByText(`Question ${i + 1} of 10`, { exact: true })).toBeVisible(); await page.getByRole('button', { name: 'Next question', exact: true }).click(); }
  await page.getByRole('button', { name: 'View summary', exact: true }).click();
  await expect(page.locator('.summary-score strong')).toHaveText('100%');
});

test('saved history and construction coverage are real and survive reload', async ({ page }) => {
  await quick(page); await finish(page, 10, 1);
  await page.getByRole('link', { name: 'Revision & progress', exact: true }).click();
  await expect(page.getByText('10 / 40 questions covered · 9 unaided correct · 1 pending revision')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Awaiting revision (1)' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'View saved summary', exact: true }).click();
  await expect(page.locator('.summary-score strong')).toHaveText('90%');
});
