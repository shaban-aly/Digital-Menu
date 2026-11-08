import { test, expect } from "@playwright/test";

test.describe("Cart Drawer & WhatsApp Flow (US2 & US3 & US4)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test("opens drawer, edits quantity, attaches note, and triggers WhatsApp for dine-in", async ({
    page,
  }) => {
    await page.goto("/menu/oriental-grill");

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

    // 6. Enter customer name (optional for dine-in)
    const nameInput = page.locator('[data-testid="customer-name-input"]');
    await nameInput.fill("أحمد مجدي");

    // 7. Intercept window.open call when submitting
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

    const whatsappBtn = page.locator('[data-testid="whatsapp-submit-btn"]');
    await whatsappBtn.click();
    expect(openedUrl).toContain("https://wa.me/");
    expect(openedUrl).toContain(encodeURIComponent("أحمد مجدي"));
  });

  test("supermarket model hides dine-in and validates delivery fields with fee", async ({ page }) => {
    await page.goto("/menu/fresh-market");

    // Add produce item to cart
    const addButtons = page.locator('[data-testid^="add-to-cart-"]');
    await addButtons.first().click();
    await page.locator('[data-testid="cart-bar"] button').click();

    // Verify dine-in is NOT present
    await expect(page.locator('[data-testid="order-type-dine_in"]')).toBeHidden();
    await expect(page.locator('[data-testid="order-type-delivery"]')).toBeVisible();

    // Select delivery
    await page.locator('[data-testid="order-type-delivery"]').click();

    // Click submit without filling fields -> verify validation errors
    const whatsappBtn = page.locator('[data-testid="whatsapp-submit-btn"]');
    await whatsappBtn.click();
    await expect(page.locator('[data-testid="customer-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="customer-phone-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="delivery-address-error"]')).toBeVisible();

    // Fill delivery fields
    await page.locator('[data-testid="customer-name-input"]').fill("سارة محمود");
    await page.locator('[data-testid="customer-phone-input"]').fill("01012345678");
    await page.locator('[data-testid="delivery-address-input"]').fill("الدقي، شارع مصدق، عمارة 5");

    await expect(page.locator('[data-testid="delivery-address-error"]')).toBeHidden();
  });
});
