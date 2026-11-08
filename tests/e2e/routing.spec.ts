import { test, expect } from "@playwright/test";

test.describe("Clean Dynamic Routing", () => {
  test("accessing /menu without slug redirects to /", async ({ page }) => {
    await page.goto("/menu");
    await expect(page).toHaveURL("/");
  });

  test("accessing unknown slug shows not-found page", async ({ page }) => {
    const response = await page.goto("/menu/unknown-store-xyz");
    expect(response?.status()).toBe(404);
    await expect(page.locator("text=/المتجر غير موجود|Store Not Found/")).toBeVisible();
  });

  test("home page renders quick links to all 3 pilot stores", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/menu/oriental-grill"]')).toBeVisible();
    await expect(page.locator('a[href="/menu/specialty-cafe"]')).toBeVisible();
    await expect(page.locator('a[href="/menu/fresh-market"]')).toBeVisible();
  });
});
