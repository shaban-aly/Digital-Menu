# Tasks: Smart Operating Hours & Availability Engine

**Input**: Design documents from `/specs/005-smart-operating-hours/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/operating-hours-contract.ts`, `quickstart.md`  
**Constitution Alignment**: Next.js 16+ App Router, React 19, Tailwind CSS v4, Zod v4, TypeScript Strict Mode, max 180 lines per component, zero physical directional CSS, zero native dialogs, zero `any` / `@ts-ignore`.

---

## Phase 1: Setup & Shared Infrastructure

**Purpose**: Externalized bilingual translation keys and core schema definitions

- [ ] T001 [P] Add Arabic translation keys for operating hours, status badges, pre-orders, and emergency pause in `src/lib/i18n/ar.json`
- [ ] T002 [P] Add English translation keys for operating hours, status badges, pre-orders, and emergency pause in `src/lib/i18n/en.json`
- [ ] T003 Create schedule types and Zod schemas in `src/features/schedule/types.ts`

---

## Phase 2: Foundational Schedule Engine

**Purpose**: Core algorithmic schedule evaluation, overnight shifts, and reactive hooks

**⚠️ CRITICAL**: Must be completed before UI components can consume schedule status.

- [ ] T004 Implement `ScheduleService` conforming to `IScheduleService` in `src/features/schedule/services/schedule-service.ts`
- [ ] T005 [P] Unit tests for `ScheduleService` (normal shift, overnight past midnight, day off, emergency pause, next opening string) in `tests/unit/schedule-service.test.ts`
- [ ] T006 Update `RestaurantSchema` in `src/features/menu/types.ts` and populate default schedules in `src/features/menu/services/mock-data/*.ts`
- [ ] T007 Implement `useStoreSchedule` reactive hook in `src/features/schedule/hooks/use-store-schedule.ts`

**Checkpoint**: Core calculation engine ready and verified with 100% test pass.

---

## Phase 3: User Story 1 & 5 - Customer Real-Time Status Badge & Schedule Modal (Priority: P1) 🎯 MVP

**Goal**: Customer sees live status (Open / Closed / Break) in header with next opening time and can view 7-day schedule in a modal.

- [ ] T008 [P] [US1] Create `StoreStatusBadge` component with accessible pulse indicator in `src/features/schedule/components/store-status-badge.tsx`
- [ ] T009 [P] [US5] Create `ScheduleModal` component displaying 7-day schedule using `Modal` primitive in `src/features/schedule/components/schedule-modal.tsx`
- [ ] T010 [US1] Integrate `StoreStatusBadge` and `ScheduleModal` into `src/features/menu/components/restaurant-header.tsx`

---

## Phase 4: User Story 2 - Cart Closed-Hour Guard & Pre-Ordering (Priority: P1) 🎯 MVP

**Goal**: Customer cart reacts to closed store with pre-order disclaimers or disabled checkout according to store policy.

- [ ] T011 [P] [US2] Create `ClosedGuardBanner` component in `src/features/schedule/components/closed-guard-banner.tsx`
- [ ] T012 [P] [US2] Update `buildWhatsAppOrderUrl` in `src/features/cart/services/whatsapp-service.ts` to prepend `[طلب مسبق لموعد الفتح: {الوقت}]` when `isPreOrder` is active
- [ ] T013 [US2] Integrate `ClosedGuardBanner` and pre-order state into `src/features/cart/components/cart-drawer.tsx`

---

## Phase 5: User Story 3 & 4 - Merchant Schedule Editor & Rush Pause (Priority: P2)

**Goal**: Merchant can edit 7-day open/close hours and activate one-tap emergency pause in Admin Dashboard.

- [ ] T014 [P] [US4] Create `EmergencyPauseSwitch` component in `src/features/admin/components/emergency-pause-switch.tsx`
- [ ] T015 [P] [US3] Create `OperatingHoursEditor` component in `src/features/admin/components/operating-hours-editor.tsx`
- [ ] T016 [US3] Update `StoreRepository` in `src/features/admin/services/store-repository.ts` to persist schedule configurations and emergency pause states
- [ ] T017 [US3] Integrate `EmergencyPauseSwitch` and `OperatingHoursEditor` into `src/features/admin/components/settings-tab.tsx`

---

## Phase 6: Polish & Production Verification

**Purpose**: Strict compliance verification, linting, type-checking, and production build

- [ ] T018 Audit component line counts across `src/features/schedule/` and `src/features/admin/` ensuring each file is <= 180 lines
- [ ] T019 Verify 100% logical directional CSS (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`) and zero native dialogs
- [ ] T020 Run TypeScript strict type-check (`npm run type-check`), ESLint (`npm run lint`), Vitest test suite (`npm test`), and Next.js production build (`npm run build`)
