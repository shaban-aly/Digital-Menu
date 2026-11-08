"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { HelpCircle, ChevronDown } from "lucide-react";
import { getFaqItems } from "../services/landing-data";

export const FaqSection: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const faqs = getFaqItems();
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 bg-neutral-50/50 dark:bg-neutral-900/30 border-t border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
            {isAr ? "كل ما تود معرفته عن المنصة" : "Everything You Need to Know"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            {isAr
              ? "إجابات واضحة ومباشرة على أكثر الاستفسارات تكراراً لدى أصحاب المتاجر:"
              : "Clear answers to the most common questions asked by merchants:"}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3 text-start">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const q = isAr ? faq.question_ar : faq.question_en;
            const a = isAr ? faq.answer_ar : faq.answer_en;

            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-4 text-start font-bold text-sm text-neutral-900 dark:text-neutral-100 hover:text-brand-600 dark:hover:text-brand-400 min-h-[48px] cursor-pointer"
                >
                  <span>{q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in duration-200">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
