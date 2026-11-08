import { describe, it, expect, vi } from "vitest";
import { QuotaService } from "@/features/subscription/services/quota-service";
import { SubscriptionService } from "@/features/subscription/services/subscription-service";
import { MenuData, CategoryWithItems, MenuItem } from "@/features/menu/types";
import DashboardRootPage from "@/app/dashboard/page";
import MenuIndexPage from "@/app/menu/page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

function createMockStore(categoryCount: number, productsPerCategory: number): MenuData {
  const categories: CategoryWithItems[] = Array.from({ length: categoryCount }, (_, catIdx) => ({
    id: `cat_${catIdx + 1}`,
    name_ar: `قسم ${catIdx + 1}`,
    name_en: `Category ${catIdx + 1}`,
    display_order: catIdx + 1,
    is_active: true,
    items: Array.from({ length: productsPerCategory }, (_, itemIdx) => ({
      id: `item_${catIdx + 1}_${itemIdx + 1}`,
      category_id: `cat_${catIdx + 1}`,
      name_ar: `صنف ${itemIdx + 1}`,
      name_en: `Item ${itemIdx + 1}`,
      short_desc_ar: "",
      short_desc_en: "",
      full_desc_ar: "",
      full_desc_en: "",
      price: 50,
      unit_ar: null,
      unit_en: null,
      image_url: null,
      display_order: itemIdx + 1,
      is_available: true,
      badges: [],
      allergens: [],
    })),
  }));

  return {
    restaurant: {
      id: "rest_1",
      slug: "test-store",
      name_ar: "متجر تجريبي",
      name_en: "Test Store",
      business_type: "restaurant",
      description_ar: "",
      description_en: "",
      logo_url: "https://example.com/logo.png",
      phone_number: "201012345678",
      default_language: "ar",
      currency: "EGP",
      supported_order_types: ["dine_in", "takeaway", "delivery"],
      delivery_fee: 20,
    },
    categories,
  };
}

describe("Dashboard Routing & Menu Redirects", () => {
  it("should redirect /dashboard to /dashboard/oriental-grill", async () => {
    const { redirect } = await import("next/navigation");
    DashboardRootPage();
    expect(redirect).toHaveBeenCalledWith("/dashboard/oriental-grill");
  });

  it("should redirect /menu without slug to /", async () => {
    const { redirect } = await import("next/navigation");
    MenuIndexPage();
    expect(redirect).toHaveBeenCalledWith("/");
  });
});

describe("QuotaService Calculations & Limits", () => {
  it("should enforce Free plan limits (max 7 categories, 50 products)", () => {
    const store = createMockStore(6, 5); // 6 categories, 30 products
    const usage = QuotaService.getQuotaUsage(store, "free");

    expect(usage.categoriesCount).toBe(6);
    expect(usage.maxCategories).toBe(7);
    expect(usage.isCategoriesExceeded).toBe(false);
    expect(usage.productsCount).toBe(30);
    expect(usage.maxProducts).toBe(50);
    expect(usage.isProductsExceeded).toBe(false);

    expect(QuotaService.canAddCategory(store, "free")).toBe(true);
    expect(QuotaService.canAddProduct(store, "free")).toBe(true);
  });

  it("should block adding categories when Free plan reaches 7 categories", () => {
    const storeAtLimit = createMockStore(7, 2);
    const usage = QuotaService.getQuotaUsage(storeAtLimit, "free");

    expect(usage.categoriesCount).toBe(7);
    expect(usage.maxCategories).toBe(7);
    expect(usage.isCategoriesExceeded).toBe(true);
    expect(usage.categoriesUsagePercent).toBe(100);
    expect(QuotaService.canAddCategory(storeAtLimit, "free")).toBe(false);
  });

  it("should block adding products when Free plan reaches 50 products", () => {
    const storeAtLimit = createMockStore(5, 10); // 5 * 10 = 50 products
    const usage = QuotaService.getQuotaUsage(storeAtLimit, "free");

    expect(usage.productsCount).toBe(50);
    expect(usage.maxProducts).toBe(50);
    expect(usage.isProductsExceeded).toBe(true);
    expect(usage.productsUsagePercent).toBe(100);
    expect(QuotaService.canAddProduct(storeAtLimit, "free")).toBe(false);
  });

  it("should allow higher capacities on Pro plan (50 categories, 500 products)", () => {
    const storeWith10Cats = createMockStore(10, 8); // 10 cats, 80 products
    expect(QuotaService.canAddCategory(storeWith10Cats, "free")).toBe(false);
    expect(QuotaService.canAddCategory(storeWith10Cats, "pro")).toBe(true);
    expect(QuotaService.canAddProduct(storeWith10Cats, "pro")).toBe(true);

    const proUsage = QuotaService.getQuotaUsage(storeWith10Cats, "pro");
    expect(proUsage.maxCategories).toBe(50);
    expect(proUsage.maxProducts).toBe(500);
    expect(proUsage.isCategoriesExceeded).toBe(false);
  });

  it("should allow unlimited capacity on Enterprise plan", () => {
    const hugeStore = createMockStore(60, 20); // 60 cats, 1200 products
    expect(QuotaService.canAddCategory(hugeStore, "enterprise")).toBe(true);
    expect(QuotaService.canAddProduct(hugeStore, "enterprise")).toBe(true);
  });
});

describe("SubscriptionService WhatsApp URL Builder", () => {
  it("should generate a proper WhatsApp deep-link with store info and plan", () => {
    const url = SubscriptionService.buildUpgradeWhatsAppUrl({
      platformPhone: "+201099887766",
      storeName: "مطعم السعادة",
      storeSlug: "happiness-grill",
      targetPlan: "pro",
      billingCycle: "yearly",
    });

    expect(url).toContain("https://wa.me/201099887766");
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("مطعم السعادة");
    expect(decoded).toContain("happiness-grill");
    expect(decoded).toContain("Pro");
    expect(decoded).toContain("2,500");
  });
});
