import { supabase } from "@/lib/supabase/client";
import {
  MenuData,
  MenuDataSchema,
  CategoryWithItems,
} from "@/features/menu/types";
import { MOCK_MENU_DATA } from "./mock-menu-data";

export async function getMenuData(): Promise<MenuData> {
  try {
    const isMockMode =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isMockMode) {
      return MOCK_MENU_DATA;
    }

    const { data: restaurants, error: restErr } = await supabase
      .from("restaurants")
      .select("*")
      .limit(1)
      .single();

    if (restErr || !restaurants) {
      return MOCK_MENU_DATA;
    }

    const { data: categories, error: catErr } = await supabase
      .from("categories")
      .select("*, menu_items(*)")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (catErr || !categories || categories.length === 0) {
      return MOCK_MENU_DATA;
    }

    const formattedCategories: CategoryWithItems[] = categories.map((cat) => ({
      id: cat.id,
      name_ar: cat.name_ar,
      name_en: cat.name_en,
      display_order: cat.display_order,
      is_active: cat.is_active,
      items: (cat.menu_items || []).sort(
        (a: { display_order: number }, b: { display_order: number }) =>
          a.display_order - b.display_order
      ),
    }));

    const result = {
      restaurant: restaurants,
      categories: formattedCategories,
    };

    return MenuDataSchema.parse(result);
  } catch (err) {
    console.warn("Failed fetching from Supabase, using mock menu data", err);
    return MOCK_MENU_DATA;
  }
}
