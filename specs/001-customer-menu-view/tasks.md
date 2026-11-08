# Tasks: Customer Digital Menu View

**Input**: Design documents from `/specs/001-customer-menu-view/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/menu-api.md`, `quickstart.md`  
**Constitution Alignment**: Next.js App Router, TypeScript Strict, Tailwind CSS (logical properties only), Supabase, EGP currency, max 180 lines per component, zero `any` / `@ts-ignore`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling configuration, and base dependencies

- [X] T001 Initialize Next.js project with TypeScript (strict mode) and Tailwind CSS in `package.json`
- [X] T002 Configure ESLint, Prettier, and TypeScript strict configuration in `tsconfig.json` and `.eslintrc.json`
- [X] T003 [P] Install core dependencies (`@supabase/supabase-js`, `zod`, `lucide-react`) and testing tools (Vitest, Playwright) in `package.json`
- [X] T004 [P] Configure Tailwind CSS with logical properties and RTL support in `tailwind.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and data types that MUST be complete before ANY user story can begin

- [X] T005 Setup Supabase client configurations in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`
- [X] T006 [P] Create shared TypeScript types and Zod schemas (`Restaurant`, `Category`, `MenuItem`, `Badge`, `Allergen`) with verbatim constraints in `src/features/menu/types.ts`
- [X] T007 [P] Create i18n translation dictionaries for Arabic and English in `src/lib/i18n/ar.json` and `src/lib/i18n/en.json`
- [X] T008 [P] Implement Egyptian Pound currency formatter `formatCurrency(amount, locale)` in `src/lib/utils.ts`
- [X] T009 [P] Create reusable Button primitive with >= 44x44px touch target in `src/components/ui/button.tsx`
- [X] T010 [P] Create reusable image fallback placeholder in `src/components/ui/image-placeholder.tsx`
- [X] T011 [P] Create reusable ErrorState component with retry action in `src/components/ui/error-state.tsx`
- [X] T012 [P] Create reusable EmptyState component in `src/components/ui/empty-state.tsx`
- [X] T013 Implement Supabase menu query service `getMenuData()` in `src/features/menu/services/menu-service.ts` per contract in `specs/001-customer-menu-view/contracts/menu-api.md`

---

## Phase 3: User Story 1 - Browse Categorized Menu (Priority: P1) 🎯 MVP

**Goal**: Customer can browse menu items grouped by categories with images, names, descriptions, EGP prices, badges, and availability status.  
**Independent Test**: Open `/ar/menu` and verify categories appear with item cards displaying images, names, descriptions, badges, and prices in `ج.م`.

### Tests for User Story 1

- [X] T014 [P] [US1] Unit test for `menu-service.ts` data fetching and error handling in `tests/unit/menu-service.test.ts`
- [X] T015 [P] [US1] End-to-end test for browsing menu categories and items in `tests/e2e/menu-browsing.spec.ts`

### Implementation for User Story 1

- [X] T016 [P] [US1] Create BadgeList component for Spicy, Vegetarian, and Best Seller indicators in `src/features/menu/components/badge-list.tsx`
- [X] T017 [P] [US1] Create MenuItemCard component with image lazy-loading, availability status, and 180-line ceiling in `src/features/menu/components/menu-item-card.tsx`
- [X] T018 [US1] Create MenuSection component for rendering category headings and item card grids in `src/features/menu/components/menu-section.tsx`
- [X] T019 [US1] Create RestaurantHeader component displaying name and logo in `src/features/menu/components/restaurant-header.tsx`
- [X] T020 [US1] Implement thin route page in `src/app/[locale]/menu/page.tsx` and main orchestrator in `src/features/menu/components/menu-page.tsx`

**Checkpoint**: User Story 1 is fully functional and delivers an independently testable MVP.

---

## Phase 4: User Story 2 - Navigate via Sticky Categories Bar (Priority: P1)

**Goal**: A horizontal sticky category bar stays pinned to the top on scroll, highlights active sections via scroll-spy, and smoothly scrolls to sections on tap.  
**Independent Test**: Scroll down past the header, verify category bar remains fixed, tap a category chip, and verify smooth scrolling to that section with active highlighting.

### Implementation for User Story 2

- [X] T021 [US2] Implement scroll-spy and smooth scroll hook using `IntersectionObserver` in `src/features/menu/hooks/use-category-scroll.ts`
- [X] T022 [US2] Create CategoryBar component with horizontal touch scrolling and sticky positioning in `src/features/menu/components/category-bar.tsx`
- [X] T023 [US2] Integrate CategoryBar with CategorySection IDs and scroll-spy synchronization in `src/features/menu/components/menu-page.tsx`

**Checkpoint**: Category navigation is smooth, sticky, and synchronized with page scrolling.

---

## Phase 5: User Story 3 - Switch Language (Arabic / English) (Priority: P2)

**Goal**: Instant client-side language toggle between Arabic (RTL) and English (LTR) with persisted session state and logical CSS styling.  
**Independent Test**: Tap language switcher in header, verify layout flips between RTL and LTR, text changes, and prices update from `ج.م` to `EGP`.

### Tests for User Story 3

- [X] T024 [P] [US3] End-to-end test for language switching and RTL/LTR layout in `tests/e2e/language-switch.spec.ts`

### Implementation for User Story 3

- [X] T025 [P] [US3] Implement language switcher state hook and session persistence in `src/features/menu/hooks/use-language.ts`
- [X] T026 [US3] Create root layout with dynamic `dir="rtl"` and `dir="ltr"` in `src/app/[locale]/layout.tsx`
- [X] T027 [US3] Add bilingual toggle button to RestaurantHeader in `src/features/menu/components/restaurant-header.tsx`

**Checkpoint**: Full bilingual and bidirectional layout support is operational.

---

## Phase 6: User Story 4 - View Item Details in Modal (Priority: P2)

**Goal**: Tapping a menu item card opens a detail modal with full description, calories, and allergens, synchronized with URL hash `#item-<id>`.  
**Independent Test**: Tap any item card, verify `#item-<id>` appears in the URL and modal opens; click device back button, verify modal closes without page refresh.

### Tests for User Story 4

- [X] T028 [P] [US4] End-to-end test for item detail modal opening, closing, and URL hash navigation in `tests/e2e/item-modal.spec.ts`

### Implementation for User Story 4

- [X] T029 [P] [US4] Create base accessible Modal primitive with backdrop in `src/components/ui/modal.tsx`
- [X] T030 [US4] Implement ItemDetailModal component displaying full description, allergen chips, and calories in `src/features/menu/components/item-detail-modal.tsx`
- [X] T031 [US4] Wire URL hash change listener and modal state handler in `src/features/menu/components/menu-page.tsx`

**Checkpoint**: Item detail modals open via card tap and direct hash URLs.

---

## Phase 7: User Story 5 - Search Menu Items (Priority: P3)

**Goal**: Instant client-side search filtering menu items by name or description with smart Arabic text normalization.  
**Independent Test**: Type Arabic query (with/without hamza or tashkeel), verify instant filtering (<200ms); verify empty state if no match.

### Tests for User Story 5

- [X] T032 [P] [US5] Unit test for Arabic text normalization regex utility in `tests/unit/search-normalization.test.ts`
- [X] T033 [P] [US5] End-to-end test for real-time search filtering and clearing in `tests/e2e/search.spec.ts`

### Implementation for User Story 5

- [X] T034 [P] [US5] Implement Arabic text normalization utility (strip diacritics, normalize alef/taa/yaa) in `src/features/menu/services/search-normalization.ts`
- [X] T035 [US5] Implement client search hook with debouncing in `src/features/menu/hooks/use-menu-search.ts`
- [X] T036 [US5] Create MenuSearch input component in `src/features/menu/components/menu-search.tsx`
- [X] T037 [US5] Integrate search filter logic and EmptyState fallback into `src/features/menu/components/menu-page.tsx`

**Checkpoint**: Real-time Arabic and English search operates with sub-millisecond filtering.

---

## Phase 8: User Story 6 - Responsive Across Devices & Skeleton Loading (Priority: P3)

**Goal**: Ensure responsive layout from 320px to 1440px viewports, minimum 44x44px touch targets, and skeleton loading during initial data fetch.  
**Independent Test**: Throttle to 3G network and verify animated skeletons; verify 320px screen width has zero horizontal overflow.

### Tests for User Story 6

- [X] T038 [P] [US6] End-to-end test for responsive layout and skeleton loading in `tests/e2e/responsive.spec.ts`

### Implementation for User Story 6

- [X] T039 [P] [US6] Create animated Skeleton primitive in `src/components/ui/skeleton.tsx` and MenuSkeleton component in `src/features/menu/components/menu-skeleton.tsx`
- [X] T040 [US6] Integrate MenuSkeleton fallback state during data fetch in `src/app/[locale]/menu/page.tsx`
- [X] T041 [US6] Audit and enforce minimum 44x44px touch targets and CSS logical properties across all components

**Checkpoint**: Application meets all mobile-first responsiveness and performance criteria.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Verification, linting, type-checking, and performance budget validation

- [X] T042 [P] Execute quickstart verification scenarios in `specs/001-customer-menu-view/quickstart.md`
- [X] T043 [P] Run TypeScript strict type-check (`npm run type-check`) ensuring zero `any` or `@ts-ignore`
- [X] T044 Run ESLint and Prettier check (`npm run lint`) and component line-count audit (<= 180 lines per component)
- [X] T045 Execute production build (`npm run build`) and verify initial compressed payload is under 500 KB

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies — executes immediately.
2. **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories.
3. **User Stories (Phase 3+)**: All depend on Foundational (Phase 2).
   - **US1 (P1)**: Independent MVP slice.
   - **US2 (P1)**: Extends US1 with sticky category navigation.
   - **US3 (P2)**: Extends US1/US2 with RTL/LTR language toggling.
   - **US4 (P2)**: Extends US1 with modal detail view and hash routing.
   - **US5 (P3)**: Extends US1 with search filtering.
   - **US6 (P3)**: Cross-viewport responsive polish and skeleton UI.
4. **Polish (Phase 9)**: Runs after desired user stories are completed.

### Parallel Execution Opportunities

- **Phase 1**: T003 and T004 can run in parallel after T001/T002.
- **Phase 2**: T006, T007, T008, T009, T010, T011, T012 can all run in parallel.
- **Phase 3 (US1)**: T014, T015, T016, T017 can be developed in parallel before orchestrating in T018-T020.
- **Phase 5 (US3)**: T024 and T025 can run in parallel before T026/T027.
- **Phase 7 (US5)**: T032, T033, T034 can run in parallel before hook/UI integration.

---

## Implementation Strategy

### MVP First (Phases 1, 2, 3)
1. Complete Setup (T001–T004) and Foundation (T005–T013).
2. Implement User Story 1 (T014–T020).
3. **Stop & Validate**: Open `/ar/menu` to verify customer browsing works independently.

### Incremental Feature Additions
1. Add Sticky Bar (US2: T021–T023).
2. Add Language Switching (US3: T024–T027).
3. Add Detail Modal (US4: T028–T031).
4. Add Arabic Search (US5: T032–T037).
5. Add Skeleton & Responsive Polish (US6: T038–T041).
6. Final verification and build checks (T042–T045).
