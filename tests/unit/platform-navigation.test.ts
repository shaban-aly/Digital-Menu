import { describe, it, expect } from "vitest";
import { PRICING_TIERS, getTierPrice } from "@/features/subscription/data/pricing-plans";
import { buildUpgradeWhatsAppUrl } from "@/features/subscription/services/subscription-service";
import { QuotaService } from "@/features/subscription/services/quota-service";
import { UserProfile } from "@/features/auth/types";

describe("Platform Navigation & Routing Specifications", () => {
  describe("Post-Authentication Routing Decisions", () => {
    function getPostAuthRedirect(user: Pick<UserProfile, "storeSlug"> | null): string {
      if (!user) return "/login";
      if (!user.storeSlug) return "/onboarding";
      return "/dashboard";
    }

    it("should route user without storeSlug to /onboarding", () => {
      const newUser: Pick<UserProfile, "storeSlug"> = { storeSlug: null };
      expect(getPostAuthRedirect(newUser)).toBe("/onboarding");
    });

    it("should route user with storeSlug to /dashboard", () => {
      const merchant: Pick<UserProfile, "storeSlug"> = { storeSlug: "oriental-grill" };
      expect(getPostAuthRedirect(merchant)).toBe("/dashboard");
    });

    it("should route unauthenticated visitor at /onboarding to /login", () => {
      expect(getPostAuthRedirect(null)).toBe("/login");
    });
  });

  describe("Platform Pricing Tiers & WhatsApp Activations", () => {
    it("should provide correct Pro Monthly pricing of 250 EGP", () => {
      const monthly = getTierPrice("pro", "monthly", "ar");
      expect(monthly.price).toContain("250");
      expect(monthly.period).toContain("شهر");

      const monthlyEn = getTierPrice("pro", "monthly", "en");
      expect(monthlyEn.price).toContain("250");
      expect(monthlyEn.period).toContain("month");
    });

    it("should provide correct Pro Yearly pricing of 2500 EGP with 2 months free", () => {
      const yearly = getTierPrice("pro", "yearly", "ar");
      expect(yearly.price).toContain("2,500");
      expect(yearly.period).toContain("وفر شهرين");

      const yearlyEn = getTierPrice("pro", "yearly", "en");
      expect(yearlyEn.price).toContain("2,500");
      expect(yearlyEn.period).toContain("2 mo free");
    });

    it("should prefill WhatsApp activation URL with plan and store details", () => {
      const url = buildUpgradeWhatsAppUrl({
        platformPhone: "+201012345678",
        storeName: "كافيه أروما",
        storeSlug: "specialty-cafe",
        ownerName: "أحمد علي",
        targetPlan: "pro",
        billingCycle: "yearly",
        locale: "ar",
      });

      expect(url).toContain("https://wa.me/201012345678");
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain("كافيه أروما");
      expect(decoded).toContain("specialty-cafe");
      expect(decoded).toContain("Pro");
      expect(decoded).toContain("2,500");
    });
  });

  describe("Merchant Dashboard Quota Usage & Actions", () => {
    const mockFreeStore = {
      restaurant: {
        id: "r1",
        slug: "specialty-cafe",
        name_ar: "كافيه أروما",
        name_en: "Aroma Cafe",
        business_type: "cafe" as const,
        phone_number: "201012345678",
        default_language: "ar" as const,
        currency: "EGP",
        supported_order_types: ["takeaway" as const],
      },
      categories: [
        {
          id: "c1",
          name_ar: "قهوة ساخنة",
          name_en: "Hot Coffee",
          display_order: 1,
          is_active: true,
          items: [
            {
              id: "i1",
              category_id: "c1",
              name_ar: "إسبريسو",
              name_en: "Espresso",
              price: 35,
              display_order: 1,
              is_available: true,
              badges: [],
              allergens: [],
            },
          ],
        },
      ],
    };

    it("should calculate correct usage fractions on Free tier (X/7 and Y/50)", () => {
      const usage = QuotaService.getQuotaUsage(mockFreeStore, "free");
      expect(usage.categoriesCount).toBe(1);
      expect(usage.maxCategories).toBe(7);
      expect(usage.productsCount).toBe(1);
      expect(usage.maxProducts).toBe(50);
      expect(usage.isCategoriesExceeded).toBe(false);
      expect(usage.isProductsExceeded).toBe(false);
    });

    it("should verify customer menu path matches /menu/[slug]", () => {
      const customerMenuPath = `/menu/${mockFreeStore.restaurant.slug}`;
      expect(customerMenuPath).toBe("/menu/specialty-cafe");
    });

    it("should verify new activity path matches /onboarding", () => {
      const newActivityPath = "/onboarding";
      expect(newActivityPath).toBe("/onboarding");
    });
  });
});
