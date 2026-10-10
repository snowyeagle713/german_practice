import { expect, test, type Page } from '@playwright/test';
import { quick } from './helpers';

async function savedDraft(page: Page) {
  return page.evaluate(() => new Promise<unknown>((resolve, reject) => {
    const open = indexedDB.open('german-trainer', 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result, tx = db.transaction('sessions');
      const request = tx.objectStore('sessions').getAll();
      tx.oncomplete = () => { db.close(); resolve(request.result.find((session: { status: string }) => session.status === 'answering')?.response ?? null); };
    };
  }));
}
async function textFirst(page: Page) {
  await page.addInitScript(() => { Math.random = () => .999; }); await quick(page);
}

test('text autosaves the latest debounced draft and resumes it exactly', async ({ page }) => {
  await textFirst(page);
  const input = page.getByRole('textbox', { name: 'Your preposition' });
  await input.pressSequentially('auf', { delay: 20 });
  await expect.poll(() => savedDraft(page)).toEqual({ kind: 'text', value: 'auf' });
  await page.reload(); await expect(input).toHaveValue('auf'); await expect(input).toBeFocused();
});

test('submission flushes a pending draft before grading', async ({ page }) => {
  await textFirst(page);
  await page.getByRole('textbox', { name: 'Your preposition' }).fill('auf');
  await page.keyboard.press('Enter');
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
  await page.reload();
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
  await expect(page.getByRole('textbox', { name: 'Your preposition' })).toHaveValue('auf');
});

test('Skip and sidebar navigation flush drafts without losing the answer', async ({ page }) => {
  await textFirst(page);
  const input = page.getByRole('textbox', { name: 'Your preposition' });
  await input.fill('auf'); await page.getByRole('button', { name: 'Skip for now' }).click();
  await expect(page.getByText('Question 2 of 10', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Previous question' }).click();
  await expect(input).toHaveValue('auf');
  await input.fill('latest draft');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Home' }).click();
  await expect.poll(() => savedDraft(page)).toEqual({ kind: 'text', value: 'latest draft' });
  await page.goto('/#/practice'); await expect(input).toHaveValue('latest draft');
});

test('choice saves immediately and resumes the same checked radio', async ({ page }) => {
  await textFirst(page);
  for (const position of [2, 3]) { await page.getByRole('button', { name: 'Skip for now' }).click(); await expect(page.getByText(`Question ${position} of 10`, { exact: true })).toBeVisible(); }
  const radio = page.getByRole('radio').first(); const value = await radio.getAttribute('value');
  await radio.check(); await expect.poll(() => savedDraft(page)).toEqual({ kind: 'choice', choiceId: value });
  await page.reload(); await expect(page.getByRole('radio').first()).toBeChecked();
});

for (const kind of ['text', 'choice'] as const) {
  test(`${kind} autosaves do not move the card or steal input focus even with slow writes`, async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); await textFirst(page);
    if (kind === 'choice') for (const position of [2, 3]) { await page.getByRole('button', { name: 'Skip for now' }).click(); await expect(page.getByText(`Question ${position} of 10`, { exact: true })).toBeVisible(); }
    await page.evaluate(() => {
      const original = IDBObjectStore.prototype.put;
      IDBObjectStore.prototype.put = function (...args) {
        const result = original.apply(this, args);
        if (this.name === 'metadata') {
          const until = performance.now() + 180;
          const keepAlive = () => { const request = this.get('state'); request.onsuccess = () => { if (performance.now() < until) keepAlive(); }; };
          keepAlive();
        }
        return result;
      };
      const samples: number[] = []; const start = performance.now();
      (window as unknown as { polishSamples: number[] }).polishSamples = samples;
      function frame() { samples.push(document.querySelector('.practice-card')!.getBoundingClientRect().top); if (performance.now() - start < 1300) requestAnimationFrame(frame); }
      requestAnimationFrame(frame);
    });
    const control = kind === 'text' ? page.getByRole('textbox', { name: 'Your preposition' }) : page.getByRole('radio').first();
    if (kind === 'text') await control.pressSequentially('auf', { delay: 30 }); else await control.check();
    await expect(control).toBeFocused(); await expect.poll(() => savedDraft(page)).not.toBeNull();
    await expect.poll(() => page.evaluate(() => (window as unknown as { polishSamples: number[] }).polishSamples.length)).toBeGreaterThan(20);
    const positions = await page.evaluate(() => (window as unknown as { polishSamples: number[] }).polishSamples);
    expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(.5);
    await expect(control).toBeFocused();
  });
}

test('Home primary actions fit a desktop viewport at normal scale', async ({ page }) => {
  // 960px also leaves room for browser chrome on a 1080px display.
  await page.setViewportSize({ width: 1920, height: 960 }); await page.goto('/');
  await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeVisible();
  for (const selector of ['.welcome-panel', '.overview', '.block-card', '.progress-card', '.text-link']) {
    const bounds = (await page.locator(selector).boundingBox())!;
    expect(bounds.y).toBeGreaterThanOrEqual(0); expect(bounds.y + bounds.height).toBeLessThanOrEqual(960);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
