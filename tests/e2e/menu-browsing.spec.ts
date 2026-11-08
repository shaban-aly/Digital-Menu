import { test, expect } from "@playwright/test";

test.describe("Menu Browsing (US1)", () => {
  test("loads menu and displays categories with items in EGP", async ({ page }) => {
    await page.goto("/ar/menu");

    // Header title check
    await expect(page.locator("h1")).toBeVisible();

    // Verify category sections exist
    const categoryHeadings = page.locator("section h3");
    await expect(categoryHeadings.first()).toBeVisible();

    // Verify items display with Egyptian Pound currency
    const priceElements = page.locator("text=/\\d+\\s+ج\\.م/");
    await expect(priceElements.first()).toBeVisible();
  });
});

