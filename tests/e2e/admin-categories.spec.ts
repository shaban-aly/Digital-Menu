import { test, expect } from "@playwright/test";

test.describe("Merchant Admin - Categories Management (US2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/oriental-grill");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("creates a new category and renders it in the list", async ({ page }) => {
    await page.locator('[data-testid="admin-tab-categories"]').click();
    await page.locator('[data-testid="add-category-btn"]').click();

    await page.locator('[data-testid="cat-name-ar-input"]').fill("قسم الحلويات الفاخرة");
    await page.locator('[data-testid="cat-name-en-input"]').fill("Desserts Special");
    await page.locator('[data-testid="save-category-submit-btn"]').click();

    await expect(page.locator("text=قسم الحلويات الفاخرة")).toBeVisible();
  });
});

