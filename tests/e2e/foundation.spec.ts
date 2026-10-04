import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import seed from '../../content/seed-pack.json' with { type: 'json' };

test('built content is byte-for-byte the preserved authored seed', async ({ request }) => {
  const response = await request.get('/content/seed-pack.json');
  expect(response.ok()).toBe(true);
  expect(await response.body()).toEqual(await readFile(new URL('../../content/seed-pack.json', import.meta.url)));
});

test('Home, Blocks and every Learn construction work with browser history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A little German, every day.');
  await expect(page.getByText('10 constructions', { exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Blocks' }).click();
  await expect(page.getByRole('heading', { name: 'Your blocks' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start full block' })).toBeDisabled();
  await page.getByRole('link', { name: 'Learn', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
  for (const [index, entry] of seed.entries.entries()) {
    const card = page.getByRole('article');
    await expect(card.getByRole('heading', { name: entry.construction, exact: true })).toBeVisible();
    await expect(card.getByText(entry.meaningEn, { exact: true })).toBeVisible();
    await expect(card.getByText(entry.preposition, { exact: true })).toBeVisible();
    await expect(card.getByText(entry.governedCase, { exact: true }).first()).toBeVisible();
    for (const example of entry.examples) {
      await expect(card.getByText(example.de, { exact: true })).toBeVisible();
      await expect(card.getByText(example.en, { exact: true })).toBeVisible();
    }
    if (index < seed.entries.length - 1) await page.getByRole('link', { name: 'Next' }).click();
  }
  await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Start practice' })).toBeDisabled();
  await page.reload();
  await expect(page.getByRole('article').getByRole('heading', { name: seed.entries[9]!.construction })).toBeVisible();
  await page.getByRole('link', { name: 'Previous' }).click();
  await expect(page.getByRole('article').getByRole('heading', { name: seed.entries[8]!.construction })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('article').getByRole('heading', { name: seed.entries[9]!.construction })).toBeVisible();
  await page.getByRole('navigation', { name: 'Constructions in this block' }).getByRole('link').first().click();
  await expect(page.getByRole('article').getByRole('heading', { name: seed.entries[0]!.construction })).toBeVisible();
});

for (const width of [768, 1280, 1920]) {
  test(`desktop navigation and Learn fit ${width}px and support keyboard controls`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/blocks');
    const learn = page.getByRole('link', { name: 'Learn', exact: true });
    await expect(learn).toBeVisible();
    const sidebarBounds = await page.getByRole('complementary', { name: 'Learning sidebar' }).boundingBox();
    const mainBounds = await page.getByRole('main').boundingBox();
    expect(sidebarBounds!.x + sidebarBounds!.width).toBeLessThan(mainBounds!.x);
    await learn.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('article')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'All blocks' })).toBeFocused();
    const next = page.getByRole('link', { name: 'Next' });
    await next.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('article').getByRole('heading', { name: seed.entries[1]!.construction })).toBeVisible();
    for (const entry of seed.entries) {
      await page.getByRole('navigation', { name: 'Constructions in this block' }).getByRole('link', { name: entry.construction, exact: true }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    for (const name of ['Home', 'Blocks', 'Progress', 'Settings']) {
      await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name, exact: true }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });
}

test('invalid content is blocked, explained, and recoverable by retry', async ({ page }) => {
  let valid = false;
  await page.route('**/content/seed-pack.json', route => route.fulfill({ json: valid ? seed : { ...seed, schemaVersion: 2 } }));
  await page.goto('/#/blocks');
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Learn', exact: true })).toHaveCount(0);
  await page.getByText('Error details').click();
  await expect(page.getByText(/Content schema invalid/u)).toBeVisible();
  valid = true;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('link', { name: 'Learn', exact: true })).toBeVisible();
});

test('missing content and invalid links have honest error states', async ({ page }) => {
  await page.route('**/content/seed-pack.json', route => route.fulfill({ status: 404 }));
  await page.goto('/');
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByText('Error details').click();
  await expect(page.getByText(/HTTP 404/u)).toBeVisible();
  await page.unroute('**/content/seed-pack.json');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('link', { name: 'Learn', exact: true })).toBeVisible();
  await page.goto('/#/learn/missing-block');
  await expect(page.getByRole('heading', { name: 'Study page not found' })).toBeVisible();
  await page.goto('/#/%invalid');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('authored text is rendered as text without executing markup', async ({ page }) => {
  const pack = structuredClone(seed);
  const text = '<img src=x onerror="document.body.dataset.injected=1">';
  pack.entries[0]!.meaningEn = text;
  await page.route('**/content/seed-pack.json', route => route.fulfill({ json: pack }));
  await page.goto(`/#/learn/${seed.blocks[0]!.id}`);
  await expect(page.getByText(text, { exact: true })).toBeVisible();
  await expect(page.locator('article img')).toHaveCount(0);
  expect(await page.locator('body').getAttribute('data-injected')).toBeNull();
});
