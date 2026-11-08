import { MenuData, Restaurant, MenuItem, CategoryWithItems } from "@/features/menu/types";
import { StoreOverrideState } from "@/features/admin/types";
import { getStoreMeta } from "@/features/admin/services/store-meta-storage";

export const STORE_UPDATED_EVENT = "digital_menu_store_updated";
export const getStorageKey = (slug: string) => `store_override_${slug}`;

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

export function applyOverridesToStore(
  base: MenuData,
  overrides: StoreOverrideState,
  slug?: string
): MenuData {
  const meta = slug ? getStoreMeta(slug) : undefined;
  const restaurant: Restaurant = {
    ...base.restaurant,
    ...(overrides.restaurant || {}),
    ...(meta ? { plan: meta.plan, is_active: meta.is_active } : {}),
  };

  const deletedCatIds = new Set(overrides.deletedCategoryIds || []);
  const deletedItemIds = new Set(overrides.deletedItemIds || []);

  const categories: CategoryWithItems[] = base.categories
    .filter((cat) => !deletedCatIds.has(cat.id))
    .map((cat) => {
      const catOverride = overrides.updatedCategories?.[cat.id];
      const items = cat.items
        .filter((item) => !deletedItemIds.has(item.id))
        .map((item) => {
          const itemOverride = overrides.updatedItems?.[item.id];
          return itemOverride ? { ...item, ...itemOverride } : item;
        });

      return {
        ...cat,
        ...(catOverride || {}),
        items,
      };
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
        if (targetCat && !targetCat.items.some((i) => i.id === finalItem.id)) {
          targetCat.items.push(finalItem);
        }
      }
    }
  }

  return { restaurant, categories };
}
