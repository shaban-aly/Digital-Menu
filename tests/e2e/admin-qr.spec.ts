import { test, expect } from "@playwright/test";

test.describe("Merchant Admin - Storefront QR & Printable Tent Card (US4)", () => {
  test("generates high-res QR code and renders printable tent card", async ({ page }) => {
    await page.goto("/admin/oriental-grill");
    await page.locator('[data-testid="admin-tab-qr"]').click();

    // Verify QR card preview is visible
    await expect(page.locator('[data-testid="printable-tent-card"]')).toBeVisible();

    // Fill Wi-Fi info
    await page.locator('[data-testid="qr-wifi-ssid-input"]').fill("Baraka-Guest");
    await page.locator('[data-testid="qr-wifi-pass-input"]').fill("Grill@2026");

    await expect(page.locator("text=Baraka-Guest")).toBeVisible();
    await expect(page.locator("text=Grill@2026")).toBeVisible();
  });
});

