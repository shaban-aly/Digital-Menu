# Feature Specification: 007 Supabase Production Migration & Full System Audit

**Title**: Full Supabase Database Activation, Mock Data Removal, and Cross-Feature Compliance Audit  
**Author**: Lead Orchestrator  
**Status**: Ready for Implementation  
**Created**: 2026-11-08  
**Constitution**: Version 2.2.0  

---

## 1. Executive Summary

This milestone transitions the Digital Menu platform from development mock-data fallbacks to production-grade Supabase database actions and schemas, while systematically auditing all six features (Features 001 to 006) against their original specifications. Legacy mock modules (`mock-menu-data.ts`, `fresh-market.ts`, `oriental-grill.ts`, `specialty-cafe.ts`) will be eliminated and replaced with unified Supabase server actions and typed queries, while ensuring complete backward compatibility, zero downtime, and zero breakage.

---

## 2. User Stories & Acceptance Criteria

### User Story 1: Production Database Migrations & Clean Reset (Database Architect)
As the platform database administrator,  
I want automated, modular SQL migrations that cleanly wipe legacy tables (`CASCADE`) and recreate all tables (`profiles`, `subscriptions`, `stores`, `categories`, `products`), triggers, and RLS policies,  
So that our Supabase database is completely clean, reliable, and verified with `supabase/seed.sql`.

**Acceptance Criteria**:
- `20261108000001_clean_reset_and_enums.sql` to `20261108000005_rls_policies_and_indexes.sql` execute without SQL errors.
- All legacy columns and obsolete tables are cleanly dropped with `CASCADE`.
- Triggers strictly enforce quota limits (`check_category_quota` and `check_product_quota`) and profile auto-creation on signup (`on_auth_user_created`).
- Demo stores seed (`supabase/seed.sql`) properly inserts `oriental-grill`, `specialty-cafe`, and `fresh-market`.

### User Story 2: Mock Data Removal & Supabase Actions Unification (Data Layer Engineer)
As a platform engineer,  
I want all data retrieval and mutation operations to use Supabase client / server actions, eliminating legacy mock data files,  
So that customer menu views, cart operations, onboarding, and dashboard mutations operate on a single source of truth.

**Acceptance Criteria**:
- `src/features/menu/services/mock-data/` is deleted and references to `mock-menu-data.ts` are removed or transformed into a lightweight, schema-compliant fallback for offline dev.
- All catalog queries and store metadata are queried from Supabase tables with typed queries (`supabase-store-queries.ts`, `supabase-store-mutations.ts`).
- Any item or category added/edited in `/dashboard` persists to the database and appears in `/menu/[slug]`.

### User Story 3: Feature Audit 001–004 (Core Menu, Cart, Admin & Landing)
As a business stakeholder,  
I want Features 001 to 004 verified against their specs,  
So that customer menu viewing, cart ordering with dynamic WhatsApp payloads, merchant catalog editing, and marketing landing pages function seamlessly.

**Acceptance Criteria**:
- **Feature 001**: Category navigation, bilingual RTL/LTR display, and responsive item dialogs render dynamic data.
- **Feature 002**: WhatsApp order generation uses dynamic store phone, currency, and custom selling units (`كجم/قطعة`).
- **Feature 003**: Merchant admin (`/dashboard`) creates/edits items and categories, toggles stock, and respects plan limits.
- **Feature 004**: Landing page (`/`) shows unified `PlatformHeader`, pilot stores showcase, and working CTAs.

### User Story 4: Feature Audit 005–006 (Operating Hours, SaaS Platform & Super Admin)
As the platform owner,  
I want Features 005 and 006 verified against their specs,  
So that operating hours guards, multi-tenant onboarding, subscription quotas, and the Super Admin console operate in complete harmony.

**Acceptance Criteria**:
- **Feature 005**: 7-day schedule, rush pause, pre-orders guard, and store closed banners reflect live store schedule.
- **Feature 006**: Auth (`/login`, `/register`), 1:1 onboarding wizard (`/onboarding`), `/pricing` page, quota meters, and `/admin` tier modification operate dynamically.
- AI translation (`/api/translate`) works across all Arabic input fields.
- 100% Constitution v2.2.0 compliance (all files <= 180 lines, 100% logical directional CSS, zero native dialogs, strict TS).
