# Implementation Plan: Cart & WhatsApp Ordering

**Branch**: `002-cart-whatsapp-ordering` | **Date**: 2026-11-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-cart-whatsapp-ordering/spec.md`

## Summary

Build a client-side shopping cart with instant `localStorage` persistence, a floating bottom summary bar, a slide-up cart drawer with quantity adjustments and custom notes, Dine-in vs. Takeaway order type selection (requiring a table number for dine-in), and one-click formatted order submission directly to the restaurant's WhatsApp via `wa.me` deep links. The feature lives in `src/features/cart/` and integrates seamlessly with `src/features/menu/` without violating any constitutional rules.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) on Node.js 20+

**Primary Dependencies**: Next.js 16+ App Router (Turbopack), React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), Zod v4, Lucide React

**Storage**: Browser `localStorage` (`digital_menu_cart_v1`) for zero-latency client persistence; no new database tables needed (YAGNI / offline payment model)

**Testing**: Vitest v5 (unit tests for WhatsApp link builder, cart state logic, Zod validation), Playwright (E2E)

**Target Platform**: Mobile-first responsive web (320 px – 1440 px)

**Project Type**: Web application feature slice (`src/features/cart/`)

**Performance Goals**: Cart operations < 50 ms, floating bar animation 60 fps, zero layout shifts

**Constraints**: All directional CSS via logical properties (ms-/me-/ps-/pe-/text-start/text-end), no `any`/`@ts-ignore`, max 180 lines per component file, minimum 44×44px touch targets

**Scale/Scope**: ~1–30 cart items per session, single restaurant phone number, client-side execution

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | Locked Technology Stack | ✅ PASS | Next.js 16+ App Router + React 19 + TypeScript strict + Tailwind v4 + Zod v4. No external state libs (Zustand/Redux) needed; native React 19 Context used. |
| II | Strict Folder Structure | ✅ PASS | All new code lives inside `src/features/cart/` (`components/`, `hooks/`, `services/`, `types.ts`). Shared UI primitives live in `src/components/ui/`. |
| III | Code & Component Rules | ✅ PASS | 180-line ceiling strictly respected by separating `cart-bar.tsx` from `cart-drawer.tsx`. Separation of WhatsApp formatting into `services/whatsapp-service.ts`. No `any`/`@ts-ignore`. |
| IV | Mobile-First & RTL | ✅ PASS | 320 px baseline, 44×44 px touch targets for all +/- buttons and actions. Fully bilingual (AR/EN) with logical CSS properties only. Currency formatted in EGP (`ج.م`). |
| V | Performance & Simplicity | ✅ PASS | Zero new npm packages. YAGNI: No backend cart database required for WhatsApp ordering. Lightweight `localStorage` persistence. |

**Gate result: ✅ ALL PASS — proceed to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/002-cart-whatsapp-ordering/
├── spec.md
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── whatsapp-payload.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── features/
│   ├── cart/
│   │   ├── components/
│   │   │   ├── cart-bar.tsx             # Floating bottom bar with count, total EGP, View Cart
│   │   │   ├── cart-drawer.tsx           # Slide-up drawer reviewing items, notes, order type
│   │   │   ├── cart-item-row.tsx         # Individual item row with +/- controls and note toggle
│   │   │   ├── order-type-selector.tsx   # Dine-in vs Takeaway toggle and table input
│   │   │   └── add-to-cart-button.tsx    # Compact (+) / stepper button for cards and modals
│   │   ├── hooks/
│   │   │   └── use-cart.tsx             # React 19 Context provider + hook + localStorage sync
│   │   ├── services/
│   │   │   └── whatsapp-service.ts      # Pure service generating formatted wa.me URLs
│   │   └── types.ts                     # CartItem, CartState, OrderType, Zod schemas
│   │
│   └── menu/
│       └── components/
│           ├── menu-item-card.tsx       # Enhanced to render AddToCartButton
│           ├── item-detail-modal.tsx    # Enhanced to include AddToCartButton
│           └── menu-page.tsx            # Wraps tree in CartProvider and renders CartBar & CartDrawer
│
├── lib/
│   └── i18n/
│       ├── ar.json                      # Added translations for cart, order types, notes
│       └── en.json                      # Added translations for cart, order types, notes
│
tests/
├── unit/
│   ├── whatsapp-service.test.ts         # Unit test for WhatsApp URL generation & formatting
│   └── cart-reducer.test.ts             # Unit test for cart calculations and persistence
└── e2e/
    └── cart-ordering.spec.ts            # E2E test for add to cart, drawer, and WhatsApp launch
```

**Structure Decision**: Fully encapsulated feature-sliced architecture under `src/features/cart/`. Integrates cleanly into `src/features/menu/` without breaking any existing functionality.

## Complexity Tracking

> No constitution violations detected. This section is intentionally empty.
