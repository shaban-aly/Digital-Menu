"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { CheckCircle2, ArrowRight, ArrowLeft, Layers } from "lucide-react";
import { getBusinessSolutions } from "../services/landing-data";

export const SolutionsSection: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const solutions = getBusinessSolutions();

  return (
    <section id="solutions" className="py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10 text-center">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs font-bold text-brand-700 dark:text-brand-300">
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? "حلول مفصلة لكل قطاع" : "Tailored Vertical Solutions"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
            {isAr
              ? "نظام واحد يتكيف بدقة مع نموذج عملك"
              : "One Platform Perfectly Tuned to Your Business Model"}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            {isAr
              ? "سواء كنت تدير مطعم مشويات، كافيه عصري، أو سوبرماركت للمواد الغذائية، توفر المنصة الأدوات المناسبة تماماً لزبائنك."
              : "Whether running a grill house, specialty coffee shop, or supermarket, our platform provides the exact tools your business demands."}
          </p>
        </div>

        {/* 3 Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {isAr ? sol.badge_ar : sol.badge_en}
                </span>
                <div>
                  <h3 className="font-extrabold text-lg text-neutral-900 dark:text-neutral-100">
                    {isAr ? sol.title_ar : sol.title_en}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {isAr ? sol.subtitle_ar : sol.subtitle_en}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  {(isAr ? sol.highlights_ar : sol.highlights_en).map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <Link
                  href={`/menu/${sol.demoSlug}`}
                  className="flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 min-h-[44px]"
                >
                  <span>{isAr ? "شاهد التجربة الحية" : "View Live Demo"}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
