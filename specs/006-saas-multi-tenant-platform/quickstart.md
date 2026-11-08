# Quickstart & Verification Guide: SaaS Multi-Tenant Platform

**Feature**: `006-saas-multi-tenant-platform`  
**Date**: 2026-11-08  

---

## 1. Automated Verification
Run Vitest for quota limits, auth workflows, and repository queries:
```bash
npm test
```
Run type-checking and linter:
```bash
npm run type-check
npm run lint
```

## 2. Key User Journeys to Verify

### Journey 1: Auth & Store Onboarding
1. Navigate to `http://localhost:3000/register`.
2. Fill name and email -> Redirected to `/onboarding`.
3. Fill new store details (`burger-queen`) -> Select `Free` plan.
4. Verify immediate redirect to `/dashboard/burger-queen`.
5. Check that `/menu/burger-queen` is live and reachable.

### Journey 2: Quota Limits & WhatsApp Upgrade Link
1. In `/dashboard/oriental-grill`, observe the Quota Progress Bars in the top bar.
2. Attempt to add categories until limit 7 (Free) is reached.
3. Verify the 8th addition is politely blocked with `QuotaUpgradeModal`.
4. Click "ترقية لخطة Pro عبر واتساب" -> Verify WhatsApp opens with pre-filled order text and 250 EGP/mo or 2500 EGP/yr details.

### Journey 3: Super Admin Console
1. Navigate to `http://localhost:3000/admin`.
2. Review KPI metric cards (Total Stores, Active, Plan Distribution).
3. In the stores table, switch `oriental-grill` from `free` to `pro`.
4. Verify `/dashboard/oriental-grill` now reflects the 50 category / 500 product quota.

### Journey 4: Supabase Database Migration
1. Review `supabase/migrations/20261108_saas_schema.sql`.
2. Verify tables and indexes match the schema.

