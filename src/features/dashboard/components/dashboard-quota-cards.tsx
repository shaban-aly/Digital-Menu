"use client";

import React from "react";
import Link from "next/link";
import { Locale } from "@/types";
import { QuotaUsage, SubscriptionPlanKey } from "@/features/subscription/types";
import { QuotaProgressBar } from "@/features/subscription/components/quota-progress-bar";
import { Sparkles, ShieldCheck } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface DashboardQuotaCardsProps {
  quotaUsage: QuotaUsage;
  planKey: SubscriptionPlanKey;
  locale: Locale;
  onUpgradeClick: () => void;
}

export const DashboardQuotaCards: React.FC<DashboardQuotaCardsProps> = ({
  quotaUsage,
  planKey,
  locale,
  onUpgradeClick,
}) => {
  const tSub =
    locale === "ar" ? arTranslations.subscription : enTranslations.subscription;
  const isArabic = locale === "ar";
  const isFree = planKey === "free";

  return (
    <div
      data-testid="dashboard-quota-section"
      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {isArabic ? "سعة وباقة المتجر" : "Store Capacity & Plan"}
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {isFree
                ? isArabic
                  ? "الخطة المجانية - سعة محددة للأقسام والمنتجات"
                  : "Free Plan - Limited categories & products"
                : isArabic
                ? "خطة نشطة مع سعة موسعة"
                : "Active tier with expanded limits"}
            </p>
          </div>
        </div>

        {isFree && (
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/pricing"
              data-testid="dashboard-pricing-link-btn"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200/60 dark:border-brand-800/60 transition-colors min-h-[36px]"
            >
              <span>{isArabic ? "ترقية الخطة" : "Upgrade Plan"}</span>
            </Link>
            <button
              type="button"
              data-testid="dashboard-upgrade-plan-btn"
              onClick={onUpgradeClick}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs min-h-[36px]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{tSub.upgradeWhatsApp}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuotaProgressBar
          label={tSub.categories}
          current={quotaUsage.categoriesCount}
          max={quotaUsage.maxCategories}
          percentage={quotaUsage.categoriesUsagePercent}
          isExceeded={quotaUsage.isCategoriesExceeded}
        />

        <QuotaProgressBar
          label={tSub.products}
          current={quotaUsage.productsCount}
          max={quotaUsage.maxProducts}
          percentage={quotaUsage.productsUsagePercent}
          isExceeded={quotaUsage.isProductsExceeded}
        />
      </div>
    </div>
  );
};
