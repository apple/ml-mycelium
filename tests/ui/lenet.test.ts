import { expect, test } from '@playwright/test';

test('example `lenet` loaded', async ({ page }) => {
  await page.goto('examples/lenet');
  await expect(page.locator('.myc-container')).toHaveCount(1);
});
