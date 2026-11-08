import { test, expect } from "@playwright/test";

test.describe("Order Placement & Confirmation (US1)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/menu/oriental-grill");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("places an order via cart drawer and navigates to tracking page with #ORD reference", async ({ page }) => {
    // Add first item to cart
    await page.locator('[data-testid^="add-to-cart-btn-"]').first().click();

    // Open Cart Drawer
    await page.locator('[data-testid="cart-bar"]').click();
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();

    // Fill customer info
    await page.locator('[data-testid="customer-name-input"]').fill("محمود أحمد");
    await page.locator('[data-testid="customer-phone-input"]').fill("01012345678");

    // Click WhatsApp submit
    await page.locator('[data-testid="whatsapp-submit-btn"]').click();

    // Verify redirected to /order/[orderId]
    await page.waitForURL(/\/order\/ord_/);
    await expect(page.locator("h1")).toContainText(/#ORD-\d+/);
    await expect(page.locator("text=محمود أحمد")).toBeVisible();
  });
});
