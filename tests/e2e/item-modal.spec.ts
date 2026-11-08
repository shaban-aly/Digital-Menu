import { test, expect } from "@playwright/test";

test.describe("Item Detail Modal & URL Hash (US4)", () => {
  test("opens detail modal on card click and syncs with URL hash", async ({ page }) => {
    await page.goto("/menu/oriental-grill");

    // Click on the first menu item card
    const firstCard = page.locator('div[role="button"]').first();
    await firstCard.click();

    // Verify modal is open and has role="dialog"
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify URL hash contains #item-
    expect(page.url()).toContain("#item-");

    // Close modal via close button
    const closeBtn = page.locator('button[aria-label="Close"]');
    await closeBtn.click();
    await expect(modal).toBeHidden();
  });
});

