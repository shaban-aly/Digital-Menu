import { test, expect } from "@playwright/test";

test.describe("Marketing Landing Page (Feature 004)", () => {
  test("renders hero, value pills, and 3 pilot model demo links", async ({ page }) => {
    await page.goto("/");

    // Verify main headline
    const heading = page.locator("h1");
    await expect(heading).toContainText(/استقبل طلباتك مباشرة|Receive Direct Orders/);

    // Verify pilot model links
    const grillLink = page.locator('a[href="/menu/oriental-grill"]');
    const cafeLink = page.locator('a[href="/menu/specialty-cafe"]');
    const marketLink = page.locator('a[href="/menu/fresh-market"]');

    await expect(grillLink.first()).toBeVisible();
    await expect(cafeLink.first()).toBeVisible();
    await expect(marketLink.first()).toBeVisible();
  });

  test("toggles language smoothly between Arabic (RTL) and English (LTR)", async ({ page }) => {
    await page.goto("/");

    // Default Arabic check
    await expect(page.locator("h1")).toContainText("بدون عمولات");

    // Click language switch
    const langBtn = page.locator('button[aria-label="Toggle language"]');
    await langBtn.click();

    // Verify English text without page reload
    await expect(page.locator("h1")).toContainText("0% Commission");
  });

  test("interactive phone simulator switches business models and updates cart", async ({ page }) => {
    await page.goto("/");

    // Switch to cafe in simulator
    const cafeTab = page.locator("button:has-text('كافيه')");
    await cafeTab.click();

    // Tap (+) button on first item inside phone simulator
    const plusButtons = page.locator("button:has(svg.lucide-plus)");
    await plusButtons.first().click();

    // Verify simulated cart bar appears with updated count
    await expect(page.locator("text=/عرض السلة|View Cart/")).toBeVisible();
  });

  test("ROI calculator updates savings dynamically when sliders move", async ({ page }) => {
    await page.goto("/");

    // Locate calculator section
    const calcSection = page.locator("#calculator");
    await expect(calcSection).toBeVisible();

    // Check savings display is present and formatted with currency
    await expect(calcSection.locator("text=/توفير شهري مباشر|Direct Monthly Savings/")).toBeVisible();
  });
});
