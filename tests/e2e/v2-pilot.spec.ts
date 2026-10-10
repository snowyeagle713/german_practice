import { expect, test, type Page } from '@playwright/test';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createServer } from 'node:http';
import { finish as finishStarter } from './helpers';
import { fileURLToPath } from 'node:url';
import pilot from '../../content/verb-forms-pilot.json' with { type: 'json' };
import batch from '../../content/verb-forms-batch-1.json' with { type: 'json' };
import batch2 from '../../content/verb-forms-batch-2.json' with { type: 'json' };
import type { ContentPackV2 } from '../../src/domain/content/v2';
const pack = pilot as unknown as ContentPackV2;
const screenshots = resolve('test-results/v2-pilot-evidence');
async function shot(page: Page, name: string) {
  await mkdir(screenshots, { recursive: true });
  // Neutralize full-page capture artifacts from sticky/fixed elements at a scrolled offset.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${screenshots}/${name}.png`, fullPage: true });
}
async function blocks(page: Page, base = '') {
  await page.goto(`${base}/#/blocks`);
  await page.getByRole('button', { name: 'Verb Forms', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(19);
}
async function start(page: Page, size: 10 | 20 = 10, block = 0) {
  await blocks(page);
  await page.getByRole('radio', { name: size === 10 ? 'Quick Practice · 10 questions' : 'Standard Practice · 20 questions' }).check();
  await page.getByRole('article').nth(block).getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByText(`Question 1 of ${size}`, { exact: true })).toBeVisible();
}
async function answer(page: Page, correct = true) {
  const prompt = await page.locator('#question-prompt').textContent();
  const q = pack.questions.find(q => q.prompt === prompt)!;
  expect(q).toBeDefined();
  if (q.type === 'verb_form_text') await page.getByRole('textbox', { name: 'Your verb form' }).fill(correct ? q.acceptedAnswers[0]! : 'wrong');
  else await page.getByRole('radio', { name: q.choices.find(choice => correct ? choice.id === q.correctChoiceId : choice.id !== q.correctChoiceId)!.text, exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('#feedback-title')).toBeVisible(); return q;
}
async function finish(page: Page, size: number, mistakes = false) {
  for (let n = 0; n < size; n++) {
    await expect(page.getByText(`Question ${n + 1} of ${size}`, { exact: true })).toBeVisible();
    if (mistakes && n === 1) await page.getByRole('button', { name: 'Hint', exact: true }).click();
    await answer(page, !mistakes || n !== 0);
    await page.getByRole('button', { name: n === size - 1 ? 'View summary' : 'Next question', exact: true }).click();
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Session summary');
}
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return errors;
}

test('alphabetical catalog, all principal parts and responsive study guide', async ({ page }) => {
  const errors = watchErrors(page);
  await page.setViewportSize({ width: 1600, height: 900 }); await blocks(page);
  await expect(page.getByText('70 authored questions')).toHaveCount(19);
  const labels = await page.getByRole('navigation', { name: 'Alphabetical verbs' }).getByRole('link').allTextContents();
  expect(labels).toEqual([...pack.items, ...batch.items, ...batch2.items].map(item => item.title).sort((a, b) => a.localeCompare(b, 'de'))); await shot(page, 'blocks');
  await page.getByRole('navigation', { name: 'Alphabetical verbs' }).getByRole('link', { name: 'fahren', exact: true }).click();
  await expect(page.locator('.verb-form-grid')).toContainText('fuhr');
  await expect(page.locator('.verb-form-grid')).toContainText('gefahren');
  await expect(page.locator('.verb-form-grid')).toContainText('fährt');
  await expect(page.getByText(/Transitive driving/)).toBeVisible(); await shot(page, 'learn');
  await page.getByRole('navigation', { name: 'Verbs in this block' }).getByRole('link', { name: 'aufstehen', exact: true }).click();
  await expect(page.locator('.verb-form-grid')).toContainText('stand auf');
  await expect(page.locator('.verb-form-grid')).toContainText('separable');
  expect(errors).toEqual([]);
});

test('seven templates, safe hints, reveal, exact drafts/feedback, Skip and keyboard', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .999; }); await start(page);
  const seen = new Set<string>();
  for (let n = 0; n < 7; n++) {
    await expect(page.getByText(`Question ${n + 1} of 10`, { exact: true })).toBeVisible();
    const q = pack.questions[n]!; seen.add(q.templateId);
    await expect(page.locator('#question-prompt')).toHaveText(q.prompt);
    await page.getByRole('button', { name: 'Hint', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Hint', exact: true })).toBeDisabled();
    const text = await page.locator('.assistance-note').textContent();
    const expected = q.type === 'verb_form_text' ? q.acceptedAnswers[0]! : q.choices.find(c => c.id === q.correctChoiceId)!.text;
    const normalized = (text ?? '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ');
    expect(` ${normalized} `).not.toContain(` ${expected.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ')} `);
    if (n === 0) {
      await page.getByRole('textbox', { name: 'Your verb form' }).fill('draft before reload');
      await expect(page.locator('.save-state')).toHaveText('Automatic local saving');
      await page.waitForTimeout(450); await page.reload();
      await expect(page.getByRole('textbox', { name: 'Your verb form' })).toHaveValue('draft before reload');
      await shot(page, 'practice');
    }
    if (n === 1) {
      await page.getByRole('button', { name: 'Reveal answer', exact: true }).click();
      await expect(page.getByText(expected, { exact: true })).toBeVisible();
    }
    await answer(page); await expect(page.locator('#feedback-title')).toContainText('Assisted');
    if (n === 0) {
      await shot(page, 'feedback'); await page.reload();
      await expect(page.locator('#feedback-title')).toContainText('Assisted');
      await expect(page.getByRole('textbox', { name: 'Your verb form' })).toHaveValue(expected);
    }
    const next = page.getByRole('button', { name: 'Next question', exact: true }); await next.focus(); await page.keyboard.press('Enter');
  }
  expect(seen.size).toBe(7);
  await expect(page.getByText('Question 8 of 10', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Skip for now' }).click();
  await expect(page.getByText('Question 9 of 10', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Previous question' }).click();
  await expect(page.getByText('Question 8 of 10', { exact: true })).toBeVisible();
});

test('Quick wrong/assisted revision, original summary and meaningful progress labels', async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => { Math.random = () => .999; }); await start(page); await finish(page, 10, true);
  await expect(page.getByText('80%', { exact: true })).toBeVisible(); await shot(page, 'summary');
  await page.goto('/#/progress');
  await expect(page.getByRole('heading', { name: 'Awaiting revision (2)' })).toBeVisible();
  await expect(page.locator('.revision-row')).toContainText(['arbeiten']);
  await expect(page.locator('.revision-row')).toContainText('Präteritum recall');
  await expect(page.locator('.revision-row')).toContainText('Partizip II recall'); await shot(page, 'progress');
  await page.getByRole('button', { name: 'Revise verb', exact: true }).click(); await finish(page, 2);
  await page.goto('/#/progress'); await expect(page.getByRole('heading', { name: 'Awaiting revision (0)' })).toBeVisible();
  await page.getByRole('button', { name: 'View saved summary', exact: true }).last().click();
  await expect(page.getByText('80%', { exact: true })).toBeVisible(); expect(errors).toEqual([]);
});

test('Standard 20, pool variation, safe mixed backup and restore into a fresh profile', async ({ page, browser }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => { Math.random = () => .999; }); await start(page, 20, 1);
  const first = await page.locator('#question-prompt').textContent(); await finish(page, 20);
  await start(page, 20, 1); expect(await page.locator('#question-prompt').textContent()).not.toBe(first);
  const q = pack.questions.find(q => q.prompt === first)!; expect(q).toBeDefined();
  const draftPrompt = await page.locator('#question-prompt').textContent();
  const draftQuestion = pack.questions.find(q => q.prompt === draftPrompt)!;
  if (draftQuestion.type === 'verb_form_text') await page.getByRole('textbox', { name: 'Your verb form' }).fill('portable draft');
  else await page.getByRole('radio').first().check();
  await page.goto('/#/settings');
  await page.getByRole('combobox', { name: 'Palette' }).selectOption('proton-inspired');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'proton-inspired');
  await expect(page.locator('.save-state')).toHaveText('Automatic local saving');
  const event = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export backup' }).click();
  const path = await (await event).path(); if (!path) throw new Error('No downloaded backup');
  const data = JSON.parse(await readFile(path, 'utf8')); expect(data.schemaVersion).toBe(2); expect(data.sessions).toHaveLength(2);
  const fresh = await browser.newContext(); const restored = await fresh.newPage();
  try {
    await restored.goto('/#/settings'); await restored.locator('#backup-file').setInputFiles(path);
    await expect(restored.getByRole('region', { name: 'Import preview' })).toBeVisible();
    await restored.getByRole('button', { name: 'Replace progress' }).click();
    await expect(restored.getByText(/Backup restored successfully/)).toBeVisible();
    await expect(restored.locator('html')).toHaveAttribute('data-theme', 'proton-inspired');
    await restored.goto('/#/practice');
    await expect(restored.locator('#question-prompt')).toHaveText(draftQuestion.prompt);
    if (draftQuestion.type === 'verb_form_text') await expect(restored.getByRole('textbox', { name: 'Your verb form' })).toHaveValue('portable draft');
    else await expect(restored.getByRole('radio').first()).toBeChecked();
  } finally { await fresh.close(); }
});

test('imports untouched release v1 backup, resumes Starter and exports mixed v1/v2 evidence', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/#/settings');
  await page.locator('#backup-file').setInputFiles(fileURLToPath(new URL('../fixtures/mvp-v1-backup.json', import.meta.url)));
  await page.getByRole('button', { name: 'Replace progress' }).click();
  await expect(page.getByText(/Backup restored successfully/)).toBeVisible();
  await page.goto('/#/practice');
  await expect(page.getByText('Question 2 of 10', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Your preposition' })).toHaveValue('draft from the MVP release');
  await page.getByRole('button', { name: 'Previous question' }).click();
  await expect(page.locator('#feedback-title')).toContainText('Assisted');
  await page.getByRole('button', { name: 'Next question' }).click();
  // The imported run's original order and saved evidence remain available; abandon explicitly.
  await page.getByText('End this run', { exact: true }).click(); await page.getByRole('button', { name: 'Abandon run' }).click();
  await start(page); await finish(page, 10);
  await page.goto('/#/settings'); const event = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export backup' }).click();
  const path = await (await event).path(); if (!path) throw new Error('No backup');
  const backup = JSON.parse(await readFile(path, 'utf8')); expect(backup.schemaVersion).toBe(2);
  expect(backup.sessions.map((session: {contentSnapshot:{schemaVersion:number}}) => session.contentSnapshot.schemaVersion)).toEqual([1, 2]);
  await page.locator('#backup-file').setInputFiles(path); await expect(page.getByRole('region', { name: 'Import preview' })).toBeVisible();
  await page.getByRole('button', { name: 'Replace progress' }).click(); await expect(page.getByText(/Backup restored successfully/)).toBeVisible();
  await page.goto('/#/progress'); await expect(page.getByRole('heading', { name: 'Awaiting revision (1)' })).toBeVisible();
});

test('v2 offline fresh-page resume, Learn, revision, history and export', async ({ page, context }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => { Math.random = () => .999; }); await start(page); await finish(page, 10, true);
  await start(page); const prompt = await page.locator('#question-prompt').textContent();
  await page.getByRole('button', { name: 'Hint', exact: true }).click();
  await page.goto('/#/settings'); await expect(page.getByText(/^Offline ready ·/)).toBeVisible();
  await context.setOffline(true); await page.close(); const offline = await context.newPage();
  await offline.goto('/#/practice'); await expect(offline.locator('#question-prompt')).toHaveText(prompt!);
  await expect(offline.getByRole('button', { name: 'Hint', exact: true })).toBeDisabled(); await finish(offline, 10);
  await offline.goto('/#/learn/verb-forms-pilot-01/forms-fahren'); await expect(offline.locator('.verb-form-grid')).toContainText('gefahren');
  await offline.goto('/#/progress'); await expect(offline.getByRole('heading', { name: 'Awaiting revision (3)' })).toBeVisible();
  await offline.getByRole('button', { name: 'Start revision', exact: true }).click(); await finish(offline, 3);
  await offline.goto('/#/progress'); await expect(offline.getByRole('heading', { name: 'Awaiting revision (0)' })).toBeVisible();
  await offline.goto('/#/settings'); const event = offline.waitForEvent('download'); await offline.getByRole('button', { name: 'Export backup' }).click();
  const path = await (await event).path(); if (!path) throw new Error('No offline backup');
  expect(JSON.parse(await readFile(path, 'utf8')).schemaVersion).toBe(2);
});

for (const [width, height] of [[1920,1080],[1366,768],[1024,768],[768,1024],[390,844]]) {
  test(`v2 Learn and Practice fit ${width}×${height} and retain reachable controls`, async ({ page }) => {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto('/#/learn/verb-forms-pilot-01/forms-fahren');
    await expect(page.locator('.verb-form-grid')).toContainText('fährt');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    if (width === 390) { await page.getByRole('combobox', { name: 'Verb', exact: true }).selectOption('forms-aufstehen'); await shot(page, 'phone'); }
    await page.getByRole('button', { name: 'Start practice', exact: true }).click();
    await expect(page.locator('#question-prompt')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await answer(page); await page.getByRole('button', { name: 'Next question', exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Next question', exact: true })).toBeInViewport();
  });
}

test('older offline bootstrap blocks v2 until a safe update, preserving Starter evidence', async ({ page }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => { Math.random = () => .999; });
  // Model the original worker's READINESS contract on a real origin, not page routing:
  // browser service-worker script loads bypass Playwright page.route.
  let updated = false;
  const server = createServer((request, response) => {
    const name = new URL(request.url ?? '/', 'http://localhost').pathname;
    const file = resolve('dist', name === '/' ? 'index.html' : `.${name}`);
    void readFile(file).then(buffer => {
      const types: Record<string, string> = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
      response.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
      response.setHeader('Cache-Control', 'no-store');
      let body: string | Buffer = buffer;
      if (name === '/sw.js') {
        body = buffer.toString().replace(/german-trainer-assets-[a-f0-9]+/u, updated ? 'german-trainer-assets-runtime-upgrade' : 'german-trainer-assets-legacy-contract');
        if (!updated) body = body.replace('runtimeVersion: 2,', '');
      }
      response.end(body);
    }).catch(() => { response.writeHead(404); response.end(); });
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address(); if (!address || typeof address === 'string') throw new Error('No test origin');
  const base = `http://127.0.0.1:${address.port}`;
  try {
    await page.goto(`${base}/#/settings`);
    await expect(page.getByText(/Apply the available app update before using Verb Forms offline/)).toBeVisible();
    await page.locator('#backup-file').setInputFiles(fileURLToPath(new URL('../fixtures/v2-pilot-backup.json', import.meta.url)));
    await expect(page.getByText(/Apply the available app update before importing v2 progress/)).toBeVisible();
    await expect(page.getByRole('region', { name: 'Import preview' })).toHaveCount(0);
    await blocks(page, base); await page.getByRole('article').first().getByRole('button', { name: 'Start practice', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('before starting Verb Forms');
    await page.getByRole('button', { name: 'Verb Constructions', exact: true }).click();
    await page.getByRole('radio', { name: 'Quick Practice · 10 questions' }).check();
    await page.getByRole('button', { name: 'Start practice', exact: true }).click();
    await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible();
    updated = true; await page.goto(`${base}/#/settings`);
    await page.getByRole('button', { name: 'Check for app update' }).click();
    await expect(page.getByRole('button', { name: 'Apply update & reload' })).toBeDisabled();
    await page.goto(`${base}/#/practice`); await finishStarter(page, 10);
    await page.goto(`${base}/#/settings`); await page.getByRole('button', { name: 'Apply update & reload' }).click();
    await expect(page.getByText(/^Offline ready ·/)).toBeVisible();
    await expect(page.getByText('german-trainer-assets-runtime-upgrade', { exact: true })).toBeVisible();
    await blocks(page, base); await page.getByRole('article').first().getByRole('button', { name: 'Start practice', exact: true }).click();
    await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible();
    await expect(page.locator('.practice-card .eyebrow')).toContainText('Präteritum recall');
    await page.goto(`${base}/#/progress`);
    await expect(page.getByRole('button', { name: 'View saved summary', exact: true })).toHaveCount(1);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
