import { test, expect } from "@playwright/test";

test.describe("Language Switching (US3)", () => {
  test("toggles between Arabic RTL and English LTR", async ({ page }) => {
    await page.goto("/ar/menu");

    // Check Arabic layout and html dir
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(html).toHaveAttribute("lang", "ar");

    // Click language switcher to English
    const switcher = page.locator('button:has-text("English")');
    await switcher.click();

    // Verify switched to English LTR
    await expect(page).toHaveURL(/\/en\/menu/);
    await expect(html).toHaveAttribute("dir", "ltr");
    await expect(html).toHaveAttribute("lang", "en");

    // Verify price changes to EGP
    const egpPrice = page.locator("text=/\\d+\\s+EGP/");
    await expect(egpPrice.first()).toBeVisible();
  });
});

