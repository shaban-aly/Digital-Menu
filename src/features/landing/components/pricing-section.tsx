"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Check, Zap, MessageSquare } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getPricingPlans, buildWhatsAppInquiryUrl } from "../services/landing-data";

export const PricingSection: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const plans = getPricingPlans();

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
              ? "اختر الباقة المناسبة وابدأ في تشغيل منيو متجرك الرقمي في أقل من 24 ساعة."
              : "Choose a plan and launch your branded digital menu in under 24 hours."}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          {plans.map((plan) => {
            const planName = isAr ? plan.name_ar : plan.name_en;
            const waUrl = buildWhatsAppInquiryUrl(planName, plan.whatsappMessage);

            return (
              <div
                key={plan.id}
                className={`relative p-6 rounded-3xl flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? "bg-white dark:bg-neutral-900 border-2 border-brand-500 shadow-xl scale-102 z-10"
                    : "bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                    {isAr ? plan.badge_ar : plan.badge_en}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-neutral-900 dark:text-neutral-100">{planName}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      {isAr ? plan.description_ar : plan.description_en}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
                      {formatCurrency(plan.priceMonthly, locale)}
                    </span>
                    <span className="text-xs text-neutral-500 ms-1 font-semibold">/{isAr ? "شهرياً" : "month"}</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    {(isAr ? plan.features_ar : plan.features_en).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                      plan.isPopular
                        ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg"
                        : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isAr ? plan.ctaText_ar : plan.ctaText_en}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
