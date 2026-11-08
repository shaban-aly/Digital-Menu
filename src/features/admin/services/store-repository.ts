import { MenuData, Restaurant, MenuItem, CategoryWithItems } from "@/features/menu/types";
import { STORES_MAP } from "@/features/menu/services/mock-menu-data";
import { StoreSettings, Category, StoreQRConfig, StoreOverrideState } from "../types";

export const STORE_UPDATED_EVENT = "digital_menu_store_updated";

function getStorageKey(slug: string) {
  return `store_override_${slug}`;
}

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

export function applyOverridesToStore(base: MenuData, overrides: StoreOverrideState): MenuData {
  const restaurant: Restaurant = {
    ...base.restaurant,
    ...(overrides.restaurant || {}),
  };

  const deletedCatIds = new Set(overrides.deletedCategoryIds || []);
  const deletedItemIds = new Set(overrides.deletedItemIds || []);

  let categories: CategoryWithItems[] = base.categories
    .filter((cat) => !deletedCatIds.has(cat.id))
    .map((cat) => {
      const catOverride = overrides.updatedCategories?.[cat.id];
      const updatedCat: CategoryWithItems = {
        ...cat,
        ...(catOverride || {}),
        items: cat.items
          .filter((item) => !deletedItemIds.has(item.id))
          .map((item) => {
            const itemOverride = overrides.updatedItems?.[item.id];
            return itemOverride ? { ...item, ...itemOverride } : item;
          }),
      };
      return updatedCat;
    });

  if (overrides.addedCategories?.length) {
    for (const addedCat of overrides.addedCategories) {
      if (!deletedCatIds.has(addedCat.id) && !categories.some((c) => c.id === addedCat.id)) {
        categories.push({
          id: addedCat.id,
          name_ar: addedCat.name_ar,
          name_en: addedCat.name_en,
          display_order: addedCat.display_order ?? categories.length + 1,
          is_active: addedCat.is_active ?? true,
          items: [],
        });
      }
    }
  }

  if (overrides.addedItems?.length) {
    for (const addedItem of overrides.addedItems) {
      if (!deletedItemIds.has(addedItem.id)) {
        const itemOverride = overrides.updatedItems?.[addedItem.id];
        const finalItem = itemOverride ? { ...addedItem, ...itemOverride } : addedItem;
        const targetCat = categories.find((c) => c.id === finalItem.category_id);
        if (targetCat) {
          if (!targetCat.items.some((i) => i.id === finalItem.id)) {
            targetCat.items.push(finalItem);
          }
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
    const overrides = getLocalOverrides(slug);
    return applyOverridesToStore(base, overrides);
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

