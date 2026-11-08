import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  translateArabicToEnglish,
  TranslationService,
} from "@/features/admin/services/translation-service";
import { SuperAdminService } from "@/features/admin/services/superadmin-service";
import { StoreRepository } from "@/features/admin/services/store-repository";
import { QuotaService } from "@/features/subscription/services/quota-service";
import { POST as translateRoute } from "@/app/api/translate/route";

describe("Admin Live Sync and AI Translation Suite", () => {
  const memoryStorage: Record<string, string> = {};

  beforeEach(async () => {
    for (const key of Object.keys(memoryStorage)) {
      delete memoryStorage[key];
    }
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => memoryStorage[k] || null,
      setItem: (k: string, v: string) => {
        memoryStorage[k] = v;
      },
      removeItem: (k: string) => {
        delete memoryStorage[k];
      },
    });
    vi.stubGlobal("window", {
      localStorage: globalThis.localStorage,
      dispatchEvent: vi.fn(),
    });

    await SuperAdminService.updateStorePlan("oriental-grill", "pro_monthly");
    await SuperAdminService.toggleStoreStatus("oriental-grill", true);
  });

  describe("AI Translation Helper & Route", () => {
    it("translates common Arabic categories and food items accurately", async () => {
      const grills = await translateArabicToEnglish("مشويات");
      expect(grills).toBe("Grills");

      const appetizers = await translateArabicToEnglish("مقبلات");
      expect(appetizers).toBe("Appetizers");

      const beverages = await translateArabicToEnglish("مشروبات");
      expect(beverages).toBe("Beverages");

      const desserts = await translateArabicToEnglish("حلويات");
      expect(desserts).toBe("Desserts");
    });

    it("translates restaurant and store identity phrases", async () => {
      const prince = await translateArabicToEnglish("شاورما البرنس");
      expect(prince).toBe("Prince Shawarma");

      const happiness = await translateArabicToEnglish("مطعم السعادة");
      expect(happiness).toBe("Happiness Restaurant");

      const desc = await TranslationService.translateArabicToEnglish("طازج ولذيذ");
      expect(desc).toBe("Fresh and delicious");
    });

    it("handles /api/translate route with valid JSON and rejects invalid inputs", async () => {
      const validReq = new Request("http://localhost:3000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "مشويات" }),
      });
      const validRes = await translateRoute(validReq);
      expect(validRes.status).toBe(200);
      const validJson = await validRes.json();
      expect(validJson.success).toBe(true);
      expect(validJson.translation).toBe("Grills");

      const invalidReq = new Request("http://localhost:3000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "   " }),
      });
      const invalidRes = await translateRoute(invalidReq);
      expect(invalidRes.status).toBe(400);
      const invalidJson = await invalidRes.json();
      expect(invalidJson.success).toBe(false);
    });
  });

  describe("Super Admin Store Plan Live Quota Synchronization", () => {
    it("updates store plan in Super Admin and immediately updates quota in store queries", async () => {
      // 1. Set to Free tier
      await SuperAdminService.updateStorePlan("oriental-grill", "free");
      let store = await StoreRepository.getStore("oriental-grill");
      expect(store).not.toBeNull();
      expect(store?.restaurant.plan).toBe("free");

      let quota = QuotaService.getQuotaUsage(store!);
      expect(quota.planKey).toBe("free");
      expect(quota.maxCategories).toBe(7);
      expect(quota.maxProducts).toBe(50);

      // 2. Upgrade to Pro (monthly)
      await SuperAdminService.updateStorePlan("oriental-grill", "pro_monthly");
      store = await StoreRepository.getStore("oriental-grill");
      quota = QuotaService.getQuotaUsage(store!);
      expect(quota.planKey).toBe("pro");
      expect(quota.maxCategories).toBe(50);
      expect(quota.maxProducts).toBe(500);

      // 3. Upgrade to Enterprise (unlimited)
      await SuperAdminService.updateStorePlan("oriental-grill", "enterprise");
      store = await StoreRepository.getStore("oriental-grill");
      quota = QuotaService.getQuotaUsage(store!);
      expect(quota.planKey).toBe("enterprise");
      expect(quota.maxCategories).toBeGreaterThanOrEqual(999999);
      expect(quota.maxProducts).toBeGreaterThanOrEqual(999999);
      expect(quota.isCategoriesExceeded).toBe(false);
    });
  });

  describe("Super Admin Store Status Live Toggling", () => {
    it("toggles store active/suspended status and reflects in store availability", async () => {
      // Initially active
      let isAvailable = await StoreRepository.isStoreAvailable("oriental-grill");
      expect(isAvailable).toBe(true);
      let store = await StoreRepository.getStore("oriental-grill");
      expect(store?.restaurant.is_active).toBe(true);

      // Suspend store
      await SuperAdminService.toggleStoreStatus("oriental-grill", false);
      isAvailable = await StoreRepository.isStoreAvailable("oriental-grill");
      expect(isAvailable).toBe(false);
      store = await StoreRepository.getStore("oriental-grill");
      expect(store?.restaurant.is_active).toBe(false);
      expect(SuperAdminService.isStoreActive("oriental-grill")).toBe(false);

      // Reactivate store
      await SuperAdminService.toggleStoreStatus("oriental-grill", true);
      isAvailable = await StoreRepository.isStoreAvailable("oriental-grill");
      expect(isAvailable).toBe(true);
      store = await StoreRepository.getStore("oriental-grill");
      expect(store?.restaurant.is_active).toBe(true);
      expect(SuperAdminService.isStoreActive("oriental-grill")).toBe(true);
    });
  });
});
