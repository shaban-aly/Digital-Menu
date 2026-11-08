import { describe, it, expect, beforeEach, vi } from "vitest";
import { StoreRepository } from "@/features/menu/services/store-repository";
import { getStoreBySlug } from "@/features/menu/services/menu-service";
import { generateWhatsAppLink } from "@/features/cart/services/whatsapp-service";
import * as supabaseClient from "@/lib/supabase/client";
import { WhatsAppOrderPayload } from "@/features/cart/types";

describe("menu-supabase-sync", () => {
  const localStoreMap: Record<string, string> = {};

  beforeEach(() => {
    vi.restoreAllMocks();
    for (const key in localStoreMap) delete localStoreMap[key];
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => localStoreMap[key] || null,
      setItem: (key: string, val: string) => { localStoreMap[key] = val; },
      removeItem: (key: string) => { delete localStoreMap[key]; },
    });
    vi.stubGlobal("window", {
      localStorage: globalThis.localStorage,
      dispatchEvent: vi.fn(),
    });
  });

  it("should query live store, categories, and products when Supabase is enabled", async () => {
    vi.spyOn(supabaseClient, "isSupabaseConfigured").mockReturnValue(true);

    const mockStore = {
      id: "store-uuid-001", slug: "live-mart", name_ar: "لايف مارت سوبر ماركت",
      name_en: "Live Mart Supermarket", business_type: "supermarket" as const,
      phone_number: "201199887766", delivery_fee: 35, currency: "EGP",
      default_language: "ar" as const, is_active: true, logo_url: "https://example.com/logo.png",
      cover_url: null, description_ar: "بقالة طازجة", description_en: "Fresh Grocery",
      owner_id: null, plan: "pro" as const, created_at: "", updated_at: "",
    };

    const mockCategory = {
      id: "cat-uuid-001",
      store_id: "store-uuid-001",
      name_ar: "الخضروات",
      name_en: "Vegetables",
      display_order: 1,
      is_active: true,
      created_at: "",
      updated_at: "",
    };

    const mockProduct = {
      id: "prod-uuid-001",
      store_id: "store-uuid-001",
      category_id: "cat-uuid-001",
      name_ar: "خيار بلدي",
      name_en: "Local Cucumbers",
      price: 20,
      unit_ar: "1 كجم",
      unit_en: "1 kg",
      is_available: true,
      display_order: 1,
      short_desc_ar: "طازج",
      short_desc_en: "Fresh",
      image_url: null,
      created_at: "",
      updated_at: "",
    };

    vi.spyOn(supabaseClient.supabase, "from").mockImplementation((table: string) => {
      if (table === "stores") {
        return {
          select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: mockStore, error: null }) }) }),
        } as unknown as ReturnType<typeof supabaseClient.supabase.from>;
      }
      const data = table === "categories" ? [mockCategory] : [mockProduct];
      return {
        select: () => ({ eq: () => ({ order: async () => ({ data, error: null }) }) }),
      } as unknown as ReturnType<typeof supabaseClient.supabase.from>;
    });

    const store = await getStoreBySlug("live-mart");
    expect(store).not.toBeNull();
    expect(store?.restaurant.slug).toBe("live-mart");
    expect(store?.restaurant.business_type).toBe("supermarket");
    expect(store?.restaurant.delivery_fee).toBe(35);
    expect(store?.restaurant.phone_number).toBe("201199887766");
    expect(store?.categories[0].name_ar).toBe("الخضروات");
    expect(store?.categories[0].items[0].unit_ar).toBe("1 كجم");
  });

  it("should gracefully fallback to local storage repository when Supabase is disabled", async () => {
    vi.spyOn(supabaseClient, "isSupabaseConfigured").mockReturnValue(false);

    const store = await getStoreBySlug("oriental-grill");
    expect(store).not.toBeNull();
    expect(store?.restaurant.slug).toBe("oriental-grill");
    expect(store?.categories.length).toBeGreaterThan(0);

    const nonExistent = await getStoreBySlug("non-existent");
    expect(nonExistent).toBeNull();
  });

  it("should immediately reflect merchant added categories and items in /menu/[slug]", async () => {
    vi.spyOn(supabaseClient, "isSupabaseConfigured").mockReturnValue(false);

    const initialStore = await getStoreBySlug("oriental-grill");
    const initialCatsCount = initialStore!.categories.length;

    const newCategory = await StoreRepository.saveCategory("oriental-grill", {
      name_ar: "أطباق الموسم",
      name_en: "Seasonal Specials",
    });

    expect(window.dispatchEvent).toHaveBeenCalled();

    const newItem = await StoreRepository.saveMenuItem("oriental-grill", {
      name_ar: "طاجن لحم بالبصل",
      name_en: "Meat Onion Tajin",
      price: 240,
      category_id: newCategory.id,
      unit_ar: "طاجن",
      unit_en: "casserole",
    });

    const updatedStore = await getStoreBySlug("oriental-grill");
    expect(updatedStore?.categories.length).toBe(initialCatsCount + 1);

    const foundCategory = updatedStore?.categories.find((c) => c.id === newCategory.id);
    expect(foundCategory).toBeDefined();
    expect(foundCategory?.items.some((i) => i.id === newItem.id)).toBe(true);
    expect(foundCategory?.items[0].unit_ar).toBe("طاجن");
  });

  it("should generate WhatsApp link with dynamic live store phone, currency, and custom units", () => {
    const payload: WhatsAppOrderPayload = {
      restaurantName: "سوبر ماركت الفاكهة",
      restaurantPhone: "201000000000",
      orderType: "delivery",
      customerName: "محمود",
      customerPhone: "01011223344",
      deliveryAddress: "الدقي، شارع مصدق",
      items: [
        {
          id: "item-kg-1",
          menuItemId: "item-kg-1",
          name_ar: "برتقال بلدي",
          name_en: "Fresh Oranges",
          price: 30,
          quantity: 3,
          unit_ar: "كجم",
          unit_en: "kg",
          itemNote: "",
          is_available: true,
        },
      ],
      itemsTotal: 90,
      deliveryFee: 10,
      totalPrice: 100,
      locale: "ar",
      currency: "EGP",
    };

    const link = generateWhatsAppLink(payload, {
      phone_number: "201599887766",
      delivery_fee: 25,
      currency: "EGP",
    });

    expect(link.startsWith("https://wa.me/201599887766?text=")).toBe(true);
    expect(decodeURIComponent(link)).toContain("3x برتقال بلدي (كجم)");
    expect(decodeURIComponent(link)).toContain("رسوم التوصيل");
    expect(decodeURIComponent(link)).toContain("الإجمالي النهائي");
    expect(decodeURIComponent(link)).toContain("ج.م");
  });
});
