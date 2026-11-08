# Feature Specification: Cart & WhatsApp Ordering

**Feature Branch**: `002-cart-whatsapp-ordering`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "سلة الطلبات والطلب عبر واتساب (Cart & WhatsApp Order): تمكين العميل من إضافة الأصناف وتحديد الكميات وإضافة ملاحظات، شريط سفلي عائم يوضح عدد الأصناف والإجمالي بالجنيه المصري (ج.م)، نافذة جانبية/سفلية للسلة لتعديل الكميات وإدخال رقم الطاولة أو الاسم، وزر إرسال الطلب بتنسيق أنيق ومحسوب التكلفة مباشرة إلى واتساب المطعم."

## User Scenarios & Testing

### User Story 1 - Add Items to Cart & Floating Summary Bar (Priority: P1)

A customer browsing the digital menu wants to select items to order. They can tap an "Add to Cart" button directly on any available menu item card or from inside the item detail modal. When an item is added, a floating summary bar appears at the bottom of the screen showing the current total item count and total cost in Egyptian Pounds (EGP).

**Why this priority**: Without adding items and viewing the running total, no order can be constructed. This is the entry point for the ordering experience.

**Independent Test**: Browse to `/ar/menu`, tap "Add" on a dish, verify the floating cart bar immediately appears at the bottom displaying "1 صنف" and the correct price in `ج.م`.

**Acceptance Scenarios**:

1. **Given** a customer is viewing an available menu item, **When** they tap the add button, **Then** the item is added to the cart with quantity 1, and the floating bottom bar displays the updated item count and total in EGP.
2. **Given** an item is marked as unavailable, **When** the customer views the card, **Then** the add button is disabled and cannot be pressed.
3. **Given** an item is already in the cart, **When** the customer taps the increment (+) or decrement (-) buttons on the card or detail view, **Then** the quantity updates and the floating bar total recalculates instantly.
4. **Given** all items are removed from the cart (quantity 0), **When** the last item is removed, **Then** the floating bottom bar smoothly hides.

---

### User Story 2 - View and Manage Cart Sheet (Priority: P1)

A customer taps on the floating cart bar to open a cart drawer/sheet. Inside the sheet, they see an itemized breakdown of selected dishes, their unit prices, individual item quantities with +/- controls, an option to add special instructions (e.g. "بدون بصل" / "سكر خفيف"), and the order subtotal.

**Why this priority**: Customers must review their selected items, adjust quantities, customize their dishes, or remove mistakes before finalizing an order.

**Independent Test**: Tap the floating cart bar to open the cart sheet. Modify item quantities, add an item note, and verify total recalculates in real-time.

**Acceptance Scenarios**:

1. **Given** the customer has items in the cart, **When** they tap the floating bottom bar, **Then** a cart sheet slides up displaying all selected items, quantities, and prices.
2. **Given** the cart sheet is open, **When** the customer changes the quantity of an item using the (+) and (-) buttons, **Then** the item total and overall cart total update immediately.
3. **Given** the customer wants to customize an item, **When** they tap "Add Note" on an item, **Then** an input field appears where they can enter custom instructions.
4. **Given** the cart sheet is open, **When** the customer taps the close button or outside the sheet, **Then** the cart sheet dismisses and the menu position is preserved.

---

### User Story 3 - Submit Order via WhatsApp (Priority: P1)

A customer reviewing their cart enters their table number (or table is pre-filled) and optional name, then taps "Send Order via WhatsApp". The application formats a clean, readable, itemized text message in the selected language and opens WhatsApp directly to the restaurant's designated phone number.

**Why this priority**: This completes the core ordering loop, delivering actionable orders directly to the restaurant staff without requiring third-party payment gateways.

**Independent Test**: Fill in a table number in the cart sheet, click "Send Order via WhatsApp", and verify the WhatsApp link opens with the exact item list, quantities, notes, and calculated total in EGP.

**Acceptance Scenarios**:

1. **Given** the cart sheet is open with items, **When** the customer enters their table number and taps "Send Order via WhatsApp", **Then** the system opens WhatsApp (`https://wa.me/<phone>?text=...`) addressed to the restaurant.
2. **Given** the generated WhatsApp message, **When** viewed, **Then** it contains the restaurant name, table number, customer name (if provided), line-by-line item names, quantities, unit prices, custom notes, and the grand total in EGP.
3. **Given** the customer attempts to submit without specifying a table number, **When** they tap submit, **Then** a validation message highlights the table number field as required.
4. **Given** the order is submitted successfully, **When** returning to the app, **Then** the customer is presented with an option to clear the cart or keep it.

---

### User Story 4 - Pre-fill Table Number via QR Code URL (Priority: P2)

When a customer scans a table-specific QR code (e.g., `https://menu.restaurant.com/ar/menu?table=12`), the system detects the `table` query parameter and automatically pre-fills the table number in the cart, saving the customer from having to type it manually.

**Why this priority**: Eliminates human error in busy restaurants where customers might type the wrong table number.

**Independent Test**: Navigate to `/ar/menu?table=7`, add an item to the cart, open the cart sheet, and verify Table 7 is pre-filled and displayed prominently.

**Acceptance Scenarios**:

1. **Given** a customer opens the menu via a URL containing `?table=N`, **When** the page loads, **Then** the table number `N` is stored in the current session.
2. **Given** a pre-filled table number from the URL, **When** the customer opens the cart sheet, **Then** the table number displays "Table N" (e.g., "طاولة 7") automatically.

---

### User Story 5 - Persist Cart Across Language Switching & Reload (Priority: P2)

A customer adds items to their cart in Arabic and decides to switch to English (or accidentally reloads the page). The items in the cart are preserved, and their names and currency formatting automatically translate to the active language.

**Why this priority**: Prevents frustrating data loss if a customer switches language or refreshes their browser.

**Independent Test**: Add 2 items in Arabic, toggle language to English, verify the cart retains both items with names displayed in English and prices formatted as `EGP`.

**Acceptance Scenarios**:

1. **Given** items exist in the cart, **When** the customer toggles the language between Arabic and English, **Then** all items remain in the cart with their names, descriptions, and labels rendered in the new language.
2. **Given** items exist in the cart, **When** the page is refreshed within the same session, **Then** all cart items and quantities are restored from session storage.

---

### Edge Cases

- What happens if a customer adds an item, but that item later becomes unavailable? The cart highlights the item with an "Unavailable" warning and prevents checkout until it is removed.
- What happens if the customer has an empty cart? The floating bar is hidden; if the cart sheet is opened, an empty state message ("Your cart is empty") with a "Browse Menu" button is shown.
- What happens if the restaurant has no WhatsApp phone number configured? The system falls back to a friendly error state instructing the customer to inform the waiter directly.
- What happens if special characters or emojis are used in the notes? The message text is properly URL-encoded (`encodeURIComponent`) to ensure no corruption in WhatsApp.
- What happens if the customer changes the quantity to 0 in the cart? A confirmation or immediate removal removes the item from the list.

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide an "Add to Cart" action on each available menu item card and inside the item detail modal.
- **FR-002**: System MUST allow customers to increment and decrement item quantities (minimum 1, maximum 99) directly from the card, modal, and cart sheet.
- **FR-003**: System MUST display a floating bottom bar whenever the cart contains one or more items, showing total item count, total price in Egyptian Pounds (EGP), and a "View Order" trigger button.
- **FR-004**: System MUST hide the floating bottom bar smoothly when the cart is empty.
- **FR-005**: Tapping the floating bottom bar MUST open a slide-up cart drawer/sheet displaying the itemized order breakdown.
- **FR-006**: The cart sheet MUST list each item with its title, unit price, quantity controls (+ / -), and an option to attach custom instructions/notes (max 100 characters).
- **FR-007**: The cart sheet MUST allow removing individual items completely via a delete icon button.
- **FR-008**: The cart sheet MUST include a required "Table Number" input field (alphanumeric, max 10 characters).
- **FR-009**: System MUST automatically extract and pre-fill the table number if provided in the URL query parameter `?table=<value>`.
- **FR-010**: The cart sheet MUST include an optional "Customer Name" field (max 50 characters).
- **FR-011**: System MUST calculate the grand total in real-time as the sum of (item unit price × quantity) for all active cart items, formatted in EGP (`ج.م` in Arabic, `EGP` in English).
- **FR-012**: System MUST provide a prominent "Send Order via WhatsApp" button with a WhatsApp icon and minimum 44×44px touch target.
- **FR-013**: Clicking "Send Order via WhatsApp" MUST validate that the cart is not empty and the table number is filled.
- **FR-014**: System MUST construct a well-formatted bilingual WhatsApp message containing: Header (Restaurant Name & Table Number), itemized list with quantities and item notes, and Grand Total in EGP.
- **FR-015**: System MUST URL-encode the WhatsApp message and open `https://wa.me/<phone>?text=<encoded_message>` in a new tab or trigger the native WhatsApp client.
- **FR-016**: System MUST persist cart items in browser storage (`sessionStorage` / `localStorage`) so that page refreshes or language switches retain the order without loss.
- **FR-017**: All cart UI elements, buttons, inputs, and drawers MUST adhere to bidirectional layout rules (RTL for Arabic, LTR for English) using CSS logical properties.
- **FR-018**: System MUST provide a "Clear Cart" button inside the cart sheet to allow wiping the order with a single confirmation.

### Key Entities

- **CartItem**: Represents a selected menu item in the customer's cart. Attributes: `itemId`, `quantity`, `unitPrice`, `itemNote` (optional).
- **Cart**: The collection of `CartItem`s. Attributes: `items`, `tableNumber`, `customerName`, `totalPrice`, `totalCount`.
- **OrderMessage**: The structured representation of the text message sent to WhatsApp. Attributes: `restaurantName`, `tableNumber`, `customerName`, `itemsList`, `totalFormatted`.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Customers can add an item to the cart and see the floating summary bar appear with updated total in under 200 milliseconds.
- **SC-002**: Cart sheet opens smoothly within 300 milliseconds of tapping the floating bar.
- **SC-003**: 100% of generated WhatsApp messages accurately list all items, notes, table number, and exact grand total matching the cart display.
- **SC-004**: Tapping "Send Order via WhatsApp" launches WhatsApp immediately without intermediate page redirects or delay.
- **SC-005**: All touch targets for quantity controls (+ / -), delete buttons, and checkout buttons meet the minimum 44 × 44 px standard.
- **SC-006**: Zero cart data loss when switching languages or refreshing the page.
- **SC-007**: 100% adherence to CSS logical properties; zero physical directional CSS properties in the cart feature.

## Assumptions

- The restaurant's WhatsApp phone number (with international country code, e.g., `201xxxxxxxxx` for Egypt) is configured in the restaurant profile or environment.
- Payment processing is not integrated into this feature; payment is settled offline (cash / card at the table or cashier).
- WhatsApp is accessible on the customer's device (native app or WhatsApp Web).
- Tax and service charges: prices displayed are inclusive of taxes unless specified otherwise in future features.
- Cart is client-managed per device session; multi-device synchronization is out of scope.
