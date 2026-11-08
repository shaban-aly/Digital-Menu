import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { MenuData, Restaurant, MenuItem, CategoryWithItems } from "@/features/menu/types";

const FALLBACK_LOGO =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop";

export async function fetchStoreFromSupabase(slug: string): Promise<MenuData | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data: store, error: sErr } = await supabase
      .from("stores").select("*").eq("slug", slug).maybeSingle();
    if (sErr || !store) return null;

    const { data: cats, error: cErr } = await supabase
      .from("categories").select("*").eq("store_id", store.id).order("display_order", { ascending: true });
    if (cErr) return null;

    const { data: prods, error: pErr } = await supabase
      .from("products").select("*").eq("store_id", store.id).order("display_order", { ascending: true });
    if (pErr) return null;

    const categories: CategoryWithItems[] = (cats || []).map((c) => ({
      id: c.id,
      name_ar: c.name_ar,
      name_en: c.name_en,
      display_order: c.display_order,
      is_active: c.is_active,
      items: (prods || [])
        .filter((p) => p.category_id === c.id)
        .map((p): MenuItem => ({
          id: p.id,
          category_id: p.category_id,
          name_ar: p.name_ar,
          name_en: p.name_en,
          short_desc_ar: p.short_desc_ar || "",
          short_desc_en: p.short_desc_en || "",
          full_desc_ar: p.short_desc_ar || "",
          full_desc_en: p.short_desc_en || "",
          price: Number(p.price) || 0,
          unit_ar: p.unit_ar ?? null,
          unit_en: p.unit_en ?? null,
          image_url: p.image_url ?? null,
          display_order: p.display_order ?? 0,
          is_available: p.is_available ?? true,
          badges: [],
          allergens: [],
        })),
    }));

    const restaurant: Restaurant = {
      id: store.id,
      slug: store.slug,
      name_ar: store.name_ar,
      name_en: store.name_en,
      business_type: store.business_type,
      description_ar: store.description_ar || "",
      description_en: store.description_en || "",
      logo_url: store.logo_url || FALLBACK_LOGO,
      cover_url: store.cover_url || undefined,
      phone_number: store.phone_number || "201012345678",
      default_language: store.default_language,
      currency: store.currency || "EGP",
      supported_order_types:
        store.business_type === "supermarket"
          ? ["delivery", "takeaway"]
          : ["dine_in", "takeaway", "delivery"],
      delivery_fee: Number(store.delivery_fee) || 0,
    };

    return { restaurant, categories };
  } catch (e) {
    console.warn("Supabase fetch error:", e);
    return null;
  }
}

export async function fetchAllStoresFromSupabase(): Promise<Restaurant[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("stores").select("*").eq("is_active", true);
    if (error || !data || data.length === 0) return null;

    return data.map((s): Restaurant => ({
      id: s.id,
      slug: s.slug,
      name_ar: s.name_ar,
      name_en: s.name_en,
      business_type: s.business_type,
      description_ar: s.description_ar || "",
      description_en: s.description_en || "",
      logo_url: s.logo_url || FALLBACK_LOGO,
      cover_url: s.cover_url || undefined,
      phone_number: s.phone_number || "201012345678",
      default_language: s.default_language,
      currency: s.currency || "EGP",
      supported_order_types:
        s.business_type === "supermarket"
          ? ["delivery", "takeaway"]
          : ["dine_in", "takeaway", "delivery"],
      delivery_fee: Number(s.delivery_fee) || 0,
    }));
  } catch {
    return null;
  }
}
