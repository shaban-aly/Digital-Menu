import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { STORES_MAP } from "@/features/menu/services/mock-menu-data";
import { StoreRepository, STORE_UPDATED_EVENT } from "./store-repository";
import {
  getAllStoreMeta,
  getStoreMeta,
  updateStoreMeta,
  LocalStoreMeta,
} from "./store-meta-storage";
import {
  SuperAdminStoreSummary,
  PlatformKPIs,
  SuperAdminPlanKey,
} from "../types";

export const SuperAdminService = {
  getStoreMeta(slug: string): LocalStoreMeta {
    return getStoreMeta(slug);
  },

  isStoreActive(slug: string): boolean {
    return getStoreMeta(slug).is_active;
  },

  async listAllStores(): Promise<SuperAdminStoreSummary[]> {
    const meta = getAllStoreMeta();
    const slugs = Object.keys(STORES_MAP);
    const results: SuperAdminStoreSummary[] = [];

    for (const slug of slugs) {
      const storeData = await StoreRepository.getStore(slug);
      const restaurant = storeData?.restaurant || STORES_MAP[slug].restaurant;
      const categories = storeData?.categories || STORES_MAP[slug].categories;
      const productsCount = categories.reduce(
        (sum, c) => sum + (c.items?.length || 0),
        0
      );
      const storeMeta = meta[slug] || {
        plan: "free" as SuperAdminPlanKey,
        is_active: true,
      };

      results.push({
        id: restaurant.id,
        slug,
        name_ar: restaurant.name_ar,
        name_en: restaurant.name_en,
        business_type: restaurant.business_type,
        phone_number: restaurant.phone_number,
        plan: storeMeta.plan,
        is_active: storeMeta.is_active,
        productsCount,
        categoriesCount: categories.length,
      });
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("stores").select("*");
      } catch {
        // Fallback gracefully without throwing
      }
    }

    return results;
  },

  async getPlatformStats(): Promise<PlatformKPIs> {
    const stores = await this.listAllStores();
    const activeStores = stores.filter((s) => s.is_active).length;
    const totalProducts = stores.reduce((sum, s) => sum + s.productsCount, 0);

    const planBreakdown = { free: 0, pro: 0, enterprise: 0 };
    for (const store of stores) {
      if (store.plan === "free") {
        planBreakdown.free += 1;
      } else if (store.plan === "enterprise") {
        planBreakdown.enterprise += 1;
      } else {
        planBreakdown.pro += 1;
      }
    }

    return {
      totalStores: stores.length,
      activeStores,
      planBreakdown,
      totalProducts,
    };
  },

  async updateStorePlan(slug: string, plan: SuperAdminPlanKey): Promise<void> {
    updateStoreMeta(slug, { plan });

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(STORE_UPDATED_EVENT, { detail: { slug } })
      );
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("stores").update({ plan }).eq("slug", slug);
      } catch {
        // Fallback gracefully
      }
    }
  },

  async toggleStoreStatus(slug: string, isActive: boolean): Promise<void> {
    updateStoreMeta(slug, { is_active: isActive });

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(STORE_UPDATED_EVENT, { detail: { slug } })
      );
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from("stores")
          .update({ is_active: isActive })
          .eq("slug", slug);
      } catch {
        // Fallback gracefully
      }
    }
  },

  filterStores(
    stores: SuperAdminStoreSummary[],
    query: string
  ): SuperAdminStoreSummary[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return stores;
    return stores.filter(
      (s) =>
        s.slug.toLowerCase().includes(normalized) ||
        s.name_ar.toLowerCase().includes(normalized) ||
        s.name_en.toLowerCase().includes(normalized)
    );
  },
};
