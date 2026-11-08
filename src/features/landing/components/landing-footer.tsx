"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { UtensilsCrossed, MessageSquare } from "lucide-react";
import { buildWhatsAppInquiryUrl } from "../services/landing-data";

export const LandingFooter: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const whatsappUrl = buildWhatsAppInquiryUrl();

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-start">
        {/* Brand Info */}
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-neutral-900 dark:text-neutral-100">
              {isAr ? "المنيو الرقمي" : "Digital Menu"}
            </span>
          </Link>
          <p className="text-xs text-neutral-500 max-w-sm">
            {isAr
              ? "المنصة الرقمية الموحدة لطلبات المطاعم والكافيهات والسوبرماركت بدون عمولات."
              : "The unified zero-commission direct ordering platform for restaurants and stores."}
          </p>
        </div>

        {/* Links & WhatsApp CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isAr ? "ابدأ متجرك عبر واتساب" : "Launch Store via WhatsApp"}</span>
          </a>
          <span className="text-[11px] text-neutral-400">
            © {new Date().getFullYear()} Digital Menu. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </span>
        </div>
      </div>
    </footer>
  );
};
