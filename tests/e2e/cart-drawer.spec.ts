import { test, expect } from "@playwright/test";

test.describe("Cart Drawer & WhatsApp Flow (US2 & US3 & US4)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test("opens drawer, edits quantity, attaches note, validates table number, and triggers WhatsApp", async ({
    page,
  }) => {
    await page.goto("/ar/menu");

    // 1. Add item to cart
    const addButtons = page.locator('[data-testid^="add-to-cart-"]');
    await addButtons.first().click();

    // 2. Click floating CartBar to open drawer
    const cartBar = page.locator('[data-testid="cart-bar"] button');
    await cartBar.click();

    // 3. Cart drawer is visible
    const drawer = page.locator('[data-testid="cart-drawer"]');
    await expect(drawer).toBeVisible();

    // 4. Quantity modification
    const increaseBtn = drawer.locator('button[aria-label="Increase quantity"]').first();
    await increaseBtn.click();
    const qtySpan = drawer.locator('[data-testid^="quantity-"]').first();
    await expect(qtySpan).toHaveText("2");

    // 5. Add note to item
    const noteBtn = drawer.locator("text=/إضافة ملاحظة|Add Note/").first();
    await noteBtn.click();
    const noteInput = drawer.locator('input[placeholder*="بدون"]').first();
    await noteInput.fill("بدون بصل");

    // 6. Test Dine-in validation without table number
    const whatsappBtn = page.locator('[data-testid="whatsapp-submit-btn"]');
    await whatsappBtn.click();
    const tableError = page.locator('[data-testid="table-number-error"]');
    await expect(tableError).toBeVisible();

    // 7. Enter table number
    const tableInput = page.locator('[data-testid="table-number-input"]');
    await tableInput.fill("7");
    await expect(tableError).toBeHidden();

    // 8. Intercept window.open call when submitting
    let openedUrl = "";
    await page.exposeFunction("captureWhatsAppUrl", (url: string) => {
      openedUrl = url;
    });
    await page.evaluate(() => {
      window.open = (url) => {
        (window as unknown as { captureWhatsAppUrl: (u: string) => void }).captureWhatsAppUrl(
          String(url)
        );
        return null;
      };
    });

    await whatsappBtn.click();
    expect(openedUrl).toContain("https://wa.me/");
    expect(openedUrl).toContain(encodeURIComponent("طاولة 7"));
  });

  test("auto-selects table number from ?table=N URL parameter", async ({ page }) => {
    await page.goto("/ar/menu?table=12");

    // Add item and open drawer
    const addButtons = page.locator('[data-testid^="add-to-cart-"]');
    await addButtons.first().click();
    await page.locator('[data-testid="cart-bar"] button').click();

    // Verify table input is pre-filled with "12"
    const tableInput = page.locator('[data-testid="table-number-input"]');
    await expect(tableInput).toHaveValue("12");
  });
});
