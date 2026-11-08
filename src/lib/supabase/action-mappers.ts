import { Database } from "@/lib/supabase/types";
import { Restaurant, MenuItem, CategoryWithItems, BadgeType, AllergenType } from "@/features/menu/types";

export const FALLBACK_LOGO =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop";

export function mapStoreToRestaurant(store: Database["public"]["Tables"]["stores"]["Row"]): Restaurant {
  return {
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
    plan: store.plan,
    is_active: store.is_active,
  };
}

export function mapProductToMenuItem(p: Database["public"]["Tables"]["products"]["Row"]): MenuItem {
  return {
    id: p.id,
    category_id: p.category_id,
    name_ar: p.name_ar,
    name_en: p.name_en,
    short_desc_ar: p.short_desc_ar || "",
    short_desc_en: p.short_desc_en || "",
    full_desc_ar: p.full_desc_ar || p.short_desc_ar || "",
    full_desc_en: p.full_desc_en || p.short_desc_en || "",
    price: Number(p.price) || 0,
    unit_ar: p.unit_ar ?? null,
    unit_en: p.unit_en ?? null,
    image_url: p.image_url ?? null,
    display_order: p.display_order ?? 0,
    is_available: p.is_available ?? true,
    badges: (p.badges as BadgeType[]) || [],
    allergens: (p.allergens as AllergenType[]) || [],
  };
}

export function buildCategoriesWithItems(
  cats: Database["public"]["Tables"]["categories"]["Row"][],
  prods: Database["public"]["Tables"]["products"]["Row"][]
): CategoryWithItems[] {
  return cats.map((c) => ({
    id: c.id,
    name_ar: c.name_ar,
    name_en: c.name_en,
    display_order: c.display_order,
    is_active: c.is_active,
    items: prods.filter((p) => p.category_id === c.id).map(mapProductToMenuItem),
  }));
}
