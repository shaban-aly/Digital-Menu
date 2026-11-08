import { test, expect } from "@playwright/test";

test.describe("QR Table Generator & Scan Flow", () => {
  test("should render QR generator page with 10 default table cards for restaurant", async ({
    page,
  }) => {
    await page.goto("/menu/oriental-grill/qr");
    await expect(page.locator("h1")).toContainText(/مولد بطاقات الطاولات|QR/);
    
    // Check table cards are rendered
    const cards = page.locator("img[alt^='QR Code for']");
    await expect(cards).toHaveCount(10);
  });

  test("should automatically default to storefront mode for supermarket", async ({
    page,
  }) => {
    await page.goto("/menu/fresh-market/qr");
    // Table count inputs should be hidden
    await expect(page.locator("input[type='number']")).toHaveCount(0);
    // Should render 1 storefront card
    const cards = page.locator("img[alt^='QR Code for']");
    await expect(cards).toHaveCount(1);
  });

  test("should auto-fill table number in cart when navigated via table query param", async ({
    page,
  }) => {
    await page.goto("/menu/oriental-grill?table=7");
    
    // Add item to cart
    const addBtn = page.locator("button[aria-label^='إضافة']").first();
    await addBtn.click();

    // Open cart
    const cartBar = page.locator("button:has-text('عرض السلة')");
    await cartBar.click();

    // Verify table number 7 is pre-filled in dine-in tab
    const tableInput = page.locator("input[placeholder='أدخل رقم الطاولة']");
    await expect(tableInput).toHaveValue("7");
  });
});
