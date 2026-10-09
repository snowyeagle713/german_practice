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

test('write failure keeps the learner draft, blocks grading and retries exactly once', async ({ page }) => {
  await page.addInitScript(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === 'attempts' && document.documentElement.dataset.failSave === 'yes') throw new DOMException('Test storage quota exceeded', 'QuotaExceededError');
      return original.apply(this, args);
    };
  });
  await page.addInitScript(() => { Math.random = () => .999; });
  await quick(page);
  await page.getByRole('textbox', { name: 'Your preposition' }).fill('auf');
  await page.evaluate(() => { document.documentElement.dataset.failSave = 'yes'; });
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByRole('alert')).toContainText('Test storage quota exceeded');
  await expect(page.getByRole('textbox', { name: 'Your preposition' })).toHaveValue('auf');
  await expect(page.locator('#feedback-title')).toHaveCount(0);
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
  await page.evaluate(() => { document.documentElement.dataset.failSave = 'no'; });
  await page.getByRole('button', { name: 'Retry local save' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
  await page.reload();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1');
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
});

test('a stale browser tab cannot overwrite a saved first answer', async ({ page, context }) => {
  await quick(page);
  const other = await context.newPage(); await other.goto('/#/practice');
  await expect(other.getByText('Question 1 of 10', { exact: true })).toBeVisible();
  await answerCurrent(page);
  // A stale tab's draft save fails before it can submit or overwrite the winner.
  const textbox = other.getByRole('textbox', { name: 'Your preposition' });
  if (await textbox.count()) await textbox.fill('wrong');
  else await other.getByRole('radio').first().check();
  await expect(other.getByRole('alert')).toContainText('Another tab changed progress');
  await other.reload();
  await expect(other.locator('#feedback-title')).toHaveText('Correct');
  await expect(other.getByRole('progressbar')).toHaveAttribute('value', '1');
});

test('four Quick runs rotate through all 40 authored questions across reloads', async ({ page }) => {
  test.setTimeout(90_000);
  const prompts = new Set<string>();
  for (let run = 0; run < 4; run++) {
    await quick(page);
    for (let i = 0; i < 10; i++) {
      await expect(page.getByText(`Question ${i + 1} of 10`, { exact: true })).toBeVisible();
      const prompt = (await page.locator('#question-prompt').textContent())!;
      expect(prompts.has(prompt)).toBe(false); prompts.add(prompt);
      await answerCurrent(page);
      await page.getByRole('button', { name: i === 9 ? 'View summary' : 'Next question', exact: true }).click();
    }
    await expect(page.locator('.summary-score strong')).toHaveText('100%');
    await page.reload();
  }
  expect(prompts.size).toBe(40);
});

test('explicit abandonment retains checked answers without claiming a completed score', async ({ page }) => {
  await quick(page); await answerCurrent(page, false);
  await page.getByText('End this run', { exact: true }).click();
  await page.getByRole('button', { name: 'Abandon run', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Progress');
  await expect(page.getByText('1 checked; no final score')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Awaiting revision (1)' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume practice', exact: true })).toHaveCount(0);
  await page.goto('/#/settings');
  await page.getByRole('button', { name: 'Export backup' }).click();
  await expect(page.getByText('Backup download requested. Keep the file somewhere safe.')).toBeVisible();
});

test('a failed draft save is retained and recoverable before checking the answer', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => .999;
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === 'sessions' && document.documentElement.dataset.failDraft === 'yes') throw new DOMException('Test draft save failed', 'QuotaExceededError');
      return original.apply(this, args);
    };
  });
  await quick(page);
  await page.evaluate(() => { document.documentElement.dataset.failDraft = 'yes'; });
  const input = page.getByRole('textbox', { name: 'Your preposition' });
  await input.fill('auf');
  await expect(page.getByRole('alert')).toContainText('Test draft save failed');
  await expect(input).toHaveValue('auf'); await expect(input).toHaveAttribute('readonly', '');
  await expect(page.getByRole('button', { name: 'Check answer' })).toBeDisabled();
  await page.evaluate(() => { document.documentElement.dataset.failDraft = 'no'; });
  await page.getByRole('button', { name: 'Retry local save' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.reload(); await expect(input).toHaveValue('auf');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
});

test('rapid native typing survives queued persistence and grades the visible answer', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .999; }); await quick(page);
  await page.getByRole('textbox', { name: 'Your preposition' }).pressSequentially('auf', { delay: 0 });
  await page.keyboard.press('Enter');
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
  await expect(page.getByRole('textbox', { name: 'Your preposition' })).toHaveValue('auf');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Your preposition' })).toHaveValue('auf');
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
});
