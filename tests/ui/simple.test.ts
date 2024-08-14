import { expect, test } from '@playwright/test';

test('example `simple` loaded', async ({ page }) => {
  await page.goto('examples/simple');
  await expect(page.locator('.myc-container')).toHaveCount(1);
});
