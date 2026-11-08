# Contract: WhatsApp Message & Deep Link Generation

**Feature**: `002-cart-whatsapp-ordering`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Deep Link URL Contract

- **Base URL**: `https://wa.me/{phone}?text={encoded_message}`
- **Phone Format**: Clean international format digits only (no `+`, spaces, or hyphens), e.g., `201012345678` (Egyptian number).
- **Encoding**: Standard UTF-8 URL encoding (`encodeURIComponent`), where newlines are encoded as `%0A`.

---

## 2. Text Message Templates

### 2.1 Arabic Template (`locale: "ar"`)

```text
🍽️ *طلب جديد من {restaurantName}*
------------------------------
📍 *نوع الطلب:* {orderTypeLabel}
🪑 *رقم الطاولة:* {tableNumber}       <-- (Only if Dine-in)
👤 *اسم العميل:* {customerName}      <-- (If provided or required)
📱 *رقم الموبايل:* {customerPhone}    <-- (For Takeaway & Delivery)
🏠 *عنوان التوصيل:* {deliveryAddress} <-- (For Delivery)

📋 *الأصناف المطلوبة:*
• {quantity}x {name_ar} ({unit}) ({subtotal} ج.م)
  _ملاحظة: {itemNote}_             <-- (If item has note)

📝 *ملاحظات عامة على الطلب:*
{generalNote}                        <-- (If provided)
------------------------------
💵 *المجموع الفرعي: {itemsTotal} ج.م*  <-- (If Delivery with fee)
🛵 *رسوم التوصيل: {deliveryFee} ج.م*   <-- (If Delivery with fee)
💰 *الإجمالي النهائي: {totalPrice} ج.م*
```

### 2.2 English Template (`locale: "en"`)

```text
🍽️ *New Order from {restaurantName}*
------------------------------
📍 *Order Type:* {orderTypeLabel}
🪑 *Table Number:* {tableNumber}     <-- (Only if Dine-in)
👤 *Customer Name:* {customerName}   <-- (If provided)

📋 *Ordered Items:*
• {quantity}x {name_en} ({subtotal} EGP)
  _Note: {itemNote}_                <-- (If item has note)

📝 *General Order Notes:*
{generalNote}                        <-- (If provided)
------------------------------
💰 *Grand Total: {totalPrice} EGP*
```

---

## 3. Service Interface

Defined in `src/features/cart/services/whatsapp-service.ts`:

```typescript
export interface BuildWhatsAppUrlParams {
  restaurantName: string;
  restaurantPhone: string;
  orderType: "dine_in" | "takeaway";
  tableNumber: string;
  customerName?: string;
  generalNote?: string;
  items: CartItem[];
  totalPrice: number;
  locale: "ar" | "en";
}

export function buildWhatsAppOrderUrl(params: BuildWhatsAppUrlParams): string;
```

