import { MenuData, Restaurant, MenuItem } from "@/features/menu/types";
import { STORES_MAP, getAllMockStores } from "@/features/menu/services/mock-menu-data";
import { StoreSettings, Category } from "@/features/admin/types";
import {
  getStoreBySlugAction,
  getAllStoresAction,
  saveMenuItemAction,
  toggleItemAvailabilityAction,
  deleteMenuItemAction,
  saveCategoryAction,
  deleteCategoryAction,
  updateStoreSettingsAction,
} from "@/lib/supabase/actions";
import {
  STORE_UPDATED_EVENT,
  getStorageKey,
  getLocalOverrides,
  saveLocalOverrides,
  applyOverridesToStore,
} from "./store-overrides";
import { getStoreMeta } from "@/features/admin/services/store-meta-storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export { STORE_UPDATED_EVENT, getLocalOverrides, saveLocalOverrides, applyOverridesToStore };

export const StoreRepository = {
  async getStore(slug: string): Promise<MenuData | null> {
    const overrides = getLocalOverrides(slug);
    if (isSupabaseConfigured()) {
      try {
        const live = await getStoreBySlugAction(slug);
        if (live) return applyOverridesToStore(live, overrides, slug);
      } catch (err) {
        console.warn("Supabase fetch fallback", err);
      }
    }
    const base = STORES_MAP[slug];
    if (!base) return null;
    return applyOverridesToStore(base, overrides, slug);
  },

  async isStoreAvailable(slug: string): Promise<boolean> {
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
    const overrides = getLocalOverrides(slug);
    overrides.restaurant = { ...(overrides.restaurant || {}), ...settings };
    saveLocalOverrides(slug, overrides);
    if (isSupabaseConfigured()) {
      await updateStoreSettingsAction(slug, settings);
    }
    const store = await this.getStore(slug);
    return store!.restaurant;
  },

  async toggleItemAvailability(slug: string, itemId: string, isAvailable: boolean): Promise<boolean> {
    const overrides = getLocalOverrides(slug);
    overrides.updatedItems = overrides.updatedItems || {};
    overrides.updatedItems[itemId] = { ...(overrides.updatedItems[itemId] || {}), is_available: isAvailable };
    saveLocalOverrides(slug, overrides);
    if (isSupabaseConfigured()) {
      await toggleItemAvailabilityAction(itemId, isAvailable);
    }
    return isAvailable;
  },

  async saveMenuItem(
    slug: string,
    itemData: Partial<MenuItem> & { name_ar: string; name_en: string; price: number; category_id: string }
  ): Promise<MenuItem> {
    const overrides = getLocalOverrides(slug);
    const isNew = !itemData.id;
    const id = itemData.id || `item_${Date.now()}`;
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

    if (isNew) {
      overrides.addedItems = [...(overrides.addedItems || []), fullItem];
    } else {
      overrides.updatedItems = overrides.updatedItems || {};
      overrides.updatedItems[id] = { ...(overrides.updatedItems[id] || {}), ...fullItem };
    }
    saveLocalOverrides(slug, overrides);

    if (isSupabaseConfigured()) {
      const store = await this.getStore(slug);
      if (store) await saveMenuItemAction(store.restaurant.id, fullItem);
    }
    return fullItem;
  },

  async deleteMenuItem(slug: string, itemId: string): Promise<boolean> {
    const overrides = getLocalOverrides(slug);
    overrides.deletedItemIds = Array.from(new Set([...(overrides.deletedItemIds || []), itemId]));
    if (overrides.addedItems) {
      overrides.addedItems = overrides.addedItems.filter((i) => i.id !== itemId);
    }
    saveLocalOverrides(slug, overrides);
    if (isSupabaseConfigured()) {
      await deleteMenuItemAction(itemId);
    }
    return true;
  },

  async saveCategory(slug: string, catData: { id?: string; name_ar: string; name_en: string }): Promise<Category> {
    const overrides = getLocalOverrides(slug);
    const isNew = !catData.id;
    const id = catData.id || `cat_${Date.now()}`;
    const fullCat: Category = {
      id,
      name_ar: catData.name_ar,
      name_en: catData.name_en,
      display_order: Date.now(),
      is_active: true,
    };
    if (isNew) {
      overrides.addedCategories = [...(overrides.addedCategories || []), fullCat];
    } else {
      overrides.updatedCategories = overrides.updatedCategories || {};
      overrides.updatedCategories[id] = { ...(overrides.updatedCategories[id] || {}), ...fullCat };
    }
    saveLocalOverrides(slug, overrides);
    if (isSupabaseConfigured()) {
      const store = await this.getStore(slug);
      if (store) await saveCategoryAction(store.restaurant.id, fullCat);
    }
    return fullCat;
  },

  async deleteCategory(slug: string, categoryId: string): Promise<boolean> {
    const overrides = getLocalOverrides(slug);
    overrides.deletedCategoryIds = Array.from(new Set([...(overrides.deletedCategoryIds || []), categoryId]));
    if (overrides.addedCategories) {
      overrides.addedCategories = overrides.addedCategories.filter((c) => c.id !== categoryId);
    }
    saveLocalOverrides(slug, overrides);
    if (isSupabaseConfigured()) {
      await deleteCategoryAction(categoryId);
    }
    return true;
  },

  async resetToDefaults(slug: string): Promise<void> {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(getStorageKey(slug));
      window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT, { detail: { slug } }));
    }
  },
};
