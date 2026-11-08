import { describe, it, expect } from "vitest";
import {
  StoreSettingsSchema,
  CategorySchema,
  AdminMenuItemSchema,
  StoreQRConfigSchema,
} from "@/features/admin/types";

describe("Admin Zod Validation Schemas", () => {
  it("should validate valid store settings", () => {
    const valid = {
      id: "store_1",
      slug: "oriental-grill",
      name_ar: "مشويات البركة",
      name_en: "Baraka Grill",
      phone_number: "201012345678",
      supported_order_types: ["dine_in", "takeaway"],
      delivery_fee: 25,
      currency: "EGP",
    };
    const result = StoreSettingsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject store settings with phone number under 7 digits", () => {
    const invalid = {
      id: "store_1",
      slug: "oriental-grill",
      name_ar: "مشويات البركة",
      name_en: "Baraka Grill",
      phone_number: "123",
      supported_order_types: ["dine_in"],
      delivery_fee: 25,
      currency: "EGP",
    };
    const result = StoreSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should validate valid menu item and reject negative price", () => {
    const valid = {
      id: "item_1",
      category_id: "cat_1",
      name_ar: "كباب حلبى",
      name_en: "Halabi Kebab",
      price: 180,
    };
    expect(AdminMenuItemSchema.safeParse(valid).success).toBe(true);

    const withoutId = {
      category_id: "cat_1",
      name_ar: "كباب حلبى",
      name_en: "Halabi Kebab",
      price: 180,
    };
    expect(AdminMenuItemSchema.safeParse(withoutId).success).toBe(true);

    const invalidPrice = { ...valid, price: -10 };
    expect(AdminMenuItemSchema.safeParse(invalidPrice).success).toBe(false);
  });

  it("should validate category schema", () => {
    const valid = {
      id: "cat_1",
      name_ar: "المشويات",
      name_en: "Grills",
    };
    expect(CategorySchema.safeParse(valid).success).toBe(true);

    const withoutId = {
      name_ar: "المشويات",
      name_en: "Grills",
    };
    expect(CategorySchema.safeParse(withoutId).success).toBe(true);

    const invalidShortName = { id: "cat_1", name_ar: "ا", name_en: "G" };
    expect(CategorySchema.safeParse(invalidShortName).success).toBe(false);
  });

  it("should validate QR config schema", () => {
    const valid = {
      storeSlug: "oriental-grill",
      targetUrl: "https://example.com/menu/oriental-grill",
      wifiSsid: "Guest-Wifi",
      wifiPassword: "Password123",
    };
    expect(StoreQRConfigSchema.safeParse(valid).success).toBe(true);
  });
});

