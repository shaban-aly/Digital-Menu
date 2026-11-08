# Feature Specification: Cart & WhatsApp Ordering

**Feature Branch**: `002-cart-whatsapp-ordering`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "سلة الطلبات والطلب عبر واتساب (Cart & WhatsApp Order): (1) إضافة الأصناف للسلة بزر سريع (+) على البطاقة وداخل نافذة التفاصيل، مع منع إضافة الأصناف غير المتاحة. (2) حفظ محتويات السلة في localStorage. (3) شريط سفلي عائم يظهر تلقائياً عند وجود صنف واحد أو أكثر ويعرض عدد القطع والإجمالي (ج.م) وزر عرض السلة. (4) نافذة مراجعة السلة (Drawer/Modal) للتحكم في الكميات أو الحذف أو إفراغ السلة، إضافة ملاحظات خاصة، واختيار نوع الطلب: داخل المطعم (Dine-in) مع رقم طاولة إجباري أو استلام من الفرع (Takeaway). (5) زر إرسال الطلب بتنسيق أنيق ومحسوب التكلفة يفتح رابط wa.me مباشرة."

## User Scenarios & Testing

### User Story 1 - Quick Add to Cart & Sticky Floating Bar (Priority: P1)

A customer browsing the digital menu wants to quickly order dishes. They can tap a prominent quick-add button (+) on any available item card or within the item detail modal. When the first item is added, an animated sticky floating bar slides up at the bottom of the screen showing the total item count, total price in Egyptian Pounds (`ج.م` / `EGP`), and a "View Cart" action.

**Why this priority**: Core entry point to purchasing. Without adding items and viewing the live total, no checkout or order can happen.

**Independent Test**: Navigate to `/ar/menu`, click (+) on a menu card, verify the card reflects the added state and the sticky bottom bar immediately displays "1 صنف" with the correct item price in `ج.م`.

**Acceptance Scenarios**:

1. **Given** an available menu item on the menu or in the modal, **When** the customer taps the (+) button, **Then** the item is added to the cart and the sticky bottom bar appears with the updated item count and running total in EGP.
2. **Given** an unavailable item, **When** viewed on the card or in the modal, **Then** the add button is disabled and cannot be tapped.
3. **Given** an item already in the cart, **When** the customer taps (+) or (-) on the card or in the modal, **Then** the quantity updates in place and the floating bar updates in real time.
4. **Given** the customer decreases an item's quantity to zero, **When** no other items remain in the cart, **Then** the sticky floating bar smoothly disappears.

---

### User Story 2 - Cart Persistence in Local Storage (Priority: P1)

A customer adds several dishes to their cart while on their mobile phone, then accidentally refreshes the browser, locks their screen, or switches the interface language between Arabic and English. Their cart contents, selected quantities, and custom notes remain intact without data loss.

**Why this priority**: Mobile browser reloads and memory evictions are extremely common in restaurants. Losing cart contents causes customer frustration and abandoned orders.

**Independent Test**: Add 3 items to the cart, refresh the browser page, and verify the cart still retains all 3 items with their exact quantities and total price.

**Acceptance Scenarios**:

1. **Given** items in the cart, **When** the page is reloaded or the browser tab is closed and reopened on the same device, **Then** all items, quantities, and notes are automatically restored from local storage.
2. **Given** items in the cart, **When** the customer toggles the language between Arabic (RTL) and English (LTR), **Then** the cart items remain preserved, displaying item titles and currency in the newly selected language.

---

### User Story 3 - Review & Customize Cart in Drawer / Modal (Priority: P1)

The customer taps "View Cart" on the floating bar. A slide-up drawer (or modal on desktop) opens, showing an itemized list of selected dishes, their unit prices, individual item quantities with (+ / -) controls, a delete button per item, an option to add special instructions per item (e.g., "بدون شطة" / "extra sauce"), and an "Empty Cart" button to wipe the order if desired.

**Why this priority**: Customers need to review their order, customize individual dishes according to dietary needs, and see the itemized breakdown before committing to the order.

**Independent Test**: Open the cart drawer, increase quantity of an item, add an item-level note, delete another item, and verify the total recalculates instantly.

**Acceptance Scenarios**:

1. **Given** items exist in the cart, **When** the customer taps "View Cart", **Then** the cart drawer slides up displaying the itemized breakdown, quantity buttons (+ / -), item-level notes, and total price.
2. **Given** the customer taps (+), (-), or the delete trash icon for an item, **Then** the item's quantity updates or is removed, and the total price recalculates instantly.
3. **Given** the customer taps "Add Note" on an item, **When** they type a custom instruction, **Then** the note is saved with that specific cart item.
4. **Given** the customer taps "Empty Cart", **When** they confirm, **Then** all items are removed from the cart, local storage is cleared, and the drawer displays an empty state.

---

### User Story 4 - Order Type Selection (Dine-in, Takeaway, Delivery) (Priority: P1)

Before submitting the order, the customer chooses their order fulfillment type according to the business capabilities:
1. **داخل المطعم (Dine-in)**: Requires entering a Table Number (إجباري). If opened via QR code with `?table=N`, the table number is automatically pre-filled. Automatically hidden for Supermarket/Groceries businesses.
2. **استلام من الفرع (Takeaway)**: Table number is not required; customer enters their name and phone number for pickup.
3. **توصيل للمنزل (Delivery)**: Requires customer name, mobile phone number, and detailed delivery address. Adds delivery fee (`deliveryFee`) to the order subtotal.

**Why this priority**: Supports the platform's multi-tenant business model covering dine-in restaurants, takeaway cafes, and delivery-centric supermarkets.

**Independent Test**:
- On `oriental-grill` or `specialty-cafe`, select "Dine-in" and attempt to submit without table number -> verify error.
- On `fresh-market`, verify "Dine-in" is hidden, select "Delivery", submit without address -> verify address error; fill address and phone -> verify delivery fee is calculated and included in WhatsApp link.

**Acceptance Scenarios**:

1. **Given** the customer selects "داخل المطعم (Dine-in)", **When** they attempt to submit without entering a table number, **Then** the system prevents submission and highlights the table number input as required.
2. **Given** the customer opens the menu with a URL parameter `?table=5`, **When** the cart opens, **Then** "Dine-in" is selected and Table 5 is pre-filled automatically.
3. **Given** the customer selects "استلام من الفرع (Takeaway)", **When** they submit, **Then** customer name and mobile phone number are validated.
4. **Given** the customer selects "توصيل للمنزل (Delivery)", **When** they submit, **Then** customer name, phone number, and detailed address are strictly validated, and the delivery fee is added to the grand total in the drawer and WhatsApp message.
5. **Given** a business model of type "supermarket", **Then** the "Dine-in" option is automatically hidden from the order type selector.

---

### User Story 5 - Send Order via WhatsApp (Priority: P1)

The customer taps "Send Order via WhatsApp" (إرسال الطلب عبر واتساب). The system validates the inputs, composes an elegant, clear, structured plain-text message in the current language, and opens a direct `https://wa.me/<phone>?text=...` link addressing the restaurant's WhatsApp number.

**Why this priority**: Delivers the finalized order directly to the restaurant kitchen/waiter staff with zero friction and without requiring a paid payment gateway.

**Independent Test**: Complete a cart with 2 items and Table 3 in Arabic mode, click WhatsApp button, verify the generated URL contains an encoded message listing restaurant name, Table 3, both items with quantities and prices in `ج.م`, and the exact grand total.

**Acceptance Scenarios**:

1. **Given** a valid cart with order type and table number (if dine-in), **When** the customer taps "Send Order via WhatsApp", **Then** the browser launches WhatsApp directly to the restaurant's phone number.
2. **Given** the generated WhatsApp text in Arabic, **When** inspected, **Then** it includes:
   - Header with restaurant name and order type (e.g. `طلب جديد - داخل المطعم (طاولة 3)`).
   - Itemized list with bullets (e.g. `• 2x كباب وكفتة مشوية (580 ج.م) - ملاحظة: بدون بصل`).
   - General order notes (if provided).
   - Grand Total (e.g. `الإجمالي: 580 ج.م`).
3. **Given** the customer is viewing the site in English, **When** they submit, **Then** the message is formatted in English with `EGP` currency formatting.
4. **Given** special characters or spaces in the notes, **When** encoded, **Then** all characters are properly URL-encoded using `encodeURIComponent` to prevent message truncation.

---

### Edge Cases

- What happens if the customer has an empty cart? The floating bar is hidden; if the cart drawer is accessed directly, it shows an empty state with a "Browse Menu" button.
- What happens if an item in the cart becomes out-of-stock after being added? The cart sheet displays an "Unavailable" badge on that item and disables the submit button until the item is removed.
- What happens if the restaurant has no WhatsApp number configured? A clear notification is shown advising the customer to inform their waiter directly.
- What happens if the customer closes WhatsApp and returns to the app? The cart remains in memory, giving the customer the option to keep or clear the cart.
- What happens when a user enters long text in the notes? Notes are limited to 150 characters to prevent message overflow.

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a quick-add (+) button on each available menu item card and inside the item detail modal.
- **FR-002**: System MUST prevent adding unavailable (out-of-stock) items to the cart and disable their add triggers.
- **FR-003**: System MUST persist the entire cart state (items, quantities, item notes, order type, table number, general notes) in `localStorage`.
- **FR-004**: System MUST restore the cart state from `localStorage` upon page load or reload without data loss.
- **FR-005**: System MUST display a sticky floating bottom bar when the cart contains one or more items.
- **FR-006**: The floating bottom bar MUST show the total item count, the calculated total price in Egyptian Pounds (`ج.م` / `EGP`), and a "View Cart" button.
- **FR-007**: The floating bottom bar MUST hide smoothly when the cart item count reaches zero.
- **FR-008**: Tapping "View Cart" MUST open a cart drawer/modal displaying all selected items with individual quantity adjusters (+ / -), item unit prices, and individual item subtotals.
- **FR-009**: The cart drawer MUST allow attaching an optional custom note (up to 150 characters) to any individual item.
- **FR-010**: The cart drawer MUST allow deleting individual items, as well as an "Empty Cart" button that clears the entire cart with confirmation.
- **FR-011**: The cart drawer MUST provide an Order Type toggle: "داخل المطعم (Dine-in)" vs. "استلام من الفرع (Takeaway)".
- **FR-012**: When "Dine-in" is selected, the Table Number field MUST be strictly required before order submission.
- **FR-013**: System MUST automatically extract and pre-populate the table number if the URL contains a `?table=<value>` query parameter.
- **FR-014**: When "Takeaway" is selected, the Table Number field MUST be hidden or optional, and a Customer Name/Phone field is provided.
- **FR-015**: System MUST calculate the grand total in real-time as the sum of all item subtotals, formatted in EGP (`ج.م` in Arabic, `EGP` in English).
- **FR-016**: System MUST provide an "Send Order via WhatsApp" button with a WhatsApp icon and minimum 44×44px touch target.
- **FR-017**: Clicking the WhatsApp button MUST validate all required fields, construct a cleanly formatted, itemized plain-text message in the current language, URL-encode it, and open `https://wa.me/<phone>?text=<encoded_text>` in a new tab or trigger the WhatsApp mobile app.
- **FR-018**: All cart components MUST reside in `src/features/cart/` with maximum 180 lines per file, strictly following CSS logical properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`) for full RTL/LTR bilingual support.

### Key Entities

- **CartItem**: Represents a selected menu item in the cart. Attributes: `id`, `menuItemId`, `name_ar`, `name_en`, `unitPrice`, `quantity`, `itemNote`, `image_url`, `is_available`.
- **OrderType**: Enum: `'dine_in' | 'takeaway'`.
- **CartState**: The comprehensive cart entity: `items: CartItem[]`, `orderType: OrderType`, `tableNumber: string`, `customerName?: string`, `generalNote?: string`, `totalCount: number`, `totalPrice: number`.
- **WhatsAppMessage**: Structured plain-text template formatted per locale for transmission via WhatsApp.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Tapping (+) adds an item and displays the sticky floating bar in under 150 milliseconds.
- **SC-002**: 100% of cart data is persisted in `localStorage` and successfully recovered after browser reload.
- **SC-003**: 100% of generated WhatsApp links properly open the WhatsApp interface with all items, quantities, notes, table number, and exact grand total correctly listed.
- **SC-004**: Form submission with missing table number in "Dine-in" mode is blocked 100% of the time with immediate inline validation feedback.
- **SC-005**: All interactive buttons (quantity +/-, delete, drawer open/close, WhatsApp submit) maintain minimum 44×44px touch targets.
- **SC-006**: 100% adherence to CSS logical properties; zero physical directional properties (`left`, `right`, `ml-`, `mr-`, `pl-`, `pr-`) in `src/features/cart/`.
- **SC-007**: Zero component files exceeding the 180-line constitutional limit.

## Assumptions

- The restaurant's WhatsApp phone number is configured in the environment or restaurant settings (e.g. Egyptian number format `201xxxxxxxxx`).
- Customers settle payments in person (cash, credit card, or digital wallet) at the table or counter; online payment gateways are out of scope for this feature.
- WhatsApp is accessible on the customer's mobile device or desktop browser.
- Menu items added to the cart reflect prices inclusive of any applicable taxes.
