# Feature Specification: Merchant Admin Dashboard

**Feature Branch**: `003-merchant-admin-dashboard`  
**Created**: 2026-11-08  
**Status**: Draft  
**Input**: User description: "لوحة تحكم التاجر (Merchant Admin Dashboard) لإدارة المنيو، الأصناف، الأسعار، الإتاحة، إعدادات المتجر، والـ QR كود، بموك داتا تفاعلية أولاً ثم الربط مع سوبابيز لاحقاً"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Item Management & Instant Stock Toggle (Priority: P1) 🎯 MVP

As a store owner or manager, I want to view all my menu items, quickly toggle their availability on or off, add new items, and edit or delete existing items, so that my customers always see an accurate and up-to-date menu.

**Why this priority**: Managing menu items and their availability is the foundational purpose of a digital menu admin. Without this, the merchant cannot control what is sold or prevent customers from ordering out-of-stock items.

**Independent Test**:
1. Open the merchant dashboard for a store.
2. Toggle an available item to "Out of Stock".
3. Verify the item immediately reflects as unavailable in both the dashboard and the customer-facing menu view.
4. Add a new item and edit an existing item's price, verifying the updates appear immediately.

**Acceptance Scenarios**:
1. **Given** a merchant is viewing the items list, **When** they click the availability toggle on an item, **Then** its status flips between "Available" and "Out of Stock" with visual confirmation without page reload.
2. **Given** a merchant opens the "Add Item" form, **When** they fill in valid details (Arabic name, English name, category, price) and submit, **Then** the new item is added to the catalog and visible in the menu.
3. **Given** an existing item, **When** the merchant edits its details (such as price or description) and saves, **Then** the changes are saved and reflected across the store views.
4. **Given** an item the merchant wants to remove, **When** they choose "Delete" and confirm via the confirmation dialog, **Then** the item is removed from the catalog.

---

### User Story 2 - Categories Management (Priority: P2)

As a store owner, I want to create, edit, reorder, and remove menu categories, so that my products are logically grouped for customers to browse easily.

**Why this priority**: Categories provide structure to the menu. As a store expands its offerings or reorganizes sections (e.g., adding "Breakfast" or "Special Offers"), the merchant needs autonomy to maintain these sections.

**Independent Test**:
1. Open the categories section in the admin dashboard.
2. Create a new category "العصائر الطازجة / Fresh Juices".
3. Assign an item to this category.
4. Verify the new category tab appears with its item on the customer menu.

**Acceptance Scenarios**:
1. **Given** the categories management view, **When** the merchant enters a new Arabic and English category name and saves, **Then** the category is created and available for item assignment.
2. **Given** an existing category with items, **When** the merchant attempts to delete it, **Then** the system presents a clear warning about affected items before confirmation.
3. **Given** multiple categories, **When** the merchant reorders them, **Then** the order of category tabs updates accordingly in the customer menu.

---

### User Story 3 - Store Profile & Fulfillment Settings (Priority: P2)

As a store owner, I want to configure my store's operational profile (store name, WhatsApp order receiving number, delivery fee, and enabled order types: Dine-in, Takeaway, Delivery), so that customer orders are routed and priced correctly according to my business model.

**Why this priority**: Different businesses (restaurants, cafes, supermarkets) operate under different models. Enabling/disabling delivery, adjusting delivery fees, and changing the receiving WhatsApp number are critical operational controls.

**Independent Test**:
1. Open Store Settings in the dashboard.
2. Change the WhatsApp phone number and update delivery fee.
3. Toggle "Delivery" fulfillment option off.
4. Verify that the customer cart no longer allows delivery and sends orders to the newly updated WhatsApp number.

**Acceptance Scenarios**:
1. **Given** store settings, **When** the merchant enters a new receiving WhatsApp phone number and saves, **Then** all future customer orders generate WhatsApp links targeted to the new number.
2. **Given** fulfillment settings, **When** the merchant updates the delivery fee, **Then** the new fee is automatically calculated into customer delivery orders.
3. **Given** fulfillment settings, **When** the merchant disables an order type (e.g., Dine-in or Delivery), **Then** that order type option is hidden from the customer's cart selector.

---

### User Story 4 - Storefront QR Code & Printable Tent/Sticker Card (Priority: P3)

As a store owner, I want to preview, customize, and download high-resolution QR codes and printable tent/table cards that point to my digital menu, so that I can print and place them in my physical venue or storefront.

**Why this priority**: Physical customers need a frictionless way to access the digital menu. Providing high-resolution QR generation and print-ready card layouts directly from the admin panel completes the bridge between physical store and digital menu.

**Independent Test**:
1. Navigate to the QR section in the admin dashboard.
2. Verify the preview displays the store's direct menu URL encoded in the QR code.
3. Configure optional Wi-Fi credentials to show on the printable card.
4. Click "Download / Print Tent Card" and verify a print-friendly layout opens with clear styling and scannable code.

**Acceptance Scenarios**:
1. **Given** the QR generator view, **When** the merchant views the QR preview, **Then** it accurately encodes the current store's direct menu link (`/menu/[slug]`).
2. **Given** the merchant inputs optional venue Wi-Fi network name and password, **When** previewing the printable card, **Then** the Wi-Fi credentials appear legibly beneath or alongside the QR code.
3. **Given** the printable card view, **When** the merchant initiates printing or download, **Then** a high-resolution, print-optimized document is generated without screen UI clutter.

---

### User Story 5 - Bilingual Administration & Dark/Light Theme (Priority: P3)

As a merchant or staff member, I want to use the dashboard in either Arabic (RTL) or English (LTR) and toggle between dark and light themes, so that I can manage my store comfortably in my preferred language and lighting environment.

**Why this priority**: Store managers and kitchen staff have diverse language preferences and work in varying lighting conditions (daylight vs. dimly lit kitchen/counter environments).

**Independent Test**:
1. Toggle language from Arabic to English in the admin header.
2. Verify all labels, forms, placeholders, and directional layouts switch cleanly to English LTR without page reload.
3. Toggle theme between light and dark, verifying high contrast and readability across all admin screens.

**Acceptance Scenarios**:
1. **Given** any admin screen, **When** the merchant clicks the language switch, **Then** the entire dashboard layout adapts its direction (`dir="rtl"` or `dir="ltr"`) and all interface texts update immediately.
2. **Given** any admin screen, **When** the merchant switches theme, **Then** colors adjust with proper contrast and zero visual artifacts.

---

## Edge Cases

- **Empty Catalog**: When a new store has zero items or zero categories, the dashboard MUST display informative empty states with clear calls-to-action to add the first category or item.
- **Duplicate Names**: What happens when a merchant attempts to create a category or item with an existing name? The system MUST display an inline validation warning rather than failing silently.
- **Invalid WhatsApp Number**: When updating the store's phone number, entering invalid characters or a number too short to receive WhatsApp messages MUST be caught with immediate validation.
- **Deleting Category with Assigned Items**: Deleting a category that contains active items MUST either prompt to reassign/uncategorize the items or warn that those items will become unassigned, preventing orphaned states.
- **Network Disconnection / Offline Mode**: When operating with local mock data, changes persist in local storage; if a temporary connection issue occurs, the merchant's unsaved edits MUST NOT be lost abruptly.
- **Extremely Long Text**: When item names or descriptions are unusually long, UI cards and table cells MUST truncate gracefully with accessible tooltips or expanders without breaking layout.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a dedicated Merchant Admin interface accessible via `/admin` (or `/admin/[slug]`).
- **FR-002**: System MUST display an overview of all menu items grouped by category with their photo, Arabic name, English name, price, and current availability status.
- **FR-003**: System MUST allow instant toggling of an item's availability (Available / Out of Stock) with immediate state persistence.
- **FR-004**: System MUST allow adding new items with fields for Arabic name, English name, category, price, optional unit, image URL, and optional description.
- **FR-005**: System MUST allow editing all attributes of any existing menu item.
- **FR-006**: System MUST allow deleting an item after user confirmation via a custom, accessible confirmation dialog (native browser dialogs are strictly prohibited).
- **FR-007**: System MUST provide category management (view, create, edit names in Arabic and English, and delete).
- **FR-008**: System MUST provide a Store Settings screen allowing the merchant to update store display name, description, receiving WhatsApp phone number, and delivery fee.
- **FR-009**: System MUST allow the merchant to enable or disable individual fulfillment order types (Dine-in, Takeaway, Delivery).
- **FR-010**: System MUST generate a high-resolution QR code encoding the store's customer menu URL (`/menu/[slug]`).
- **FR-011**: System MUST provide a printable tent card / sticker view for the store QR code with customizable venue details (e.g., Wi-Fi network and password) and print-optimized styling.
- **FR-012**: System MUST support complete bilingual presentation (Arabic RTL and English LTR) with in-place language switching.
- **FR-013**: System MUST persist all admin changes in mock state / local storage during the mock phase, with clear service abstractions so it can be connected to Supabase without UI changes.
- **FR-014**: System MUST validate all merchant inputs (prices must be non-negative numbers, names must not be empty, phone numbers must adhere to phone formatting) with clear inline error messages.

---

### Key Entities

- **StoreProfile**:
  - `id`: Unique store identifier (slug).
  - `name_ar` / `name_en`: Localized store names.
  - `description_ar` / `description_en`: Localized store descriptions.
  - `phone`: Primary contact and WhatsApp receiving phone number.
  - `supportedOrderTypes`: List of enabled order types (`dine_in`, `takeaway`, `delivery`).
  - `deliveryFee`: Fixed delivery charge in EGP.
  - `currency`: Default currency (`EGP` / `ج.م`).
  - `logoUrl` / `coverUrl`: Store visual branding assets.

- **Category**:
  - `id`: Unique category identifier.
  - `storeId`: Associated store identifier.
  - `name_ar` / `name_en`: Localized category titles.
  - `sortOrder`: Display sorting sequence.
  - `icon`: Optional category icon identifier.

- **MenuItem**:
  - `id`: Unique item identifier.
  - `categoryId`: Parent category reference.
  - `storeId`: Associated store identifier.
  - `name_ar` / `name_en`: Localized item names.
  - `description_ar` / `description_en`: Localized descriptions.
  - `price`: Numeric price in EGP.
  - `unit_ar` / `unit_en`: Optional measurement unit (e.g., "كجم / kg", "قطعة / piece").
  - `image_url`: Product image URL.
  - `is_available`: Boolean indicating live inventory availability.

- **StoreQRConfig**:
  - `storeSlug`: Target menu path encoded into QR.
  - `wifiSsid`: Optional venue Wi-Fi network name.
  - `wifiPassword`: Optional venue Wi-Fi network password.
  - `tableLabel`: Optional table or stand label.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A merchant can toggle an item's availability from "Available" to "Out of Stock" in under 2 clicks and less than 1 second, with the change instantly visible on the customer menu.
- **SC-002**: A merchant can add a new menu item with all required fields in under 60 seconds.
- **SC-003**: 100% of merchant actions (add/edit/delete/toggle/settings) persist across page reloads in mock storage.
- **SC-004**: 100% of user-facing text and validation messages render properly in both Arabic (RTL) and English (LTR) with zero layout disruption.
- **SC-005**: Printable QR tent card renders cleanly on standard A4 / A5 paper sizes when triggered via print dialog, with zero extraneous website chrome or headers.
- **SC-006**: Zero usage of native browser popups (`window.confirm`, `window.alert`); all feedback and confirmations use custom, branded UI primitives.

---

## Assumptions

- **Mock-First Architecture**: During the initial build phase, all admin mutations update an in-memory/local-storage mock store repository that mirrors the future Supabase schema, enabling complete end-to-end testing without external network dependencies.
- **Authentication Scope**: Full multi-tenant authentication (login, password reset, RBAC) will be integrated with Supabase Auth in the pre-launch phase; for the mock prototype, an administrative role switcher / direct `/admin/[slug]` access is assumed for seamless evaluation.
- **Image Uploads**: For the mock prototype, image URLs can be selected from a preset gallery or provided as external URLs; Supabase Storage bucket uploads will be plugged in during the backend connection phase.
- **Single Active Store Context**: The dashboard operates in the context of the selected store (`slug`), allowing testing across the three demo businesses (Oriental Grill, Aroma Cafe, Fresh Market).
