"use client";

import React from "react";
import Link from "next/link";
import { Utensils, Coffee, ShoppingBasket, Globe, ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export default function HomePage() {
  const { locale, toggleLanguage } = useLanguage();
  const isAr = locale === "ar";

  const stores = [
    {
      slug: "oriental-grill",
      name: isAr ? "مطعم مشويات البركة" : "Al-Baraka Oriental Grill",
      type: isAr ? "مطعم مشويات" : "Grill Restaurant",
      icon: <Utensils className="w-5 h-5 text-brand-600" />,
      features: isAr
        ? "يدعم: داخل المطعم (طاولة إجباري)، استلام من الفرع، وتوصيل للمنزل"
        : "Supports: Dine-in (table required), Takeaway, and Home Delivery",
      badge: isAr ? "نموذج 1: مطعم" : "Model 1: Restaurant",
    },
    {
      slug: "specialty-cafe",
      name: isAr ? "كافيه ومخبوزات أروما" : "Aroma Specialty Café & Bakery",
      type: isAr ? "كافيه ومخبوزات" : "Café & Bakery",
      icon: <Coffee className="w-5 h-5 text-amber-600" />,
      features: isAr
        ? "يدعم: أحجام الأكواب (350 مل)، قطع الحلويات، داخل المطعم، استلام، وتوصيل"
        : "Supports: Cup sizes, pastries, Dine-in, Takeaway, and Delivery",
      badge: isAr ? "نموذج 2: كافيه" : "Model 2: Café",
    },
    {
      slug: "fresh-market",
      name: isAr ? "سوبر ماركت فريش ماركت" : "Fresh Market Supermarket",
      type: isAr ? "سوبر ماركت وبقالة" : "Supermarket",
      icon: <ShoppingBasket className="w-5 h-5 text-emerald-600" />,
      features: isAr
        ? "يدعم: وحدات الوزن والعبوة (1 كجم، لتر)، وتوصيل واستلام فقط (إخفاء الطاولة)"
        : "Supports: Weight/Volume units, Delivery & Takeaway only (hides table)",
      badge: isAr ? "نموذج 3: سوبر ماركت" : "Model 3: Supermarket",
    },
  ];

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header & In-place Language Toggle */}
        <header className="flex items-center justify-between pb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100">
              {isAr ? "المنيو الرقمي - النماذج التجريبية" : "Digital Menu - Pilot Models"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {isAr
                ? "منصة رقمية موحدة للمطاعم والكافيهات والأسواق التجارية"
                : "Unified digital platform for restaurants, cafes, and supermarkets"}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-h-[44px] cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span>{isAr ? "English" : "العربية"}</span>
          </button>
        </header>

        {/* Temporary Portal Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
          <span>
            {isAr
              ? "⚡ بوابة تجريبية سريعة: صفحة الهبوط التسويقية الكاملة مجدولة في الخطة القادمة."
              : "⚡ Fast testing portal: Full marketing landing page is scheduled for next milestone."}
          </span>
        </div>

        {/* Pilot Store Cards */}
        <div className="space-y-4">
          {stores.map((store) => (
            <div
              key={store.slug}
              className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                    {store.icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md">
                      {store.badge}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {store.name}
                    </h2>
                  </div>
                </div>

                <span className="text-xs font-mono text-neutral-400">
                  /menu/{store.slug}
                </span>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 leading-relaxed">
                {store.features}
              </p>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end">
                <Link
                  href={`/menu/${store.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 transition-colors shadow-xs min-h-[44px]"
                >
                  <span>{isAr ? "فتح المنيو التجريبي" : "Open Pilot Menu"}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
