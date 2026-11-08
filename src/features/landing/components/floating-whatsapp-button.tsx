"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { buildWhatsAppInquiryUrl } from "../services/landing-data";

export const FloatingWhatsAppButton: React.FC = () => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const whatsappUrl = buildWhatsAppInquiryUrl(
    isAr ? "منصة المنيو الرقمي" : "Digital Menu Platform",
    isAr ? "استفسار من الموقع الرئيسي" : "Inquiry from homepage"
  );

  return (
    <aside
      aria-label={isAr ? "زر المحادثة الفورية" : "Floating Chat Action"}
      className="fixed bottom-5 end-5 sm:bottom-6 sm:end-6 z-40"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="floating-whatsapp-btn"
        aria-label={isAr ? "تواصل معنا مباشرة عبر واتساب" : "Contact us on WhatsApp"}
        className="group relative flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xl shadow-emerald-900/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 min-h-[48px] min-w-[48px]"
      >
        {/* Active Ping Indicator */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>

        <MessageSquare className="w-5 h-5 shrink-0" />
        <span className="text-xs sm:text-sm font-extrabold tracking-wide pe-0.5">
          {isAr ? "تواصل واتساب" : "WhatsApp"}
        </span>
      </a>
    </aside>
  );
};
