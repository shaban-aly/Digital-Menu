# Quickstart & Verification Guide: Cart & WhatsApp Ordering

**Feature**: `002-cart-whatsapp-ordering`  
**Date**: 2026-11-08  
**Status**: Ready  

This guide provides runnable instructions to test and verify the Cart & WhatsApp Ordering feature locally.

---

## 1. Prerequisites

- Next.js 16+, React 19, Tailwind v4
- Local server running: `npm run dev`

---

## 2. Verification Scenarios

### Scenario 1: Quick Add to Cart & Floating Bar
1. Navigate to `http://localhost:3000/ar/menu`.
2. Locate an available dish (e.g., "شوربة لسان عصفور بالمستكة").
3. Tap the quick-add (+) button on the card.
4. **Verify**: The sticky bottom floating bar slides up, displaying "1 صنف" and "55 ج.م".
5. Tap (+) again on the same card or another item.
6. **Verify**: The bar updates to "2 صنف" and the calculated total.

### Scenario 2: Out of Stock Protection
1. Locate an unavailable item (e.g., "طاجن موزة بالبامية" which is marked `غير متاح حالياً`).
2. **Verify**: The quick-add button is disabled and cannot be clicked.

### Scenario 3: Cart Drawer, Notes & Quantities
1. Click "عرض السلة / View Cart" on the floating bottom bar.
2. **Verify**: The cart drawer slides up smoothly.
3. Tap (+) to increase quantity to 3; tap (-) to decrease.
4. Tap "إضافة ملاحظة" on an item and enter: `بدون بصل`.
5. **Verify**: Note is attached to the item and visible in the drawer.

### Scenario 4: Order Type & Table Number Validation
1. In the cart drawer, select "داخل المطعم (Dine-in)".
2. Clear the table number field and tap "إرسال الطلب عبر واتساب".
3. **Verify**: The submission is blocked and an error prompts for the table number.
4. Enter `4` in the table number field.
5. Tap "إرسال الطلب عبر واتساب".
6. **Verify**: Validation passes and WhatsApp opens with Table 4.
7. Switch order type to "استلام من الفرع (Takeaway)".
8. **Verify**: Table number is no longer required.

### Scenario 5: Local Storage Recovery on Reload
1. With items in the cart, refresh the browser page (`F5`).
2. **Verify**: The sticky bottom bar still appears immediately with the exact same item count and total.
3. Open the drawer: all items, quantities, notes, and selected order type are fully restored.

### Scenario 6: WhatsApp Message Format
1. Click the WhatsApp button in Arabic mode.
2. **Verify**: The generated URL opens `https://wa.me/...` containing formatted Arabic text with emojis, restaurant name, table number, itemized bullet points, notes, and grand total in `ج.م`.
3. Switch language to English and repeat.
4. **Verify**: Message is formatted in English with `EGP` currency.

---

## 3. Automated Testing

```bash
# Unit tests (Zod schemas, Cart state reducer, WhatsApp URL builder)
npm test

# TypeScript type check (Strict Mode)
npm run type-check

# ESLint audit
npm run lint

# End-to-end tests
npm run test:e2e
```
