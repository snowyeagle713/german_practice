import { expect, test } from '@playwright/test';

for (const theme of ['lingua-learning', 'finance-dashboard']) {
  test(`${theme} keeps the same accessible study layout and truthful progress`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 960 });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Learn', exact: true })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'lingua-learning');
    // Internal palette preview only: no theme controls, persistence or new product flow.
    await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
    await expect(page.getByRole('heading', { name: 'A place for your progress' })).toBeVisible();
    await expect(page.getByText('Not recorded', { exact: true })).toBeVisible();
    await expect(page.getByRole('progressbar')).toHaveCount(0);
    const sidebar = page.getByRole('complementary', { name: 'Learning sidebar' });
    const main = page.getByRole('main');
    const sidebarBounds = (await sidebar.boundingBox())!;
    const mainBounds = (await main.boundingBox())!;
    expect(sidebarBounds.x + sidebarBounds.width).toBeLessThan(mainBounds.x);
    await expect(page.getByRole('button', { name: 'Start full block' })).toBeDisabled();

    const contrasts = await page.evaluate(() => {
      function luminance(color: string) {
        const channels = color.match(/[\d.]+/gu)!.slice(0, 3).map(value => {
          const channel = Number(value) / 255;
          return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
        });
        return channels[0]! * .2126 + channels[1]! * .7152 + channels[2]! * .0722;
      }
      function ratio(foreground: string, background: string) {
        const a = luminance(foreground), b = luminance(background);
        return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      }
      const sidebarStyle = getComputedStyle(document.querySelector('.learning-sidebar')!);
      const brandStyle = getComputedStyle(document.querySelector('.brand')!);
      const activeStyle = getComputedStyle(document.querySelector('[aria-label="Main navigation"] [aria-current]')!);
      const inactiveStyle = getComputedStyle(document.querySelector('[aria-label="Main navigation"] a:not([aria-current])')!);
      const cardStyle = getComputedStyle(document.querySelector('.block-card')!);
      const descriptionStyle = getComputedStyle(document.querySelector('.block-description')!);
      const buttonStyle = getComputedStyle(document.querySelector('.card-actions .button')!);
      return {
        brand: ratio(brandStyle.color, sidebarStyle.backgroundColor),
        activeNavigation: ratio(activeStyle.color, activeStyle.backgroundColor),
        inactiveNavigation: ratio(inactiveStyle.color, sidebarStyle.backgroundColor),
        cardText: ratio(cardStyle.color, cardStyle.backgroundColor),
        secondaryText: ratio(descriptionStyle.color, cardStyle.backgroundColor),
        primaryButton: ratio(buttonStyle.color, buttonStyle.backgroundColor),
      };
    });
    for (const [name, value] of Object.entries(contrasts)) {
      expect(value, `${theme} ${name} text contrast`).toBeGreaterThanOrEqual(4.5);
    }
    await page.getByRole('link', { name: 'Learn', exact: true }).click();
    await expect(page.getByRole('progressbar', { name: 'Position in study material' })).toHaveAttribute('value', '1');
    await page.getByRole('link', { name: 'Next' }).click();
    await expect(page.getByRole('progressbar', { name: 'Position in study material' })).toHaveAttribute('value', '2');
    await expect(page.getByText('Study position · not a completion score')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start practice' })).toBeDisabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByRole('combobox')).toHaveCount(0);
  });
}
