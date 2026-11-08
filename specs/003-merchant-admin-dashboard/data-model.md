# Data Model: Merchant Admin Dashboard

**Feature**: `003-merchant-admin-dashboard`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Entities & Zod Validation Schemas

### 1.1 StoreSettings
Represents the business profile, fulfillment rules, and contact information.

```typescript
import { z } from "zod";
import { OrderTypeSchema } from "@/features/cart/types";

export const StoreSettingsSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name_ar: z.string().min(2, "اسم المتجر بالعربية مطلوب"),
  name_en: z.string().min(2, "English store name is required"),
  description_ar: z.string().optional().default(""),
  description_en: z.string().optional().default(""),
  phone: z.string().min(7, "رقم هاتف الواتساب يجب ألا يقل عن 7 أرقام"),
  supportedOrderTypes: z.array(OrderTypeSchema).min(1, "يجب تفعيل نوع طلب واحد على الأقل"),
  deliveryFee: z.number().nonnegative("رسوم التوصيل يجب أن تكون صفر أو أكثر").default(0),
  currency: z.string().default("EGP"),
  logoUrl: z.string().url().nullable().optional(),
  coverUrl: z.string().url().nullable().optional(),
});

export type StoreSettings = z.infer<typeof StoreSettingsSchema>;
```

---

### 1.2 Category
Represents a grouping of products within a store.

```typescript
export const CategorySchema = z.object({
  id: z.string().min(1),
  storeSlug: z.string().min(1),
  name_ar: z.string().min(2, "اسم القسم بالعربية مطلوب"),
  name_en: z.string().min(2, "English category name is required"),
  sortOrder: z.number().int().default(0),
  icon: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
```

---

### 1.3 AdminMenuItem
Extends the customer MenuItem with administrative controls and mutations.

```typescript
export const AdminMenuItemSchema = z.object({
  id: z.string().min(1),
  storeSlug: z.string().min(1),
  categoryId: z.string().min(1, "يجب تحديد قسم للصنف"),
  name_ar: z.string().min(2, "اسم الصنف بالعربية مطلوب"),
  name_en: z.string().min(2, "English item name is required"),
  description_ar: z.string().optional().default(""),
  description_en: z.string().optional().default(""),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  unit_ar: z.string().nullable().optional(),
  unit_en: z.string().nullable().optional(),
  image_url: z.string().url("رابط الصورة غير صالح").nullable().optional(),
  is_available: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type AdminMenuItem = z.infer<typeof AdminMenuItemSchema>;
```

---

### 1.4 StoreQRConfig
Configuration for generating venue QR codes and printable tent cards.

```typescript
export const StoreQRConfigSchema = z.object({
  storeSlug: z.string().min(1),
  targetUrl: z.string().url(),
  wifiSsid: z.string().max(50).optional().default(""),
  wifiPassword: z.string().max(50).optional().default(""),
  venueNotes_ar: z.string().max(100).optional().default("امسح الرمز لتصفح المنيو والطلب عبر واتساب"),
  venueNotes_en: z.string().max(100).optional().default("Scan QR to browse menu & order via WhatsApp"),
});

export type StoreQRConfig = z.infer<typeof StoreQRConfigSchema>;
```

---

## 2. State Storage Representation (Local Override Model)

In the mock phase, modifications are persisted in `localStorage` under keys `store_override_<slug>`:

```typescript
export interface StoreOverrideState {
  settings?: Partial<StoreSettings>;
  categories?: Category[];
  items?: AdminMenuItem[];
  deletedItemIds?: string[];
  deletedCategoryIds?: string[];
  qrConfig?: Partial<StoreQRConfig>;
}
```

This ensures that:
- Any new items added by the merchant appear in both the admin and customer menu.
- Any items modified (price, availability, name) override the initial mock item.
- Any items deleted by the merchant are excluded from both views.
- Resetting to defaults can easily clear this override key.
