# Feature Specification: QR Code Table Generator & Printable Cards

**Feature Branch**: `003-qr-table-generator`  
**Created**: 2026-11-08  
**Status**: Ready for Planning  
**Input**: System capability expansion for merchants to generate, preview, customize, and print high-resolution QR code table cards and storefront QR codes linking directly to `/menu/[slug]?table=N`.

---

## User Scenarios & Testing

### User Story 1 - Batch Table QR Code Generation (Priority: P1) 🎯 MVP

A restaurant or café owner (e.g., `oriental-grill` or `specialty-cafe`) wants to generate QR codes for all their dining tables at once. They open the QR Generator at `/menu/[slug]/qr`, specify the number of tables (e.g., 10 or 20 tables), and the system immediately generates high-contrast QR codes for each table with the exact URL: `${origin}/menu/[slug]?table=[number]`.

**Why this priority**: Essential for dine-in operations. Manual generation of 20-50 table links is tedious and error-prone. Automatic batch creation eliminates setup friction.

**Independent Test**: Navigate to `/menu/oriental-grill/qr`, enter 5 tables, verify that 5 distinct QR code cards are generated with URLs `.../menu/oriental-grill?table=1` through `table=5`.

**Acceptance Scenarios**:
1. **Given** a restaurant store slug, **When** the merchant enters table count `10`, **Then** the system renders 10 table QR cards numbered 1 to 10 with direct table URLs.
2. **Given** a customer scans any generated table QR code with their mobile camera, **When** the page opens, **Then** they land on `/menu/[slug]?table=N` and the cart automatically pre-fills that table number.
3. **Given** custom table ranges or alphanumeric names (e.g., "T1", "VIP-1"), **When** configured, **Then** the generator accurately encodes the custom identifier.

---

### User Story 2 - Storefront / Retail QR Code for Supermarkets & Takeaway (Priority: P1)

A supermarket or takeaway-centric store manager (e.g., `fresh-market`) needs a prominent QR code for their storefront, flyers, or delivery bags without any table parameters. The system automatically detects when a business does not use dine-in, or provides a dedicated "Storefront / Home Delivery QR" mode generating `${origin}/menu/[slug]`.

**Why this priority**: Non-restaurant businesses (supermarkets, cloud kitchens) do not have tables but need QR codes for packaging, social media, and storefront banners.

**Independent Test**: Navigate to `/menu/fresh-market/qr`, verify the system defaults to "Storefront QR" mode generating a high-res code for `/menu/fresh-market` with promotional copy ("Scan to order delivery / اطلب للتوصيل للمنزل").

**Acceptance Scenarios**:
1. **Given** a store with `business_type: "supermarket"`, **Then** the generator presents the Storefront / Delivery QR card by default.
2. **Given** any store, **When** the merchant switches to "Storefront / All Orders", **Then** a general QR code is generated without table parameters.

---

### User Story 3 - Elegant Print-Ready Table Stand Cards (Priority: P1)

The merchant needs the generated QR codes formatted into professional, ready-to-print Table Tent Cards (بطاقات طاولات) without needing graphic design software. Each card contains:
- Restaurant logo & brand name.
- Prominent table number badge (e.g., "طاولة رقم 5" / "Table #5").
- Clear high-contrast QR code.
- Helpful call-to-action ("امسح الكود لتصفح المنيو والطلب مباشرة").
- Optional WiFi network and password instructions.

**Why this priority**: Raw QR codes look unprofessional. Providing ready-to-print, beautifully designed table cards saves the merchant hundreds of pounds in design costs and enables same-day deployment.

**Independent Test**: Preview table cards in the browser, verify layout includes store logo, table badge, and legible QR code with bilingual RTL/LTR support.

**Acceptance Scenarios**:
1. **Given** generated table cards, **When** viewed on screen or print preview, **Then** each card has a balanced vertical tent format (card size suitable for table stands: 10×15 cm or 2 cards per A4 page).
2. **Given** dark mode is active on screen, **When** printing or previewing printable cards, **Then** cards always render with crisp white backgrounds and pure black QR codes for 100% printer readability and ink savings.

---

### User Story 4 - One-Click Print & High-Res Image Downloads (Priority: P2)

The merchant wants to either print all table cards directly via their printer or export them as image files (SVG / PNG) to send to a professional printing shop.

**Why this priority**: Gives the merchant complete flexibility between immediate in-house printing and professional print shop production.

**Independent Test**: Click "Print All Cards" -> verify browser print dialog is invoked with page breaks separating cards cleanly; click "Download PNG" on a card -> verify clean image file is downloaded.

**Acceptance Scenarios**:
1. **Given** the table cards view, **When** the merchant clicks "طباعة بطاقات الطاولات (Print Cards)", **Then** the native print dialog opens with `@media print` styling (clean page layout, zero navigation clutter).
2. **Given** any individual QR card, **When** the merchant clicks "تحميل (Download)", **Then** the QR code is downloaded as a crisp PNG file named `qr-table-[number].png`.

---

## Requirements

### Functional Requirements

- **FR-001**: Route MUST be accessible at `/menu/[slug]/qr` for any valid store slug.
- **FR-002**: System MUST generate pure client-side QR codes using `qrcode` library with error correction level 'M' or 'H' for fast scanning in low restaurant lighting.
- **FR-003**: For dine-in businesses, system MUST provide a Table Count input (1 to 100) and generate sequential table cards.
- **FR-004**: Each table QR code MUST encode the URL `${origin}/menu/${storeSlug}?table=${tableNumber}`.
- **FR-005**: For supermarket/retail businesses, system MUST generate storefront QR codes encoding `${origin}/menu/${storeSlug}` with delivery CTA text.
- **FR-006**: System MUST provide customizable card options: toggle WiFi info (Network SSID & Password), toggle restaurant logo, toggle card instructions.
- **FR-007**: System MUST provide a "Print All Cards" action with `@media print` rules ensuring cards fit 2 per A4 sheet with proper margin spacing and no browser headers/footers.
- **FR-008**: System MUST provide individual QR PNG download buttons with minimum 44×44px touch targets.
- **FR-009**: QR generator page MUST support in-place Arabic (RTL) and English (LTR) language switching via `LanguageContext`.
- **FR-010**: All feature files MUST reside in `src/features/qr/` with max 180 lines per file and 100% logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`).

### Key Entities

- **TableQRItem**: `{ tableNumber: string | number; url: string; qrDataUrl: string }`.
- **QRGeneratorConfig**: `{ tableCount: number; showLogo: boolean; showWifi: boolean; wifiSsid: string; wifiPassword: string; customTitle: string }`.

---

## Success Criteria

- **SC-001**: 20 table QR codes generate client-side in under 500ms without server roundtrips.
- **SC-002**: 100% of generated QR codes scan reliably on iOS Camera and Android Google Lens.
- **SC-003**: Print preview outputs cleanly without overlapping elements or broken page breaks.
- **SC-004**: Zero files exceeding the 180-line limit; strict TypeScript and ESLint compliance.
