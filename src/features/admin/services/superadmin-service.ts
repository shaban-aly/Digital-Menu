import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { STORES_MAP } from "@/features/menu/services/mock-menu-data";
import { StoreRepository } from "./store-repository";
import {
  SuperAdminStoreSummary,
  PlatformKPIs,
  SuperAdminPlanKey,
} from "../types";

const SUPERADMIN_STORAGE_KEY = "superadmin_stores_meta";

interface LocalStoreMeta {
  plan: SuperAdminPlanKey;
  is_active: boolean;
}

const DEFAULT_STORE_META: Record<string, LocalStoreMeta> = {
  "oriental-grill": { plan: "pro_monthly", is_active: true },
  "specialty-cafe": { plan: "free", is_active: true },
  "fresh-market": { plan: "enterprise", is_active: true },
};

function getLocalMeta(): Record<string, LocalStoreMeta> {
  if (typeof window === "undefined") {
    return { ...DEFAULT_STORE_META };
  }
  try {
    const raw = window.localStorage.getItem(SUPERADMIN_STORAGE_KEY);
    return raw
      ? { ...DEFAULT_STORE_META, ...JSON.parse(raw) }
      : { ...DEFAULT_STORE_META };
  } catch {
    return { ...DEFAULT_STORE_META };
  }
}

function saveLocalMeta(meta: Record<string, LocalStoreMeta>): void {
  if (typeof window === "undefined") {
    Object.assign(DEFAULT_STORE_META, meta);
    return;
  }
  try {
    window.localStorage.setItem(SUPERADMIN_STORAGE_KEY, JSON.stringify(meta));
  } catch {
    Object.assign(DEFAULT_STORE_META, meta);
  }
}

export const SuperAdminService = {
  async listAllStores(): Promise<SuperAdminStoreSummary[]> {
    const meta = getLocalMeta();
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

    const planBreakdown = {
      free: 0,
      pro: 0,
      enterprise: 0,
    };

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
    const meta = getLocalMeta();
    meta[slug] = {
      ...(meta[slug] || { is_active: true }),
      plan,
    };
    saveLocalMeta(meta);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("stores").update({ plan }).eq("slug", slug);
      } catch {
        // Fallback gracefully
      }
    }
  },

  async toggleStoreStatus(slug: string, isActive: boolean): Promise<void> {
    const meta = getLocalMeta();
    meta[slug] = {
      ...(meta[slug] || { plan: "free" }),
      is_active: isActive,
    };
    saveLocalMeta(meta);

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
