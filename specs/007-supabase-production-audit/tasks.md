# Tasks: 007 Supabase Production Migration & Full System Audit

**Input**: Design documents from `/specs/007-supabase-production-audit/`  
**Prerequisites**: `spec.md`, `plan.md`, `specs/001-*` through `specs/006-*`  
**Constitution Alignment**: Next.js 16+, React 19, Tailwind CSS v4, TypeScript Strict Mode, max 180 lines per file, 100% logical directional CSS, zero native dialogs, zero `any` / `@ts-ignore`.

---

## Phase 1: Sub-Agent 1 — Supabase Database Migrations & Schema Hardening

**Goal**: Verify, harden, and clean all Supabase migrations, ensuring clean cascade resets, enums, tables, triggers, and seed data.

- [x] T039 [P] Audit `supabase/migrations/` (5 files) to ensure clean `CASCADE` drops, exact enum values, and no leftover legacy tables.
- [x] T040 [P] Verify `profiles`, `subscriptions`, `stores`, `categories`, and `products` foreign keys, indexes, and RLS policies.
- [x] T041 [P] Ensure triggers `check_category_quota` and `check_product_quota` accurately enforce Free (7/50), Pro (50/500), and Enterprise (unlimited) limits.
- [x] T042 [P] Verify `supabase/seed.sql` populates the 3 demo stores (`oriental-grill`, `specialty-cafe`, `fresh-market`) with full bilingual data and correct tiers.

---

## Phase 2: Sub-Agent 2 — Mock Data Elimination & Supabase Server Actions

**Goal**: Remove legacy mock files, unify all data access through typed Supabase actions and queries, and clean up repositories.

- [ ] T043 [P] Safely delete obsolete directory `src/features/menu/services/mock-data/` (`fresh-market.ts`, `oriental-grill.ts`, `specialty-cafe.ts`).
- [ ] T044 [P] Refactor `src/features/menu/services/store-repository.ts` and `src/features/menu/services/mock-menu-data.ts` to use a lightweight, schema-compliant fallback for offline dev.
- [ ] T045 [P] Create/verify typed Supabase Server Actions in `src/lib/supabase/actions.ts` for store creation, item/category mutation, and stock toggling.
- [ ] T046 [P] Update unit tests to ensure all store repository tests pass without relying on legacy mock files.

---

## Phase 3: Sub-Agent 3 — Feature Audit 001–004 (Menu, Cart, Admin & Landing)

**Goal**: Verify complete compliance of Features 001, 002, 003, and 004 against their specs.

- [ ] T047 [P] Audit Feature 001 (Customer Menu): Dynamic categories, search, RTL/LTR layout, and supermarket units (`unit_ar`/`unit_en`).
- [ ] T048 [P] Audit Feature 002 (Cart & WhatsApp Ordering): Dynamic store phone, currency, order types (`dine_in`, `takeaway`, `delivery`), and WhatsApp message formatting.
- [ ] T049 [P] Audit Feature 003 (Merchant Admin & Dashboard): Catalog management at `/dashboard`, item/category modals, and stock availability toggles.
- [ ] T050 [P] Audit Feature 004 (Marketing Landing Page): Unified header, pilot stores showcase, pricing links, and responsive layout.

---

## Phase 4: Sub-Agent 4 — Feature Audit 005–006 (Operating Hours, SaaS Platform & Super Admin)

**Goal**: Verify complete compliance of Features 005 and 006 against their specs.

- [ ] T051 [P] Audit Feature 005 (Smart Operating Hours): Schedule editor, emergency rush pause, pre-orders guard, and store closed badges.
- [ ] T052 [P] Audit Feature 006 (SaaS Platform & Quotas): Auth (`/login`, `/register`), Onboarding wizard (`/onboarding`), Quota progress meters, and `/pricing` page.
- [ ] T053 [P] Audit AI Translation: Verify `/api/translate` button integration across category modal, item modal, and onboarding store name.
- [ ] T054 [P] Audit Super Admin Console: Verify `/admin` store table, 1-click tier modification, and live quota sync to `/dashboard`.

---

## Phase 5: Lead Verification & Polish

**Purpose**: Strict compliance verification, line counts, logical CSS, linting, type-checking, and production build.

- [ ] T055 Audit all created and touched files ensuring each is <= 180 lines.
- [ ] T056 Verify 100% logical directional CSS and zero native dialogs across the codebase.
- [ ] T057 Run `npm run type-check`, `npm run lint`, `npm test` (all unit tests), and `npm run build` (Next.js 16 Turbopack).
