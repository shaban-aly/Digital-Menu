# Data Model: Customer Digital Menu View

**Feature**: `001-customer-menu-view`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Database Schema (Supabase / PostgreSQL)

### 1.1 `restaurants`
Represents the restaurant tenant / establishment profile.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Unique restaurant ID |
| `name_ar` | `text` | NOT NULL | Arabic business name |
| `name_en` | `text` | NOT NULL | English business name |
| `logo_url` | `text` | NOT NULL | URL to logo asset |
| `default_language` | `text` | NOT NULL, DEFAULT `'ar'` | Default locale (`ar` or `en`) |
| `currency` | `text` | NOT NULL, DEFAULT `'EGP'` | Fixed ISO currency code |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Timestamp |

---

### 1.2 `categories`
Groups items into sequential sections (e.g., Beverages, Main Courses).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Unique category ID |
| `restaurant_id` | `uuid` | NOT NULL, References `restaurants(id)` ON DELETE CASCADE | Parent restaurant |
| `name_ar` | `text` | NOT NULL | Category name in Arabic |
| `name_en` | `text` | NOT NULL | Category name in English |
| `display_order` | `integer` | NOT NULL, DEFAULT 0 | Sorting sequence in UI |
| `is_active` | `boolean` | NOT NULL, DEFAULT true | Visible on menu if true |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Timestamp |

---

### 1.3 `menu_items`
Individual dishes, drinks, or desserts offered by the restaurant.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Unique menu item ID |
| `category_id` | `uuid` | NOT NULL, References `categories(id)` ON DELETE CASCADE | Associated category |
| `name_ar` | `text` | NOT NULL | Item title in Arabic |
| `name_en` | `text` | NOT NULL | Item title in English |
| `short_desc_ar`| `text` | NOT NULL | Short summary shown on card (Arabic) |
| `short_desc_en`| `text` | NOT NULL | Short summary shown on card (English) |
| `full_desc_ar` | `text` | NOT NULL | Full details for modal (Arabic) |
| `full_desc_en` | `text` | NOT NULL | Full details for modal (English) |
| `price` | `numeric(10, 2)`| NOT NULL, CHECK (`price >= 0`) | Price amount (in EGP) |
| `image_url` | `text` | NULLABLE | Supabase storage image URL |
| `display_order`| `integer` | NOT NULL, DEFAULT 0 | Ordering within category |
| `is_available` | `boolean` | NOT NULL, DEFAULT true | If false, card shows 'غير متاح' |
| `calories` | `integer` | NULLABLE, CHECK (`calories >= 0`)| Nutritional calories count |
| `badges` | `text[]` | NOT NULL, DEFAULT `'{}'` | Array of `spicy`, `vegetarian`, `best_seller` |
| `allergens` | `text[]` | NOT NULL, DEFAULT `'{}'` | Array of allergens (e.g., `nuts`, `gluten`, `dairy`) |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Timestamp |

---

## 2. Row Level Security (RLS) Policies

All tables allow public anonymous `SELECT` operations for active menu presentation:

```sql
-- Public Read Access for Menu Consumers
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on restaurants" ON restaurants FOR SELECT USING (true);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on active categories" ON categories FOR SELECT USING (is_active = true);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on menu items" ON menu_items FOR SELECT USING (true);
```

---

## 3. TypeScript Interfaces & Zod Schemas

Defined under `src/features/menu/types.ts`:

```typescript
import { z } from 'zod';

export const BadgeTypeSchema = z.enum(['spicy', 'vegetarian', 'best_seller']);
export type BadgeType = z.infer<typeof BadgeTypeSchema>;

export const AllergenTypeSchema = z.enum([
  'nuts',
  'dairy',
  'gluten',
  'eggs',
  'soy',
  'shellfish',
  'wheat',
]);
export type AllergenType = z.infer<typeof AllergenTypeSchema>;

export const RestaurantSchema = z.object({
  id: z.string().uuid(),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  logo_url: z.string().url(),
  default_language: z.enum(['ar', 'en']).default('ar'),
  currency: z.literal('EGP').default('EGP'),
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
```

