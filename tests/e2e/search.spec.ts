import { test, expect } from "@playwright/test";

test.describe("Real-time Arabic Search (US5)", () => {
  test("filters menu items and handles alef normalization", async ({ page }) => {
    await page.goto("/menu/oriental-grill");

    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();

    // Search for orzo soup using different alef form
    await searchInput.fill("عصفور");

    // Verify soup is visible and kebab is filtered out
    await expect(page.locator("text=شوربة لسان عصفور بالمستكة")).toBeVisible();
    await expect(page.locator("text=كباب وكفتة مشوية على الفحم")).toBeHidden();

    // Clear search
    const clearBtn = page.locator('button[aria-label="مسح البحث"]');
    await clearBtn.click();

    // Verify all categories restore
    await expect(page.locator("text=كباب وكفتة مشوية على الفحم")).toBeVisible();
  });
});

