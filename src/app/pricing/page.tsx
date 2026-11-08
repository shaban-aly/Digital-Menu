"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PlatformHeader } from "@/components/layout/platform-header";
import { PricingComparison } from "@/features/subscription/components/pricing-comparison";

export default function PricingPage() {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <PlatformHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-xs font-bold text-brand-700 dark:text-brand-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "باقات واشتراكات شفافة" : "Transparent Pricing Plans"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
            {isAr ? "اختر الخطة المناسبة لحجم نشاطك" : "Choose the Perfect Plan for Your Business"}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {isAr
              ? "ابدأ مجاناً 100% بدون أي بطاقة بنكية، أو اشترك في باقة النمو بـ 250 ج.م شهرياً مع وفر شهرين عند الاشتراك السنوي وتفعيل فوري على واتساب."
              : "Start 100% free with no credit card required, or upgrade to Pro Growth at 250 EGP/mo with 2 months free on annual plans."}
          </p>
        </div>

        <PricingComparison
          locale={locale}
          storeSlug={user?.storeSlug || undefined}
          ownerName={user?.fullName || undefined}
          ownerEmail={user?.email || undefined}
        />

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                {isAr ? "ضمان تجربة مجانية بدون التزام" : "Risk-Free Trial Guarantee"}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {isAr
                  ? "يمكنك التبديل بين الباقات أو إلغاء الاشتراك في أي وقت. دعم فني متاح على مدار الساعة."
                  : "Switch plans or cancel anytime. 24/7 dedicated customer assistance."}
              </p>
            </div>
          </div>

          <Link
            href="/register"
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs min-h-[44px]"
          >
            <span>{isAr ? "ابدأ تجربتك المجانية الآن" : "Start Your Free Trial Now"}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()}{" "}
        {isAr
          ? "منصة المنيو الرقمي — جميع الحقوق محفوظة"
          : "Digital Menu Platform — All Rights Reserved"}
      </footer>
    </div>
  );
}
