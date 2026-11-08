# Implementation Plan: SaaS Multi-Tenant Platform

**Branch**: `006-saas-multi-tenant-platform`  
**Spec**: [spec.md](file:///e:/Projects/digital-menu/specs/006-saas-multi-tenant-platform/spec.md)  
**Date**: 2026-11-08  
**Constitution**: v2.2.0  

---

## 1. Technical Context & Scope

- **Objective**: Implement multi-tenancy, authentication & onboarding, subscription tier quotas, merchant `/dashboard`, super admin `/admin`, and Supabase schema.
- **Tech Stack**:
  - Next.js 16+ App Router, React 19, TypeScript Strict Mode.
  - Tailwind CSS v4 with 100% logical directional properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`).
  - Zod v4 schemas for input validation.
  - Vitest v5 for unit testing.
  - Reusable UI primitives in `src/components/ui/` (`Modal`, `Button`, `ConfirmDialog`).
  - Maximum 180 lines per file (strictly enforced).

---

## 2. Constitution Alignment Check

- [x] **File Size Limit (<= 180 lines)**: All components, pages, and services decomposed into files < 180 lines.
- [x] **Zero Native Dialogs**: Zero `window.confirm`, `window.alert`, `window.prompt`.
- [x] **Shared UI Primitives**: Reuses `src/components/ui/` primitives.
- [x] **Logical Directional CSS**: 100% logical directional styles for RTL/LTR bilingual support.
- [x] **Strict Type Safety**: Zero `any`, zero `@ts-ignore`.

---

## 3. Directory Layout & Module Boundaries

```
src/
├── app/
│   ├── login/page.tsx               # Auth Login route
│   ├── register/page.tsx            # Auth Register route
│   ├── onboarding/page.tsx          # Store creation wizard route
│   ├── dashboard/                   # Merchant Dashboard routes
│   │   ├── page.tsx                 # Default/first store redirect
│   │   └── [slug]/page.tsx          # Store-specific merchant console
│   └── admin/                       # Super Admin platform console
│       └── page.tsx                 # Global platform stats & store management
├── features/
│   ├── auth/                        # Sub-Agent 1: Authentication & User Profiles
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── onboarding/                  # Sub-Agent 1: Store Creation Wizard
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── subscription/                # Sub-Agent 2: Quota Engine & Plans
│   │   ├── components/              # QuotaProgressBar, QuotaUpgradeModal, PricingComparison
│   │   ├── hooks/
│   │   ├── services/                # quota-service.ts, subscription-service.ts
│   │   └── types.ts
│   ├── dashboard/                   # Sub-Agent 3: Merchant Dashboard Views
│   │   ├── components/              # dashboard-view, store-switcher, quota-meters
│   │   ├── hooks/
│   │   └── types.ts
│   └── admin/                       # Sub-Agent 4: Super Admin Platform Oversight
│       ├── components/              # kpi-metrics, stores-table, platform-settings
│       ├── hooks/
│       ├── services/
│       └── types.ts
├── lib/
│   └── supabase/                    # Sub-Agent 4: Supabase Client & Types
│       ├── client.ts
│       └── types.ts
supabase/
└── migrations/
    └── 20261108_saas_schema.sql     # Sub-Agent 4: PostgreSQL DDL & RLS
```

---

## 4. Work Breakdown for 4 Sub-Agents

1. **Sub-Agent 1 (Auth & Onboarding)**:
   - Scoped to `src/features/auth/`, `src/features/onboarding/`, `/login`, `/register`, `/onboarding`.
2. **Sub-Agent 2 (Subscription & Quota Engine)**:
   - Scoped to `src/features/subscription/`, `QuotaService`, `QuotaUpgradeModal`, `PricingPlansComparison`.
3. **Sub-Agent 3 (Merchant Dashboard)**:
   - Scoped to `src/features/dashboard/`, `/dashboard`, `/dashboard/[slug]`, quota usage progress meters, store switcher.
4. **Sub-Agent 4 (Super Admin & Supabase Database)**:
   - Scoped to `src/features/admin/`, `/admin`, `supabase/migrations/`, `src/lib/supabase/`.

