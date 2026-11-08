# Tasks: Cart & WhatsApp Ordering

**Input**: Design documents from `/specs/002-cart-whatsapp-ordering/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/whatsapp-payload.md`, `quickstart.md`  
**Constitution Alignment**: Next.js 16+ App Router, React 19, Tailwind CSS v4, Zod v4, TypeScript Strict Mode, max 180 lines per component, zero physical directional CSS classes, zero `any` / `@ts-ignore`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Directory scaffolding, translation dictionary entries for cart interactions

- [X] T001 Create cart feature directory structure in `src/features/cart/components/`, `src/features/cart/hooks/`, `src/features/cart/services/`
- [X] T002 [P] Add Arabic translation keys for cart, order types, notes, and WhatsApp buttons in `src/lib/i18n/ar.json`
- [X] T003 [P] Add English translation keys for cart, order types, notes, and WhatsApp buttons in `src/lib/i18n/en.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, WhatsApp formatting service, and CartContext state provider

- [X] T004 [P] Create cart TypeScript interfaces and Zod schemas (`CartItem`, `OrderType`, `CartState`, `WhatsAppOrderPayload`) in `src/features/cart/types.ts`
- [X] T005 [P] Implement pure WhatsApp message generator and `wa.me` deep link builder in `src/features/cart/services/whatsapp-service.ts` per contract in `specs/002-cart-whatsapp-ordering/contracts/whatsapp-payload.md`
- [X] T006 [P] Unit test for WhatsApp URL builder and formatting in `tests/unit/whatsapp-service.test.ts`
- [X] T007 Implement React 19 CartContext & `useCart` hook with `localStorage` persistence and hydration guard in `src/features/cart/hooks/use-cart.tsx`
- [X] T008 [P] Unit test for cart calculations, item additions, removals, and quantities in `tests/unit/cart-reducer.test.ts`

---

## Phase 3: User Story 1 - Quick Add to Cart & Sticky Floating Cart Bar (Priority: P1) 🎯 MVP

**Goal**: Customer can tap (+) on an available item card or detail modal to add items, view a live floating summary bar with item count and EGP total, and see unavailable items locked.  
**Independent Test**: Navigate to `/ar/menu`, tap (+) on an available item, verify floating bar appears showing "1 صنف" and price in `ج.م`.

### Tests for User Story 1

- [X] T009 [P] [US1] End-to-end test for quick add to cart, out-of-stock guard, and floating summary bar in `tests/e2e/cart-bar.spec.ts`

### Implementation for User Story 1

- [X] T010 [P] [US1] Create AddToCartButton component with (+) trigger, quantity steppers, and out-of-stock disabled state in `src/features/cart/components/add-to-cart-button.tsx`
- [X] T011 [P] [US1] Create CartBar sticky floating bottom component with item count, total price in EGP, and "View Cart" action in `src/features/cart/components/cart-bar.tsx`
- [X] T012 [US1] Integrate AddToCartButton into menu cards in `src/features/menu/components/menu-item-card.tsx`
- [X] T013 [US1] Integrate AddToCartButton into detail modal in `src/features/menu/components/item-detail-modal.tsx`
- [X] T014 [US1] Wrap `src/features/menu/components/menu-page.tsx` with CartProvider and mount CartBar

**Checkpoint**: User Story 1 is fully functional and delivers an independently testable MVP.

---

## Phase 4: User Story 2 & 3 - View/Manage Cart Drawer & Submit via WhatsApp (Priority: P1)

**Goal**: Customer opens cart drawer to view itemized breakdown, adjust quantities, delete items, attach item-level notes, and send the order to WhatsApp.  
**Independent Test**: Open cart drawer, adjust quantities, add a note "بدون بصل", click WhatsApp button, and verify generated `wa.me` URL contains the formatted order.

### Tests for User Story 2 & 3

- [X] T015 [P] [US2] End-to-end test for cart drawer quantity controls, item note input, and WhatsApp link generation in `tests/e2e/cart-drawer.spec.ts`

### Implementation for User Story 2 & 3

- [X] T016 [P] [US2] Create CartItemRow component with quantity controls (+/-), note toggle, and delete action in `src/features/cart/components/cart-item-row.tsx`
- [X] T017 [US2] Create CartDrawer slide-up component with header, itemized list, empty state, and "Empty Cart" button in `src/features/cart/components/cart-drawer.tsx`
- [X] T018 [US3] Add WhatsApp submit button with validation, error toast, and `buildWhatsAppOrderUrl` trigger in `src/features/cart/components/cart-drawer.tsx`
- [X] T019 [US2] Connect CartDrawer open/close state to CartBar in `src/features/menu/components/menu-page.tsx`

**Checkpoint**: Full cart review, item customizations, and WhatsApp ordering are operational.

---

## Phase 5: User Story 4 - Order Type Selection (Dine-in vs. Takeaway) & URL Table Number (Priority: P1)

**Goal**: Customer chooses Dine-in (Table Number required) or Takeaway; table number is automatically extracted and pre-filled if URL contains `?table=N`.  
**Independent Test**: Load `/ar/menu?table=4`, open cart drawer, verify "Dine-in" is selected and Table 4 is pre-filled; switch to Takeaway and verify table number is not required.

### Implementation for User Story 4

- [X] T020 [P] [US4] Create OrderTypeSelector toggle component (Dine-in vs. Takeaway) with table number input in `src/features/cart/components/order-type-selector.tsx`
- [X] T021 [US4] Add URL search params parser (`?table=...`) to auto-set table number in `src/features/cart/hooks/use-cart.tsx`
- [X] T022 [US4] Embed OrderTypeSelector into CartDrawer before the submit button in `src/features/cart/components/cart-drawer.tsx`

**Checkpoint**: Order type fulfillment and automatic table pre-filling are fully functional.

---

## Phase 6: User Story 5 - Cart Persistence Across Reload & Language Switching (Priority: P2)

**Goal**: Cart items, quantities, and notes survive page reloads and translate titles seamlessly when toggling between Arabic and English.  
**Independent Test**: Add items, switch to English, verify prices show `EGP` and items remain; reload browser, verify cart is fully restored from `localStorage`.

### Tests for User Story 5

- [X] T023 [US5] End-to-end test for cart persistence across browser reloads and language toggling in `tests/e2e/cart-persistence.spec.ts`

**Checkpoint**: Zero cart loss on mobile browsers or during language toggling.

---

## Phase 7: Polish & Verification

**Purpose**: Strict compliance verification, linting, type-checking, and production build

- [X] T024 [P] Audit component line counts in `src/features/cart/` to guarantee all files are <= 180 lines
- [X] T025 [P] Audit CSS classes in `src/features/cart/` to ensure 100% logical properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`)
- [X] T026 Run TypeScript strict type-check (`npm run type-check`) ensuring zero `any` or `@ts-ignore`
- [X] T027 Run ESLint check (`npm run lint`) and Vitest test suite (`npm test`)
- [X] T028 Execute production build (`npm run build`) with Next.js 16 Turbopack and verify clean build

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies — executes immediately.
2. **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories.
3. **User Stories (Phase 3+)**: All depend on Foundational (Phase 2).
   - **US1 (P1)**: Independent MVP slice (Quick Add + Floating Bar).
   - **US2 & US3 (P1)**: Cart Drawer + WhatsApp checkout.
   - **US4 (P1)**: Order type toggle & Table number pre-filling.
   - **US5 (P2)**: Persistence & bilingual translation checks.
4. **Polish (Phase 7)**: Runs after all user stories are complete.

### Parallel Execution Opportunities

- **Phase 1**: T002 and T003 can run in parallel.
- **Phase 2**: T004, T005, T006, and T008 can run in parallel.
- **Phase 3**: T009, T010, and T011 can be developed in parallel.
- **Phase 4**: T015 and T016 can run in parallel.
- **Phase 5**: T020 can run in parallel.

---

## Implementation Strategy

### MVP First (Phases 1, 2, 3)
1. Complete Setup (T001–T003) and Foundation (T004–T008).
2. Implement User Story 1 (T009–T014).
3. **Validate**: Open `/ar/menu`, add an item, verify floating bar appears with total in EGP.

### Incremental Feature Additions
1. Add Cart Drawer & WhatsApp ordering (US2 & US3: T015–T019).
2. Add Order Type & Table pre-filling (US4: T020–T022).
3. Validate persistence and language switching (US5: T023).
4. Run audits, tests, and production build (T024–T028).
