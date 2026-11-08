import { describe, it, expect, beforeEach, vi } from "vitest";
import { StoreRepository, STORE_UPDATED_EVENT } from "@/features/admin/services/store-repository";

describe("StoreRepository", () => {
  const storeMap: Record<string, string> = {};

  beforeEach(() => {
    for (const key in storeMap) delete storeMap[key];
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storeMap[key] || null,
      setItem: (key: string, value: string) => {
        storeMap[key] = value;
      },
      removeItem: (key: string) => {
        delete storeMap[key];
      },
    });
    vi.stubGlobal("window", {
      localStorage: globalThis.localStorage,
      dispatchEvent: vi.fn(),
    });
  });

  it("should retrieve base mock store when no overrides exist", async () => {
    const store = await StoreRepository.getStore("oriental-grill");
    expect(store).not.toBeNull();
    expect(store?.restaurant.slug).toBe("oriental-grill");
    expect(store?.categories.length).toBeGreaterThan(0);
  });

  it("should toggle item availability and persist it in localStorage", async () => {
    const storeBefore = await StoreRepository.getStore("oriental-grill");
    const testItem = storeBefore!.categories[0].items[0];
    expect(testItem.is_available).toBe(true);

    await StoreRepository.toggleItemAvailability("oriental-grill", testItem.id, false);

    const storeAfter = await StoreRepository.getStore("oriental-grill");
    const updatedItem = storeAfter!.categories[0].items.find((i) => i.id === testItem.id);
    expect(updatedItem?.is_available).toBe(false);
  });

  it("should add a new menu item to a category", async () => {
    const storeBefore = await StoreRepository.getStore("oriental-grill");
    const targetCat = storeBefore!.categories[0];
    const initialCount = targetCat.items.length;

    const newItem = await StoreRepository.saveMenuItem("oriental-grill", {
      name_ar: "طبق تجريبي جديد",
      name_en: "New Test Item",
      price: 150,
      category_id: targetCat.id,
    });

    expect(newItem.id).toBeDefined();

    const storeAfter = await StoreRepository.getStore("oriental-grill");
    const updatedCat = storeAfter!.categories.find((c) => c.id === targetCat.id);
    expect(updatedCat?.items.length).toBe(initialCount + 1);
    expect(updatedCat?.items.some((i) => i.name_ar === "طبق تجريبي جديد")).toBe(true);
  });

  it("should delete a menu item", async () => {
    const storeBefore = await StoreRepository.getStore("oriental-grill");
    const itemToDelete = storeBefore!.categories[0].items[0];

    await StoreRepository.deleteMenuItem("oriental-grill", itemToDelete.id);

    const storeAfter = await StoreRepository.getStore("oriental-grill");
    const found = storeAfter!.categories.flatMap((c) => c.items).find((i) => i.id === itemToDelete.id);
    expect(found).toBeUndefined();
  });

  it("should update store settings (phone and delivery fee)", async () => {
    await StoreRepository.updateSettings("oriental-grill", {
      phone_number: "201999999999",
      delivery_fee: 45,
    });

    const store = await StoreRepository.getStore("oriental-grill");
    expect(store?.restaurant.phone_number).toBe("201999999999");
    expect(store?.restaurant.delivery_fee).toBe(45);
  });
});

