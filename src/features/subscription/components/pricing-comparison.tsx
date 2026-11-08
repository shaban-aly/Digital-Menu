"use client";

import React, { useState } from "react";
import { SubscriptionPlanKey, BillingCycle } from "../types";
import { PRICING_TIERS, getTierPrice } from "../data/pricing-plans";
import { buildUpgradeWhatsAppUrl } from "../services/subscription-service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, MessageCircle, Sparkles } from "lucide-react";

export interface PricingComparisonProps {
  currentPlan?: SubscriptionPlanKey;
  storeName?: string;
  storeSlug?: string;
  ownerName?: string;
  ownerEmail?: string;
  platformPhone?: string;
  locale?: "ar" | "en";
  className?: string;
  onSelectPlan?: (planKey: SubscriptionPlanKey, cycle: BillingCycle) => void;
}

export const PricingComparison: React.FC<PricingComparisonProps> = ({
  currentPlan = "free",
  storeName = "",
  storeSlug = "",
  ownerName,
  ownerEmail,
  platformPhone,
  locale = "ar",
  className,
  onSelectPlan,
}) => {
  const [cycle, setCycle] = useState<BillingCycle>("yearly");
  const isAr = locale === "ar";

  const handleAction = (planKey: SubscriptionPlanKey) => {
    onSelectPlan?.(planKey, cycle);
    if (planKey !== "free" && typeof window !== "undefined") {
      const url = buildUpgradeWhatsAppUrl({
        platformPhone,
        storeName: storeName || (isAr ? "متجري" : "My Store"),
        storeSlug: storeSlug || "store",
        ownerName,
        ownerEmail,
        targetPlan: planKey,
        billingCycle: cycle,
        locale,
      });
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={cn("space-y-8 text-center", className)}>
      {/* Billing Cycle Toggle */}
      <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
        <button
          type="button"
          onClick={() => setCycle("monthly")}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px]",
            cycle === "monthly"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400"
          )}
        >
          {isAr ? "اشتراك شهري" : "Monthly"}
        </button>
        <button
          type="button"
          onClick={() => setCycle("yearly")}
          className={cn(
            "relative px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] flex items-center gap-1.5",
            cycle === "yearly"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400"
          )}
        >
          <span>{isAr ? "اشتراك سنوي" : "Yearly"}</span>
          <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
            {isAr ? "وفر شهرين!" : "2 Mo Free!"}
          </span>
        </button>
      </div>

      {/* 3-Column Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
        {PRICING_TIERS.map((tier) => {
          const { price, period } = getTierPrice(tier.key, cycle, locale);
          const isCurrent = currentPlan === tier.key;
          const isPro = tier.isPopular;

          return (
            <div
              key={tier.key}
              className={cn(
                "relative rounded-3xl p-6 transition-all flex flex-col justify-between bg-white dark:bg-neutral-900 border",
                isPro
                  ? "border-2 border-brand-500 shadow-xl shadow-brand-500/10"
                  : "border-neutral-200 dark:border-neutral-800 shadow-sm"
              )}
            >
              {isPro && (
                <div className="absolute -top-3.5 inset-inline-0 flex justify-center">
                  <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? tier.badgeAr : tier.badgeEn}</span>
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {isAr ? tier.nameAr : tier.nameEn}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {isAr ? tier.descriptionAr : tier.descriptionEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">{price}</span>
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{period}</span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-lg inline-block">
                    {isAr ? tier.quotaAr : tier.quotaEn}
                  </div>
                </div>

                <ul className="space-y-2.5 pt-4 text-xs text-neutral-600 dark:text-neutral-300">
                  {(isAr ? tier.featuresAr : tier.featuresEn).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Button
                  type="button"
                  variant={isCurrent ? "outline" : isPro ? "primary" : "secondary"}
                  onClick={() => handleAction(tier.key)}
                  disabled={isCurrent}
                  className="w-full font-bold gap-2 min-h-[44px]"
                >
                  {isCurrent ? (
                    <span>{isAr ? "خطتك الحالية" : "Current Plan"}</span>
                  ) : (
                    <>
                      {tier.key !== "free" && <MessageCircle className="w-4 h-4" />}
                      <span>
                        {tier.key === "free"
                          ? isAr ? "الباقة المجانية" : "Start Free"
                          : isAr ? "اشترك عبر واتساب" : "Subscribe via WhatsApp"}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
