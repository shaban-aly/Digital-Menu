import { describe, it, expect, beforeEach, vi } from "vitest";
import { ScheduleService } from "@/features/schedule/services/schedule-service";
import { StoreScheduleConfigSchema } from "@/features/schedule/types";
import { formatWhatsAppMessage } from "@/features/cart/services/whatsapp-service";
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

describe("Features 005 & 006 Comprehensive Audit Suite", () => {
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

  describe("Feature 005: Smart Operating Hours & Availability Engine", () => {
    it("T051: validates 7-day schedule schema and evaluates open, overnight, and paused states", () => {
      const schedule = ScheduleService.getDefaultScheduleConfig();
      expect(StoreScheduleConfigSchema.safeParse(schedule).success).toBe(true);

      // Normal daytime shift (Sunday 14:00 - open 10:00 to 23:00)
      const sunOpen = new Date(2026, 10, 8, 14, 0);
      expect(ScheduleService.evaluateStoreStatus(schedule, sunOpen).isOpen).toBe(true);

      // Overnight shift configuration
      schedule.weekly_schedule[5] = { day: 5, is_enabled: true, open_time: "18:00", close_time: "03:00" };
      const satEarly = new Date(2026, 10, 14, 1, 30); // Saturday 01:30 AM (part of Friday overnight)
      expect(ScheduleService.evaluateStoreStatus(schedule, satEarly).isOpen).toBe(true);

      // Emergency rush pause override
      const paused = { ...schedule, is_manually_paused: true, pause_note_ar: "ضغط عمل مؤقت" };
      const pausedStatus = ScheduleService.evaluateStoreStatus(paused, sunOpen);
      expect(pausedStatus.status).toBe("paused");
      expect(pausedStatus.canPlaceOrder).toBe(false);
      expect(pausedStatus.pauseNoteAr).toBe("ضغط عمل مؤقت");
    });

    it("T051: enforces pre-order guard and prefixes WhatsApp orders during closed hours", () => {
      const schedule = ScheduleService.getDefaultScheduleConfig();
      const closedTime = new Date(2026, 10, 8, 3, 0); // Sunday 03:00 AM (closed)

      // Strict block: allow_preorders = false
      const strictSchedule = { ...schedule, allow_preorders: false };
      const strictStatus = ScheduleService.evaluateStoreStatus(strictSchedule, closedTime);
      expect(strictStatus.canPlaceOrder).toBe(false);
      expect(strictStatus.isPreOrder).toBe(false);

      // Pre-order enabled: allow_preorders = true
      const preSchedule = { ...schedule, allow_preorders: true };
      const preStatus = ScheduleService.evaluateStoreStatus(preSchedule, closedTime);
      expect(preStatus.canPlaceOrder).toBe(true);
      expect(preStatus.isPreOrder).toBe(true);

      const msg = formatWhatsAppMessage({
        restaurantName: "مشويات البركة",
        restaurantPhone: "201012345678",
        orderType: "takeaway",
        customerName: "كريم",
        customerPhone: "01099998888",
        deliveryAddress: "",
        generalNote: "",
        items: [
          {
            id: "1",
            menuItemId: "m1",
            name_ar: "كباب",
            name_en: "Kebab",
            price: 100,
            quantity: 1,
            itemNote: "",
            is_available: true,
          },
        ],
        itemsTotal: 100,
        deliveryFee: 0,
        totalPrice: 100,
        locale: "ar",
        currency: "EGP",
        isPreOrder: true,
        preOrderOpeningText: preStatus.nextOpeningDateTextAr,
      });
      expect(msg).toContain("🔔 *[طلب مسبق لموعد الفتح");
    });
  });

  describe("Feature 006: SaaS Platform, Multi-Tenant Quotas & Super Admin", () => {
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

      const freeStore = makeStore(7, 7); // 7 cats, 49 prods
      expect(QuotaService.canAddCategory(freeStore, "free")).toBe(false);
      expect(QuotaService.canAddProduct(freeStore, "free")).toBe(true);

      const proStore = makeStore(10, 10); // 10 cats, 100 prods
      expect(QuotaService.canAddCategory(proStore, "pro")).toBe(true);
      expect(QuotaService.getQuotaUsage(proStore, "pro").maxCategories).toBe(50);
      expect(QuotaService.getQuotaUsage(proStore, "pro").maxProducts).toBe(500);

      const entStore = makeStore(60, 20); // 60 cats, 1200 prods
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

      // 1-Click tier modification: Free -> Pro
      await SuperAdminService.updateStorePlan("oriental-grill", "pro_monthly");
      let store = await StoreRepository.getStore("oriental-grill");
      expect(store?.restaurant.plan).toBe("pro_monthly");
      expect(QuotaService.getQuotaUsage(store!).maxCategories).toBe(50);

      // Live 1-click tier modification: Pro -> Enterprise
      await SuperAdminService.updateStorePlan("oriental-grill", "enterprise");
      store = await StoreRepository.getStore("oriental-grill");
      expect(QuotaService.getQuotaUsage(store!).planKey).toBe("enterprise");
    });
  });
});
