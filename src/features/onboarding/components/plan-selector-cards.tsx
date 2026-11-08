"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";
import { SubscriptionPlanKey, BillingCycle } from "@/features/subscription/types";
import { cn } from "@/lib/utils";

interface PlanSelectorCardsProps {
  selectedPlan: SubscriptionPlanKey;
  billingCycle: BillingCycle;
  onSelectPlan: (plan: SubscriptionPlanKey) => void;
  onToggleCycle: (cycle: BillingCycle) => void;
}

export const PlanSelectorCards: React.FC<PlanSelectorCardsProps> = ({
  selectedPlan,
  billingCycle,
  onSelectPlan,
  onToggleCycle,
}) => {
  const { locale } = useLanguage();
  const t = locale === "ar" ? arTranslations : enTranslations;

  const plans: {
    key: SubscriptionPlanKey;
    title: string;
    price: string;
    quota: string;
    recommended?: boolean;
  }[] = [
    {
      key: "free",
      title: t.subscription.freeTitle,
      price: t.subscription.freePrice,
      quota: t.subscription.freeQuota,
    },
    {
      key: "pro",
      title: t.subscription.proTitle,
      price: billingCycle === "yearly" ? t.subscription.proPriceYearly : t.subscription.proPriceMonthly,
      quota: t.subscription.proQuota,
      recommended: true,
    },
    {
      key: "enterprise",
      title: t.subscription.enterpriseTitle,
      price: t.subscription.enterprisePrice,
      quota: t.subscription.enterpriseQuota,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 text-start">
          {t.onboarding.selectPlan}
        </label>
        <div className="inline-flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          <button
            type="button"
            onClick={() => onToggleCycle("monthly")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all min-h-[32px]",
              billingCycle === "monthly"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            )}
          >
            {t.subscription.monthly}
          </button>
          <button
            type="button"
            onClick={() => onToggleCycle("yearly")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all min-h-[32px]",
              billingCycle === "yearly"
                ? "bg-white dark:bg-neutral-900 text-brand-600 dark:text-brand-400 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            )}
          >
            {t.subscription.yearly}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.key;
          return (
            <button
              key={plan.key}
              type="button"
              onClick={() => onSelectPlan(plan.key)}
              className={cn(
                "relative p-4 rounded-2xl border text-start transition-all min-h-[110px] flex flex-col justify-between cursor-pointer",
                isSelected
                  ? "border-brand-600 bg-brand-50/60 dark:bg-brand-950/30 ring-2 ring-brand-500/20 shadow-xs"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700"
              )}
            >
              {plan.recommended && (
                <span className="absolute -top-2.5 end-3 px-2 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-black inline-flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>{locale === "ar" ? "الأكثر طلباً" : "Popular"}</span>
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {plan.title}
                  </span>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                      isSelected
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-neutral-300 dark:border-neutral-600"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
                <div className="text-sm font-black text-brand-600 dark:text-brand-400">
                  {plan.price}
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 leading-tight">
                {plan.quota}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
