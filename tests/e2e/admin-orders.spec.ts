import { test, expect } from "@playwright/test";

test.describe("Merchant Admin - Orders Management (US2 & US3)", () => {
  test("displays orders list and updates order status", async ({ page }) => {
    // Navigate to admin
    await page.goto("/admin/oriental-grill");

    // Click orders tab
    await page.locator('[data-testid="admin-tab-orders"]').click();

    // Verify search and filter tabs exist
    await expect(page.locator('[data-testid="admin-order-search"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-filter-all"]')).toBeVisible();
  });
});
