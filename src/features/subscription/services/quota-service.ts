import {
  SubscriptionPlanKey,
  QuotaUsage,
  SUBSCRIPTION_QUOTAS,
} from "../types";
import { MenuData } from "@/features/menu/types";

export interface QuotaStoreData {
  categories?: Array<{
    items?: unknown[];
  }>;
  restaurant?: {
    plan?: SubscriptionPlanKey | string;
    [key: string]: unknown;
  };
}

/**
 * Normalizes any plan key variant (e.g. "pro_monthly", "pro_yearly") to standard SubscriptionPlanKey.
 */
export function normalizePlanKey(plan?: string | null): SubscriptionPlanKey {
  if (!plan) return "free";
  if (plan === "enterprise") return "enterprise";
  if (plan === "pro" || plan === "pro_monthly" || plan === "pro_yearly") {
    return "pro";
  }
  return "free";
}

/**
 * Calculates current quota utilization against the active or requested subscription plan.
 */
export function getQuotaUsage(
  storeData: MenuData | QuotaStoreData,
  planKey?: SubscriptionPlanKey | string
): QuotaUsage {
  const storePlan =
    storeData.restaurant &&
    "plan" in storeData.restaurant &&
    typeof storeData.restaurant.plan === "string"
      ? storeData.restaurant.plan
      : undefined;

  const resolvedPlan: SubscriptionPlanKey = normalizePlanKey(planKey ?? storePlan);
  const quota = SUBSCRIPTION_QUOTAS[resolvedPlan] || SUBSCRIPTION_QUOTAS.free;
  const categoriesCount = storeData.categories ? storeData.categories.length : 0;
  const productsCount = storeData.categories
    ? storeData.categories.reduce(
        (sum, cat) => sum + (Array.isArray(cat.items) ? cat.items.length : 0),
        0
      )
    : 0;

  const isEnterprise =
    resolvedPlan === "enterprise" ||
    quota.maxCategories >= 999999 ||
    quota.maxCategories === -1 ||
    quota.maxProducts === -1;

  const categoriesUsagePercent = isEnterprise
    ? 0
    : quota.maxCategories > 0
      ? Math.min(100, Math.round((categoriesCount / quota.maxCategories) * 100))
      : 0;

  const productsUsagePercent = isEnterprise
    ? 0
    : quota.maxProducts > 0
      ? Math.min(100, Math.round((productsCount / quota.maxProducts) * 100))
      : 0;

  const isCategoriesExceeded = isEnterprise
    ? false
    : quota.maxCategories > 0
      ? categoriesCount >= quota.maxCategories
      : false;

  const isProductsExceeded = isEnterprise
    ? false
    : quota.maxProducts > 0
      ? productsCount >= quota.maxProducts
      : false;

  return {
    categoriesCount,
    maxCategories: isEnterprise ? 999999 : quota.maxCategories,
    categoriesUsagePercent,
    isCategoriesExceeded,
    productsCount,
    maxProducts: isEnterprise ? 999999 : quota.maxProducts,
    productsUsagePercent,
    isProductsExceeded,
    planKey: resolvedPlan,
  };
}

/**
 * Checks whether a new category can be added under the current quota.
 */
export function canAddCategory(
  storeData: MenuData | QuotaStoreData,
  planKey?: SubscriptionPlanKey | string
): boolean {
  const usage = getQuotaUsage(storeData, planKey);
  return !usage.isCategoriesExceeded;
}

/**
 * Checks whether a new product/item can be added under the current quota.
 */
export function canAddProduct(
  storeData: MenuData | QuotaStoreData,
  planKey?: SubscriptionPlanKey | string
): boolean {
  const usage = getQuotaUsage(storeData, planKey);
  return !usage.isProductsExceeded;
}

export const canAddItem = canAddProduct;

export const QuotaService = {
  normalizePlanKey,
  getQuotaUsage,
  canAddCategory,
  canAddProduct,
  canAddItem,
};
