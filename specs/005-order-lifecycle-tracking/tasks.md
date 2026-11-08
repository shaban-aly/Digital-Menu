# Tasks: Order Lifecycle & Tracking

**Input**: Design documents from `/specs/005-order-lifecycle-tracking/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/order-repository.md`, `quickstart.md`  
**Constitution Alignment**: Next.js 16+ App Router, React 19, Tailwind CSS v4, Zod v4, TypeScript Strict Mode, max 180 lines per component, zero physical directional CSS, zero native dialogs, zero `any` / `@ts-ignore`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Translation dictionary entries and feature directory scaffolding

- [X] T001 [P] Add Arabic translation keys for orders, tracking, status badges, and stepper in `src/lib/i18n/ar.json`
- [X] T002 [P] Add English translation keys for orders, tracking, status badges, and stepper in `src/lib/i18n/en.json`
- [X] T003 Create orders feature directory layout in `src/features/orders/components/`, `src/features/orders/hooks/`, `src/features/orders/services/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TypeScript interfaces, Zod schemas, Order Repository with sequential reference generation and event sync

**⚠️ CRITICAL**: No user story work can begin until this foundational layer is in place.

- [X] T004 [P] Create Order TypeScript interfaces and Zod schemas (`OrderStatusSchema`, `OrderItemSchema`, `OrderRecordSchema`) in `src/features/orders/types.ts`
- [X] T005 Implement `LocalStorageOrderRepository` conforming to `IOrderRepository` with unique `#ORD-XXXX` reference generator and cross-view sync in `src/features/orders/services/order-repository.ts`
- [X] T006 [P] Unit tests for `LocalStorageOrderRepository` (order creation, sequential reference, status updates, multi-store filtering) in `tests/unit/order-repository.test.ts`
- [X] T007 Implement `useOrderTracking` hook for real-time order status subscription in `src/features/orders/hooks/use-order-tracking.ts`

**Checkpoint**: Foundation ready - order repository, schemas, reactive hooks, and sync verified.

---

## Phase 3: User Story 1 - Order Placement & Confirmation Screen (Priority: P1) 🎯 MVP

**Goal**: When customer submits an order via WhatsApp, assign unique reference `#ORD-XXXX`, persist the order locally, empty the cart, and navigate to `/order/[orderId]` with full receipt.  
**Independent Test**: Add items to cart, checkout via WhatsApp, verify WhatsApp message starts with `*طلب جديد #ORD-XXXX*`, and browser opens `/order/[orderId]` with receipt.

### Tests for User Story 1

- [X] T008 [P] [US1] End-to-end Playwright test for order submission, reference generation, and confirmation page in `tests/e2e/order-placement.spec.ts`

### Implementation for User Story 1

- [X] T009 [US1] Update `src/features/cart/services/whatsapp-service.ts` to accept optional `orderReference` and prefix WhatsApp message with `*طلب جديد #ORD-XXXX*`
- [X] T010 [US1] Integrate `OrderRepository.createOrder` into `src/features/cart/components/cart-drawer.tsx` on WhatsApp checkout, clear cart, and navigate to `/order/[orderId]`
- [X] T011 [P] [US1] Create OrderSummaryCard component with itemized breakdown, notes, customer details, and price totals in `src/features/orders/components/order-summary-card.tsx`
- [X] T012 [US1] Create OrderTrackingView component displaying order header, summary, and action buttons in `src/features/orders/components/order-tracking-view.tsx`
- [X] T013 [US1] Create dynamic order tracking route at `src/app/order/[orderId]/page.tsx` and fallback at `src/app/order/page.tsx`

**Checkpoint**: User Story 1 is fully functional and delivers an independently testable MVP.

---

## Phase 4: User Story 2 & 3 - Merchant Orders Tab & Live Status Updates (Priority: P1/P2)

**Goal**: Merchant can view incoming orders in an "Orders" tab in admin, update status with one click, and customer's tracking screen reflects the progress stepper in real-time.  
**Independent Test**: Open order tracking page in one window; in admin, update status from "قيد الانتظار" to "جاري التجهيز", verify customer stepper advances immediately.

### Tests for User Story 2 & 3

- [X] T014 [P] [US2] End-to-end Playwright test for merchant order management and status update sync in `tests/e2e/admin-orders.spec.ts`

### Implementation for User Story 2 & 3

- [X] T015 [P] [US3] Create OrderStatusStepper component with 4 visual progress steps and status badge in `src/features/orders/components/order-status-stepper.tsx`
- [X] T016 [US3] Embed OrderStatusStepper into `src/features/orders/components/order-tracking-view.tsx`
- [X] T017 [P] [US2] Create AdminOrderCard component with status selector, customer contact info, and item expander in `src/features/admin/components/admin-order-card.tsx`
- [X] T018 [US2] Create AdminOrdersTab component with status filter buttons, search input, and orders list in `src/features/admin/components/admin-orders-tab.tsx`
- [X] T019 [US2] Mount Orders tab into `src/features/admin/components/admin-header.tsx` and `src/features/admin/components/admin-dashboard-page.tsx`

**Checkpoint**: Full real-time order lifecycle between customer and merchant is operational.

---

## Phase 5: User Story 4 - Customer Order History (Priority: P3)

**Goal**: Returning customer can view their past orders on this device and navigate back to tracking receipts.  
**Independent Test**: Click "طلباتي السابقة" on menu page, verify modal lists past orders with direct links.

### Implementation for User Story 4

- [X] T020 [P] [US4] Implement `useCustomerOrders` hook in `src/features/orders/hooks/use-customer-orders.ts`
- [X] T021 [US4] Create CustomerOrdersModal component listing past orders with timestamps and links in `src/features/orders/components/customer-orders-modal.tsx`
- [X] T022 [US4] Add "طلباتي السابقة / My Orders" button trigger in customer header `src/features/menu/components/restaurant-header.tsx`

---

## Phase 6: Polish & Verification

**Purpose**: Strict compliance verification, linting, type-checking, and production build

- [X] T023 [P] Audit component line counts across `src/features/orders/` ensuring each file is <= 180 lines
- [X] T024 [P] Verify zero usage of native browser dialogs across orders feature
- [X] T025 Run TypeScript strict type-check (`npm run type-check`) ensuring zero `any` or `@ts-ignore`
- [X] T026 Run ESLint check (`npm run lint`) and Vitest test suite (`npm test`)
- [X] T027 Execute production build (`npm run build`) with Next.js 16 Turbopack and verify clean build

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies — executes immediately.
2. **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories.
3. **User Stories (Phase 3+)**: All depend on Foundational (Phase 2).
   - **US1 (P1)**: Independent MVP slice (Order creation & tracking page).
   - **US2 & US3 (P1/P2)**: Merchant Orders tab + live stepper updates.
   - **US4 (P3)**: Customer order history.
4. **Polish (Phase 6)**: Runs after all user stories are complete.
