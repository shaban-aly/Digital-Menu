import { MenuData, Restaurant, MenuItem } from "@/features/menu/types";
import { getAllMockStores } from "@/features/menu/services/mock-menu-data";
import { StoreSettings, Category } from "@/features/admin/types";
import {
  getStoreBySlugAction, getAllStoresAction, saveMenuItemAction,
  toggleItemAvailabilityAction, deleteMenuItemAction, saveCategoryAction,
  deleteCategoryAction, updateStoreSettingsAction,
} from "@/lib/supabase/actions";
import {
  STORE_UPDATED_EVENT, getLocalOverrides, saveLocalOverrides, applyOverridesToStore,
  getFallbackStore, resetFallbackStore, fallbackSaveMenuItem, fallbackToggleAvailability,
  fallbackDeleteMenuItem, fallbackSaveCategory, fallbackDeleteCategory, fallbackUpdateSettings,
} from "./store-overrides";
import { getStoreMeta } from "@/features/admin/services/store-meta-storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export { STORE_UPDATED_EVENT, getLocalOverrides, saveLocalOverrides, applyOverridesToStore };

function notifyStoreUpdated(slug: string): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT, { detail: { slug } }));
  }
}

export const StoreRepository = {
  async getStore(slug: string): Promise<MenuData | null> {
    if (isSupabaseConfigured()) {
      try {
        const live = await getStoreBySlugAction(slug);
        return live || null;
      } catch (err) {
        console.warn("Supabase fetch fallback", err);
        return null;
      }
    }
    return getFallbackStore(slug);
  },

  async isStoreAvailable(slug: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const store = await getStoreBySlugAction(slug);
        if (store) return store.restaurant.is_active ?? true;
      } catch {}
    }
    return getStoreMeta(slug).is_active;
  },

  async getAllStores(): Promise<Restaurant[]> {
    if (isSupabaseConfigured()) {
      try {
        const live = await getAllStoresAction();
        if (live && live.length > 0) return live;
      } catch {}
    }
    return getAllMockStores();
  },

  async updateSettings(slug: string, settings: Partial<StoreSettings>): Promise<Restaurant> {
    if (isSupabaseConfigured()) {
      await updateStoreSettingsAction(slug, settings);
      notifyStoreUpdated(slug);
      const store = await this.getStore(slug);
      return store!.restaurant;
    }
    const res = fallbackUpdateSettings(slug, settings);
    notifyStoreUpdated(slug);
    return res;
  },

  async toggleItemAvailability(slug: string, itemId: string, isAvailable: boolean): Promise<boolean> {
    if (isSupabaseConfigured()) {
      await toggleItemAvailabilityAction(itemId, isAvailable);
      notifyStoreUpdated(slug);
      return isAvailable;
    }
    const res = fallbackToggleAvailability(slug, itemId, isAvailable);
    notifyStoreUpdated(slug);
    return res;
  },

  async saveMenuItem(
    slug: string,
    itemData: Partial<MenuItem> & { name_ar: string; name_en: string; price: number; category_id: string }
  ): Promise<MenuItem> {
    if (isSupabaseConfigured()) {
      const store = await this.getStore(slug);
      if (!store) throw new Error(`Store ${slug} not found`);
      const id = itemData.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `item_${Date.now()}`);
      const fullItem: MenuItem = {
        id,
        category_id: itemData.category_id,
        name_ar: itemData.name_ar,
        name_en: itemData.name_en,
        short_desc_ar: itemData.short_desc_ar || "",
        short_desc_en: itemData.short_desc_en || "",
        full_desc_ar: itemData.full_desc_ar || "",
        full_desc_en: itemData.full_desc_en || "",
        price: itemData.price,
        unit_ar: itemData.unit_ar ?? null,
        unit_en: itemData.unit_en ?? null,
        image_url: itemData.image_url ?? null,
        display_order: itemData.display_order ?? 0,
        is_available: itemData.is_available ?? true,
        badges: itemData.badges || [],
        allergens: itemData.allergens || [],
      };
      const saved = await saveMenuItemAction(store.restaurant.id, fullItem);
      notifyStoreUpdated(slug);
      return saved;
    }
    const saved = fallbackSaveMenuItem(slug, itemData);
    notifyStoreUpdated(slug);
    return saved;
  },

  async deleteMenuItem(slug: string, itemId: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      await deleteMenuItemAction(itemId);
      notifyStoreUpdated(slug);
      return true;
    }
    const res = fallbackDeleteMenuItem(slug, itemId);
    notifyStoreUpdated(slug);
    return res;
  },

  async saveCategory(
    slug: string,
    catData: { id?: string; name_ar: string; name_en: string; display_order?: number }
  ): Promise<Category> {
    if (isSupabaseConfigured()) {
      const store = await this.getStore(slug);
      if (!store) throw new Error(`Store ${slug} not found`);
      const id = catData.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `cat_${Date.now()}`);
      const saved = await saveCategoryAction(store.restaurant.id, {
        id,
        name_ar: catData.name_ar,
        name_en: catData.name_en,
        display_order: catData.display_order,
      });
      notifyStoreUpdated(slug);
      return saved;
    }
    const saved = fallbackSaveCategory(slug, catData);
    notifyStoreUpdated(slug);
    return saved;
  },

  async deleteCategory(slug: string, categoryId: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      await deleteCategoryAction(categoryId);
      notifyStoreUpdated(slug);
      return true;
    }
    const res = fallbackDeleteCategory(slug, categoryId);
    notifyStoreUpdated(slug);
    return res;
  },

  async resetToDefaults(slug: string): Promise<void> {
    resetFallbackStore(slug);
    notifyStoreUpdated(slug);
  },
};
