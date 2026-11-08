import { z } from "zod";
import { StoreOrderTypeSchema, MenuItem, CategoryWithItems, Restaurant } from "@/features/menu/types";
import { StoreScheduleConfigSchema } from "@/features/schedule/types";

export const StoreSettingsSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name_ar: z.string().min(2, "اسم المتجر بالعربية مطلوب"),
  name_en: z.string().min(2, "English store name is required"),
  description_ar: z.string().optional().default(""),
  description_en: z.string().optional().default(""),
  phone_number: z.string().min(7, "رقم هاتف الواتساب يجب ألا يقل عن 7 أرقام"),
  supported_order_types: z.array(StoreOrderTypeSchema).min(1, "يجب تفعيل نوع طلب واحد على الأقل"),
  delivery_fee: z.number().nonnegative("رسوم التوصيل يجب أن تكون صفر أو أكثر").default(0),
  currency: z.literal("EGP").default("EGP"),
  logo_url: z.string().url().optional(),
  cover_url: z.string().url().optional(),
  schedule: StoreScheduleConfigSchema.optional(),
});
export type StoreSettings = z.infer<typeof StoreSettingsSchema>;

export const CategorySchema = z.object({
  id: z.string().min(1),
  name_ar: z.string().min(2, "اسم القسم بالعربية مطلوب"),
  name_en: z.string().min(2, "English category name is required"),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});
export type Category = z.infer<typeof CategorySchema>;

export const AdminMenuItemSchema = z.object({
  id: z.string().min(1),
  category_id: z.string().min(1, "يجب تحديد قسم للصنف"),
  name_ar: z.string().min(2, "اسم الصنف بالعربية مطلوب"),
  name_en: z.string().min(2, "English item name is required"),
  short_desc_ar: z.string().optional().default(""),
  short_desc_en: z.string().optional().default(""),
  full_desc_ar: z.string().optional().default(""),
  full_desc_en: z.string().optional().default(""),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  unit_ar: z.string().nullable().optional(),
  unit_en: z.string().nullable().optional(),
  image_url: z.string().url("رابط الصورة غير صالح").nullable().optional(),
  is_available: z.boolean().default(true),
  display_order: z.number().int().default(0),
});
export type AdminMenuItem = z.infer<typeof AdminMenuItemSchema>;

export const StoreQRConfigSchema = z.object({
  storeSlug: z.string().min(1),
  targetUrl: z.string().url(),
  wifiSsid: z.string().max(50).optional().default(""),
  wifiPassword: z.string().max(50).optional().default(""),
  venueNotes_ar: z.string().max(100).optional().default("امسح الرمز لتصفح المنيو والطلب عبر واتساب"),
  venueNotes_en: z.string().max(100).optional().default("Scan QR to browse menu & order via WhatsApp"),
});
export type StoreQRConfig = z.infer<typeof StoreQRConfigSchema>;

export interface StoreOverrideState {
  restaurant?: Partial<Restaurant>;
  addedCategories?: Category[];
  updatedCategories?: Record<string, Partial<Category>>;
  deletedCategoryIds?: string[];
  addedItems?: MenuItem[];
  updatedItems?: Record<string, Partial<MenuItem>>;
  deletedItemIds?: string[];
  qrConfig?: Partial<StoreQRConfig>;
}

export type AdminActiveTab = "items" | "categories" | "settings" | "qr";

export type SuperAdminPlanKey = "free" | "pro_monthly" | "pro_yearly" | "enterprise";

export interface SuperAdminStoreSummary {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  business_type: string;
  phone_number: string;
  plan: SuperAdminPlanKey;
  is_active: boolean;
  productsCount: number;
  categoriesCount: number;
}

export interface PlatformKPIs {
  totalStores: number;
  activeStores: number;
  planBreakdown: {
    free: number;
    pro: number;
    enterprise: number;
  };
  totalProducts: number;
}
