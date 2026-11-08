import { test, expect } from "@playwright/test";

test.describe("Cart Persistence & Language Switching (US5)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test("persists items across page reloads and switches language smoothly", async ({
    page,
  }) => {
    await page.goto("/menu/oriental-grill");

    // 1. Add item to cart
    const addButtons = page.locator('[data-testid^="add-to-cart-"]');
    await addButtons.first().click();

    // Verify cart bar is visible with 1 item
    const badgeCount = page.locator('[data-testid="cart-badge-count"]');
    await expect(badgeCount).toHaveText("1");

    // 2. Reload the page
    await page.reload();

    // Verify cart is restored from localStorage
    await expect(page.locator('[data-testid="cart-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-badge-count"]')).toHaveText("1");

    // 3. Switch language to English
    const langToggle = page.locator('button[aria-label*="English"], button[aria-label*="العربية"]');
    await langToggle.click();

    // Verify URL does not change upon language toggle
    await expect(page).toHaveURL("/menu/oriental-grill");

    // Verify cart bar still shows 1 item, but currency changed to EGP
    await expect(page.locator('[data-testid="cart-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-badge-count"]')).toHaveText("1");
    await expect(page.locator('[data-testid="cart-total-price"]')).toContainText("EGP");

    // 4. Open drawer and clear cart
    await page.locator('[data-testid="cart-bar"] button').click();
    const drawer = page.locator('[data-testid="cart-drawer"]');
    await expect(drawer).toBeVisible();

    // Mock confirm dialog
    page.on("dialog", (dialog) => dialog.accept());
    const clearBtn = page.locator('[data-testid="cart-clear-btn"]');
    await clearBtn.click();

    // Cart is now empty in drawer
    await expect(page.locator("text=/Your cart is empty|سلتك فارغة/")).toBeVisible();

    // Close drawer
    await page.locator('[data-testid="cart-drawer-close"]').click();
    await expect(page.locator('[data-testid="cart-bar"]')).toBeHidden();
  });
});

