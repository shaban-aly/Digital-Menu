import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MenuItem } from "@/features/menu/types";
import { StoreSettings } from "@/features/admin/types";
import { Database } from "@/lib/supabase/types";

export async function syncStoreSettingsToSupabase(
  slug: string,
  settings: Partial<StoreSettings>
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const updatePayload: Partial<Database["public"]["Tables"]["stores"]["Update"]> = {};
    if (settings.name_ar !== undefined) updatePayload.name_ar = settings.name_ar;
    if (settings.name_en !== undefined) updatePayload.name_en = settings.name_en;
    if (settings.description_ar !== undefined) updatePayload.description_ar = settings.description_ar;
    if (settings.description_en !== undefined) updatePayload.description_en = settings.description_en;
    if (settings.phone_number !== undefined) updatePayload.phone_number = settings.phone_number;
    if (settings.delivery_fee !== undefined) updatePayload.delivery_fee = settings.delivery_fee;
    if (settings.currency !== undefined) updatePayload.currency = settings.currency;
    if (settings.logo_url !== undefined) updatePayload.logo_url = settings.logo_url;
    if (settings.cover_url !== undefined) updatePayload.cover_url = settings.cover_url;
    if (Object.keys(updatePayload).length > 0) {
      await supabase.from("stores").update(updatePayload).eq("slug", slug);
    }
  } catch (e) {
    console.warn("Failed syncing store settings to Supabase", e);
  }
}

export async function syncProductToSupabase(
  storeId: string,
  item: MenuItem
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("products").upsert({
      id: item.id,
      store_id: storeId,
      category_id: item.category_id,
      name_ar: item.name_ar,
      name_en: item.name_en,
      short_desc_ar: item.short_desc_ar || null,
      short_desc_en: item.short_desc_en || null,
      price: item.price,
      unit_ar: item.unit_ar ?? null,
      unit_en: item.unit_en ?? null,
      image_url: item.image_url ?? null,
      display_order: item.display_order ?? 0,
      is_available: item.is_available ?? true,
    });
  } catch (e) {
    console.warn("Failed syncing product to Supabase", e);
  }
}

export async function syncProductAvailabilityToSupabase(
  itemId: string,
  isAvailable: boolean
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("products").update({ is_available: isAvailable }).eq("id", itemId);
  } catch (e) {
    console.warn("Failed updating item in Supabase", e);
  }
}

export async function deleteProductFromSupabase(itemId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("products").delete().eq("id", itemId);
  } catch (e) {
    console.warn("Failed deleting product from Supabase", e);
  }
}

export async function syncCategoryToSupabase(
  storeId: string,
  category: { id: string; name_ar: string; name_en: string; display_order?: number }
): Promise<void> {
  if (!isSupabaseConfigured()) return;
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
}

export async function deleteCategoryFromSupabase(categoryId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("categories").delete().eq("id", categoryId);
  } catch (e) {
    console.warn("Failed deleting category from Supabase", e);
  }
}
