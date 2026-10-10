import { expect, test, type Page } from '@playwright/test';
import seed from '../../content/seed-pack.json' with { type: 'json' };
import { answerCurrent, quick } from './helpers';

test.setTimeout(60000);

async function noHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => {
    const last = document.querySelector('main')!.lastElementChild!;
    return document.querySelector('footer')!.getBoundingClientRect().top >= last.getBoundingClientRect().bottom;
  })).toBe(true);
}
async function withinViewport(page: Page, selector: string, height: number) {
  const bounds = (await page.locator(selector).boundingBox())!;
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
}
for (const [width, height] of [[1920, 1080], [1600, 900], [1366, 768]] as const) {
  test(`viewport efficiency and visual evidence at ${width}×${height}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    await page.addInitScript(() => { Math.random = () => .999; });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeVisible();
    await noHorizontalOverflow(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    if (width === 1920) expect(overflow).toBeLessThanOrEqual(1);
    if (width === 1600) expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: info.outputPath(`home-${width}x${height}.png`), fullPage: true });
    await page.goto('/#/blocks');
    await expect(page.getByRole('link', { name: 'Learn', exact: true })).toBeVisible();
    if (width >= 1600) expect(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)).toBeLessThanOrEqual(1);
    await page.goto(`/#/learn/${seed.blocks[0]!.id}/${seed.entries[0]!.id}`);
    await expect(page.locator('.learn-card')).toBeVisible();
    expect((await page.locator('.learn-card').boundingBox())!.y).toBeLessThan(200);
    await noHorizontalOverflow(page);
    if (height < 900) {
      const examples = (await page.locator('.examples').boundingBox())!;
      expect((await page.locator('.learn-card-footer').boundingBox())!.y).toBeGreaterThanOrEqual(examples.y + examples.height);
    }
    await page.screenshot({ path: info.outputPath(`learn-${width}x${height}.png`) });
    await quick(page);
    expect((await page.locator('.practice-card').boundingBox())!.y).toBeLessThan(250);
    for (let index = 0; index < 4; index++) {
      await expect(page.getByText(`Question ${index + 1} of 10`, { exact: true })).toBeVisible();
      if (width >= 1600) {
        await withinViewport(page, '#question-prompt', height);
        await withinViewport(page, '.assistance-actions', height);
        await withinViewport(page, '.submit-area', height);
      }
      await noHorizontalOverflow(page);
      if (!index) {
        await page.screenshot({ path: info.outputPath(`practice-unanswered-${width}x${height}.png`) });
        await page.getByText('End this run', { exact: true }).click();
        const details = (await page.locator('.session-end').boundingBox())!;
        expect(details.y + details.height).toBeLessThanOrEqual((await page.locator('.practice-card').boundingBox())!.y);
        await page.getByText('End this run', { exact: true }).click();
      }
      await answerCurrent(page, index !== 0);
      if (!index) await page.screenshot({ path: info.outputPath(`practice-feedback-${width}x${height}.png`) });
      await page.getByRole('button', { name: 'Next question', exact: true }).click();
    }
    for (let index = 4; index < 10; index++) {
      await expect(page.getByText(`Question ${index + 1} of 10`, { exact: true })).toBeVisible();
      await answerCurrent(page);
      await page.getByRole('button', { name: index === 9 ? 'View summary' : 'Next question', exact: true }).click();
    }
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Session summary');
    await noHorizontalOverflow(page);
    await page.screenshot({ path: info.outputPath(`summary-${width}x${height}.png`), fullPage: true });
    await page.goto('/#/progress');
    await expect(page.locator('.revision-row')).toHaveCount(1);
    await noHorizontalOverflow(page);
    await page.screenshot({ path: info.outputPath(`progress-revision-${width}x${height}.png`), fullPage: true });
    await page.goto('/#/settings');
    await expect(page.getByRole('combobox', { name: 'Palette' })).toBeVisible();
    await noHorizontalOverflow(page);
    await page.screenshot({ path: info.outputPath(`settings-${width}x${height}.png`), fullPage: true });
  });
}

test('resizing across density breakpoints preserves controls and study selection', async ({ page }) => {
  await page.goto(`/#/learn/${seed.blocks[0]!.id}/${seed.entries.at(-1)!.id}`);
  const selected = page.locator('.construction-list [aria-current="page"]');
  await expect(selected).toBeVisible();
  for (const width of [1600, 1400, 1399, 1366, 1201, 1200, 1101, 1100, 901, 900, 768]) {
    await page.setViewportSize({ width, height: 768 });
    await noHorizontalOverflow(page);
    if (width > 1100) await expect.poll(async () => {
      const item = (await selected.boundingBox())!, rail = (await page.locator('.construction-list').boundingBox())!;
      return item.y >= rail.y && item.y + item.height <= rail.y + rail.height;
    }).toBe(true);
    else await expect(page.getByRole('combobox', { name: 'Construction', exact: true })).toHaveValue(seed.entries.at(-1)!.id);
    await page.getByRole('link', { name: 'Previous' }).focus();
    await expect(page.getByRole('link', { name: 'Previous' })).toBeFocused();
  }
  for (const route of ['', 'blocks', 'settings', 'progress']) {
    await page.goto(`/#/${route}`);
    for (const width of [1600, 1201, 1200, 901, 900, 768]) {
      await page.setViewportSize({ width, height: 768 }); await noHorizontalOverflow(page);
    }
  }
  await quick(page);
  for (const width of [1600, 1400, 1399, 1366, 1201, 1200, 901, 900, 768]) {
    await page.setViewportSize({ width, height: 768 });
    await noHorizontalOverflow(page);
    const check = page.getByRole('button', { name: 'Check answer', exact: true });
    await check.scrollIntoViewIfNeeded(); await expect(check).toBeInViewport();
  }
});
