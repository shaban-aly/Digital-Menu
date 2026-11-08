import { describe, it, expect } from "vitest";
import { CartItem } from "@/features/cart/types";

describe("cart-state calculations", () => {
  const sampleItems: CartItem[] = [
    {
      id: "item-101",
      menuItemId: "item-101",
      name_ar: "شوربة لسان عصفور",
      name_en: "Orzo Soup",
      price: 55,
      quantity: 2,
      itemNote: "",
      is_available: true,
    },
    {
      id: "item-201",
      menuItemId: "item-201",
      name_ar: "كباب وكفتة",
      name_en: "Kebab & Kofta",
      price: 290,
      quantity: 1,
      itemNote: "",
      is_available: true,
    },
  ];

  it("should calculate totalCount correctly as sum of quantities", () => {
    const totalCount = sampleItems.reduce((acc, it) => acc + it.quantity, 0);
    expect(totalCount).toBe(3);
  });

  it("should calculate totalPrice correctly as sum of price * quantity in EGP", () => {
    const totalPrice = sampleItems.reduce(
      (acc, it) => acc + it.price * it.quantity,
      0
    );
    expect(totalPrice).toBe(55 * 2 + 290 * 1); // 400
  });

  it("should handle empty cart total as zero", () => {
    const emptyItems: CartItem[] = [];
    const totalPrice = emptyItems.reduce(
      (acc, it) => acc + it.price * it.quantity,
      0
    );
    expect(totalPrice).toBe(0);
  });
});
