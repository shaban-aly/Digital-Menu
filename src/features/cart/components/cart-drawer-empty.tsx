"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { Locale } from "@/types";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CartDrawerEmptyProps {
  locale: Locale;
  onClose: () => void;
}

export const CartDrawerEmpty: React.FC<CartDrawerEmptyProps> = ({
  locale,
  onClose,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;

  return (
    <div className="py-12 text-center space-y-3">
      <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
        <ShoppingBag className="w-7 h-7" />
      </div>
      <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
        {t.cart.emptyTitle}
      </h3>
      <p className="text-xs text-neutral-500 max-w-xs mx-auto">
        {t.cart.emptyDesc}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 text-white hover:bg-brand-700 min-h-[44px] cursor-pointer"
      >
        {t.cart.browseMenu}
      </button>
    </div>
  );
};
