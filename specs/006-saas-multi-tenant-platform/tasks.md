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

- [X] T003 [P] Implement `AuthService` and `useAuth` hook in `src/features/auth/services/auth-service.ts` & `src/features/auth/hooks/use-auth.ts`
- [X] T004 [P] Implement Login and Register components and pages (`/login` and `/register`)
- [X] T005 Implement `OnboardingService` and `OnboardingWizard` in `src/features/onboarding/` and route `/onboarding`
- [X] T006 [P] Unit tests for Auth and Onboarding workflows in `tests/unit/auth-onboarding.test.ts`

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

- [X] T012 Implement merchant dashboard routes at `src/app/dashboard/page.tsx` and `src/app/dashboard/[slug]/page.tsx`
- [X] T013 Implement `DashboardView` with quota progress meters and store management in `src/features/dashboard/components/`
- [X] T014 Integrate `QuotaService` into item and category creation modals in the merchant dashboard so quota breaches trigger `QuotaUpgradeModal`
- [X] T015 Ensure `/menu` automatically redirects to `/` if accessed without a slug

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

- [ ] T020 Audit component line counts across all 4 sub-agent directories ensuring each file is <= 180 lines
- [ ] T021 Verify 100% logical directional CSS (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`) and zero native dialogs
- [ ] T022 Run TypeScript strict type-check (`npm run type-check`), ESLint (`npm run lint`), Vitest test suite (`npm test`), and Next.js 16 production build (`npm run build`)
