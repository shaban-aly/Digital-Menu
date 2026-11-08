# Tasks: SaaS Multi-Tenant Platform

**Input**: Design documents from `/specs/006-saas-multi-tenant-platform/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/saas-contracts.ts`, `quickstart.md`  
**Constitution Alignment**: Next.js 16+ App Router, React 19, Tailwind CSS v4, Zod v4, TypeScript Strict Mode, max 180 lines per component, zero physical directional CSS, zero native dialogs, zero `any` / `@ts-ignore`.

---

## Phase 1: Shared Setup & Core Types

**Purpose**: Externalized bilingual translation keys and core subscription types

- [X] T001 [P] Add Arabic and English translation keys for SaaS, Auth, Onboarding, Quota warnings, and Super Admin in `src/lib/i18n/ar.json` & `src/lib/i18n/en.json`
- [X] T002 [P] Create subscription and SaaS shared types and Zod schemas in `src/features/subscription/types.ts`

---

## Phase 2: Sub-Agent 1 — Auth & Business Onboarding (`src/features/auth/` & `src/features/onboarding/`)

**Goal**: Full registration, login, and multi-tenant store creation wizard with slug validation.

- [ ] T003 [P] Implement `AuthService` and `useAuth` hook in `src/features/auth/services/auth-service.ts` & `src/features/auth/hooks/use-auth.ts`
- [ ] T004 [P] Implement Login and Register components and pages (`/login` and `/register`)
- [ ] T005 Implement `OnboardingService` and `OnboardingWizard` in `src/features/onboarding/` and route `/onboarding`
- [ ] T006 [P] Unit tests for Auth and Onboarding workflows in `tests/unit/auth-onboarding.test.ts`

---

## Phase 3: Sub-Agent 2 — Subscription & Quota Engine (`src/features/subscription/`)

**Goal**: Quota verification engine (7 cat / 50 prod for Free, 50 cat / 500 prod for Pro, Infinity for Enterprise) with WhatsApp deep-linking.

- [ ] T007 [P] Implement `QuotaService` in `src/features/subscription/services/quota-service.ts`
- [ ] T008 [P] Implement `SubscriptionService` (WhatsApp upgrade URL builder) in `src/features/subscription/services/subscription-service.ts`
- [ ] T009 Implement `QuotaProgressBar` and `QuotaUpgradeModal` in `src/features/subscription/components/`
- [ ] T010 Implement `PricingComparison` with Monthly/Yearly toggle in `src/features/subscription/components/pricing-comparison.tsx`
- [ ] T011 [P] Unit tests for Quota calculations, limits blocking, and WhatsApp URL generation in `tests/unit/quota-service.test.ts`

---

## Phase 4: Sub-Agent 3 — Merchant Dashboard (`src/features/dashboard/`)

**Goal**: Routing migration (`/admin` -> `/dashboard`), visual quota progress bars, quota-guarded catalog management, and store switcher.

- [ ] T012 Implement merchant dashboard routes at `src/app/dashboard/page.tsx` and `src/app/dashboard/[slug]/page.tsx`
- [ ] T013 Implement `DashboardView` with quota progress meters and store management in `src/features/dashboard/components/`
- [ ] T014 Integrate `QuotaService` into item and category creation modals in the merchant dashboard so quota breaches trigger `QuotaUpgradeModal`
- [ ] T015 Ensure `/menu` automatically redirects to `/` if accessed without a slug

---

## Phase 5: Sub-Agent 4 — Super Admin Console & Supabase Schema (`src/features/admin/` & `src/lib/supabase/`)

**Goal**: Super Admin console at `/admin` with global platform KPIs, store management table with 1-click tier modification, and PostgreSQL migration schema with RLS.

- [ ] T016 [P] Create PostgreSQL DDL and RLS policies in `supabase/migrations/20261108_saas_schema.sql`
- [ ] T017 [P] Implement Supabase client with graceful local fallback in `src/lib/supabase/client.ts` and `src/lib/supabase/types.ts`
- [ ] T018 Build Super Admin console at `/admin` (`src/app/admin/page.tsx`) with KPI cards, store list, 1-click plan modifier, and store active toggler
- [ ] T019 [P] Unit tests for Super Admin service and Supabase client fallback in `tests/unit/superadmin-service.test.ts`

---

## Phase 6: Polish & Verification

**Purpose**: Strict compliance verification, linting, type-checking, and production build

- [X] T020 Audit component line counts across all 4 sub-agent directories ensuring each file is <= 180 lines
- [X] T021 Verify 100% logical directional CSS (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`) and zero native dialogs
- [X] T022 Run TypeScript strict type-check (`npm run type-check`), ESLint (`npm run lint`), Vitest test suite (`npm test`), and Next.js 16 production build (`npm run build`)

---

## Phase 7: Full Integration & Supabase Activation (Sub-Agents Parallel Execution)

**Goal**: Seamless end-to-end integration across Supabase modular migrations, live menu/cart syncing, unified navigation headers, routing transitions, and AI translation integration.

### Sub-Agent 1: Supabase Migrations, CLI & Environment Configuration
- [X] T023 [P] Delete old unified `20261108_saas_schema.sql` and initialize `supabase/config.toml` for Supabase CLI.
- [X] T024 [P] Split database migrations into 5 modular, clean SQL files under `supabase/migrations/`:
  - `20261108000001_clean_reset_and_enums.sql`: Drop tables with CASCADE and create enums (`business_type`, `plan_tier`, `billing_cycle`, `user_role`).
  - `20261108000002_profiles_and_subscriptions.sql`: `profiles` linked to `auth.users` via trigger, `subscriptions` with plan quotas.
  - `20261108000003_stores_table.sql`: `stores` table linked to `owner_id` and `slug`.
  - `20261108000004_categories_and_products.sql`: `categories` & `products` tables with AR/EN fields, units, and quota trigger.
  - `20261108000005_rls_policies_and_indexes.sql`: Declarative RLS policies for public read and merchant write.
  - `supabase/seed.sql`: Seed data for the 3 demo businesses.
- [X] T025 [P] Update `.env.local` and `.env.example` with Supabase configuration keys and credentials.
- [X] T026 [P] Add Supabase CLI npm scripts (`db:link`, `db:push`, `db:reset`) to `package.json`.

### Sub-Agent 2: Live Supabase Layer Sync for Menu & Cart
- [X] T027 [P] Connect `/menu/[slug]` (`src/features/menu/`) to unified data repository with Supabase live fetch and graceful fallback.
- [X] T028 [P] Ensure store settings (name, logo, phone, delivery fee, business type) in `/menu/[slug]` are dynamically read from the live store profile.
- [X] T029 Connect `/features/cart/` to live product/store data and verify WhatsApp order payload matches live store data.
- [X] T030 [P] Write integration unit tests verifying instant reflection of merchant modifications in `/menu/[slug]`.

### Sub-Agent 3: Unified Header, Flow Transitions & Pricing Page
- [X] T031 [P] Build unified responsive Navbar/Header component (`src/components/layout/platform-header.tsx`) with dynamic auth state, store links, and language switcher.
- [X] T032 [P] Wire all navigation links and router transitions across landing page `/`, `/login`, `/register`, and `/onboarding`.
- [X] T033 [P] Implement dedicated pricing page `/pricing` (`src/app/pricing/page.tsx`) with monthly/yearly toggle and WhatsApp CTA.
- [X] T034 [P] Add direct "معاينة المنيو" and "إضافة نشاط جديد" action buttons and upgrade links inside `/dashboard`.

### Sub-Agent 4: Smart AI Translation Integration & Super Admin Live Sync
- [X] T035 [P] Integrate `/api/translate` automatic Arabic-to-English translation into catalog modals in `/dashboard`.
- [X] T036 [P] Integrate `/api/translate` into store creation form in `/onboarding`.
- [X] T037 [P] Connect `/admin` to live database/repository so Super Admin tier updates immediately sync quotas to `/dashboard`.
- [X] T038 [P] Unit tests for live Super Admin plan updates and translation triggers.
