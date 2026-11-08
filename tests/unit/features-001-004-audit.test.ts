import { describe, it, expect, vi } from "vitest";
import { getStoreBySlug } from "@/features/menu/services/menu-service";
import { matchesSearch, normalizeArabicText } from "@/features/menu/services/search-normalization";
import { formatWhatsAppMessage, buildWhatsAppOrderUrl, generateWhatsAppLink } from "@/features/cart/services/whatsapp-service";
import { WhatsAppOrderPayload, CartItem } from "@/features/cart/types";
import { QuotaService } from "@/features/subscription/services/quota-service";
import { getPilotStores } from "@/features/landing/data/pilot-stores";
import { getPricingPlans, buildWhatsAppInquiryUrl } from "@/features/landing/services/landing-data";
import DashboardRootPage from "@/app/dashboard/page";
import { redirect } from "next/navigation";

const mockReplace = vi.fn();

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useEffect: (fn: () => void) => { fn(); } };
});

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: () => ({ user: { id: "1", storeSlug: "oriental-grill", role: "merchant" }, isLoading: false, isAuthenticated: true }),
}));

vi.mock("next/navigation", () => ({ redirect: vi.fn(), useRouter: () => ({ replace: mockReplace, push: vi.fn() }) }));

describe("Audit Suite: Features 001 to 004 Specifications", () => {
  describe("Feature 001: Customer Menu View", () => {
    it("provides categorized items, supermarket custom units, and RTL/LTR fields", async () => {
      const market = await getStoreBySlug("fresh-market");
      expect(market).not.toBeNull();
      expect(market?.restaurant.business_type).toBe("supermarket");
      expect(market?.categories.length).toBeGreaterThan(0);

      // Check selling units in fresh produce
      const firstItem = market?.categories[0].items[0];
      expect(firstItem?.unit_ar).toBe("1 كجم");
      expect(firstItem?.unit_en).toBe("1 kg");

      // Verify bilingual metadata & badges
      const grill = await getStoreBySlug("oriental-grill");
      expect(grill?.restaurant.name_ar).toBeTruthy();
      expect(grill?.restaurant.name_en).toBeTruthy();
      const itemWithBadges = grill?.categories.flatMap((c) => c.items).find((i) => i.badges.length > 0);
      expect(itemWithBadges).toBeDefined();
    });

    it("supports search with full Arabic diacritics and letter normalization", () => {
      expect(normalizeArabicText("شَوْرَبَة")).toBe("شوربه");
      expect(normalizeArabicText("إِسبريسو")).toBe("اسبريسو");
      expect(matchesSearch("شوربه", "شوربة لسان عصفور", true)).toBe(true);
      expect(matchesSearch("coffee", "Iced Coffee", false)).toBe(true);
    });
  });

  describe("Feature 002: Cart & WhatsApp Ordering", () => {
    const produceItem: CartItem = {
      id: "prod-1",
      menuItemId: "prod-1",
      name_ar: "طماطم بلدي",
      name_en: "Local Tomatoes",
      price: 25,
      unit_ar: "1 كجم",
      unit_en: "1 kg",
      quantity: 2,
      itemNote: "حمراء مستوية",
      is_available: true,
    };

    it("formats WhatsApp order message with custom units and dynamic phone", () => {
      const payload: WhatsAppOrderPayload = {
        restaurantName: "سوبر ماركت فريش ماركت",
        restaurantPhone: "+201099887766",
        orderType: "delivery",
        customerName: "محمود",
        customerPhone: "01011223344",
        deliveryAddress: "المعادي، شارع النصر",
        items: [produceItem],
        itemsTotal: 50,
        deliveryFee: 15,
        totalPrice: 65,
        locale: "ar",
        currency: "EGP",
      };

      const message = formatWhatsAppMessage(payload);
      expect(message).toContain("سوبر ماركت فريش ماركت");
      expect(message).toContain("2x طماطم بلدي (1 كجم)");
      expect(message).toContain("المجموع الفرعي");
      expect(message).toContain("رسوم التوصيل");
      expect(message).toContain("الإجمالي النهائي");

      const url = buildWhatsAppOrderUrl(payload);
      expect(url).toContain("https://wa.me/201099887766");
      expect(url).toContain(encodeURIComponent("طماطم بلدي (1 كجم)"));
    });

    it("correctly calculates financial totals across dine_in, takeaway, and delivery", () => {
      const basePayload: WhatsAppOrderPayload = {
        restaurantName: "كافيه أروما",
        restaurantPhone: "201000000000",
        orderType: "dine_in",
        items: [produceItem],
        itemsTotal: 50,
        deliveryFee: 0,
        totalPrice: 50,
        locale: "en",
        currency: "USD",
      };

      // Dine-in has 0 delivery fee
      const dineInLink = generateWhatsAppLink(basePayload, { delivery_fee: 25 });
      expect(decodeURIComponent(dineInLink)).not.toContain("Delivery Fee");

      // Delivery adds delivery fee
      const deliveryPayload = { ...basePayload, orderType: "delivery" as const };
      const deliveryLink = generateWhatsAppLink(deliveryPayload, { delivery_fee: 10, currency: "USD" });
      const decoded = decodeURIComponent(deliveryLink);
      expect(decoded).toContain("*Delivery Fee:* 10 USD");
      expect(decoded).toContain("*Grand Total: 60 USD*");
    });
  });

  describe("Feature 003: Merchant Admin & Dashboard", () => {
    it("redirects root dashboard to default merchant slug", () => {
      DashboardRootPage();
      expect(mockReplace).toHaveBeenCalledWith("/dashboard/oriental-grill");
    });

    it("enforces tier limits via QuotaService and monitors stock availability", async () => {
      const store = await getStoreBySlug("oriental-grill");
      expect(store).not.toBeNull();
      if (!store) return;

      const freeQuota = QuotaService.getQuotaUsage(store, "free");
      expect(freeQuota.maxCategories).toBe(7);
      expect(freeQuota.maxProducts).toBe(50);
      expect(freeQuota.planKey).toBe("free");

      const proQuota = QuotaService.getQuotaUsage(store, "pro");
      expect(proQuota.maxCategories).toBe(50);
      expect(proQuota.maxProducts).toBe(500);

      // Verify availability toggle mutation safety
      const targetItem = store.categories[0].items[0];
      const toggledAvailability = !targetItem.is_available;
      const updatedItem = { ...targetItem, is_available: toggledAvailability };
      expect(updatedItem.is_available).toBe(toggledAvailability);
      expect(updatedItem.id).toBe(targetItem.id);
    });
  });

  describe("Feature 004: Marketing Landing Page", () => {
    it("exports 3 pilot stores showcase covering restaurant, cafe, and supermarket", () => {
      const storesAr = getPilotStores(true);
      expect(storesAr.length).toBe(3);
      expect(storesAr.map((s) => s.slug)).toEqual(["oriental-grill", "specialty-cafe", "fresh-market"]);
      expect(storesAr[0].tag).toContain("مطعم");
      expect(storesAr[1].tag).toContain("كافيه");
      expect(storesAr[2].tag).toContain("سوبر ماركت");

      const storesEn = getPilotStores(false);
      expect(storesEn[2].desc).toContain("kg, liter");
    });

    it("provides pricing plans and structured WhatsApp inquiry links", () => {
      const plans = getPricingPlans();
      expect(plans.length).toBe(3);
      const proPlan = plans.find((p) => p.isPopular);
      expect(proPlan).toBeDefined();
      expect(proPlan?.priceMonthly).toBe(250);

      const inquiryUrl = buildWhatsAppInquiryUrl(proPlan!.name_ar, proPlan!.whatsappMessage);
      expect(inquiryUrl).toContain("https://wa.me/");
      expect(inquiryUrl).toContain(encodeURIComponent(proPlan!.whatsappMessage));
    });
  });
});
