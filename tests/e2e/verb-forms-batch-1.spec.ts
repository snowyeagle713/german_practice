import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import batch from '../../content/verb-forms-batch-1.json' with { type: 'json' };
import pilot from '../../content/verb-forms-pilot.json' with { type: 'json' };
import type { ContentPackV2 } from '../../src/domain/content/v2';
const pack = batch as unknown as ContentPackV2;

async function start(page: Page, block = 0, size: 10 | 20 = 10) {
  await page.goto('/#/blocks');
  await page.getByRole('button', { name: 'Verb Forms', exact: true }).click();
  await page.getByRole('radio', { name: size === 10 ? 'Quick Practice · 10 questions' : 'Standard Practice · 20 questions' }).check();
  const card = page.getByRole('article').filter({ has: page.getByRole('heading', { name: pack.blocks[block]!.title, exact: true }) });
  await card.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByText(`Question 1 of ${size}`, { exact: true })).toBeVisible();
}
async function answer(page: Page, correct = true) {
  const prompt = await page.locator('#question-prompt').textContent();
  const q = pack.questions.find(q => q.prompt === prompt)!; expect(q).toBeDefined();
  if (q.type === 'verb_form_text') await page.getByRole('textbox', { name: 'Your verb form' }).fill(correct ? q.acceptedAnswers[0]! : 'wrong');
  else await page.getByRole('radio', { name: q.choices.find(c => correct ? c.id === q.correctChoiceId : c.id !== q.correctChoiceId)!.text, exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('#feedback-title')).toBeVisible(); return q;
}
async function finish(page: Page, count: number, mistakes = false) {
  const seen: string[] = [];
  for (let n = 0; n < count; n++) {
    await expect(page.getByText(`Question ${n + 1} of ${count}`, { exact: true })).toBeVisible();
    if (mistakes && n === 1) await page.getByRole('button', { name: 'Hint', exact: true }).click();
    const q = await answer(page, !mistakes || n !== 0); seen.push(q.id);
    await page.getByRole('button', { name: n === count - 1 ? 'View summary' : 'Next question', exact: true }).click();
  }
  expect(new Set(seen).size).toBe(count);
  await expect(page.getByRole('heading', { name: 'Session summary', exact: true })).toBeVisible(); return seen;
}

test('100-verb global alphabetical index routes to stable pilot/new blocks and ships the exact authored pack', async ({ page, request }) => {
  await page.goto('/#/blocks'); await page.getByRole('button', { name: 'Verb Forms', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(10);
  const index = page.getByRole('navigation', { name: 'Alphabetical verbs' });
  const labels = [...pilot.items, ...pack.items].map(i => i.title).sort((a, b) => a.localeCompare(b, 'de'));
  expect(await index.getByRole('link').allTextContents()).toEqual(labels);
  for (const p of [pilot, pack]) for (const item of p.items) {
    const block = p.blocks.find(b => b.itemIds.includes(item.id))!;
    await expect(index.getByRole('link', { name: item.title, exact: true })).toHaveAttribute('href', `#/learn/${block.id}/${item.id}`);
  }
  const response = await request.get('/content/verb-forms-batch-1.json');
  expect(response.ok()).toBe(true);
  expect(await response.text()).toBe(await readFile('content/verb-forms-batch-1.json', 'utf8'));
});

for (const [n, block] of pack.blocks.entries()) {
  test(`${block.id}: Learn, Quick/Standard start, hint, keyboard and feedback resume`, async ({ page }) => {
    await page.addInitScript(() => { Math.random = () => .999; });
    const item = pack.items.find(i => i.id === block.itemIds[0])!;
    await page.goto(`/#/learn/${block.id}/${item.id}`);
    await expect(page.getByRole('heading', { name: item.title, exact: true })).toBeVisible();
    await expect(page.locator('.verb-form-grid')).toContainText(item.properties.participle);
    await expect(page.getByRole('navigation', { name: 'Verbs in this block' }).getByRole('link')).toHaveCount(10);
    await start(page, n, n % 2 ? 20 : 10);
    const first = await page.locator('#question-prompt').textContent();
    await page.getByRole('button', { name: 'Hint', exact: true }).click();
    const q = pack.questions.find(q => q.prompt === first)!;
    await page.getByRole('textbox', { name: 'Your verb form' }).fill(q.type === 'verb_form_text' ? q.acceptedAnswers[0]! : 'wrong');
    await page.getByRole('button', { name: 'Check answer', exact: true }).focus(); await page.keyboard.press('Enter');
    await expect(page.locator('#feedback-title')).toContainText('Assisted');
    await page.reload(); await expect(page.locator('#question-prompt')).toHaveText(first!);
    await expect(page.locator('#feedback-title')).toContainText('Assisted');
    const next = page.getByRole('button', { name: 'Next question', exact: true }); await next.focus(); await page.keyboard.press('Enter');
    await expect(page.getByText(`Question 2 of ${n % 2 ? 20 : 10}`, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

test('new Quick block completes, revises wrong/assisted facets, preserves score and restores exact draft/theme in a fresh profile', async ({ page, browser }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => { Math.random = () => .999; });
  await start(page, 7); await finish(page, 10, true);
  await expect(page.getByText('80%', { exact: true })).toBeVisible();
  await page.goto('/#/progress'); await expect(page.getByRole('heading', { name: 'Awaiting revision (2)' })).toBeVisible();
  await expect(page.locator('.revision-row')).toContainText('verlieren');
  await page.getByRole('button', { name: 'Revise verb', exact: true }).click(); await finish(page, 2);
  await page.goto('/#/progress'); await expect(page.getByRole('heading', { name: 'Awaiting revision (0)' })).toBeVisible();
  await page.getByRole('button', { name: 'View saved summary', exact: true }).last().click();
  await expect(page.getByText('80%', { exact: true })).toBeVisible();
  await start(page, 0); const prompt = await page.locator('#question-prompt').textContent();
  await page.getByRole('textbox', { name: 'Your verb form' }).fill('saved batch draft');
  await expect(page.locator('.save-state')).toHaveText('Automatic local saving'); await page.waitForTimeout(450);
  await page.goto('/#/settings'); await page.getByRole('combobox', { name: 'Palette' }).selectOption('finance-dashboard');
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export backup' }).click();
  const path = await (await download).path(); if (!path) throw new Error('No backup download');
  const exported = JSON.parse(await readFile(path, 'utf8')); expect(exported.schemaVersion).toBe(2);
  expect(exported.sessions).toHaveLength(3);
  const fresh = await browser.newContext(); const restored = await fresh.newPage();
  try {
    await restored.goto('/#/settings'); await restored.locator('#backup-file').setInputFiles(path);
    await expect(restored.getByRole('region', { name: 'Import preview' })).toBeVisible();
    await restored.getByRole('button', { name: 'Replace progress' }).click(); await expect(restored.getByText(/Backup restored successfully/)).toBeVisible();
    await expect(restored.locator('html')).toHaveAttribute('data-theme', 'finance-dashboard');
    await restored.goto('/#/practice'); await expect(restored.locator('#question-prompt')).toHaveText(prompt!);
    await expect(restored.getByRole('textbox', { name: 'Your verb form' })).toHaveValue('saved batch draft');
  } finally { await fresh.close(); }
});

test('new Standard 20 completes exactly once per authored question and next run rotates the pool', async ({ page }) => {
  test.setTimeout(90_000); await page.addInitScript(() => { Math.random = () => .999; });
  await start(page, 3, 20); const first = await page.locator('#question-prompt').textContent();
  const ids = await finish(page, 20); expect(ids.every(id => pack.blocks[3]!.questionIds.includes(id))).toBe(true);
  await expect(page.getByText('100%', { exact: true })).toBeVisible();
  await start(page, 3, 20); expect(await page.locator('#question-prompt').textContent()).not.toBe(first);
});

test('production offline fresh launch loads every new block and resumes/completes new practice with export', async ({ page, context }) => {
  test.setTimeout(90_000); await page.addInitScript(() => { Math.random = () => .999; });
  await start(page, 6); const prompt = await page.locator('#question-prompt').textContent();
  await page.getByRole('textbox', { name: 'Your verb form' }).fill('offline draft');
  await page.goto('/#/settings'); await expect(page.getByText(/^Offline ready ·/)).toBeVisible();
  await context.setOffline(true); await page.close(); const offline = await context.newPage();
  for (const block of pack.blocks) {
    const item = pack.items.find(i => i.id === block.itemIds[0])!;
    await offline.goto(`/#/learn/${block.id}/${item.id}`);
    await expect(offline.locator('.verb-form-grid')).toContainText(item.properties.participle);
  }
  await offline.goto('/#/practice'); await expect(offline.locator('#question-prompt')).toHaveText(prompt!);
  await expect(offline.getByRole('textbox', { name: 'Your verb form' })).toHaveValue('offline draft');
  await finish(offline, 10);
  await offline.goto('/#/progress'); await expect(offline.getByText(pack.blocks[6]!.title, { exact: true }).first()).toBeVisible();
  await offline.goto('/#/settings'); const download = offline.waitForEvent('download'); await offline.getByRole('button', { name: 'Export backup' }).click();
  const path = await (await download).path(); if (!path) throw new Error('No offline export');
  expect(JSON.parse(await readFile(path, 'utf8')).sessions[0].contentSnapshot.packId).toBe(pack.packId);
});
