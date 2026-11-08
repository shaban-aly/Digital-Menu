# Data Model: SaaS Multi-Tenant Platform

**Feature**: `006-saas-multi-tenant-platform`  
**Date**: 2026-11-08  

---

## 1. Zod Schemas & TypeScript Types

```typescript
import { z } from "zod";

export const SubscriptionPlanKeySchema = z.enum(["free", "pro", "enterprise"]);
export type SubscriptionPlanKey = z.infer<typeof SubscriptionPlanKeySchema>;

export const BillingCycleSchema = z.enum(["monthly", "yearly"]);
export type BillingCycle = z.infer<typeof BillingCycleSchema>;

export const SubscriptionQuotaSchema = z.object({
  planKey: SubscriptionPlanKeySchema,
  billingCycle: BillingCycleSchema.optional(),
  maxCategories: z.number().int().nonnegative(),
  maxProducts: z.number().int().nonnegative(),
  priceMonthly: z.number().nonnegative(),
  priceYearly: z.number().nonnegative(),
});
export type SubscriptionQuota = z.infer<typeof SubscriptionQuotaSchema>;

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum(["merchant", "superadmin"]).default("merchant"),
  storeSlug: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const StoreOnboardingInputSchema = z.object({
  businessType: z.enum(["restaurant", "cafe", "supermarket", "store"]),
  nameAr: z.string().min(2, "الاسم بالعربية مطلوب"),
  nameEn: z.string().min(2, "English name is required"),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "الرابط يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط"),
  phoneNumber: z.string().min(7),
  deliveryFee: z.number().nonnegative().default(20),
  selectedPlan: SubscriptionPlanKeySchema.default("free"),
  billingCycle: BillingCycleSchema.default("monthly"),
});
export type StoreOnboardingInput = z.infer<typeof StoreOnboardingInputSchema>;

export const QuotaUsageSchema = z.object({
  categoriesCount: z.number().int(),
  maxCategories: z.number().int(),
  categoriesUsagePercent: z.number(),
  isCategoriesExceeded: z.boolean(),
  productsCount: z.number().int(),
  maxProducts: z.number().int(),
  productsUsagePercent: z.number(),
  isProductsExceeded: z.boolean(),
  planKey: SubscriptionPlanKeySchema,
});
export type QuotaUsage = z.infer<typeof QuotaUsageSchema>;
```

---

## 2. Hardcoded Plan Quota Constants

```typescript
export const SUBSCRIPTION_QUOTAS: Record<SubscriptionPlanKey, SubscriptionQuota> = {
  free: {
    planKey: "free",
    maxCategories: 7,
    maxProducts: 50,
    priceMonthly: 0,
    priceYearly: 0,
  },
  pro: {
    planKey: "pro",
    maxCategories: 50,
    maxProducts: 500,
    priceMonthly: 250,
    priceYearly: 2500,
  },
  enterprise: {
    planKey: "enterprise",
    maxCategories: 999999,
    maxProducts: 999999,
    priceMonthly: 0,
    priceYearly: 0,
  },
};
```
