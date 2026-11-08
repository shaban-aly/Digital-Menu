import { test, expect } from "@playwright/test";

test.describe("Cart Bar & Quick Add (US1)", () => {
  test("cart bar is hidden initially, appears on adding an item, and reflects count & price", async ({
    page,
  }) => {
    // Clear localStorage before starting
    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    await page.goto("/ar/menu");

    // 1. Initially, cart bar should not be visible
    const cartBar = page.locator('[data-testid="cart-bar"]');
    await expect(cartBar).toBeHidden();

    // 2. Click quick add button on the first available item
    const addButtons = page.locator('[data-testid^="add-to-cart-"]');
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();

    // 3. Cart bar should now appear
    await expect(cartBar).toBeVisible();

    // 4. Badge count should show 1
    const badgeCount = page.locator('[data-testid="cart-badge-count"]');
    await expect(badgeCount).toHaveText("1");

    // 5. Total price should contain Egyptian Pound currency symbol (ج.م)
    const totalPrice = page.locator('[data-testid="cart-total-price"]');
    await expect(totalPrice).toContainText("ج.م");
  });
});

