import { MenuData, Restaurant, MenuItem } from "@/features/menu/types";
import { STORES_MAP } from "@/features/menu/services/mock-menu-data";
import { StoreSettings, Category, StoreOverrideState } from "@/features/admin/types";
import { getStoreMeta } from "@/features/admin/services/store-meta-storage";

export const STORE_UPDATED_EVENT = "digital_menu_store_updated";
export const getStorageKey = (slug: string) => `store_override_${slug}`;

/** @deprecated Replaced by Supabase SQL Engine */
export const getLocalOverrides = (_slug: string): StoreOverrideState => ({});
/** @deprecated Replaced by Supabase SQL Engine */
export const saveLocalOverrides = (_slug: string, _overrides: StoreOverrideState): void => {};
/** @deprecated Replaced by Supabase SQL Engine */
export const applyOverridesToStore = (base: MenuData): MenuData => base;

const fallbackStores = new Map<string, MenuData>();

export function getFallbackStore(slug: string): MenuData | null {
  if (!fallbackStores.has(slug)) {
    const base = STORES_MAP[slug];
    if (!base) return null;
    fallbackStores.set(slug, JSON.parse(JSON.stringify(base)));
  }
  const store = fallbackStores.get(slug)!;
  const meta = getStoreMeta(slug);
  store.restaurant.plan = meta.plan;
  store.restaurant.is_active = meta.is_active;
  return store;
}

export function resetFallbackStore(slug: string): void {
  fallbackStores.delete(slug);
}

export function fallbackSaveMenuItem(
  slug: string,
  itemData: Partial<MenuItem> & { name_ar: string; name_en: string; price: number; category_id: string }
): MenuItem {
  const store = getFallbackStore(slug);
  if (!store) throw new Error(`Store ${slug} not found`);
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
  const cat = store.categories.find((c) => c.id === itemData.category_id);
  if (cat) {
    const idx = cat.items.findIndex((i) => i.id === id);
    if (idx >= 0) cat.items[idx] = { ...cat.items[idx], ...fullItem };
    else cat.items.push(fullItem);
  }
  return fullItem;
}

export function fallbackToggleAvailability(slug: string, itemId: string, isAvailable: boolean): boolean {
  const store = getFallbackStore(slug);
  if (store) {
    for (const cat of store.categories) {
      const item = cat.items.find((i) => i.id === itemId);
      if (item) { item.is_available = isAvailable; break; }
    }
  }
  return isAvailable;
}

export function fallbackDeleteMenuItem(slug: string, itemId: string): boolean {
  const store = getFallbackStore(slug);
  if (store) {
    for (const cat of store.categories) {
      cat.items = cat.items.filter((i) => i.id !== itemId);
    }
  }
  return true;
}

export function fallbackSaveCategory(
  slug: string,
  catData: { id?: string; name_ar: string; name_en: string; display_order?: number }
): Category {
  const store = getFallbackStore(slug);
  if (!store) throw new Error(`Store ${slug} not found`);
  const id = catData.id || `cat_${Date.now()}`;
  const fullCat: Category = {
    id,
    name_ar: catData.name_ar,
    name_en: catData.name_en,
    display_order: catData.display_order ?? store.categories.length + 1,
    is_active: true,
  };
  const idx = store.categories.findIndex((c) => c.id === id);
  if (idx >= 0) store.categories[idx] = { ...store.categories[idx], ...fullCat };
  else store.categories.push({ ...fullCat, items: [] });
  return fullCat;
}

export function fallbackDeleteCategory(slug: string, categoryId: string): boolean {
  const store = getFallbackStore(slug);
  if (store) {
    store.categories = store.categories.filter((c) => c.id !== categoryId);
  }
  return true;
}

export function fallbackUpdateSettings(slug: string, settings: Partial<StoreSettings>): Restaurant {
  const store = getFallbackStore(slug);
  if (!store) throw new Error(`Store ${slug} not found`);
  store.restaurant = { ...store.restaurant, ...settings };
  return store.restaurant;
}
