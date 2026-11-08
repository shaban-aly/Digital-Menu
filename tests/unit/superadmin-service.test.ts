import { describe, it, expect, beforeEach, vi } from "vitest";
import { SuperAdminService } from "@/features/admin/services/superadmin-service";
import * as supabaseClient from "@/lib/supabase/client";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { setupMockSupabase, resetMockSupabase } from "../mocks/mock-supabase-auth";

describe("SuperAdminService & Supabase Fallback", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    resetMockSupabase();
    setupMockSupabase(supabaseClient);

    await SuperAdminService.updateStorePlan("oriental-grill", "pro_monthly");
    await SuperAdminService.updateStorePlan("specialty-cafe", "free");
    await SuperAdminService.updateStorePlan("fresh-market", "enterprise");
    await SuperAdminService.toggleStoreStatus("oriental-grill", true);
    await SuperAdminService.toggleStoreStatus("specialty-cafe", true);
    await SuperAdminService.toggleStoreStatus("fresh-market", true);
  });

  describe("Supabase Configuration & Fallback", () => {
    it("reports whether Supabase is configured without throwing errors", () => {
      const configured = isSupabaseConfigured();
      expect(typeof configured).toBe("boolean");
    });

    it("exports a defined supabase client instance", () => {
      expect(supabase).toBeDefined();
      expect(typeof supabase.from).toBe("function");
    });
  });

  describe("Platform Statistics Computation", () => {
    it("computes platform KPIs correctly from initial store catalog", async () => {
      const stats = await SuperAdminService.getPlatformStats();
      expect(stats.totalStores).toBe(3);
      expect(stats.activeStores).toBe(3);
      expect(stats.planBreakdown.free).toBe(1);
      expect(stats.planBreakdown.pro).toBe(1);
      expect(stats.planBreakdown.enterprise).toBe(1);
      expect(stats.totalProducts).toBeGreaterThan(0);
    });
  });

  describe("Store Listing & Counting", () => {
    it("lists all stores with products and categories count", async () => {
      const stores = await SuperAdminService.listAllStores();
      expect(stores.length).toBe(3);

      const grill = stores.find((s) => s.slug === "oriental-grill");
      expect(grill).toBeDefined();
      expect(grill?.plan).toBe("pro_monthly");
      expect(grill?.is_active).toBe(true);
      expect(grill?.productsCount).toBeGreaterThan(0);
      expect(grill?.categoriesCount).toBeGreaterThan(0);
    });
  });

  describe("Plan Modification", () => {
    it("updates store plan and updates KPI plan breakdown", async () => {
      await SuperAdminService.updateStorePlan("specialty-cafe", "pro_yearly");
      const stores = await SuperAdminService.listAllStores();
      const cafe = stores.find((s) => s.slug === "specialty-cafe");
      expect(cafe?.plan).toBe("pro_yearly");

      const stats = await SuperAdminService.getPlatformStats();
      expect(stats.planBreakdown.free).toBe(0);
      expect(stats.planBreakdown.pro).toBe(2);
      expect(stats.planBreakdown.enterprise).toBe(1);
    });
  });

  describe("Store Status Toggling", () => {
    it("toggles store active status and reflects in activeStores KPI", async () => {
      await SuperAdminService.toggleStoreStatus("fresh-market", false);
      const stores = await SuperAdminService.listAllStores();
      const fresh = stores.find((s) => s.slug === "fresh-market");
      expect(fresh?.is_active).toBe(false);

      const stats = await SuperAdminService.getPlatformStats();
      expect(stats.totalStores).toBe(3);
      expect(stats.activeStores).toBe(2);
    });
  });

  describe("Store Search & Filtering", () => {
    it("filters stores by slug, Arabic name, and English name", async () => {
      const stores = await SuperAdminService.listAllStores();

      const bySlug = SuperAdminService.filterStores(stores, "oriental");
      expect(bySlug.length).toBe(1);
      expect(bySlug[0].slug).toBe("oriental-grill");

      const byArabic = SuperAdminService.filterStores(stores, "أروما");
      expect(byArabic.length).toBe(1);
      expect(byArabic[0].slug).toBe("specialty-cafe");

      const byEnglish = SuperAdminService.filterStores(stores, "Market");
      expect(byEnglish.length).toBe(1);
      expect(byEnglish[0].slug).toBe("fresh-market");

      const emptyQuery = SuperAdminService.filterStores(stores, "   ");
      expect(emptyQuery.length).toBe(3);

      const noMatch = SuperAdminService.filterStores(
        stores,
        "nonexistent-query-12345"
      );
      expect(noMatch.length).toBe(0);
    });
  });
});
