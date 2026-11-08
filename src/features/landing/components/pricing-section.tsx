"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Zap } from "lucide-react";
import { PricingComparison } from "@/features/subscription/components/pricing-comparison";

export const PricingSection: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10 text-center">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs font-bold text-brand-700 dark:text-brand-300">
            <Zap className="w-3.5 h-3.5" />
            <span>{isAr ? "اشتراك ثابت بدون عمولات" : "Flat Subscription, 0% Cuts"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
            {isAr ? "باقات اشتراك شفافة تناسب حجم نشاطك" : "Simple Pricing for Every Business Size"}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            {isAr
              ? "ابدأ مجاناً 100% بدون أي بطاقة بنكية، أو اشترك في باقة النمو بـ 250 ج.م شهرياً مع وفر شهرين عند الاشتراك السنوي."
              : "Start 100% free with no credit card required, or upgrade to Pro Growth at 250 EGP/mo with 2 months free on annual billing."}
          </p>
        </div>

        {/* Unified Pricing Comparison with Monthly/Yearly Toggle & WhatsApp Deep-Links */}
        <PricingComparison locale={locale} />
      </div>
    </section>
  );
};
