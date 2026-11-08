import { describe, it, expect, beforeEach, vi } from "vitest";
import { OrderRepository } from "@/features/orders/services/order-repository";

describe("OrderRepository", () => {
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
      get length() {
        return Object.keys(storeMap).length;
      },
      key: (idx: number) => Object.keys(storeMap)[idx] || null,
    });
    vi.stubGlobal("window", {
      localStorage: globalThis.localStorage,
      dispatchEvent: vi.fn(),
    });
  });

  it("should create an order with unique sequential reference", async () => {
    const order1 = await OrderRepository.createOrder({
      storeSlug: "oriental-grill",
      storeName_ar: "مشويات البركة",
      storeName_en: "Baraka Grill",
      storePhone: "201012345678",
      customerName: "عميل تجريبي",
      customerPhone: "01012345678",
      orderType: "takeaway",
      items: [
        {
          menuItemId: "item_1",
          name_ar: "كباب",
          name_en: "Kebab",
          price: 100,
          quantity: 2,
        },
      ],
    });

    expect(order1.id).toBeDefined();
    expect(order1.reference).toMatch(/^#ORD-\d+$/);
    expect(order1.totalPrice).toBe(200);
    expect(order1.status).toBe("pending");

    const order2 = await OrderRepository.createOrder({
      storeSlug: "oriental-grill",
      storeName_ar: "مشويات البركة",
      storeName_en: "Baraka Grill",
      storePhone: "201012345678",
      customerName: "عميل 2",
      customerPhone: "01099999999",
      orderType: "dine_in",
      items: [
        {
          menuItemId: "item_2",
          name_ar: "شيش",
          name_en: "Shish",
          price: 50,
          quantity: 1,
        },
      ],
    });

    expect(order2.reference).not.toBe(order1.reference);
  });

  it("should update order status", async () => {
    const order = await OrderRepository.createOrder({
      storeSlug: "oriental-grill",
      storeName_ar: "مشويات البركة",
      storeName_en: "Baraka Grill",
      storePhone: "201012345678",
      customerName: "محمد علي",
      customerPhone: "01000000000",
      orderType: "delivery",
      deliveryFee: 20,
      items: [
        {
          menuItemId: "item_1",
          name_ar: "كباب",
          name_en: "Kebab",
          price: 120,
          quantity: 1,
        },
      ],
    });

    expect(order.totalPrice).toBe(140);

    const updated = await OrderRepository.updateOrderStatus(order.id, "preparing");
    expect(updated?.status).toBe("preparing");
  });
});
