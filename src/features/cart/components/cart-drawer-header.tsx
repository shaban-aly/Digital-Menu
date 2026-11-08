"use client";

import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Locale } from "@/types";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CartDrawerHeaderProps {
  totalCount: number;
  hasItems: boolean;
  onClearCart: () => void;
  onClose: () => void;
  locale: Locale;
}

export const CartDrawerHeader: React.FC<CartDrawerHeaderProps> = ({
  totalCount,
  hasItems,
  onClearCart,
  onClose,
  locale,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const t = locale === "ar" ? arTranslations : enTranslations;

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h2
            id="cart-drawer-title"
            className="text-base font-bold text-neutral-900 dark:text-neutral-100"
          >
            {t.cart.title}
          </h2>
          {totalCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
              {totalCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {hasItems && (
            <button
              type="button"
              data-testid="cart-clear-btn"
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 min-h-[44px] px-2.5 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.cart.clearCart}</span>
            </button>
          )}
          <button
            type="button"
            data-testid="cart-drawer-close"
            onClick={onClose}
            aria-label={t.menu.close}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title={t.cart.clearCart}
        message={t.cart.confirmClear}
        confirmLabel={t.cart.confirm}
        cancelLabel={t.cart.cancel}
        variant="danger"
        onConfirm={() => {
          onClearCart();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
