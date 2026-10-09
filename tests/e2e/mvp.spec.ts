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

test('Finance palette and Quick preference persist without replacing the layout or active run', async ({ page }) => {
  await quick(page); const prompt = await page.locator('#question-prompt').textContent();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Settings' }).click();
  await page.getByRole('combobox', { name: 'Palette' }).selectOption('finance-dashboard');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'finance-dashboard');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'finance-dashboard');
  await expect(page.getByRole('combobox', { name: 'Preferred session size' })).toHaveValue('10');
  await page.goto('/#/practice');
  await expect(page.locator('#question-prompt')).toHaveText(prompt!);
  await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible();
});

test('backup preview/cancel, invalid rejection and explicit replacement preserve real progress', async ({ page }) => {
  await quick(page); await finish(page, 10, 1);
  await page.goto('/#/settings');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const file = await download; const path = await file.path(); if (!path) throw new Error('No backup download');
  await page.getByRole('combobox', { name: 'Palette' }).selectOption('finance-dashboard');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'finance-dashboard');
  const chooser = page.getByLabel('Choose backup to import (JSON, up to 10 MiB)');
  await chooser.setInputFiles(path);
  await expect(page.getByRole('region', { name: 'Import preview' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel import' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'finance-dashboard');
  await chooser.setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"schemaVersion":999}') });
  await expect(page.getByText(/Backup schema invalid or unsupported/u)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Replace progress' })).toHaveCount(0);
  await chooser.setInputFiles(path);
  await expect(page.getByRole('region', { name: 'Import preview' })).toBeVisible();
  await page.getByRole('button', { name: 'Replace progress' }).click();
  await expect(page.getByText(/Backup restored successfully/u)).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'lingua-learning');
  await page.reload(); await page.goto('/#/progress');
  await expect(page.getByRole('heading', { name: 'Awaiting revision (1)' })).toBeVisible();
  await page.getByRole('button', { name: 'View saved summary', exact: true }).click();
  await expect(page.locator('.summary-score strong')).toHaveText('90%');
});
