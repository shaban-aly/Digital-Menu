# Research & Architectural Decisions: Order Lifecycle & Tracking

**Feature**: `005-order-lifecycle-tracking`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Unique Human-Friendly Order Reference Number

### Context & Problem
When a customer orders via WhatsApp, having an internal ID like `ord_1731081600000_abc` is too unwieldy for human conversation. The cashier and customer need a punchy, memorable reference like `#ORD-1042`.

### Decision
Generate a reference using the format `#ORD-` followed by an incrementing counter or a 4-digit hash based on the daily sequence (e.g. `#ORD-1001` through `#ORD-9999`) stored locally in `order_sequence_counter`.
- The reference is included directly at the top of the generated WhatsApp message:
  `*طلب جديد #ORD-1042*`
- The reference is displayed prominently on the customer tracking screen `/order/[id]` and in the merchant admin orders table.

---

## 2. Mock Order Repository Pattern & Multi-Tab Synchronization

### Context & Problem
In the mock-first architecture, orders must be created from the customer cart, persisted locally, and made immediately visible in the Merchant Admin Dashboard, while allowing status updates in the dashboard to update the customer tracking screen in real-time.

### Decision
Implement `IOrderRepository` with `LocalStorageOrderRepository`:
- Stores store-specific orders under `orders_store_<slug>`.
- Stores customer's personal order history under `customer_orders_history`.
- When an order is created or updated, dispatches:
  `window.dispatchEvent(new CustomEvent("digital_menu_order_updated", { detail: { orderId, storeSlug, status } }))`
- Listens to the browser's native `storage` event so changes made in one browser tab (e.g., admin dashboard) reflect immediately in another tab (e.g., customer tracking page).

---

## 3. Order Status State Machine

### Transitions
```text
[pending] ──► [preparing] ──► [out_for_delivery / ready] ──► [completed]
    │                │                       │
    └────────────────┴───────────────────────┴──► [cancelled]
```

- `pending` (قيد المراجعة / Order Received)
- `preparing` (جاري التجهيز بالمطبخ / Preparing in Kitchen)
- `out_for_delivery` (مع المندوب للتوصيل / Out for Delivery) OR `ready` (جاهز للاستلام / Ready for Pickup)
- `completed` (تم التسليم / Delivered & Completed)
- `cancelled` (ملغي / Cancelled)

---

## 4. Component Decomposition (<= 180 lines)

Adhering strictly to the Constitution:
- `order-status-stepper.tsx`: Visual animated progress bar and step indicators (<= 90 lines).
- `order-summary-card.tsx`: Itemized receipt, customer details, delivery address, notes (<= 120 lines).
- `order-tracking-view.tsx`: Customer tracking page layout (<= 140 lines).
- `admin-orders-tab.tsx`: Admin orders manager with status filter bar and search (<= 150 lines).
- `admin-order-card.tsx`: Individual order card with one-click status transitions and details expander (<= 140 lines).
- `customer-orders-modal.tsx`: Modal listing past orders for repeat customers (<= 130 lines).
- All cancellations use `ConfirmDialog`.
