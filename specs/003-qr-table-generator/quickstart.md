# Quickstart Validation: QR Code Table Generator & Printable Cards

**Feature**: `003-qr-table-generator`  
**Date**: 2026-11-08  
**Status**: Ready for Implementation  

---

## Prerequisites
1. Dependencies installed: `qrcode` (`^1.5.4`), `@types/qrcode` (`^1.5.5`).
2. Dev server running on `http://localhost:3000`.

---

## 1. Quick Verification Scenarios

### Scenario 1: Generate Dine-In Table QR Cards (Restaurant)
1. Navigate to: `http://localhost:3000/menu/oriental-grill/qr`
2. **Expectation**:
   - Page loads showing "مولد بطاقات الطاولات (Table QR Generator)".
   - Default table count is set to 10.
   - Grid renders 10 printable tent cards numbered Table #1 to Table #10.
   - Each card displays store logo, table badge, high-contrast QR code, and scan CTA.
3. Adjust table count to `5`:
   - Grid immediately re-renders exactly 5 cards in <300ms.
4. Toggle "معلومات الواي فاي (WiFi Details)":
   - Enter SSID: `Grill_WiFi`, Password: `grillguest2026`.
   - Cards instantly show WiFi icon, network name, and password block.

### Scenario 2: Test Mobile Scan Auto-Fill
1. Hover or inspect Card #3: URL encoded is `http://localhost:3000/menu/oriental-grill?table=3`.
2. Open that URL directly in browser: `http://localhost:3000/menu/oriental-grill?table=3`.
3. Add any item to the cart (e.g., "كباب مشكل").
4. Open Cart Drawer:
   - Order type is automatically selected as "داخل المطعم (Dine-in)".
   - Table Number input is pre-filled with `3`.
   - Form validation passes without requiring manual table entry.

### Scenario 3: Supermarket Storefront Mode (Fresh Market)
1. Navigate to: `http://localhost:3000/menu/fresh-market/qr`
2. **Expectation**:
   - System recognizes `fresh-market` as a supermarket (`businessType: "supermarket"`).
   - Mode defaults to "Storefront / Home Delivery QR".
   - Table number controls are hidden.
   - Prominent QR card is rendered linking directly to `http://localhost:3000/menu/fresh-market`.
   - Subtitle displays "امسح الكود لطلب توصيل طلبات البقالة للمنزل".

### Scenario 4: One-Click Print Layout Test
1. Click the "طباعة بطاقات الطاولات (Print Cards)" button.
2. Verify browser print preview:
   - Header, navigation, form inputs, download buttons, and footer are completely hidden (`@media print`).
   - Cards render with pure white background, crisp black QR codes, and clear borders.
   - Layout formats 2 tent cards per A4 page without awkward page cutoffs.

### Scenario 5: Single Card PNG Download
1. Click "تحميل PNG" on Table Card #1.
2. **Expectation**: Browser downloads `oriental-grill-table-1.png` (high-res 600×600px).

---

## 2. Automated Test Commands

```bash
# Type-check verification
npm run type-check

# Unit tests verification
npm test

# Production build verification
npm run build
```

