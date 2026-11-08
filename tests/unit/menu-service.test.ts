import { describe, it, expect } from "vitest";
import { getMenuData } from "@/features/menu/services/menu-service";

describe("menu-service", () => {
  it("should return valid MenuData conforming to MenuDataSchema", async () => {
    const data = await getMenuData();
    expect(data).toBeDefined();
    expect(data.restaurant).toBeDefined();
    expect(data.restaurant.currency).toBe("EGP");
    expect(data.categories.length).toBeGreaterThan(0);

    const firstCategory = data.categories[0];
    expect(firstCategory.items.length).toBeGreaterThan(0);
    expect(firstCategory.items[0].price).toBeGreaterThan(0);
  });
});

