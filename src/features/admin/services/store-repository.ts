import { MenuData, Restaurant, MenuItem, CategoryWithItems } from "@/features/menu/types";
import { STORES_MAP } from "@/features/menu/services/mock-menu-data";
import { StoreSettings, Category, StoreOverrideState } from "../types";
import { getStoreMeta } from "./store-meta-storage";

export const STORE_UPDATED_EVENT = "digital_menu_store_updated";
const getStorageKey = (slug: string) => `store_override_${slug}`;

export function getLocalOverrides(slug: string): StoreOverrideState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(getStorageKey(slug));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalOverrides(slug: string, overrides: StoreOverrideState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getStorageKey(slug), JSON.stringify(overrides));
    window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT, { detail: { slug } }));
  } catch (e) {
    console.error("Failed saving store overrides", e);
  }
}

export function applyOverridesToStore(base: MenuData, overrides: StoreOverrideState, slug?: string): MenuData {
  const meta = slug ? getStoreMeta(slug) : undefined;
  const restaurant: Restaurant = {
    ...base.restaurant,
    ...(overrides.restaurant || {}),
    ...(meta ? { plan: meta.plan, is_active: meta.is_active } : {}),
  };

  const delCats = new Set(overrides.deletedCategoryIds || []);
  const delItems = new Set(overrides.deletedItemIds || []);

  const categories: CategoryWithItems[] = base.categories
    .filter((cat) => !delCats.has(cat.id))
    .map((cat) => ({
      ...cat,
      ...(overrides.updatedCategories?.[cat.id] || {}),
      items: cat.items
        .filter((item) => !delItems.has(item.id))
        .map((it) => overrides.updatedItems?.[it.id] ? { ...it, ...overrides.updatedItems[it.id] } : it),
    }));

  if (overrides.addedCategories?.length) {
    for (const add of overrides.addedCategories) {
      if (!delCats.has(add.id) && !categories.some((c) => c.id === add.id)) {
        categories.push({ ...add, display_order: add.display_order ?? categories.length + 1, items: [] });
      }
    }
  }

  if (overrides.addedItems?.length) {
    for (const add of overrides.addedItems) {
      if (!delItems.has(add.id)) {
        const item = overrides.updatedItems?.[add.id] ? { ...add, ...overrides.updatedItems[add.id] } : add;
        const target = categories.find((c) => c.id === item.category_id);
        if (target && !target.items.some((i) => i.id === item.id)) {
          target.items.push(item);
        }
      }
    }
  }

  return { restaurant, categories };
}

export const StoreRepository = {
  async getStore(slug: string): Promise<MenuData | null> {
    const base = STORES_MAP[slug];
    if (!base) return null;
    return applyOverridesToStore(base, getLocalOverrides(slug), slug);
  },

  async isStoreAvailable(slug: string): Promise<boolean> {
    return getStoreMeta(slug).is_active;
  },

  async updateSettings(slug: string, settings: Partial<StoreSettings>): Promise<Restaurant> {
    const overrides = getLocalOverrides(slug);
    overrides.restaurant = { ...(overrides.restaurant || {}), ...settings };
    saveLocalOverrides(slug, overrides);
    const store = await this.getStore(slug);
    return store!.restaurant;
  },

  async toggleItemAvailability(slug: string, itemId: string, isAvailable: boolean): Promise<boolean> {
    const overrides = getLocalOverrides(slug);
    overrides.updatedItems = overrides.updatedItems || {};
    overrides.updatedItems[itemId] = { ...(overrides.updatedItems[itemId] || {}), is_available: isAvailable };
    saveLocalOverrides(slug, overrides);
    return isAvailable;
  },

  async saveMenuItem(slug: string, itemData: Partial<MenuItem> & { name_ar: string; name_en: string; price: number; category_id: string }): Promise<MenuItem> {
    const overrides = getLocalOverrides(slug);
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
    if (!itemData.id) {
      overrides.addedItems = [...(overrides.addedItems || []), fullItem];
    } else {
      overrides.updatedItems = overrides.updatedItems || {};
      overrides.updatedItems[id] = { ...(overrides.updatedItems[id] || {}), ...fullItem };
    }
    saveLocalOverrides(slug, overrides);
    return fullItem;
  },

  async deleteMenuItem(slug: string, itemId: string): Promise<boolean> {
    const overrides = getLocalOverrides(slug);
    overrides.deletedItemIds = Array.from(new Set([...(overrides.deletedItemIds || []), itemId]));
    if (overrides.addedItems) {
      overrides.addedItems = overrides.addedItems.filter((i) => i.id !== itemId);
    }
    saveLocalOverrides(slug, overrides);
    return true;
  },

  async saveCategory(slug: string, catData: { id?: string; name_ar: string; name_en: string }): Promise<Category> {
    const overrides = getLocalOverrides(slug);
    const id = catData.id || `cat_${Date.now()}`;
    const fullCat: Category = {
      id,
      name_ar: catData.name_ar,
      name_en: catData.name_en,
      display_order: Date.now(),
      is_active: true,
    };
    if (!catData.id) {
      overrides.addedCategories = [...(overrides.addedCategories || []), fullCat];
    } else {
      overrides.updatedCategories = overrides.updatedCategories || {};
      overrides.updatedCategories[id] = { ...(overrides.updatedCategories[id] || {}), ...fullCat };
    }
    saveLocalOverrides(slug, overrides);
    return fullCat;
  },

  async deleteCategory(slug: string, categoryId: string): Promise<boolean> {
    const overrides = getLocalOverrides(slug);
    overrides.deletedCategoryIds = Array.from(new Set([...(overrides.deletedCategoryIds || []), categoryId]));
    if (overrides.addedCategories) {
      overrides.addedCategories = overrides.addedCategories.filter((c) => c.id !== categoryId);
    }
    saveLocalOverrides(slug, overrides);
    return true;
  },

  async resetToDefaults(slug: string): Promise<void> {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(getStorageKey(slug));
      window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT, { detail: { slug } }));
    }
  },
};
