# Tasks: Merchant Admin Dashboard

**Input**: Design documents from `/specs/003-merchant-admin-dashboard/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/store-repository.md`, `quickstart.md`  
**Constitution Alignment**: Next.js 16+ App Router, React 19, Tailwind CSS v4, Zod v4, TypeScript Strict Mode, max 180 lines per component, zero physical directional CSS, zero native dialogs (`window.confirm` prohibited), zero `any` / `@ts-ignore`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencies, directory scaffolding, and bilingual translation dictionaries

- [X] T001 Install `qrcode` and `@types/qrcode` dependencies in `package.json`
- [X] T002 [P] Add Arabic translation keys for admin dashboard (tabs, stock toggles, form labels, errors, QR labels) in `src/lib/i18n/ar.json`
- [X] T003 [P] Add English translation keys for admin dashboard (tabs, stock toggles, form labels, errors, QR labels) in `src/lib/i18n/en.json`
- [X] T004 Create admin feature directory layout in `src/features/admin/components/`, `src/features/admin/hooks/`, `src/features/admin/services/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TypeScript interfaces, Zod schemas, Store Repository with `localStorage` persistence, and synchronization hook

**⚠️ CRITICAL**: No user story work can begin until this foundational layer is in place.

- [X] T005 [P] Create admin TypeScript interfaces and Zod schemas (`StoreSettingsSchema`, `CategorySchema`, `AdminMenuItemSchema`, `StoreQRConfigSchema`) in `src/features/admin/types.ts`
- [X] T006 Implement `LocalStorageStoreRepository` conforming to `IStoreRepository` in `src/features/admin/services/store-repository.ts` per contract in `specs/003-merchant-admin-dashboard/contracts/store-repository.md`
- [X] T007 [P] Unit tests for `LocalStorageStoreRepository` (store retrieval, stock toggling, item saving, deletions, event dispatch) in `tests/unit/store-repository.test.ts`
- [X] T008 [P] Unit tests for admin Zod validation schemas (price non-negative, required names, valid phone numbers) in `tests/unit/admin-validation.test.ts`
- [X] T009 Implement `useStoreAdmin` hook for reactive state management, notifications, and mutations in `src/features/admin/hooks/use-store-admin.ts`
- [X] T010 Update customer menu service/hook (`src/features/menu/services/menu-service.ts` or `src/features/menu/components/menu-page.tsx`) to subscribe to `store-repository.ts` so admin updates reflect instantly on customer view

**Checkpoint**: Foundation ready - store repository, schemas, reactive hooks, and customer menu sync verified.

---

## Phase 3: User Story 1 - Item Management & Instant Stock Toggle (Priority: P1) 🎯 MVP

**Goal**: Merchant can view all items, instantly flip stock availability (In Stock / Out of Stock) with immediate customer menu reflection, add new items, edit existing items, and delete items with custom `ConfirmDialog`.  
**Independent Test**: Navigate to `/admin/oriental-grill`, toggle an item to "Out of Stock", verify customer menu at `/menu/oriental-grill` disables the item immediately; add a new item and verify it appears.

### Tests for User Story 1

- [X] T011 [P] [US1] End-to-end Playwright test for item stock toggling, item addition, editing, and customer menu sync in `tests/e2e/admin-items.spec.ts`

### Implementation for User Story 1

- [X] T012 [P] [US1] Create ItemRowCard component with item image, price, stock toggle switch, edit/delete triggers, and logical CSS in `src/features/admin/components/item-row-card.tsx`
- [X] T013 [P] [US1] Create ItemFormModal component with Zod validation, category selector, price input, and accessible `Modal` primitive in `src/features/admin/components/item-form-modal.tsx`
- [X] T014 [US1] Create ItemsTab component with category filter, search query input, "Add Item" button, and items grid in `src/features/admin/components/items-tab.tsx`
- [X] T015 [US1] Create AdminHeader component with store switcher, navigation tabs, and language/theme toggle in `src/features/admin/components/admin-header.tsx`
- [X] T016 [US1] Create AdminDashboardPage container component connecting `useStoreAdmin` to active tabs in `src/features/admin/components/admin-dashboard-page.tsx`
- [X] T017 [US1] Create store admin route in `src/app/admin/[slug]/page.tsx` and admin portal redirect/switcher in `src/app/admin/page.tsx`

**Checkpoint**: User Story 1 is fully functional and delivers an independently testable MVP.

---

## Phase 4: User Story 2 - Categories Management (Priority: P2)

**Goal**: Merchant can view, create, edit, and delete categories with validation preventing orphaned items.  
**Independent Test**: Navigate to Categories tab, add a new category "عصائر طازجة / Fresh Juices", assign an item, and verify category tab appears on customer menu.

### Tests for User Story 2

- [X] T018 [P] [US2] End-to-end Playwright test for category creation, editing, and deletion in `tests/e2e/admin-categories.spec.ts`

### Implementation for User Story 2

- [X] T019 [P] [US2] Create CategoryModal component with Arabic and English name inputs and validation in `src/features/admin/components/category-modal.tsx`
- [X] T020 [US2] Create CategoriesTab component with category list, assigned item count, and deletion confirmation via `ConfirmDialog` in `src/features/admin/components/categories-tab.tsx`
- [X] T021 [US2] Integrate CategoriesTab into `src/features/admin/components/admin-dashboard-page.tsx`

**Checkpoint**: User Stories 1 and 2 operate seamlessly together.

---

## Phase 5: User Story 3 - Store Profile & Fulfillment Settings (Priority: P2)

**Goal**: Merchant can configure WhatsApp order receiving phone number, delivery fees, and toggle fulfillment order types (Dine-in, Takeaway, Delivery).  
**Independent Test**: Change receiving WhatsApp number and delivery fee in Store Settings; verify customer checkout uses the new delivery fee and routes order to the updated WhatsApp number.

### Tests for User Story 3

- [X] T022 [P] [US3] End-to-end Playwright test for store settings and WhatsApp link generation in `tests/e2e/admin-settings.spec.ts`

### Implementation for User Story 3

- [X] T023 [US3] Create SettingsTab component with WhatsApp phone input, delivery fee input, and fulfillment order type checkboxes in `src/features/admin/components/settings-tab.tsx`
- [X] T024 [US3] Integrate SettingsTab into `src/features/admin/components/admin-dashboard-page.tsx`

**Checkpoint**: Store fulfillment settings directly control customer checkout options.

---

## Phase 6: User Story 4 - Storefront QR Code & Printable Tent Card (Priority: P3)

**Goal**: Merchant can preview high-resolution QR code pointing to `/menu/[slug]`, configure optional Wi-Fi credentials, and print or download branded tent cards.  
**Independent Test**: Navigate to QR & Print tab, enter Wi-Fi credentials, verify preview QR encodes `/menu/[slug]`, and verify print view formats cleanly on A4/A5 without website chrome.

### Tests for User Story 4

- [X] T025 [P] [US4] End-to-end Playwright test for QR generation and printable layout in `tests/e2e/admin-qr.spec.ts`

### Implementation for User Story 4

- [X] T026 [P] [US4] Implement QR generation service using `qrcode` in `src/features/admin/services/qr-generator-service.ts`
- [X] T027 [P] [US4] Implement `useStoreQR` hook in `src/features/admin/hooks/use-store-qr.ts`
- [X] T028 [US4] Create PrintableTentCard standalone print layout with QR, store branding, and Wi-Fi info in `src/features/admin/components/printable-tent-card.tsx`
- [X] T029 [US4] Create QRTab component with QR preview, Wi-Fi inputs, and print action in `src/features/admin/components/qr-tab.tsx`
- [X] T030 [US4] Create dedicated print route at `src/app/admin/[slug]/print-qr/page.tsx`
- [X] T031 [US4] Integrate QRTab into `src/features/admin/components/admin-dashboard-page.tsx`

**Checkpoint**: Merchant can generate and print venue QR tent cards directly from the admin panel.

---

## Phase 7: User Story 5 - Bilingual Administration & Dark/Light Theme (Priority: P3)

**Goal**: Merchant can use the dashboard in Arabic (RTL) or English (LTR) and toggle between dark and light themes with zero visual artifacts.  
**Independent Test**: Switch language to English, verify all labels, tables, and forms flip to LTR; toggle dark theme, verify high contrast and readability.

### Implementation for User Story 5

- [X] T032 [US5] Implement language switching and RTL/LTR synchronization in `src/features/admin/components/admin-header.tsx`
- [X] T033 [US5] Audit all admin component classes to ensure 100% logical directional CSS (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) across `src/features/admin/components/`

---

## Phase 8: Polish & Verification

**Purpose**: Strict compliance verification, linting, type-checking, and production build

- [X] T034 [P] Audit component line counts across `src/features/admin/components/` ensuring each file is <= 180 lines
- [X] T035 [P] Verify zero usage of native browser dialogs (`window.confirm`, `window.alert`, `window.prompt`) across the entire codebase
- [X] T036 Run TypeScript strict type-check (`npm run type-check`) ensuring zero `any` or `@ts-ignore`
- [X] T037 Run ESLint check (`npm run lint`) and Vitest test suite (`npm test`)
- [X] T038 Execute production build (`npm run build`) with Next.js 16 Turbopack and verify clean build

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies — executes immediately.
2. **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories.
3. **User Stories (Phase 3+)**: All depend on Foundational (Phase 2).
   - **US1 (P1)**: Independent MVP slice (Items & Stock Toggle).
   - **US2 (P2)**: Categories management.
   - **US3 (P2)**: Store profile & fulfillment settings.
   - **US4 (P3)**: QR code & printable tent card.
   - **US5 (P3)**: Bilingual & theme support.
4. **Polish (Phase 8)**: Runs after all user stories are complete.

### Parallel Execution Opportunities

- **Phase 1**: T002 and T003 can run in parallel.
- **Phase 2**: T005, T007, and T008 can run in parallel.
- **Phase 3**: T011, T012, and T013 can be developed in parallel.
- **Phase 4**: T018 and T019 can run in parallel.
- **Phase 5**: T022 and T023 can run in parallel.
- **Phase 6**: T025, T026, and T027 can run in parallel.

---

## Implementation Strategy

### MVP First (Phases 1, 2, 3)
1. Complete Setup (T001–T004) and Foundation (T005–T010).
2. Implement User Story 1 (T011–T017).
3. **Validate MVP**: Open `/admin/oriental-grill`, toggle item availability, and verify instant change on `/menu/oriental-grill`.

### Incremental Feature Additions
1. Add Categories Management (US2: T018–T021).
2. Add Store Settings & WhatsApp routing (US3: T022–T024).
3. Add QR Generator & Printable Tent Card (US4: T025–T031).
4. Validate Bilingual & Theme support (US5: T032–T033).
5. Run audits, tests, and production build (T034–T038).
