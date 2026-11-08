# Feature Specification: Order Lifecycle & Tracking

**Feature Branch**: `005-order-lifecycle-tracking`  
**Created**: 2026-11-08  
**Status**: Draft  
**Input**: User description: "إكمال دورة الطلبات بالموك داتا أولاً (إنشاء الطلب، رقم طلب فريد، شاشة تأكيد وتتبع الطلب للعميل، وتبويب إدارة الطلبات وتحديث حالتها في لوحة تحكم التاجر)"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Order Placement & Unique Reference Confirmation (Priority: P1) 🎯 MVP

As a customer ordering from a digital menu, when I submit my order via WhatsApp, I want the system to generate a unique human-friendly order reference (e.g. `#ORD-1042`) and direct me to an order confirmation screen, so that I have clear proof of my order and its exact details.

**Why this priority**: Without an order confirmation screen and a reference number, the order experience feels open-ended and informal. A reference number bridges the customer's WhatsApp chat with the merchant's physical kitchen/counter.

**Independent Test**:
1. Add items to cart at `/menu/oriental-grill`.
2. Fill name and phone in the cart drawer.
3. Click "إرسال عبر واتساب / Send via WhatsApp".
4. Verify that WhatsApp opens with `#ORD-XXXX` included in the message, the cart empties, and the browser navigates to `/order/[orderId]`.
5. Verify the confirmation page displays the reference number, item breakdown, and initial status "قيد المراجعة / Pending".

**Acceptance Scenarios**:
1. **Given** items in cart with valid order details, **When** customer taps "Send via WhatsApp", **Then** an order record is persisted locally, a unique reference number is assigned, and the customer is routed to `/order/[orderId]`.
2. **Given** a confirmed order, **When** viewing the `/order/[orderId]` page, **Then** the page displays the order number, timestamp, store name, fulfillment type, itemized list, notes, and grand total.
3. **Given** the customer is on `/order/[orderId]`, **When** they click "فتح محادثة واتساب / Open WhatsApp", **Then** the pre-formatted WhatsApp chat is re-opened with the order reference.

---

### User Story 2 - Merchant Orders Management Tab (Priority: P1)

As a merchant or store manager, I want an "Orders (الطلبات)" tab in my Admin Dashboard that lists all recent customer orders with their statuses, so that my kitchen and staff can view, prepare, and manage orders systematically.

**Why this priority**: Digital ordering provides little value if the store staff cannot view incoming orders organized chronologically or track what has been prepared versus what is still pending.

**Independent Test**:
1. Open `/admin/oriental-grill` and switch to the "الطلبات / Orders" tab.
2. Verify all recently submitted orders appear in reverse chronological order with customer name, phone, order type badge, and total price.
3. Filter orders by status (e.g. "Pending / قيد الانتظار" vs "Completed / مكتمل").
4. Click on an order to expand its itemized breakdown and customer instructions.

**Acceptance Scenarios**:
1. **Given** new customer orders, **When** the merchant opens the Orders tab in admin, **Then** all orders for the current store are displayed with their reference number, customer phone, and status.
2. **Given** an order in the list, **When** the merchant clicks on it, **Then** the itemized summary (quantities, item notes, delivery address) expands.
3. **Given** a list of orders, **When** the merchant filters by status ("All", "Pending", "Preparing", "Completed"), **Then** only matching orders are displayed.

---

### User Story 3 - Live Order Status Updates & Customer Progress Stepper (Priority: P2)

As a customer and as a merchant, I want the merchant to update the order status (e.g. from "قيد المراجعة" to "جاري التجهيز" to "مكتمل") and have the customer's tracking screen reflect that progress with a visual stepper, so that the customer knows exactly when their order is ready or on the way.

**Why this priority**: Real-time status feedback builds trust, prevents repeated calls to the store, and creates a professional customer experience comparable to top delivery apps.

**Independent Test**:
1. Submit an order as a customer and keep `/order/[orderId]` open.
2. In admin `/admin/oriental-grill`, change the order status to "جاري التجهيز / Preparing".
3. Check the customer page; verify the status badge and stepper immediately advance to "جاري التجهيز" without page reload.
4. Advance the status to "مكتمل / Completed" (or "جاري التوصيل"); verify the final step illuminates on customer screen.

**Acceptance Scenarios**:
1. **Given** an order in the merchant admin, **When** staff selects a new status (`pending` -> `preparing` -> `out_for_delivery` -> `completed`), **Then** the status is saved immediately.
2. **Given** the customer tracking page is open, **When** the order status changes in admin, **Then** the visual status stepper and text update automatically via local event synchronization.
3. **Given** an order that cannot be fulfilled, **When** the merchant selects "ملغي / Cancelled", **Then** the customer screen displays a clear cancellation notice with a call-to-action to contact the store.

---

### User Story 4 - Customer Order History & Reorder (Priority: P3)

As a returning customer, I want to view my previous orders on this device, so that I can check past purchases or easily access previous order tracking details.

**Why this priority**: Repeat customers appreciate quick access to previous orders and reference numbers for receipts or reordering.

**Independent Test**:
1. Open customer menu at `/menu/oriental-grill`.
2. Click "طلباتي السابقة / My Orders" in the header or drawer.
3. Verify a list of past orders made on this device is displayed with dates, totals, and links to their tracking pages.

**Acceptance Scenarios**:
1. **Given** previous orders placed on the device, **When** opening the order history view, **Then** past orders are listed with date, store name, reference number, and status.
2. **Given** an order in the history list, **When** clicking on it, **Then** the user is taken directly to that order's tracking page.

---

## Edge Cases

- **Direct Navigation to Invalid Order ID**: If a customer visits `/order/unknown-id`, the page MUST render a clean `EmptyState` explaining that the order was not found, with a button to return to the store menu.
- **Empty Cart Order Trigger**: If a customer tries to submit when the cart is empty or expired, the submission MUST be blocked with an informative message.
- **Multiple Stores on Same Device**: Order records MUST track `storeSlug` so customer history groups orders appropriately and the merchant admin only shows orders belonging to the selected store.
- **Offline / Local Storage Clearing**: If a customer clears browser data, previous orders will no longer appear locally; the system handles this gracefully with an empty history state.
- **Cancelled Orders**: When an order is cancelled, the customer tracking screen MUST display a distinct alert explaining the cancellation and offering a one-tap phone call or WhatsApp button to the store.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate a sequential, human-friendly order reference (format: `#ORD-XXXX`) upon order submission.
- **FR-002**: System MUST persist the complete order record (items, quantities, notes, customer name, phone, order type, delivery address, delivery fee, grand total, status, timestamp, storeSlug) in local mock storage.
- **FR-003**: System MUST provide a dedicated customer order tracking page at `/order/[orderId]` (and `/order`).
- **FR-004**: System MUST display a 4-step visual progress stepper on the tracking page:
  1. `pending`: تم استلام الطلب / Order Received
  2. `preparing`: جاري التجهيز بالمطبخ / Preparing in Kitchen
  3. `out_for_delivery` (or `ready` for Dine-in/Takeaway): مع مندوب التوصيل / جاهز للاستلام
  4. `completed`: تم التسليم / Delivered & Completed
- **FR-005**: System MUST include the generated `#ORD-XXXX` reference inside the formatted WhatsApp message payload.
- **FR-006**: System MUST add a dedicated "الطلبات (Orders)" tab in the Merchant Admin Dashboard (`/admin/[slug]`).
- **FR-007**: System MUST allow merchants to filter orders by status (`all`, `pending`, `preparing`, `out_for_delivery`, `completed`, `cancelled`).
- **FR-008**: System MUST allow merchants to update order status with one click, persisting the update and dispatching a cross-view sync event (`digital_menu_order_updated`).
- **FR-009**: System MUST support cancellation of orders with custom confirmation dialog (`ConfirmDialog`).
- **FR-010**: System MUST support bilingual presentation (Arabic RTL and English LTR) across both the customer tracking screen and the admin orders tab.
- **FR-011**: System MUST implement `IOrderRepository` with clean interfaces so switching to Supabase PostgreSQL orders table in the future requires zero UI refactoring.
- **FR-012**: System MUST provide a customer "My Orders" modal or drawer accessible from the customer menu view.

---

### Key Entities

- **OrderRecord**:
  - `id`: Unique identifier (e.g., `ord_1731081600000_abc`).
  - `reference`: Human-friendly code (e.g., `#ORD-1042`).
  - `storeSlug`: Associated store slug.
  - `storeName`: Localized store name at time of order.
  - `storePhone`: WhatsApp receiving phone number.
  - `customerName`: Customer full name.
  - `customerPhone`: Customer phone number.
  - `orderType`: `dine_in` | `takeaway` | `delivery`.
  - `deliveryAddress`: Optional detailed address string.
  - `deliveryFee`: Numeric delivery fee in EGP.
  - `items`: Array of item records (id, name_ar, name_en, price, quantity, itemNote).
  - `itemsTotal`: Sum of item prices.
  - `totalPrice`: Grand total including delivery fee.
  - `status`: `pending` | `preparing` | `out_for_delivery` | `completed` | `cancelled`.
  - `createdAt`: ISO 8601 date string.
  - `updatedAt`: ISO 8601 date string.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Submitting an order creates the record, includes the `#ORD-XXXX` reference in WhatsApp, and routes to `/order/[id]` in under 500ms.
- **SC-002**: Status update in merchant admin reflects on customer tracking page in under 300ms without page reload.
- **SC-003**: 100% of order details (items, notes, customer contact, address) are legibly displayed in both Arabic and English.
- **SC-004**: All component files adhere strictly to the project constitution (each file <= 180 lines, zero native popups, 100% logical directional CSS).

---

## Assumptions

- **Mock-First Persistence**: In this development phase, orders are stored in `localStorage` under `orders_store_<slug>` and `customer_orders_history` to simulate the future Supabase `orders` table.
- **Multi-Tab Sync**: Communication between admin and customer tracking screens on the same device/browser is powered by browser `storage` events and custom window events.
- **Direct WhatsApp Handoff**: The WhatsApp URL remains the primary outbound communication channel, but now carries the exact `#ORD-XXXX` reference so customer and cashier reference the same ticket.
