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

