import { expect, test } from '@playwright/test';
import seed from '../../content/seed-pack.json' with { type: 'json' };
import { answerCurrent, quick } from './helpers';

for (const width of [1280, 1920]) {
  test(`Learn workspace keeps construction and navigation visible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    await page.goto(`/#/learn/${seed.blocks[0]!.id}/${seed.entries[0]!.id}`);
    const card = page.locator('.learn-card'); await expect(card).toBeVisible();
    expect((await card.boundingBox())!.y).toBeLessThan(200);
    const next = page.getByRole('link', { name: 'Next' });
    const bounds = (await next.boundingBox())!; expect(bounds.y + bounds.height).toBeLessThan(960);
    const titleSize = await page.locator('#construction-title').evaluate(element => getComputedStyle(element).fontSize);
    expect(parseFloat(titleSize)).toBeGreaterThanOrEqual(25.6);
    await page.goto(`/#/learn/${seed.blocks[0]!.id}/${seed.entries.at(-1)!.id}`);
    const selected = page.locator('.construction-list [aria-current="page"]');
    await expect(selected).toHaveText(/diskutieren über/u);
    await expect.poll(async () => {
      const item = (await selected.boundingBox())!, list = (await page.locator('.construction-list').boundingBox())!;
      return item.y >= list.y && item.y + item.height <= Math.min(list.y + list.height, 960);
    }).toBe(true);
    await page.getByRole('link', { name: 'Previous' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#construction-title')).toHaveText(seed.entries.at(-2)!.construction);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('wide Practice keeps answer, feedback and next action in the workspace', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 960 });
  await page.addInitScript(() => { Math.random = () => .999; }); await quick(page);
  expect((await page.locator('.practice-card').boundingBox())!.y).toBeLessThan(300);
  const input = page.getByRole('textbox', { name: 'Your preposition' });
  const size = await input.evaluate(element => getComputedStyle(element).fontSize);
  expect(parseFloat(size)).toBe(16);
  await answerCurrent(page);
  const answer = (await page.locator('.answer-field').boundingBox())!;
  const feedback = (await page.locator('.answer-feedback').boundingBox())!;
  expect(feedback.x).toBeGreaterThan(answer.x + answer.width);
  const next = page.getByRole('button', { name: 'Next question', exact: true });
  expect((await next.boundingBox())!.y + (await next.boundingBox())!.height).toBeLessThan(960);
  await expect(next).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.getByText('Question 2 of 10', { exact: true })).toBeVisible();
});
