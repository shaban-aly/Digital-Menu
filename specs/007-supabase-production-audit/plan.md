# Implementation Plan: 007 Supabase Production Migration & Full System Audit

**Branch**: `007-supabase-production-audit`  
**Constitution**: Version 2.2.0  

---

## 1. Technical Context & Constraints

- **Stack**: Next.js 16.4.5 (Turbopack, App Router), React 19.3.1, Tailwind CSS v4, TypeScript 5.7.3, Vitest 5.1.0, Supabase CLI & Client (`@supabase/supabase-js` v2.119.0).
- **Core Goal**: Eliminate sprawling legacy mock files, activate production Supabase migrations and server actions/repository, and conduct a full audit across Features 001–006.
- **Constitutional Guardrails**:
  1. Maximum 180 lines per file (strictly enforced).
  2. 100% logical directional CSS (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`).
  3. Zero native browser dialogs (`window.alert`, `window.confirm`, `window.prompt`).
  4. Strict TypeScript typing with zero `any` and zero `@ts-ignore`.

---

## 2. Sub-Agent Work Breakdown & Isolation

To eliminate race conditions and worktree collisions, the work is strictly partitioned across 4 Sub-Agents:

1. **Sub-Agent 1 (Supabase Migrations & Database Hardening)**:
   - Scoped to: `supabase/migrations/`, `supabase/config.toml`, `supabase/seed.sql`, `src/lib/supabase/`.
   - Focus: Review all 5 migration SQL files, verify table cleanup scripts, foreign keys, triggers for quota blocks, and RLS policies.

2. **Sub-Agent 2 (Data Layer & Mock Data Elimination)**:
   - Scoped to: `src/features/menu/services/`, `src/features/admin/services/`, `src/lib/supabase/actions.ts`.
   - Focus: Delete `src/features/menu/services/mock-data/`, refactor `store-repository.ts` and `menu-service.ts` to rely on Supabase queries/actions with a unified clean fallback, eliminating obsolete mock data dependencies across the project.

3. **Sub-Agent 3 (Feature Audit 001–004: Menu, Cart, Admin & Landing)**:
   - Scoped to: `src/features/menu/`, `src/features/cart/`, `src/features/landing/`, `src/app/`, `tests/unit/`.
   - Focus: Audit Features 001 to 004 against `specs/001-*`, `specs/002-*`, `specs/003-*`, `specs/004-*`. Ensure dynamic store phone in WhatsApp messages, custom units (`كجم/قطعة`), responsive layout, and unified navigation.

4. **Sub-Agent 4 (Feature Audit 005–006: Operating Hours, SaaS Platform & Super Admin)**:
   - Scoped to: `src/features/schedule/`, `src/features/auth/`, `src/features/onboarding/`, `src/features/subscription/`, `src/features/admin/`, `src/features/dashboard/`.
   - Focus: Audit Features 005 and 006 against `specs/005-*` and `specs/006-*`. Verify 7-day schedule editor, pre-orders guard, quota blocking, AI translation (`/api/translate`), and Super Admin live tier synchronization.
