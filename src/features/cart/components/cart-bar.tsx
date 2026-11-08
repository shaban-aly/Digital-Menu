"use client";

import React from "react";
import { ShoppingBag, ChevronUp } from "lucide-react";
import { useCart } from "../hooks/use-cart";
import { Locale } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CartBarProps {
  locale: Locale;
  onOpenCart: () => void;
  className?: string;
}

export const CartBar: React.FC<CartBarProps> = ({
  locale,
  onOpenCart,
  className,
}) => {
  const { totalCount, totalPrice, isHydrated } = useCart();
  const t = locale === "ar" ? arTranslations : enTranslations;

  if (!isHydrated || totalCount === 0) {
    return null;
  }

  return (
    <div
      data-testid="cart-bar"
      className={cn(
        "fixed bottom-4 inset-x-4 z-40 max-w-lg mx-auto sm:bottom-6",
        "animate-in fade-in slide-in-from-bottom-4 duration-300",
        className
      )}
    >
      <button
        type="button"
        onClick={onOpenCart}
        aria-label={`${t.cart.viewCart}: ${totalCount} ${t.cart.itemCount}, ${formatCurrency(totalPrice, locale)}`}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-2xl",
          "bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white",
          "shadow-xl shadow-brand-900/25 border border-brand-500/40",
          "transition-all duration-150 select-none cursor-pointer",
          "min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
        )}
      >
        {/* Left/Start: Item counter & Price */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-brand-700/80 text-white shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <span
              data-testid="cart-badge-count"
              className="absolute -top-1.5 -end-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-500 text-neutral-950 text-xs font-black flex items-center justify-center shadow-xs"
            >
              {totalCount}
            </span>
          </div>

          <div className="text-start">
            <p className="text-xs text-brand-100 font-medium">
              {totalCount} {t.cart.itemCount}
            </p>
            <p
              data-testid="cart-total-price"
              className="text-base font-extrabold text-white leading-tight"
            >
              {formatCurrency(totalPrice, locale)}
            </p>
          </div>
        </div>

        {/* Right/End: View Cart Action */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-700/90 hover:bg-brand-800 px-3.5 py-2 rounded-xl transition-colors">
          <span>{t.cart.viewCart}</span>
          <ChevronUp className="w-4 h-4 rtl:rotate-0" />
        </div>
      </button>
    </div>
  );
};
