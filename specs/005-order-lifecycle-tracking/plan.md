# Implementation Plan: Order Lifecycle & Tracking

**Branch**: `005-order-lifecycle-tracking` | **Date**: 2026-11-08 | **Spec**: [specs/005-order-lifecycle-tracking/spec.md](file:///e:/Projects/digital-menu/specs/005-order-lifecycle-tracking/spec.md)

**Input**: Feature specification from `/specs/005-order-lifecycle-tracking/spec.md`

---

## Summary

Complete the full digital menu order loop using the mock-data-first pattern. When a customer checks out via WhatsApp, the system automatically assigns a unique human-friendly order reference (e.g. `#ORD-1042`), saves the order locally, directs the customer to a real-time order tracking screen (`/order/[id]`) with a 4-step progress stepper, and populates a new "Orders (الطلبات)" tab in the Merchant Admin Dashboard (`/admin/[slug]`). The merchant can filter orders and update their status (Pending -> Preparing -> Out for Delivery/Ready -> Completed), with instant cross-view event synchronization back to the customer tracking view.

---

## Technical Context

**Language/Version**: TypeScript 5.7+ (Strict Mode)  
**Primary Dependencies**: Next.js 16+ App Router, React 19, Tailwind CSS v4, Lucide React, Zod v4  
**Storage**: `LocalStorageOrderRepository` (`IOrderRepository` abstraction) → designed for 1-to-1 migration to Supabase `orders` table  
**Testing**: Vitest (repository & schema unit tests) and Playwright (end-to-end checkout & status update flows)  
**Constraints**: Component line count <= 180 lines, zero native dialogs, 100% logical directional CSS  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan Compliance Status | Notes |
|:---|:---|:---:|:---|
| **I. Locked Tech Stack** | Next.js 16+, React 19, Tailwind v4, Zod v4 | **PASSED** | Complies with locked stack; Zod v4 schemas for orders. |
| **II. Folder Structure** | `src/features/orders/`, `src/app/order/`, `src/features/admin/` | **PASSED** | Scoped cleanly under `src/features/orders/`. |
| **III. Component Line Limit** | Max 180 lines per component | **PASSED** | Decomposed into stepper, card, tracking view, and admin order row. |
| **III. Prohibition of Native Dialogs** | No `window.confirm()` | **PASSED** | Uses custom `ConfirmDialog` for order cancellations. |
| **IV. Separation of Concerns** | Logic in services/hooks, UI presentational | **PASSED** | Data access in `order-repository.ts` and `use-order.ts`. |
| **V. Internationalization** | Bilingual AR/EN, logical CSS | **PASSED** | All texts in `ar.json` & `en.json`; 100% logical CSS utilities. |

---

## Project Structure

### Documentation

```text
specs/005-order-lifecycle-tracking/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan
├── research.md          # Reference generation & multi-tab sync
├── data-model.md        # Order schemas
├── contracts/
│   └── order-repository.md # Repository interface contract
├── quickstart.md        # Step-by-step validation guide
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Implementation tasks
```

### Source Code Architecture

```text
src/
├── app/
│   └── order/
│       ├── page.tsx                  # Customer orders history / search
│       └── [orderId]/
│           └── page.tsx              # Order confirmation & live tracking page
├── features/
│   ├── orders/
│   │   ├── components/
│   │   │   ├── order-status-stepper.tsx   # Visual progress stepper (4 steps)
│   │   │   ├── order-summary-card.tsx     # Itemized breakdown & totals
│   │   │   ├── order-tracking-view.tsx    # Customer tracking screen layout
│   │   │   └── customer-orders-modal.tsx  # Customer past orders drawer
│   │   ├── hooks/
│   │   │   ├── use-order-tracking.ts      # Live order tracking & event listener
│   │   │   └── use-customer-orders.ts     # Customer order history hook
│   │   ├── services/
│   │   │   └── order-repository.ts        # IOrderRepository (localStorage + sync)
│   │   └── types.ts                       # OrderRecord, OrderStatus, Zod schemas
│   ├── cart/
│   │   └── components/
│   │       └── cart-drawer.tsx            # Integrated with createOrder & navigation
│   └── admin/
│       └── components/
│           ├── admin-orders-tab.tsx       # Orders tab in Merchant Dashboard
│           └── admin-order-card.tsx       # Order row with status transitions
tests/
├── unit/
│   └── order-repository.test.ts          # Unit tests for order creation & status updates
└── e2e/
    └── order-lifecycle.spec.ts           # End-to-end checkout, tracking & admin flow
```
