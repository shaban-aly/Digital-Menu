"use client";

import React from "react";
import { Send } from "lucide-react";
import { Locale } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CartDrawerFooterProps {
  totalPrice: number;
  locale: Locale;
  onSubmitWhatsApp: () => void;
}

export const CartDrawerFooter: React.FC<CartDrawerFooterProps> = ({
  totalPrice,
  locale,
  onSubmitWhatsApp,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;

  return (
    <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900 space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-neutral-600 dark:text-neutral-400">
          {t.cart.total}
        </span>
        <span
          data-testid="cart-drawer-total"
          className="text-lg font-black text-brand-700 dark:text-brand-400"
        >
          {formatCurrency(totalPrice, locale)}
        </span>
      </div>

      <button
        type="button"
        data-testid="whatsapp-submit-btn"
        onClick={onSubmitWhatsApp}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all min-h-[44px]",
          "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-700/25 cursor-pointer"
        )}
      >
        <Send className="w-4 h-4 rtl:rotate-180" />
        <span>{t.cart.sendWhatsApp}</span>
      </button>
    </div>
  );
};
