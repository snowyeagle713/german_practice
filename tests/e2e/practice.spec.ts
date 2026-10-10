import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import seed from '../../content/seed-pack.json' with { type: 'json' };

async function start(page: Page) {
  await page.goto('/#/blocks');
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Practice', exact: true })).toBeVisible();
}
async function current(page: Page) {
  const prompt = await page.locator('#question-prompt').textContent();
  const question = seed.questions.find(item => item.prompt === prompt);
  if (!question) throw new Error(`Unknown question: ${prompt}`);
  return question;
}
async function answer(page: Page, correct = true) {
  const question = await current(page);
  if (question.type === 'preposition_cloze') await page.getByRole('textbox', { name: 'Your preposition' }).fill(correct ? `  ${question.acceptedAnswers![0]!.toUpperCase()}  ` : 'wrong');
  else {
    const choice = question.choices!.find(item => correct ? item.id === question.correctChoiceId : item.id !== question.correctChoiceId)!;
    await page.getByRole('radio', { name: choice.text, exact: true }).check();
  }
  return question;
}

test('20 selected authored questions complete once with deterministic grading, assistance and summary', async ({ page }) => {
  test.setTimeout(120_000);
  await start(page);
  await expect(page.getByText(/Your run saves automatically/u)).toBeVisible();
  const seen = new Set<string>();
  for (let index = 0; index < 20; index++) {
    await expect(page.getByText(`Question ${index + 1} of 20`, { exact: true })).toBeVisible();
    await expect(page.getByRole('progressbar', { name: 'Questions answered' })).toHaveAttribute('value', String(index));
    const question = await current(page);
    expect(seen.has(question.id)).toBe(false);
    seen.add(question.id);
    await expect(page.locator('.answer-feedback')).toHaveCount(0);
    await expect(page.getByText(question.explanation, { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Next question' })).toHaveCount(0);
    if (index % 4 === 2) await page.getByRole('button', { name: 'Hint', exact: true }).click();
    if (index % 4 === 3) await page.getByRole('button', { name: 'Reveal answer', exact: true }).click();
    await answer(page, index % 4 !== 1);
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.locator('#feedback-title')).toHaveText(index % 4 === 0 ? 'Correct' : index % 4 === 1 ? 'Wrong' : 'Assisted · correct answer');
    await expect(page.locator('#question-prompt')).toHaveText(question.prompt);
    await expect(page.getByText(question.explanation, { exact: true })).toBeVisible();
    if (question.type === 'preposition_cloze') await expect(page.getByRole('textbox', { name: 'Your preposition' })).toHaveValue(index % 4 !== 1 ? `  ${question.acceptedAnswers![0]!.toUpperCase()}  ` : 'wrong');
    else await expect(page.locator('input[type="radio"]:checked')).toHaveAttribute('value', index % 4 !== 1 ? question.correctChoiceId! : question.choices!.find(item => item.id !== question.correctChoiceId)!.id);
    await expect(page.getByRole('progressbar', { name: 'Questions answered' })).toHaveAttribute('value', String(index + 1));
    await page.getByRole('button', { name: index === 19 ? 'View summary' : 'Next question' }).click();
  }
  expect(seen).toEqual(new Set(seed.blocks[0]!.questionIds.slice(0, 20)));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Session summary');
  await expect(page.getByRole('heading', { name: '20 of 20 questions answered' })).toBeVisible();
  await expect(page.locator('.summary-score strong')).toHaveText('25%');
  await expect(page.locator('.summary-counts .stat-card strong')).toHaveText(['15', '5', '10']);
  await expect(page.getByRole('heading', { name: 'Questions to revisit (15)' })).toBeVisible();
  await expect(page.locator('.review-list li')).toHaveCount(15);
  await expect(page.getByText(/First-pass score: 5 unaided correct \/ 20/u)).toBeVisible();
  await page.getByRole('button', { name: 'Repeat practice' }).click();
  await expect(page.getByText('Question 1 of 20', { exact: true })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Questions answered' })).toHaveAttribute('value', '0');
});

test('empty submissions, keyboard feedback and double-clicks do not skip or regrade', async ({ page }) => {
  await start(page);
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByRole('alert')).toContainText(/before checking/u);
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
  await answer(page);
  await page.getByRole('button', { name: 'Check answer' }).focus();
  await page.keyboard.down('Enter');
  await expect(page.getByText('Question 1 of 20', { exact: true })).toBeVisible();
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
  await expect(page.getByRole('button', { name: 'Next question' })).toBeFocused();
  await page.keyboard.down('Enter');
  await expect(page.getByText('Question 1 of 20', { exact: true })).toBeVisible();
  await page.keyboard.up('Enter');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Question 2 of 20', { exact: true })).toBeVisible();
  await answer(page, false);
  await page.getByRole('button', { name: 'Check answer' }).dblclick();
  await expect(page.getByText('Question 2 of 20', { exact: true })).toBeVisible();
  await expect(page.locator('#feedback-title')).toHaveText('Wrong');
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '2');
  await page.getByRole('button', { name: 'Next question' }).dblclick();
  await expect(page.getByText('Question 3 of 20', { exact: true })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '2');
});

test('typed and native radio answers can be completed using keyboard controls', async ({ page }) => {
  // Identity Fisher-Yates order exposes the first two clozes then the authored case choice.
  await page.addInitScript(() => { Math.random = () => .999; });
  await start(page);
  for (let index = 0; index < 2; index++) {
    const input = page.getByRole('textbox', { name: 'Your preposition' });
    await expect(input).toBeFocused();
    await input.fill('auf');
    await page.keyboard.press('Enter');
    await expect(page.locator('#feedback-title')).toHaveText('Correct');
    await page.keyboard.press('Enter');
  }
  await expect(page.getByText('Question 3 of 20', { exact: true })).toBeVisible();
  await expect(page.locator('#question-prompt')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('radio').first()).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('radio').first()).toBeChecked();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await page.getByRole('button', { name: 'Check answer' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#feedback-title')).toHaveText('Wrong');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Question 4 of 20', { exact: true })).toBeVisible();
});

test('active run requires explicit replacement, retains feedback during navigation, and resumes exactly on reload', async ({ page }) => {
  await start(page);
  const question = await answer(page);
  await page.getByRole('button', { name: 'Check answer' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Blocks' }).click();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A run is already in progress' })).toBeVisible();
  await page.getByRole('button', { name: 'Resume current run' }).click();
  await expect(page.locator('#question-prompt')).toHaveText(question.prompt);
  await expect(page.locator('#feedback-title')).toHaveText('Correct');
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Blocks' }).click();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await page.getByRole('button', { name: 'Abandon and start new run' }).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
  await page.reload();
  await expect(page.getByText('Question 1 of 20', { exact: true })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
});

for (const width of [768, 1280, 1920]) {
  test(`practice/feedback fit ${width}px with keyboard reachable inputs and theme roles`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await start(page);
    if (width === 1920) await page.evaluate(() => { document.documentElement.dataset.theme = 'finance-dashboard'; });
    await answer(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Check answer' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Next question' })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page.getByText('Question 2 of 20', { exact: true })).toBeVisible();
  });
}

test('reload preserves graded answer, exact shuffled order, draft and assistance', async ({ page }) => {
  await start(page);
  const first = await answer(page);
  await page.getByRole('button', { name: 'Hint', exact: true }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.locator('#feedback-title')).toContainText('Assisted');
  await page.reload();
  await expect(page.locator('#question-prompt')).toHaveText(first.prompt);
  await expect(page.locator('#feedback-title')).toContainText('Assisted');
  await page.getByRole('button', { name: 'Next question' }).click();
  await expect(page.getByText('Question 2 of 20', { exact: true })).toBeVisible();
  const second = await answer(page, false);
  await page.getByRole('button', { name: 'Hint', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Hint', exact: true })).toBeDisabled();
  await page.reload();
  await expect(page.locator('#question-prompt')).toHaveText(second.prompt);
  await expect(page.getByRole('button', { name: 'Hint', exact: true })).toBeDisabled();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1');
  await page.getByRole('button', { name: 'Previous question' }).click();
  await expect(page.locator('#question-prompt')).toHaveText(first.prompt);
  await expect(page.locator('#feedback-title')).toContainText('Assisted');
});
