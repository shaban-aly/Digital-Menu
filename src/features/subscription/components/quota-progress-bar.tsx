"use client";

import React from "react";
import { QuotaUsage, SubscriptionPlanKey } from "../types";
import { MenuData } from "@/features/menu/types";
import { getQuotaUsage, QuotaStoreData } from "../services/quota-service";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";

export interface QuotaProgressBarProps {
  usage?: QuotaUsage;
  storeData?: MenuData | QuotaStoreData;
  planKey?: SubscriptionPlanKey;
  locale?: "ar" | "en";
  className?: string;
  showPlanBadge?: boolean;
  onUpgradeClick?: () => void;
}

export const QuotaProgressBar: React.FC<QuotaProgressBarProps> = ({
  usage: directUsage,
  storeData,
  planKey,
  locale = "ar",
  className,
  showPlanBadge = true,
  onUpgradeClick,
}) => {
  const isAr = locale === "ar";
  const usage = directUsage ?? getQuotaUsage(storeData ?? {}, planKey);
  const isEnterprise = usage.planKey === "enterprise";

  const getMeterColor = (percent: number, exceeded: boolean) => {
    if (exceeded) return "bg-red-500";
    if (percent >= 80) return "bg-amber-500";
    return "bg-brand-600";
  };

  const planLabels: Record<SubscriptionPlanKey, { ar: string; en: string }> = {
    free: { ar: "الباقة المجانية", en: "Free Plan" },
    pro: { ar: "باقة النمو Pro", en: "Pro Growth" },
    enterprise: { ar: "باقة الشركات", en: "Enterprise" },
  };

  const currentPlan = planLabels[usage.planKey] || planLabels.free;

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-4 shadow-sm",
        className
      )}
    >
      {/* Header with Plan Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <span className="font-bold text-sm text-neutral-800 dark:text-neutral-100">
            {isAr ? "سعة المتجر والاستهلاك" : "Store Quota Usage"}
          </span>
        </div>

        {showPlanBadge && (
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              usage.planKey === "enterprise"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                : usage.planKey === "pro"
                  ? "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300"
                  : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            )}
          >
            {isAr ? currentPlan.ar : currentPlan.en}
          </span>
        )}
      </div>

      {/* Categories Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <span>{isAr ? "الأقسام" : "Categories"}</span>
          <span>
            {usage.categoriesCount} /{" "}
            {isEnterprise ? (isAr ? "غير محدود" : "Unlimited") : usage.maxCategories}{" "}
            {!isEnterprise && `(${usage.categoriesUsagePercent}%)`}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={isEnterprise ? 100 : usage.categoriesUsagePercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              getMeterColor(usage.categoriesUsagePercent, usage.isCategoriesExceeded)
            )}
            style={{
              width: `${isEnterprise ? 100 : Math.min(100, usage.categoriesUsagePercent)}%`,
            }}
          />
        </div>
      </div>

      {/* Products Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <span>{isAr ? "المنتجات" : "Products"}</span>
          <span>
            {usage.productsCount} /{" "}
            {isEnterprise ? (isAr ? "غير محدود" : "Unlimited") : usage.maxProducts}{" "}
            {!isEnterprise && `(${usage.productsUsagePercent}%)`}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={isEnterprise ? 100 : usage.productsUsagePercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              getMeterColor(usage.productsUsagePercent, usage.isProductsExceeded)
            )}
            style={{
              width: `${isEnterprise ? 100 : Math.min(100, usage.productsUsagePercent)}%`,
            }}
          />
        </div>
      </div>

      {/* Upgrade CTA Button */}
      {onUpgradeClick && usage.planKey !== "enterprise" && (
        <button
          type="button"
          onClick={onUpgradeClick}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-colors min-h-[44px]",
            usage.isCategoriesExceeded || usage.isProductsExceeded
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60"
          )}
        >
          <span>{isAr ? "ترقية الباقة وسعة إضافية" : "Upgrade Plan for More Capacity"}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
