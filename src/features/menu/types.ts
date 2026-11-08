import { z } from "zod";
import { StoreScheduleConfigSchema, StoreScheduleConfig } from "@/features/schedule/types";

export const BusinessTypeSchema = z.enum(["restaurant", "cafe", "supermarket"]);
export type BusinessType = z.infer<typeof BusinessTypeSchema>;

export const StoreOrderTypeSchema = z.enum(["dine_in", "takeaway", "delivery"]);
export type StoreOrderType = z.infer<typeof StoreOrderTypeSchema>;

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
  id: z.string().min(1),
  slug: z.string().default("oriental-grill"),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  business_type: BusinessTypeSchema.default("restaurant"),
  description_ar: z.string().optional().default(""),
  description_en: z.string().optional().default(""),
  logo_url: z.string().url(),
  cover_url: z.string().url().optional(),
  phone_number: z.string().default("201012345678"),
  default_language: z.enum(["ar", "en"]).default("ar"),
  currency: z.literal("EGP").default("EGP"),
  supported_order_types: z.array(StoreOrderTypeSchema).default([
    "dine_in",
    "takeaway",
    "delivery",
  ]),
  delivery_fee: z.number().nonnegative().default(20),
  schedule: StoreScheduleConfigSchema.optional(),
});
export type Restaurant = z.infer<typeof RestaurantSchema>;
export type Store = Restaurant;

export const MenuItemSchema = z.object({
  id: z.string().min(1),
  category_id: z.string().min(1),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  short_desc_ar: z.string(),
  short_desc_en: z.string(),
  full_desc_ar: z.string(),
  full_desc_en: z.string(),
  price: z.number().nonnegative(),
  unit_ar: z.string().nullable().optional(),
  unit_en: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  display_order: z.number().int().default(0),
  is_available: z.boolean().default(true),
  badges: z.array(BadgeTypeSchema).default([]),
  allergens: z.array(AllergenTypeSchema).default([]),
});
export type MenuItem = z.infer<typeof MenuItemSchema>;

export const CategoryWithItemsSchema = z.object({
  id: z.string().min(1),
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
