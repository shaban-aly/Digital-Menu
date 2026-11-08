import { z } from "zod";

export const BadgeTypeSchema = z.enum(["spicy", "vegetarian", "best_seller"]);
export type BadgeType = z.infer<typeof BadgeTypeSchema>;

export const AllergenTypeSchema = z.enum([
  "nuts",
  "dairy",
  "gluten",
  "eggs",
  "soy",
  "shellfish",
  "wheat",
]);
export type AllergenType = z.infer<typeof AllergenTypeSchema>;

export const RestaurantSchema = z.object({
  id: z.string().uuid(),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  logo_url: z.string().url(),
  default_language: z.enum(["ar", "en"]).default("ar"),
  currency: z.literal("EGP").default("EGP"),
});
export type Restaurant = z.infer<typeof RestaurantSchema>;

export const MenuItemSchema = z.object({
  id: z.string().uuid(),
  category_id: z.string().uuid(),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  short_desc_ar: z.string(),
  short_desc_en: z.string(),
  full_desc_ar: z.string(),
  full_desc_en: z.string(),
  price: z.number().nonnegative(),
  image_url: z.string().url().nullable().optional(),
  display_order: z.number().int().default(0),
  is_available: z.boolean().default(true),
  calories: z.number().int().nonnegative().nullable().optional(),
  badges: z.array(BadgeTypeSchema).default([]),
  allergens: z.array(AllergenTypeSchema).default([]),
});
export type MenuItem = z.infer<typeof MenuItemSchema>;

export const CategoryWithItemsSchema = z.object({
  id: z.string().uuid(),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  display_order: z.number().int(),
  is_active: z.boolean(),
  items: z.array(MenuItemSchema),
});
export type CategoryWithItems = z.infer<typeof CategoryWithItemsSchema>;

export const MenuDataSchema = z.object({
  restaurant: RestaurantSchema,
  categories: z.array(CategoryWithItemsSchema),
});
export type MenuData = z.infer<typeof MenuDataSchema>;

export type Locale = "ar" | "en";

