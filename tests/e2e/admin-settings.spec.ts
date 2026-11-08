import { test, expect } from "@playwright/test";

test.describe("Merchant Admin - Store Settings (US3)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/oriental-grill");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("updates WhatsApp phone number and delivery fee", async ({ page }) => {
    await page.locator('[data-testid="admin-tab-settings"]').click();

    // Fill phone and delivery fee
    const phoneInput = page.locator('[data-testid="settings-phone-input"]');
    await phoneInput.fill("+201099998888");

    const feeInput = page.locator('[data-testid="settings-delivery-fee-input"]');
    await feeInput.fill("45");

    await page.locator('[data-testid="save-settings-btn"]').click();
    await expect(page.locator('[data-testid="admin-notification-toast"]')).toBeVisible();

    // Reload page to verify persistence
    await page.reload();
    await page.locator('[data-testid="admin-tab-settings"]').click();
    await expect(page.locator('[data-testid="settings-phone-input"]')).toHaveValue("+201099998888");
    await expect(page.locator('[data-testid="settings-delivery-fee-input"]')).toHaveValue("45");
  });
});

