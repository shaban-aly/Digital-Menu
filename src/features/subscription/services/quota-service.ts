import { MenuData } from "@/features/menu/types";
import { SubscriptionPlanKey, QuotaUsage, SUBSCRIPTION_QUOTAS } from "../types";

export class QuotaService {
  static getQuotaUsage(
    storeData: MenuData,
    planKey: SubscriptionPlanKey = "free"
  ): QuotaUsage {
    const quota = SUBSCRIPTION_QUOTAS[planKey] ?? SUBSCRIPTION_QUOTAS.free;
    const categoriesCount = storeData.categories.length;
    const productsCount = storeData.categories.reduce(
      (acc, cat) => acc + (cat.items?.length || 0),
      0
    );

    const categoriesUsagePercent =
      quota.maxCategories > 0
        ? Math.min(100, Math.round((categoriesCount / quota.maxCategories) * 100))
        : 0;

    const productsUsagePercent =
      quota.maxProducts > 0
        ? Math.min(100, Math.round((productsCount / quota.maxProducts) * 100))
        : 0;

    return {
      categoriesCount,
      maxCategories: quota.maxCategories,
      categoriesUsagePercent,
      isCategoriesExceeded: categoriesCount >= quota.maxCategories,
      productsCount,
      maxProducts: quota.maxProducts,
      productsUsagePercent,
      isProductsExceeded: productsCount >= quota.maxProducts,
      planKey,
    };
  }

  static canAddCategory(
    storeData: MenuData,
    planKey: SubscriptionPlanKey = "free"
  ): boolean {
    const usage = this.getQuotaUsage(storeData, planKey);
    return !usage.isCategoriesExceeded;
  }

  static canAddProduct(
    storeData: MenuData,
    planKey: SubscriptionPlanKey = "free"
  ): boolean {
    const usage = this.getQuotaUsage(storeData, planKey);
    return !usage.isProductsExceeded;
  }
}
