# Quickstart & Validation Guide: Merchant Admin Dashboard

**Feature**: `003-merchant-admin-dashboard`  
**Date**: 2026-11-08  
**Status**: Ready for Tasks  

---

## Prerequisites
- Node.js 20+
- Installed packages: Next.js 16+, React 19, Tailwind CSS v4, Lucide React, Zod v4, QRCode.

---

## Validation Scenarios

### Scenario 1: Accessing the Dashboard & Switching Stores
1. Run development server: `npm run dev`.
2. Navigate to `http://localhost:3000/admin/oriental-grill` (or via the store switcher at `/admin`).
3. Verify the store header displays "مشويات البركة / Oriental Grill", contact phone, and 4 primary tabs:
   - **الأصناف (Items)**
   - **الأقسام (Categories)**
   - **إعدادات المتجر (Store Settings)**
   - **كود الـ QR والطباعة (QR & Print)**
4. Switch to English using the language toggle; verify the layout smoothly transforms to LTR with English labels.

---

### Scenario 2: Instant Stock Availability Toggle (P1 MVP)
1. On the **Items** tab, locate an available item (e.g., "شيش طاووق / Shish Tawook").
2. Click the stock toggle switch to mark it "غير متوفر / Out of Stock".
3. Open a second browser tab to `http://localhost:3000/menu/oriental-grill`.
4. Verify "شيش طاووق" shows the "غير متوفر / Out of Stock" badge and the (+) add-to-cart button is disabled.
5. Switch it back to "متوفر / Available" in the admin tab; verify the customer menu enables the item immediately.

---

### Scenario 3: Adding & Editing an Item
1. In the admin dashboard, click **"إضافة صنف جديد / Add New Item"**.
2. Fill in:
   - الاسم بالعربية: "كباب حلبى فاخر"
   - Name in English: "Halabi Kebab"
   - القسم / Category: المشويات
   - السعر / Price: 250
3. Click "حفظ / Save".
4. Verify the item appears in the items list and on the customer menu under the "المشويات" section.
5. Click "تعديل / Edit" on the item, change the price to 270, save, and verify the price updates.

---

### Scenario 4: Store Settings & WhatsApp Order Routing
1. Go to the **Store Settings** tab.
2. Update the WhatsApp phone number to a new number (e.g., `+201099999999`).
3. Update the delivery fee from `20` to `35`.
4. Click "حفظ الإعدادات / Save Settings".
5. In the customer menu, add an item to the cart, select "توصيل / Delivery", and verify the delivery fee is calculated as `35 ج.م`.
6. Click "إرسال عبر واتساب / Send via WhatsApp" and verify the target WhatsApp link points to the new phone number (`201099999999`).

---

### Scenario 5: QR Code Generation & Printable Tent Card
1. Navigate to the **QR & Print** tab.
2. Verify the preview QR code correctly generates and points to `/menu/oriental-grill`.
3. Enter optional venue Wi-Fi credentials:
   - اسم الشبكة: `Baraka-Guest`
   - كلمة السر: `Grill@2026`
4. Click **"طباعة الستاند / Print Tent Card"**.
5. Verify the print preview opens with clean, branded formatting, the QR code, store logo, Wi-Fi info, and zero website navigation chrome.
