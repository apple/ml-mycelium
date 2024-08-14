import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Mycelium' })).toBeVisible();
});

test('index page has expected figure', async ({ page }) => {
  await page.goto('.');
  await expect(page.locator('.myc-container')).toHaveCount(1);
});
