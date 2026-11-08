"use client";

import React from "react";
import Link from "next/link";
import { UtensilsCrossed, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export default function NotFound() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center">
          <UtensilsCrossed className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-black text-neutral-900 dark:text-neutral-100">
          {isAr ? "المتجر غير موجود" : "Store Not Found"}
        </h1>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {isAr
            ? "عذراً، لم نتمكن من العثور على قائمة الطعام أو المتجر المطلوب. تأكد من صحة الرابط."
            : "Sorry, we could not find the requested store or menu. Please check the URL and try again."}
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-xs min-h-[44px]"
          >
            <span>{isAr ? "العودة للرئيسية" : "Back to Home"}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </div>
  );
}
