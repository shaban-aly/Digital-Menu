# Data Model: Order Lifecycle & Tracking

**Feature**: `005-order-lifecycle-tracking`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Entities & Zod Validation Schemas

### 1.1 OrderStatus
```typescript
import { z } from "zod";
import { OrderTypeSchema } from "@/features/cart/types";

export const OrderStatusSchema = z.enum([
  "pending",
  "preparing",
  "out_for_delivery",
  "ready",
  "completed",
  "cancelled",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
```

---

### 1.2 OrderItem
```typescript
export const OrderItemSchema = z.object({
  id: z.string().min(1),
  menuItemId: z.string().min(1),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  price: z.number().nonnegative(),
  unit_ar: z.string().nullable().optional(),
  unit_en: z.string().nullable().optional(),
  quantity: z.number().int().min(1),
  itemNote: z.string().optional().default(""),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;
```

---

### 1.3 OrderRecord
```typescript
export const OrderRecordSchema = z.object({
  id: z.string().min(1),
  reference: z.string().regex(/^#ORD-\d+$/),
  storeSlug: z.string().min(1),
  storeName_ar: z.string().min(1),
  storeName_en: z.string().min(1),
  storePhone: z.string().min(7),
  customerName: z.string().min(1, "اسم العميل مطلوب"),
  customerPhone: z.string().min(7, "رقم الهاتف مطلوب"),
  orderType: OrderTypeSchema,
  deliveryAddress: z.string().optional().default(""),
  deliveryFee: z.number().nonnegative().default(0),
  generalNote: z.string().optional().default(""),
  items: z.array(OrderItemSchema).min(1),
  itemsTotal: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  status: OrderStatusSchema.default("pending"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type OrderRecord = z.infer<typeof OrderRecordSchema>;
```

---

## 2. Storage Mapping (Local Mock Phase)

- `orders_store_<slug>`: Array of `OrderRecord` stored as JSON string.
- `customer_recent_orders`: Array of `{ orderId: string; reference: string; storeSlug: string; createdAt: string }` saved in customer's local storage.
- `order_sequence_counter`: Numeric counter incremented with each created order to produce `#ORD-1001`, `#ORD-1002`, etc.
