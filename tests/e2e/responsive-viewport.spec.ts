import { expect, test, type Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import seed from '../../content/seed-pack.json' with { type: 'json' };
import { answerCurrent, quick } from './helpers';

test.setTimeout(60000);
async function metrics(page: Page, name: string) {
  await page.evaluate(() => window.scrollTo(0, 0));
  return page.evaluate(name => {
    const d = document.documentElement;
    return { name, innerWidth, innerHeight, clientWidth: d.clientWidth, clientHeight: d.clientHeight,
      scrollWidth: d.scrollWidth, scrollHeight: d.scrollHeight,
      horizontal: d.scrollWidth > d.clientWidth, vertical: d.scrollHeight > d.clientHeight,
      cardTop: document.querySelector('.practice-card, .learn-card')?.getBoundingClientRect().top ?? null };
  }, name);
}
for (const [width, height] of [[1700, 950], [1700, 1050], [1920, 1080], [1366, 768], [1024, 768], [768, 1024], [390, 844], [2560, 1440]] as const) {
  test(`responsive layout evidence ${width}×${height}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height });
    await page.addInitScript(() => { Math.random = () => .999; });
    const records: Awaited<ReturnType<typeof metrics>>[] = [];
    const capture = async (name: string) => {
      const record = await metrics(page, name); records.push(record);
      expect(record.horizontal, `${name} horizontal overflow`).toBe(false);
      await page.screenshot({ path: info.outputPath(`${name}-${width}x${height}.png`), fullPage: true });
    };
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeVisible();
    await capture('home');
    if (width >= 1700) expect(records.at(-1)!.scrollHeight).toBeLessThanOrEqual(height + 1);
    for (const label of ['Home', 'Blocks', 'Progress', 'Settings']) {
      const link = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: label });
      await expect(link).toBeInViewport();
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
    await page.goto(`/#/learn/${seed.blocks[0]!.id}/${seed.entries[0]!.id}`);
    await expect(page.locator('.learn-card')).toBeVisible();
    if (width <= 1100) {
      const picker = page.getByRole('combobox', { name: 'Construction', exact: true });
      await picker.selectOption(seed.entries.at(-1)!.id);
      await expect(page.locator('#construction-title')).toHaveText(seed.entries.at(-1)!.construction);
      await picker.selectOption(seed.entries[0]!.id);
      await expect(page.locator('#construction-title')).toHaveText(seed.entries[0]!.construction);
      await expect(page.locator('.construction-list')).toBeHidden();
    }
    await capture('learn');
    if (width > 1100) expect(records.at(-1)!.cardTop).toBeLessThan(200);
    if (width >= 1700) expect(records.at(-1)!.scrollHeight).toBeLessThanOrEqual(height + 1);
    await quick(page);
    await capture('practice-unanswered');
    const gap = await page.evaluate(() => document.querySelector('.practice-card')!.getBoundingClientRect().top - document.querySelector('.practice-controls')!.getBoundingClientRect().bottom);
    expect(gap).toBeLessThanOrEqual(12);
    for (let index = 0; index < 4; index++) {
      await expect(page.getByText(`Question ${index + 1} of 10`, { exact: true })).toBeVisible();
      if (width >= 1700) {
        await page.evaluate(() => scrollTo(0, 0));
        await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeInViewport();
        const bounds = (await page.locator('.submit-area').boundingBox())!;
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
      }
      await answerCurrent(page, index > 0);
      if (!index) await capture('practice-feedback');
      const next = page.getByRole('button', { name: 'Next question', exact: true });
      await expect(next).toBeFocused(); await next.click();
    }
    for (let index = 4; index < 10; index++) {
      await expect(page.getByText(`Question ${index + 1} of 10`, { exact: true })).toBeVisible();
      await answerCurrent(page);
      await page.getByRole('button', { name: index === 9 ? 'View summary' : 'Next question', exact: true }).click();
    }
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Session summary');
    await capture('summary');
    await page.goto('/#/progress');
    await expect(page.locator('.revision-row')).toHaveCount(1);
    await capture('progress');
    await page.goto('/#/settings');
    await expect(page.getByRole('combobox', { name: 'Palette' })).toBeVisible();
    await capture('settings');
    for (const option of await page.locator('#theme option').evaluateAll(items => items.map(item => (item as HTMLOptionElement).value))) {
      await page.locator('#theme').selectOption(option);
      await expect(page.locator('html')).toHaveAttribute('data-theme', option);
      expect((await metrics(page, `settings-${option}`)).horizontal).toBe(false);
    }
    await writeFile(info.outputPath(`metrics-${width}x${height}.json`), JSON.stringify(records, null, 2));
    await info.attach('viewport-metrics', { body: JSON.stringify(records, null, 2), contentType: 'application/json' });
  });
}
