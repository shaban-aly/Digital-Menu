import { test, expect } from "@playwright/test";

test.describe("Merchant Admin - Items & Stock Toggle (US1)", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage overrides before each test
    await page.goto("/admin/oriental-grill");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("loads the admin dashboard with store title and items list", async ({ page }) => {
    await expect(page.locator("h1")).toContainText(/مشويات البركة|Oriental Grill/);
    await expect(page.locator('[data-testid="admin-tab-items"]')).toBeVisible();
    await expect(page.locator('[data-testid^="admin-item-card-"]').first()).toBeVisible();
  });

  test("toggles stock availability between available and out-of-stock", async ({ page }) => {
    const firstToggle = page.locator('[data-testid^="stock-toggle-"]').first();
    await expect(firstToggle).toContainText(/متوفر للطلب|In Stock/);

    // Click to mark out of stock
    await firstToggle.click();
    await expect(firstToggle).toContainText(/غير متوفر|Out of Stock/);

    // Verify notification toast
    await expect(page.locator('[data-testid="admin-notification-toast"]')).toBeVisible();

    // Reload page to verify persistence in localStorage
    await page.reload();
    await expect(page.locator('[data-testid^="stock-toggle-"]').first()).toContainText(/غير متوفر|Out of Stock/);
  });

  test("adds a new item and displays it in the items list", async ({ page }) => {
    await page.locator('[data-testid="admin-add-item-btn"]').click();

    // Fill form
    await page.locator('[data-testid="item-name-ar-input"]').fill("طبق كباب إضافي");
    await page.locator('[data-testid="item-name-en-input"]').fill("Extra Kebab Dish");
    await page.locator('[data-testid="item-price-input"]').fill("220");

    await page.locator('[data-testid="save-item-submit-btn"]').click();

    // Verify new item appears in list
    await expect(page.locator("text=طبق كباب إضافي")).toBeVisible();
  });

  test("deletes an item using custom ConfirmDialog", async ({ page }) => {
    // Get initial card count
    const initialCount = await page.locator('[data-testid^="admin-item-card-"]').count();

    // Click delete on first item
    await page.locator('[data-testid^="delete-item-"]').first().click();

    // Confirm dialog must appear (native dialogs prohibited)
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.locator('button:has-text("حذف"), button:has-text("Delete")').last().click();

    // Count should decrease by 1
    await expect(page.locator('[data-testid^="admin-item-card-"]')).toHaveCount(initialCount - 1);
  });
});

