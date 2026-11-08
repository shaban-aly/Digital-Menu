# Research: SaaS Multi-Tenant Platform

**Feature**: `006-saas-multi-tenant-platform`  
**Date**: 2026-11-08  

---

## 1. Routing Segregation Strategy

### Current vs. Target Layout
- **Current**: `/admin` (contains merchant dashboard components).
- **Target**:
  - `/dashboard`: The merchant management portal (`src/app/dashboard/page.tsx` and `src/app/dashboard/[slug]/page.tsx`).
  - `/admin`: The Super Admin platform owner console (`src/app/admin/page.tsx`).
  - `/login`, `/register`: Authentication endpoints.
  - `/onboarding`: 3-step store creation wizard after registration.
  - `/menu/[slug]`: Customer digital menu (unchanged).

---

## 2. Quota & Subscription Engine Architecture

### Plan Limits Matrix
| Plan Key | Name (AR/EN) | Price (EGP) | Max Categories | Max Products | Multi-Store Support |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `free` | باقة البداية / Free | 0 EGP | 7 | 50 | Single Store |
| `pro` (monthly) | باقة النمو / Pro Monthly | 250 EGP / شهر | 50 | 500 | Multi-Store (up to 5) |
| `pro` (yearly) | باقة النمو السنوية / Pro Yearly | 2,500 EGP / سنة | 50 | 500 | Multi-Store (up to 5) |
| `enterprise` | الشركات / Enterprise | مخصص / Custom | $\infty$ | $\infty$ | Unlimited Stores |

### Quota Verification Logic
```typescript
export interface QuotaCheckResult {
  allowed: boolean;
  currentCount: number;
  maxLimit: number;
  usagePercent: number;
  planKey: SubscriptionPlanKey;
  messageAr: string;
  messageEn: string;
}
```

Whenever `saveMenuItem` or `saveCategory` is invoked, `QuotaService.canAddItem(store)` or `QuotaService.canAddCategory(store)` evaluates:
$$\text{allowed} = \text{currentCount} < \text{maxLimit}$$
If `!allowed`, an accessible upgrade dialog opens with WhatsApp deep link:
```text
https://wa.me/{PLATFORM_PHONE}?text=مرحباً أرغب في ترقية متجر ({storeName}) إلى باقة Pro...
```

---

## 3. Database & Hybrid Persistence

### Supabase Table Schema
1. `profiles`: `id (UUID)`, `email`, `full_name`, `phone`, `role ('merchant' | 'superadmin')`, `created_at`.
2. `stores`: `id (UUID)`, `owner_id (FK)`, `slug (UNIQUE)`, `name_ar`, `name_en`, `business_type`, `phone_number`, `delivery_fee`, `plan ('free' | 'pro' | 'enterprise')`, `is_active (BOOLEAN)`.
3. `categories`: `id (UUID)`, `store_id (FK)`, `name_ar`, `name_en`, `display_order`, `is_active`.
4. `products`: `id (UUID)`, `store_id (FK)`, `category_id (FK)`, `name_ar`, `name_en`, `price`, `unit_ar`, `unit_en`, `is_available`, `image_url`.

### Safe Offline / Development Fallback
`src/lib/supabase/client.ts` exports `isSupabaseConfigured()`. When environment variables are missing, all repositories fall back transparently to `LocalStorageStoreRepository` so offline builds, Vitest unit tests, and local previews execute with 0 failures.

---

## 4. 4-Sub-Agent Work Breakdown & Isolation

To eliminate race conditions and file collisions:
1. **Sub-Agent 1 (Auth & Onboarding)**: Scoped strictly to `src/features/auth/`, `src/features/onboarding/`, `src/app/login/`, `src/app/register/`, `src/app/onboarding/`.
2. **Sub-Agent 2 (Subscription & Quotas)**: Scoped strictly to `src/features/subscription/`, `QuotaService`, `QuotaUpgradeModal`, `PricingComparison`.
3. **Sub-Agent 3 (Merchant Dashboard)**: Scoped strictly to `src/features/dashboard/`, `src/app/dashboard/`, quota usage bars, store switcher.
4. **Sub-Agent 4 (Super Admin & Database)**: Scoped strictly to `src/features/admin/`, `src/app/admin/`, `supabase/migrations/`, `src/lib/supabase/`.

