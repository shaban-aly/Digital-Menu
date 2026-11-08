"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { Globe, MessageSquare, UtensilsCrossed } from "lucide-react";
import { buildWhatsAppInquiryUrl } from "../services/landing-data";

export const LandingNavbar: React.FC = () => {
  const { locale, toggleLanguage } = useLanguage();
  const isAr = locale === "ar";

  const navLinks = [
    { href: "#models", label: isAr ? "النماذج الحية" : "Live Models" },
    { href: "#solutions", label: isAr ? "حلول الأنشطة" : "Solutions" },
    { href: "#calculator", label: isAr ? "حاسبة التوفير" : "Savings Calculator" },
    { href: "#pricing", label: isAr ? "باقات الأسعار" : "Pricing" },
    { href: "#faq", label: isAr ? "الأسئلة الشائعة" : "FAQ" },
  ];

  const whatsappUrl = buildWhatsAppInquiryUrl(
    isAr ? "منصة المنيو الرقمي" : "Digital Menu Platform",
    isAr ? "استفسار من الموقع الرئيسي" : "Inquiry from homepage"
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-neutral-950/85 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 min-h-[44px] min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-sm sm:text-lg text-neutral-900 dark:text-neutral-100 tracking-tight block truncate">
              {isAr ? "المنيو الرقمي" : "Digital Menu"}
            </span>
            <span className="hidden sm:inline-block ms-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
              0% {isAr ? "عمولة" : "Commission"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions: Language Toggle + Admin Dashboard + WhatsApp CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-950/40 text-[11px] sm:text-xs font-bold text-brand-700 dark:text-brand-300 hover:bg-brand-100 transition-colors min-h-[44px]"
          >
            <span className="hidden sm:inline">{isAr ? "لوحة التاجر" : "Merchant Admin"}</span>
            <span className="sm:hidden">{isAr ? "التاجر" : "Admin"}</span>
          </Link>

          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[11px] sm:text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-h-[44px] cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>{isAr ? "English" : "العربية"}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isAr ? "تواصل عبر واتساب" : "WhatsApp Inquiry"}
            className="flex items-center justify-center gap-1.5 p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all min-h-[44px] min-w-[44px]"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{isAr ? "تواصل واتساب" : "WhatsApp"}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
