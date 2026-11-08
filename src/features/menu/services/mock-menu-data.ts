import { MenuData, Restaurant, MenuItem, CategoryWithItems } from "@/features/menu/types";
import { StoreScheduleConfig } from "@/features/schedule/types";

function defaultSchedule(): StoreScheduleConfig {
  return {
    timezone: "Africa/Cairo",
    allow_preorders: true,
    is_manually_paused: false,
    pause_note_ar: "",
    pause_note_en: "",
    weekly_schedule: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
      day,
      is_enabled: true,
      open_time: "10:00",
      close_time: "23:00",
    })),
  };
}

function makeItem(
  id: string,
  category_id: string,
  name_ar: string,
  name_en: string,
  price: number,
  img: string,
  opts?: { unit_ar?: string; unit_en?: string; badges?: ("best_seller" | "vegetarian")[]; allergens?: ("gluten" | "dairy")[] }
): MenuItem {
  return {
    id,
    category_id,
    name_ar,
    name_en,
    short_desc_ar: `${name_ar} طازج ولذيذ`,
    short_desc_en: `Fresh and delicious ${name_en}`,
    full_desc_ar: `${name_ar} محضّر بعناية فائقة من أجود المكونات الطبيعية.`,
    full_desc_en: `${name_en} prepared with high-quality fresh ingredients.`,
    price,
    unit_ar: opts?.unit_ar ?? null,
    unit_en: opts?.unit_en ?? null,
    image_url: img,
    display_order: 1,
    is_available: true,
    badges: opts?.badges || [],
    allergens: opts?.allergens || [],
  };
}

function makeCat(id: string, name_ar: string, name_en: string, order: number, items: MenuItem[]): CategoryWithItems {
  return { id, name_ar, name_en, display_order: order, is_active: true, items };
}

const ORIENTAL_GRILL_DATA: MenuData = {
  restaurant: {
    id: "11111111-0000-0000-0000-000000000001",
    slug: "oriental-grill",
    name_ar: "مطعم مشويات البركة",
    name_en: "Al-Baraka Oriental Grill",
    business_type: "restaurant",
    description_ar: "أشهى المشويات الشرقية والطواجن",
    description_en: "Authentic charcoal grill and dishes",
    logo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&fit=crop&q=80",
    phone_number: "201012345678",
    default_language: "ar",
    currency: "EGP",
    supported_order_types: ["dine_in", "takeaway", "delivery"],
    delivery_fee: 25,
    schedule: defaultSchedule(),
  },
  categories: [
    makeCat("c1111111-0000-0000-0000-000000000001", "المقبلات والشوربة", "Appetizers & Soups", 1, [
      makeItem("p1111111-0000-0000-0000-000000000001", "c1111111-0000-0000-0000-000000000001", "شوربة لسان عصفور بالمستكة", "Orzo Soup with Mastic", 55, "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&fit=crop&q=80", { unit_ar: "طبق", unit_en: "Bowl", badges: ["best_seller"], allergens: ["gluten"] }),
    ]),
    makeCat("c1111111-0000-0000-0000-000000000002", "مشويات على الفحم", "Charcoal Grills", 2, [
      makeItem("p1111111-0000-0000-0000-000000000002", "c1111111-0000-0000-0000-000000000002", "كباب وكفتة مشكل", "Mixed Kebab & Kofta", 280, "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&fit=crop&q=80", { unit_ar: "طبق", unit_en: "Platter", badges: ["best_seller"] }),
    ]),
  ],
};

const SPECIALTY_CAFE_DATA: MenuData = {
  restaurant: {
    id: "22222222-0000-0000-0000-000000000002",
    slug: "specialty-cafe",
    name_ar: "كافيه ومخبوزات أروما",
    name_en: "Aroma Specialty Cafe",
    business_type: "cafe",
    description_ar: "محمصة قهوة ومخبوزات طازجة",
    description_en: "Specialty coffee and fresh pastries",
    logo_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&fit=crop&q=80",
    phone_number: "201098765432",
    default_language: "ar",
    currency: "EGP",
    supported_order_types: ["dine_in", "takeaway"],
    delivery_fee: 15,
    schedule: defaultSchedule(),
  },
  categories: [
    makeCat("c2222222-0000-0000-0000-000000000001", "القهوة المختصة", "Specialty Coffee", 1, [
      makeItem("p2222222-0000-0000-0000-000000000001", "c2222222-0000-0000-0000-000000000001", "فلات وايت", "Flat White", 75, "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&fit=crop&q=80", { unit_ar: "كوب 250 مل", unit_en: "Cup 250ml", allergens: ["dairy"] }),
    ]),
    makeCat("c2222222-0000-0000-0000-000000000002", "مخبوزات طازجة", "Fresh Pastries", 2, [
      makeItem("p2222222-0000-0000-0000-000000000002", "c2222222-0000-0000-0000-000000000002", "كرواسون زبدة فرنسي", "French Butter Croissant", 60, "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&fit=crop&q=80", { unit_ar: "قطعة", unit_en: "Piece", allergens: ["gluten", "dairy"] }),
    ]),
  ],
};

const FRESH_MARKET_DATA: MenuData = {
  restaurant: {
    id: "33333333-0000-0000-0000-000000000003",
    slug: "fresh-market",
    name_ar: "سوبر ماركت فريش ماركت",
    name_en: "Fresh Market Supermarket",
    business_type: "supermarket",
    description_ar: "خضروات وفواكه طازجة يومياً",
    description_en: "Daily fresh farm produce and goods",
    logo_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&fit=crop&q=80",
    phone_number: "201011223344",
    default_language: "ar",
    currency: "EGP",
    supported_order_types: ["takeaway", "delivery"],
    delivery_fee: 20,
    schedule: defaultSchedule(),
  },
  categories: [
    makeCat("c3333333-0000-0000-0000-000000000001", "الخضروات والفواكه", "Fresh Produce", 1, [
      makeItem("p3333333-0000-0000-0000-000000000001", "c3333333-0000-0000-0000-000000000001", "طماطم بلدي فرز أول طازجة", "Fresh Local Tomatoes (Grade A)", 22, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&fit=crop&q=80", { unit_ar: "1 كجم", unit_en: "1 kg", badges: ["vegetarian"] }),
    ]),
    makeCat("c3333333-0000-0000-0000-000000000002", "الألبان والأجبان", "Dairy & Cheese", 2, [
      makeItem("p3333333-0000-0000-0000-000000000002", "c3333333-0000-0000-0000-000000000002", "جبنة فيتا طبيعية (500 جم)", "Fresh Feta Cheese (500g)", 85, "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=600&fit=crop&q=80", { unit_ar: "500 جم", unit_en: "500g", allergens: ["dairy"] }),
    ]),
  ],
};

export const STORES_MAP: Record<string, MenuData> = {
  "oriental-grill": ORIENTAL_GRILL_DATA,
  "specialty-cafe": SPECIALTY_CAFE_DATA,
  "fresh-market": FRESH_MARKET_DATA,
};

export const MOCK_MENU_DATA: MenuData = ORIENTAL_GRILL_DATA;

export function getMockStoreBySlug(slug: string): MenuData | null {
  return STORES_MAP[slug] || null;
}

export function getAllMockStores(): Restaurant[] {
  return Object.values(STORES_MAP).map((data) => data.restaurant);
}
