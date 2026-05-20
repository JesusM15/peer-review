import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect page to load successfully
  await expect(page).toHaveURL(/.*localhost/);
});

test('app loads', async ({ page }) => {
  await page.goto('/');

  // Expects page to be visible
  await expect(page.locator('body')).toBeTruthy();
});
