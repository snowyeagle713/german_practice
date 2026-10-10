import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { Backup } from '../../src/storage/backup';
import { quick, finish } from './helpers';

function watchProduction(page: Page, failures: string[]) {
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
  page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
}

test('production manifest/icons, keyboard settings and portable restore into a fresh profile', async ({ page, browser }) => {
  test.setTimeout(120000);
  const failures: string[] = [];
  watchProduction(page, failures);
  await page.addInitScript(() => { Math.random = () => .999; });
  await page.goto('/#/settings');
  await expect(page.getByText(/^Offline ready ·/u)).toBeVisible();
  const manifest = await page.evaluate(async () => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')!;
    const response = await fetch(link.href);
    const data = await response.json();
    const icons = await Promise.all(data.icons.map(async (icon: { src: string; sizes: string; type: string }) => {
      const url = new URL(icon.src, link.href).href;
      const img = new Image(); img.src = url; await img.decode();
      return { url, width: img.naturalWidth, height: img.naturalHeight, sizes: icon.sizes, type: icon.type };
    }));
    const registration = await navigator.serviceWorker.ready;
    return { name: data.name, display: data.display, start: new URL(data.start_url, link.href).href,
      scope: new URL(data.scope, link.href).href, icons, active: registration.active?.state,
      controlled: Boolean(navigator.serviceWorker.controller), manifestOk: response.ok };
  });
  expect(manifest).toMatchObject({ name: 'German Trainer', display: 'standalone', active: 'activated', controlled: true, manifestOk: true });
  expect(manifest.start).toBe(new URL('/', page.url()).href);
  expect(manifest.scope).toBe(manifest.start);
  expect(manifest.icons.map(icon => [icon.width, icon.height])).toEqual([[192, 192], [512, 512]]);
  for (const icon of manifest.icons) {
    expect(icon.sizes).toBe(`${icon.width}x${icon.height}`);
    expect(icon.type).toBe('image/png');
    expect(new URL(icon.url).origin).toBe(new URL(page.url()).origin);
  }
  const palette = page.getByRole('combobox', { name: 'Palette' });
  await palette.focus(); await page.keyboard.press('End'); await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'proton-inspired');
  const size = page.getByRole('combobox', { name: 'Preferred session size' });
  await size.focus(); await page.keyboard.press('End'); await page.keyboard.press('Enter');
  await expect(size).toHaveValue('10');
  expect(await size.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
  await page.goto('/#/blocks');
  await page.getByRole('link', { name: 'Learn', exact: true }).click();
  await expect(page.locator('#construction-title')).toBeVisible();
  await quick(page); await finish(page, 10, 1);
  await quick(page);
  for (let index = 0; index < 10; index++) {
    await expect(page.getByText(`Question ${index + 1} of 10`, { exact: true })).toBeVisible();
    if (await page.getByRole('textbox', { name: 'Your preposition' }).count()) break;
    await page.getByRole('button', { name: 'Skip for now', exact: true }).click();
  }
  const prompt = await page.locator('#question-prompt').textContent();
  const input = page.getByRole('textbox', { name: 'Your preposition' });
  await input.fill('saved draft');
  await page.goto('/#/settings');
  await expect(page.locator('.save-state')).toHaveText('Automatic local saving');
  const download = page.waitForEvent('download');
  const exportButton = page.getByRole('button', { name: 'Export backup' });
  await exportButton.focus(); await page.keyboard.press('Enter');
  const file = await download; const path = await file.path();
  if (!path) throw new Error('Backup did not download');
  const backup: Backup = JSON.parse(await readFile(path, 'utf8'));
  expect(backup.appId).toBe('german-trainer');
  expect(backup.schemaVersion).toBe(1);
  expect(backup.settings).toEqual({ theme: 'proton-inspired', sessionSize: 10 });
  expect(backup.sessions).toHaveLength(2);
  expect(backup.attempts).toHaveLength(10);
  expect(backup.currentId).not.toBeNull();

  const fresh = await browser.newContext();
  try {
    const restored = await fresh.newPage(); watchProduction(restored, failures);
    await restored.goto('/#/settings');
    await expect(restored.locator('html')).toHaveAttribute('data-theme', 'lingua-learning');
    const chooser = restored.getByLabel('Choose backup to import (JSON, up to 10 MiB)');
    await chooser.focus(); await expect(chooser).toBeFocused();
    await chooser.setInputFiles(path);
    await expect(restored.getByRole('region', { name: 'Import preview' })).toBeVisible();
    await expect(restored.locator('html')).toHaveAttribute('data-theme', 'lingua-learning');
    const replace = restored.getByRole('button', { name: 'Replace progress' });
    await replace.focus(); await restored.keyboard.press('Enter');
    await expect(restored.getByText(/Backup restored successfully/u)).toBeVisible();
    await expect(restored.locator('html')).toHaveAttribute('data-theme', 'proton-inspired');
    await restored.reload();
    await expect(restored.getByRole('combobox', { name: 'Preferred session size' })).toHaveValue('10');
    await restored.goto('/#/progress');
    await expect(restored.getByRole('heading', { name: 'Awaiting revision (1)' })).toBeVisible();
    await expect(restored.getByRole('button', { name: 'View saved summary', exact: true })).toHaveCount(1);
    await restored.getByRole('button', { name: 'View saved summary', exact: true }).click();
    await expect(restored.locator('.summary-score strong')).toHaveText('90%');
    await restored.goto('/#/');
    await restored.getByRole('button', { name: 'Return to current run', exact: true }).click();
    await expect(restored.locator('#question-prompt')).toHaveText(prompt!);
    await expect(restored.getByRole('textbox', { name: 'Your preposition' })).toHaveValue('saved draft');
  } finally { await fresh.close(); }
  expect(failures).toEqual([]);
});
