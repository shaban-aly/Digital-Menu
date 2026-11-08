# Research & Architectural Decisions: Merchant Admin Dashboard

**Feature**: `003-merchant-admin-dashboard`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Mock-First State Architecture & Data Synchronization

### Context & Problem
The user specified that this feature must be built with mock data first and connected to Supabase before launch. When a merchant makes updates in the dashboard (e.g., toggles item availability, changes a price, adds a new item, or updates store phone/delivery fees), those changes must:
1. Persist across browser reloads.
2. Immediately reflect in the customer menu (`/menu/[slug]`) and customer cart checkout.
3. Be structured with clean service boundaries so switching from Mock to Supabase in the pre-launch phase requires zero modifications to React UI components.

### Decision
Implement a **Store Repository Pattern** (`IStoreRepository`) with a `LocalStorageStoreRepository` (which wraps `mockStores` and overlays modifications saved in `localStorage` under `store_override_${slug}`).
- React Context (`StoreContext` or `useStore`) will provide read and write methods:
  - `getStore(slug)`
  - `updateItemAvailability(slug, itemId, isAvailable)`
  - `saveMenuItem(slug, itemData)`
  - `deleteMenuItem(slug, itemId)`
  - `saveCategory(slug, categoryData)`
  - `deleteCategory(slug, categoryId)`
  - `updateStoreSettings(slug, settings)`
- When Supabase is connected later, `SupabaseStoreRepository` will implement the exact same `IStoreRepository` interface.

### Alternatives Considered
- *In-memory state only*: Rejected because refreshing the browser would wipe the merchant's edits, making testing and demoing impossible.
- *Separate Next.js API Routes reading JSON files on disk*: Rejected because Next.js server runtime cannot persist writes cleanly on serverless platforms (Vercel), whereas browser `localStorage` guarantees client-side persistence during prototype development.

---

## 2. Storefront QR Code Generation & Printable Tent Cards

### Context & Problem
The admin panel needs to generate high-resolution QR codes pointing to the store's customer menu URL (`/menu/[slug]`) and provide printable tent cards/stickers with optional Wi-Fi credentials.

### Decision
Use `qrcode` (`qrcode` + `@types/qrcode`) which was already validated in the project. It provides:
1. `QRCode.toDataURL(url, options)` for instant base64 SVG/PNG data URLs.
2. Lightweight, zero UI bloat, pure TypeScript compatibility.
3. Print optimization using CSS `@media print` rules: hides sidebar/navigation chrome and formats the printable tent card cleanly on A4/A5 paper.

### Alternatives Considered
- *External QR API (e.g. Google Chart API / qr-server)*: Rejected because it requires active internet connectivity, leaks customer store URLs to third parties, and fails in offline/mock environments.
- *SVG manual rendering*: More complex to maintain with error correction levels (ECC Level M/H) than using the standard `qrcode` library.

---

## 3. Component Decomposition & Strict Size Constraints (<= 180 lines)

### Context & Problem
Constitution Rule III enforces a strict limit of 180 lines per component file, logical decomposition, and reuse of `src/components/ui/` primitives.

### Decision
Decompose the Admin feature into distinct, focused subcomponents inside `src/features/admin/components/`:
- `admin-dashboard-page.tsx`: Shell layout with tabs (Items, Categories, Settings, QR Code), store switcher, language/theme toggle.
- `items-tab.tsx`: Category filter, search input, "Add Item" button, and items grid/table.
- `item-row-card.tsx`: Single item display with image, price, stock toggle switch, edit/delete actions.
- `item-form-modal.tsx`: Modal form for adding/editing items, using shared `Modal` and `Button` primitives.
- `categories-tab.tsx`: Category list, add category input, edit/delete actions with `ConfirmDialog`.
- `settings-tab.tsx`: Form for WhatsApp phone number, delivery fee, and fulfillment toggles (Dine-in, Takeaway, Delivery).
- `qr-tab.tsx`: QR preview, Wi-Fi configuration fields, and print button.
- `printable-tent-card.tsx`: Standalone print-optimized layout.

All deletions and confirmations will strictly use `src/components/ui/confirm-dialog.tsx` to adhere to the constitution's complete ban on `window.confirm()`.

---

## 4. Internationalization & Directionality (RTL/LTR)

### Context & Problem
The admin panel must support seamless bilingual operation (Arabic default RTL, English LTR) with zero layout disruption.

### Decision
Extend the existing `src/lib/i18n/ar.json` and `src/lib/i18n/en.json` dictionaries with an `admin` namespace covering:
- Navigation tabs and headers.
- Form field labels, placeholders, and validation errors.
- Stock statuses ("متوفر" / "Available", "غير متوفر" / "Out of stock").
- Confirmation messages for deletions.
- QR and tent card printable labels.
Strictly use logical CSS utilities (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`, `start-0`, `end-0`).
