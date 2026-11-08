import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthService } from "@/features/auth/services/auth-service";
import { OnboardingService } from "@/features/onboarding/services/onboarding-service";
import { QuotaService } from "@/features/subscription/services/quota-service";
import { SubscriptionService } from "@/features/subscription/services/subscription-service";
import { getTierPrice } from "@/features/subscription/data/pricing-plans";
import { SuperAdminService } from "@/features/admin/services/superadmin-service";
import { StoreRepository } from "@/features/admin/services/store-repository";
import { translateArabicToEnglish } from "@/features/admin/services/translation-service";
import { POST as translateRoute } from "@/app/api/translate/route";
import { MenuData } from "@/features/menu/types";

describe("Feature 006: SaaS Platform, Multi-Tenant Quotas & Super Admin", () => {
  const storageMock: Record<string, string> = {};

  beforeEach(() => {
    for (const key in storageMock) delete storageMock[key];
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => storageMock[k] || null,
      setItem: (k: string, v: string) => { storageMock[k] = v; },
      removeItem: (k: string) => { delete storageMock[k]; },
    });
    vi.stubGlobal("window", {
      localStorage: globalThis.localStorage,
      dispatchEvent: vi.fn(),
      open: vi.fn(),
    });
  });

  it("T052: registers account, creates store with slug check, and establishes 1:1 link", async () => {
    const user = await AuthService.register("merchant@test.com", "Sami", "pass123");
    expect(user.storeSlug).toBeNull();

    expect(await OnboardingService.checkSlugAvailability("admin")).toBe(false);
    expect(await OnboardingService.checkSlugAvailability("oriental-grill")).toBe(false);
    expect(await OnboardingService.checkSlugAvailability("audit-bistro")).toBe(true);

    const store = await OnboardingService.createStore({
      businessType: "restaurant",
      nameAr: "بيسترو المراجعة",
      nameEn: "Audit Bistro",
      slug: "audit-bistro",
      phoneNumber: "201011223344",
      deliveryFee: 25,
      selectedPlan: "free",
      billingCycle: "monthly",
    }, user.id);

    expect(store.slug).toBe("audit-bistro");
    const current = await AuthService.getCurrentUser();
    expect(current?.storeSlug).toBe("audit-bistro");
  });

  it("T052: verifies QuotaService tiers (Free: 7/50, Pro: 50/500, Enterprise: unlimited)", () => {
    const makeStore = (cats: number, prods: number): MenuData => ({
      restaurant: { id: "s1", slug: "s1", name_ar: "م", name_en: "M", business_type: "restaurant", description_ar: "", description_en: "", logo_url: "", phone_number: "2010", default_language: "ar", currency: "EGP", supported_order_types: ["takeaway"], delivery_fee: 0 },
      categories: Array.from({ length: cats }, (_, c) => ({
        id: `c${c}`, name_ar: `ق${c}`, name_en: `C${c}`, display_order: c, is_active: true,
        items: Array.from({ length: prods }, (_, i) => ({ id: `i${c}_${i}`, category_id: `c${c}`, name_ar: `ص`, name_en: `I`, short_desc_ar: "", short_desc_en: "", full_desc_ar: "", full_desc_en: "", price: 20, display_order: i, is_available: true, badges: [], allergens: [] })),
      })),
    });

    const freeStore = makeStore(7, 7);
    expect(QuotaService.canAddCategory(freeStore, "free")).toBe(false);
    expect(QuotaService.canAddProduct(freeStore, "free")).toBe(true);

    const proStore = makeStore(10, 10);
    expect(QuotaService.canAddCategory(proStore, "pro")).toBe(true);
    expect(QuotaService.getQuotaUsage(proStore, "pro").maxCategories).toBe(50);
    expect(QuotaService.getQuotaUsage(proStore, "pro").maxProducts).toBe(500);

    const entStore = makeStore(60, 20);
    expect(QuotaService.canAddCategory(entStore, "enterprise")).toBe(true);
    expect(QuotaService.canAddProduct(entStore, "enterprise")).toBe(true);
  });

  it("T052: validates pricing toggle and pre-filled WhatsApp activation deep-link", () => {
    const mo = getTierPrice("pro", "monthly", "ar");
    const yr = getTierPrice("pro", "yearly", "ar");
    expect(mo.price).toContain("250");
    expect(yr.price).toContain("2,500");

    const url = SubscriptionService.buildUpgradeWhatsAppUrl({
      storeName: "سوبرماركت البركة",
      storeSlug: "baraka-market",
      ownerName: "يوسف",
      targetPlan: "pro",
      billingCycle: "yearly",
    });
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("سوبرماركت البركة");
    expect(decoded).toContain("baraka-market");
    expect(decoded).toContain("2,500");
  });

  it("T053: tests AI translation service and /api/translate route handler", async () => {
    expect(await translateArabicToEnglish("مشويات")).toBe("Grills");
    expect(await translateArabicToEnglish("شاورما البرنس")).toBe("Prince Shawarma");

    const req = new Request("http://localhost:3000/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "مقبلات" }),
    });
    const res = await translateRoute(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.translation).toBe("Appetizers");
  });

  it("T054: audits Super Admin KPIs, 1-click tier modification, and live sync", async () => {
    const stats = await SuperAdminService.getPlatformStats();
    expect(stats.totalStores).toBeGreaterThanOrEqual(3);
    expect(stats.planBreakdown.free).toBeGreaterThanOrEqual(1);

    await SuperAdminService.updateStorePlan("oriental-grill", "pro_monthly");
    let store = await StoreRepository.getStore("oriental-grill");
    expect(store?.restaurant.plan).toBe("pro_monthly");
    expect(QuotaService.getQuotaUsage(store!).maxCategories).toBe(50);

    await SuperAdminService.updateStorePlan("oriental-grill", "enterprise");
    store = await StoreRepository.getStore("oriental-grill");
    expect(QuotaService.getQuotaUsage(store!).planKey).toBe("enterprise");
  });
});

