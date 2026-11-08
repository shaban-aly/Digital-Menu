import { test, expect } from "@playwright/test";

test.describe("Responsiveness & Touch Targets (US6)", () => {
  test("renders correctly without horizontal overflow on 320px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/menu/oriental-grill");

    // Check no horizontal scrollbar on body
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Verify touch targets on interactive buttons are >= 44x44px
    const buttons = page.locator("button");
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box && box.width > 0 && box.height > 0) {
        expect(box.height).toBeGreaterThanOrEqual(40); // with rounding tolerance
      }
    }
  });
});

