import { describe, it, expect } from "vitest";
import {
  getMenuData,
  getStoreBySlug,
  getAllStores,
} from "@/features/menu/services/menu-service";

describe("menu-service", () => {
  it("should return valid MenuData for default store conforming to MenuDataSchema", async () => {
    const data = await getMenuData();
    expect(data).toBeDefined();
    expect(data.restaurant.currency).toBe("EGP");
    expect(data.categories.length).toBeGreaterThan(0);
  });

  it("should return all 3 pilot stores with correct business types", async () => {
    const stores = await getAllStores();
    expect(stores.length).toBe(3);

    const slugs = stores.map((s) => s.slug);
    expect(slugs).toContain("oriental-grill");
    expect(slugs).toContain("specialty-cafe");
    expect(slugs).toContain("fresh-market");
  });

  it("should return supermarket store without dine_in and with unit items", async () => {
    const market = await getStoreBySlug("fresh-market");
    expect(market.restaurant.business_type).toBe("supermarket");
    expect(market.restaurant.supported_order_types).not.toContain("dine_in");
    expect(market.restaurant.supported_order_types).toContain("delivery");
    expect(market.restaurant.supported_order_types).toContain("takeaway");

    // Check sales units on produce items
    const tomatoes = market.categories[0].items[0];
    expect(tomatoes.unit_ar).toBe("1 كجم");
  });
});
