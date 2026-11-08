import { describe, it, expect } from "vitest";
import {
  getQuotaUsage,
  canAddCategory,
  canAddProduct,
  canAddItem,
  QuotaService,
} from "@/features/subscription/services/quota-service";
import {
  buildUpgradeWhatsAppUrl,
  SubscriptionService,
  DEFAULT_PLATFORM_PHONE,
} from "@/features/subscription/services/subscription-service";
import { MenuData } from "@/features/menu/types";

function createMockMenuData(catCount: number, prodPerCat: number, plan?: string): MenuData {
  return {
    restaurant: {
      id: "r1",
      slug: "test-grill",
      name_ar: "مشويات",
      name_en: "Grill",
      business_type: "restaurant",
      description_ar: "",
      description_en: "",
      logo_url: "https://example.com/logo.png",
      phone_number: "201012345678",
      default_language: "ar",
      currency: "EGP",
      supported_order_types: ["dine_in", "takeaway", "delivery"],
      delivery_fee: 20,
      ...(plan ? { plan } : {}),
    },
    categories: Array.from({ length: catCount }, (_, c) => ({
      id: `cat-${c + 1}`,
      name_ar: `قسم ${c + 1}`,
      name_en: `Cat ${c + 1}`,
      display_order: c + 1,
      is_active: true,
      items: Array.from({ length: prodPerCat }, (_, i) => ({
        id: `i-${c + 1}-${i + 1}`,
        category_id: `cat-${c + 1}`,
        name_ar: `منتج ${i + 1}`,
        name_en: `Item ${i + 1}`,
        short_desc_ar: "",
        short_desc_en: "",
        full_desc_ar: "",
        full_desc_en: "",
        price: 50,
        display_order: i + 1,
        is_available: true,
        badges: [],
        allergens: [],
      })),
    })),
  };
}

describe("QuotaService", () => {
  it("allows additions under Free limits and enforces 7 categories / 50 products", () => {
    const under = createMockMenuData(5, 5, "free");
    expect(canAddCategory(under)).toBe(true);
    expect(canAddProduct(under)).toBe(true);
    expect(canAddItem(under)).toBe(true);

    const atCatLimit = createMockMenuData(7, 2, "free");
    expect(canAddCategory(atCatLimit)).toBe(false);
    expect(canAddProduct(atCatLimit)).toBe(true);

    const atProdLimit = createMockMenuData(5, 10, "free");
    expect(canAddCategory(atProdLimit)).toBe(true);
    expect(canAddProduct(atProdLimit)).toBe(false);
  });

  it("handles Pro limits (50 categories, 500 products)", () => {
    const pro = createMockMenuData(10, 10, "pro");
    expect(canAddCategory(pro, "pro")).toBe(true);
    expect(canAddProduct(pro, "pro")).toBe(true);

    const maxPro = createMockMenuData(50, 10, "pro");
    expect(canAddCategory(maxPro, "pro")).toBe(false);
    expect(canAddProduct(maxPro, "pro")).toBe(false);
  });

  it("allows unlimited additions on Enterprise", () => {
    const ent = createMockMenuData(100, 20, "enterprise");
    const usage = getQuotaUsage(ent, "enterprise");
    expect(usage.isCategoriesExceeded).toBe(false);
    expect(canAddCategory(ent, "enterprise")).toBe(true);
    expect(canAddProduct(ent, "enterprise")).toBe(true);
  });

  it("handles empty or missing categories gracefully", () => {
    const usage = QuotaService.getQuotaUsage({});
    expect(usage.categoriesCount).toBe(0);
    expect(usage.productsCount).toBe(0);
    expect(usage.planKey).toBe("free");
    expect(QuotaService.canAddCategory({})).toBe(true);
  });
});

describe("SubscriptionService - buildUpgradeWhatsAppUrl", () => {
  it("generates WhatsApp URL with pre-filled Arabic message and default phone", () => {
    const url = buildUpgradeWhatsAppUrl({
      storeName: "مطعم البركة",
      storeSlug: "al-baraka",
      ownerName: "أحمد محمد",
      ownerEmail: "ahmed@example.com",
      targetPlan: "pro",
      billingCycle: "monthly",
    });
    expect(url).toContain(`https://wa.me/${DEFAULT_PLATFORM_PHONE}`);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("مطعم البركة");
    expect(decoded).toContain("/menu/al-baraka");
    expect(decoded).toContain("أحمد محمد");
    expect(decoded).toContain("250 ج.م / شهر");
  });

  it("includes 2-month discount when choosing yearly billing", () => {
    const url = SubscriptionService.buildUpgradeWhatsAppUrl({
      platformPhone: "+20 (101) 234-5678",
      storeName: "Burger House",
      storeSlug: "burger-house",
      targetPlan: "pro",
      billingCycle: "yearly",
      locale: "en",
    });
    expect(url).toContain("https://wa.me/201012345678");
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Burger House");
    expect(decoded).toContain("2,500 EGP / yr");
    expect(decoded).toContain("2 months free");
  });

  it("handles Enterprise plan requests", () => {
    const url = buildUpgradeWhatsAppUrl({
      storeName: "Sultan Chain",
      storeSlug: "sultan-chain",
      targetPlan: "enterprise",
    });
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Enterprise");
    expect(decoded).toContain("سعة وفروع غير محدودة");
  });
});
