# Contracts: Customer Digital Menu Service & Data Flow

**Feature**: `001-customer-menu-view`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Internal Service Contract: `menu-service.ts`

The customer menu view fetches full menu data via server-side execution (`src/features/menu/services/menu-service.ts`) using the Supabase client.

### Method: `getMenuData()`

- **Input**: None (or optional `restaurantId?: string`)
- **Execution Target**: Server-side Next.js Server Component or API route
- **Response Format**: `Promise<MenuData>`

#### Success Response Shape (`MenuData`)
```json
{
  "restaurant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name_ar": "مطعم النخيل",
    "name_en": "Al-Nakheel Restaurant",
    "logo_url": "https://xyz.supabase.co/storage/v1/object/public/menu-images/logo.webp",
    "default_language": "ar",
    "currency": "EGP"
  },
  "categories": [
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "name_ar": "المقبلات",
      "name_en": "Appetizers",
      "display_order": 1,
      "is_active": true,
      "items": [
        {
          "id": "8c599b82-9993-4a16-8334-a1db4855f410",
          "category_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          "name_ar": "حمص بالطحينة",
          "name_en": "Hummus with Tahini",
          "short_desc_ar": "حمص ناعم مع زيت زيتون بكر وطحينة سمسم",
          "short_desc_en": "Smooth chickpea dip with virgin olive oil and tahini",
          "full_desc_ar": "طبق حمص شامي تقليدي غني بالطحينة وزيت الزيتون البكر الممتاز، يقدم مع خبز بلدي ساخن.",
          "full_desc_en": "Traditional Levantine hummus made with creamy tahini and extra virgin olive oil, served with warm bread.",
          "price": 65.00,
          "image_url": "https://xyz.supabase.co/storage/v1/object/public/menu-images/hummus.webp",
          "display_order": 1,
          "is_available": true,
          "calories": 280,
          "badges": ["vegetarian"],
          "allergens": ["soy"]
        }
      ]
    }
  ]
}
```

#### Error Handling
- If Supabase query fails (network error, database unreachable): throws `MenuFetchError`.
- Component handles it by rendering `src/components/ui/error-state.tsx` with a retry trigger.

---

## 2. Client-Side Hash Contract: Item Detail Modal

### URL Hash Pattern
- **Format**: `https://<domain>/[locale]/menu#item-<menu_item_id>`
- **Example**: `https://menu.example.com/ar/menu#item-8c599b82-9993-4a16-8334-a1db4855f410`

### Behavior
- **Opening**: Clicking an item card sets `window.location.hash = 'item-' + item.id`.
- **Displaying**: Component parses hash, matches against pre-loaded items, and renders modal.
- **Closing**: Clicking Close or Backdrop performs `history.back()` (or clears hash), closing the modal without reloading.
- **Direct Link**: Navigating directly to a URL containing `#item-<id>` opens the modal automatically once items are mounted.

