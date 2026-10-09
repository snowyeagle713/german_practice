import { expect, test } from '@playwright/test';
import { quick, finish } from './helpers';

test('production cache enables new-page offline Learn, exact resume, revision, history and theme', async ({ page, context }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => { Math.random = () => .999; });
  await quick(page); await finish(page, 10, 1);
  await page.goto('/#/settings');
  await page.getByRole('combobox', { name: 'Palette' }).selectOption('finance-dashboard');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'finance-dashboard');
  await expect(page.getByText(/^Offline ready · \d+ required files cached$/u)).toBeVisible();
  await page.goto('/#/blocks');
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible();
  const prompt = await page.locator('#question-prompt').textContent();
  await page.getByRole('button', { name: 'Hint', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Hint', exact: true })).toBeDisabled();
  await context.setOffline(true); await page.close();
  const offline = await context.newPage(); await offline.goto('/#/practice');
  await expect(offline.locator('#question-prompt')).toHaveText(prompt!);
  await expect(offline.getByRole('button', { name: 'Hint', exact: true })).toBeDisabled();
  await expect(offline.locator('html')).toHaveAttribute('data-theme', 'finance-dashboard');
  // Chromium's navigator.onLine may remain true for a fresh emulated-offline tab.
  // Verify actual network failure independently of that platform hint.
  expect(await offline.evaluate(() => fetch('/uncached-network-probe', { cache: 'no-store' }).then(() => false, () => true))).toBe(true);
  await expect(offline.locator('.page-header .badge')).toContainText(/Offline(?: ·)? ready/u);
  await finish(offline, 10);
  await offline.goto('/#/blocks'); await offline.getByRole('link', { name: 'Learn', exact: true }).click();
  await expect(offline.getByRole('article')).toBeVisible();
  await offline.goto('/#/progress');
  await expect(offline.getByRole('heading', { name: 'Awaiting revision (2)' })).toBeVisible();
  await offline.getByRole('button', { name: 'Start revision', exact: true }).click(); await finish(offline, 2);
  await offline.goto('/#/progress');
  await expect(offline.getByRole('heading', { name: 'Awaiting revision (0)' })).toBeVisible();
  await expect(offline.getByRole('button', { name: 'View saved summary', exact: true })).toHaveCount(3);
  await offline.reload();
  await expect(offline.getByRole('heading', { name: 'Awaiting revision (0)' })).toBeVisible();
});

test('readiness requires all precached assets and can recover a missing asset', async ({ page }) => {
  await page.goto('/#/settings');
  await expect(page.getByText(/^Offline ready ·/u)).toBeVisible();
  await page.evaluate(async () => {
    const name = (await caches.keys()).find(name => name.startsWith('german-trainer-assets-'))!;
    await (await caches.open(name)).delete(new URL('/content/seed-pack.json', location.origin).href);
  });
  await page.reload();
  await expect(page.getByText('Offline files are incomplete. Prepare them again while online.')).toBeVisible();
  await page.getByRole('button', { name: 'Prepare offline files' }).click();
  await expect(page.getByText(/^Offline ready ·/u)).toBeVisible();
});

test('waiting updates defer during active runs and stale tabs, then preserve history on activation', async ({ page, context }) => {
  test.setTimeout(90_000);
  const { createServer } = await import('node:http');
  const { readFile } = await import('node:fs/promises');
  const { resolve, extname } = await import('node:path');
  let updated = false;
  const server = createServer((request, response) => {
    const name = new URL(request.url ?? '/', 'http://localhost').pathname;
    const file = resolve('dist', name === '/' ? 'index.html' : `.${name}`);
    void readFile(file).then(buffer => {
      const types: Record<string, string> = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
      response.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
      response.setHeader('Cache-Control', 'no-store');
      response.end(name === '/sw.js' && updated ? buffer.toString().replace(/german-trainer-assets-[a-f0-9]+/u, 'german-trainer-assets-test-update') : buffer);
    }).catch(() => { response.writeHead(404); response.end(); });
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address(); if (!address || typeof address === 'string') throw new Error('No server address');
  const base = `http://127.0.0.1:${address.port}`;
  try {
    await page.goto(`${base}/#/settings`);
    await expect(page.getByText(/^Offline ready ·/u)).toBeVisible();
    await page.goto(`${base}/#/blocks`);
    await page.getByRole('radio', { name: 'Quick Practice · 10 questions' }).check();
    await page.getByRole('button', { name: 'Start practice', exact: true }).click();
    await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible();
    const other = await context.newPage(); await other.goto(`${base}/#/settings`);
    updated = true;
    await page.goto(`${base}/#/settings`);
    await page.getByRole('button', { name: 'Check for app update' }).click();
    await expect(page.getByText('Update available. Active runs defer installation in every open tab.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Apply update & reload' })).toBeDisabled();
    await page.goto(`${base}/#/practice`); await finish(page, 10, 1);
    await page.goto(`${base}/#/settings`);
    await page.getByRole('button', { name: 'Apply update & reload' }).click();
    await expect(page.getByText(/Update deferred: finish or abandon/u)).toBeVisible();
    await other.reload();
    await expect(other.getByRole('button', { name: 'Apply update & reload' })).toBeEnabled();
    await page.getByRole('button', { name: 'Apply update & reload' }).click();
    await expect(page.getByText('german-trainer-assets-test-update', { exact: true })).toBeVisible();
    await page.goto(`${base}/#/progress`);
    await expect(page.getByRole('heading', { name: 'Awaiting revision (1)' })).toBeVisible();
    await page.getByRole('button', { name: 'View saved summary', exact: true }).click();
    await expect(page.locator('.summary-score strong')).toHaveText('90%');
    expect(await page.evaluate(() => caches.keys())).toEqual(['german-trainer-assets-test-update']);
    await other.close();
    // Stop the origin and launch a fresh page with network disabled.
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await context.setOffline(true); await page.close();
    const offline = await context.newPage(); await offline.goto(`${base}/#/progress`);
    await expect(offline.getByRole('heading', { name: 'Awaiting revision (1)' })).toBeVisible();
  } finally { if (server.listening) await new Promise<void>(resolve => server.close(() => resolve())); }
});
