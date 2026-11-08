# Data Model: Cart & WhatsApp Ordering

**Feature**: `002-cart-whatsapp-ordering`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Client Cart Entities & TypeScript Interfaces

All models and validation schemas reside in `src/features/cart/types.ts`.

### 1.1 `OrderType`
Distinguishes between on-premise dining and takeaway orders.

```typescript
import { z } from "zod";

export const OrderTypeSchema = z.enum(["dine_in", "takeaway"]);
export type OrderType = z.infer<typeof OrderTypeSchema>;
```

---

### 1.2 `CartItem`
Represents an individual item added to the customer's cart.

```typescript
export const CartItemSchema = z.object({
  id: z.string().min(1),
  menuItemId: z.string().min(1),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().min(1).max(99),
  itemNote: z.string().max(150).optional().default(""),
  image_url: z.string().url().nullable().optional(),
  is_available: z.boolean().default(true),
});

export type CartItem = z.infer<typeof CartItemSchema>;
```

---

### 1.3 `CartState`
The complete representation of the client's shopping basket.

```typescript
export const CartStateSchema = z.object({
  items: z.array(CartItemSchema).default([]),
  orderType: OrderTypeSchema.default("dine_in"),
  tableNumber: z.string().max(10).default(""),
  customerName: z.string().max(50).optional().default(""),
  generalNote: z.string().max(200).optional().default(""),
});

export type CartState = z.infer<typeof CartStateSchema>;
```

---

### 1.4 `WhatsAppOrderPayload`
The input data structure required to generate the final WhatsApp text message.

```typescript
export const WhatsAppOrderPayloadSchema = z.object({
  restaurantName: z.string().min(1),
  restaurantPhone: z.string().min(7), // e.g. "201001234567"
  orderType: OrderTypeSchema,
  tableNumber: z.string().max(10),
  customerName: z.string().max(50).optional(),
  generalNote: z.string().max(200).optional(),
  items: z.array(CartItemSchema).min(1),
  totalPrice: z.number().nonnegative(),
  locale: z.enum(["ar", "en"]),
});

export type WhatsAppOrderPayload = z.infer<typeof WhatsAppOrderPayloadSchema>;
```

---

## 2. Local Storage Persistence Schema

Cart data is stored under the key `digital_menu_cart_v1`:

```json
{
  "items": [
    {
      "id": "item-201",
      "menuItemId": "item-201",
      "name_ar": "كباب وكفتة مشوية على الفحم",
      "name_en": "Charcoal Grilled Kebab & Kofta",
      "price": 290,
      "quantity": 2,
      "itemNote": "بدون بصل لو سمحت",
      "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "is_available": true
    }
  ],
  "orderType": "dine_in",
  "tableNumber": "4",
  "customerName": "أحمد محمود",
  "generalNote": "برجاء تسوية اللحم جيداً"
}
```

---

## 3. Validation Rules

- **Quantity Bounds**: Minimum 1, Maximum 99. Decreasing below 1 triggers item removal.
- **Table Number Validation**:
  - If `orderType === "dine_in"`: `tableNumber.trim().length > 0` is strictly enforced.
  - If `orderType === "takeaway"`: `tableNumber` is optional.
- **Out of stock guard**: Items with `is_available === false` cannot be added to the cart, and existing items marked unavailable prevent checkout until removed.
