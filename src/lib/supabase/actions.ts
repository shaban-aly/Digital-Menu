import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";
import { MenuData, Restaurant, MenuItem } from "@/features/menu/types";
import { StoreSettings, Category } from "@/features/admin/types";
import { mapStoreToRestaurant, buildCategoriesWithItems } from "./action-mappers";

export async function getStoreBySlugAction(slug: string): Promise<MenuData | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data: store, error: sErr } = await supabase.from("stores").select("*").eq("slug", slug).maybeSingle();
    if (sErr || !store) return null;

    const { data: cats, error: cErr } = await supabase
      .from("categories").select("*").eq("store_id", store.id).order("display_order", { ascending: true });
    if (cErr) return null;

    const { data: prods, error: pErr } = await supabase
      .from("products").select("*").eq("store_id", store.id).order("display_order", { ascending: true });
    if (pErr) return null;

    return {
      restaurant: mapStoreToRestaurant(store),
      categories: buildCategoriesWithItems(cats || [], prods || []),
    };
  } catch (e) {
    console.warn("Supabase fetch error:", e);
    return null;
  }
}

export async function getAllStoresAction(): Promise<Restaurant[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("stores").select("*").eq("is_active", true);
    if (error || !data || data.length === 0) return null;
    return data.map(mapStoreToRestaurant);
  } catch {
    return null;
  }
}

export async function createStoreAction(
  storeData: Database["public"]["Tables"]["stores"]["Insert"]
): Promise<Restaurant | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("stores").insert(storeData).select("*").single();
    if (error || !data) return null;
    return mapStoreToRestaurant(data);
  } catch (e) {
    console.warn("Failed creating store in Supabase", e);
    return null;
  }
}

export async function updateStoreSettingsAction(slug: string, settings: Partial<StoreSettings>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload: Partial<Database["public"]["Tables"]["stores"]["Update"]> = {};
    if (settings.name_ar !== undefined) payload.name_ar = settings.name_ar;
    if (settings.name_en !== undefined) payload.name_en = settings.name_en;
    if (settings.description_ar !== undefined) payload.description_ar = settings.description_ar;
    if (settings.description_en !== undefined) payload.description_en = settings.description_en;
    if (settings.phone_number !== undefined) payload.phone_number = settings.phone_number;
    if (settings.delivery_fee !== undefined) payload.delivery_fee = settings.delivery_fee;
    if (settings.currency !== undefined) payload.currency = settings.currency;
    if (settings.logo_url !== undefined) payload.logo_url = settings.logo_url;
    if (settings.cover_url !== undefined) payload.cover_url = settings.cover_url;
    if (Object.keys(payload).length > 0) {
      await supabase.from("stores").update(payload).eq("slug", slug);
    }
    return true;
  } catch (e) {
    console.warn("Failed syncing store settings to Supabase", e);
    return false;
  }
}

export async function saveMenuItemAction(storeId: string, item: MenuItem): Promise<MenuItem> {
  if (!isSupabaseConfigured()) return item;
  try {
    await supabase.from("products").upsert({
      id: item.id,
      store_id: storeId,
      category_id: item.category_id,
      name_ar: item.name_ar,
      name_en: item.name_en,
      short_desc_ar: item.short_desc_ar || null,
      short_desc_en: item.short_desc_en || null,
      full_desc_ar: item.full_desc_ar || null,
      full_desc_en: item.full_desc_en || null,
      price: item.price,
      unit_ar: item.unit_ar ?? null,
      unit_en: item.unit_en ?? null,
      image_url: item.image_url ?? null,
      display_order: item.display_order ?? 0,
      is_available: item.is_available ?? true,
      badges: item.badges || [],
      allergens: item.allergens || [],
    });
  } catch (e) {
    console.warn("Failed syncing product to Supabase", e);
  }
  return item;
}

export async function toggleItemAvailabilityAction(itemId: string, isAvailable: boolean): Promise<boolean> {
  if (!isSupabaseConfigured()) return isAvailable;
  try {
    await supabase.from("products").update({ is_available: isAvailable }).eq("id", itemId);
  } catch (e) {
    console.warn("Failed updating item in Supabase", e);
  }
  return isAvailable;
}

export async function deleteMenuItemAction(itemId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    await supabase.from("products").delete().eq("id", itemId);
  } catch (e) {
    console.warn("Failed deleting product from Supabase", e);
  }
  return true;
}

export async function saveCategoryAction(
  storeId: string,
  category: { id: string; name_ar: string; name_en: string; display_order?: number }
): Promise<Category> {
  const result: Category = {
    id: category.id,
    name_ar: category.name_ar,
    name_en: category.name_en,
    display_order: category.display_order ?? 0,
    is_active: true,
  };
  if (!isSupabaseConfigured()) return result;
  try {
    await supabase.from("categories").upsert({
      id: category.id,
      store_id: storeId,
      name_ar: category.name_ar,
      name_en: category.name_en,
      display_order: category.display_order ?? 0,
      is_active: true,
    });
  } catch (e) {
    console.warn("Failed syncing category to Supabase", e);
  }
  return result;
}

export async function deleteCategoryAction(categoryId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  try {
    await supabase.from("categories").delete().eq("id", categoryId);
  } catch (e) {
    console.warn("Failed deleting category from Supabase", e);
  }
  return true;
}
