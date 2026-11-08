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
 * Calculates current quota utilization against the active or requested subscription plan.
 */
export function getQuotaUsage(
  storeData: MenuData | QuotaStoreData,
  planKey?: SubscriptionPlanKey
): QuotaUsage {
  const resolvedPlan: SubscriptionPlanKey =
    planKey ??
    (storeData.restaurant &&
    "plan" in storeData.restaurant &&
    typeof storeData.restaurant.plan === "string" &&
    storeData.restaurant.plan in SUBSCRIPTION_QUOTAS
      ? (storeData.restaurant.plan as SubscriptionPlanKey)
      : "free");

  const quota = SUBSCRIPTION_QUOTAS[resolvedPlan] || SUBSCRIPTION_QUOTAS.free;
  const categoriesCount = storeData.categories ? storeData.categories.length : 0;
  const productsCount = storeData.categories
    ? storeData.categories.reduce(
        (sum, cat) => sum + (Array.isArray(cat.items) ? cat.items.length : 0),
        0
      )
    : 0;

  const isEnterprise =
    resolvedPlan === "enterprise" || quota.maxCategories >= 999999;

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
    : categoriesCount >= quota.maxCategories;

  const isProductsExceeded = isEnterprise
    ? false
    : productsCount >= quota.maxProducts;

  return {
    categoriesCount,
    maxCategories: quota.maxCategories,
    categoriesUsagePercent,
    isCategoriesExceeded,
    productsCount,
    maxProducts: quota.maxProducts,
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
  planKey?: SubscriptionPlanKey
): boolean {
  const usage = getQuotaUsage(storeData, planKey);
  return !usage.isCategoriesExceeded;
}

/**
 * Checks whether a new product/item can be added under the current quota.
 */
export function canAddProduct(
  storeData: MenuData | QuotaStoreData,
  planKey?: SubscriptionPlanKey
): boolean {
  const usage = getQuotaUsage(storeData, planKey);
  return !usage.isProductsExceeded;
}

/**
 * Alias for canAddProduct for backward/contract compatibility.
 */
export const canAddItem = canAddProduct;

export const QuotaService = {
  getQuotaUsage,
  canAddCategory,
  canAddProduct,
  canAddItem,
};
