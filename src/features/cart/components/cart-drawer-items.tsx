"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { CartItem } from "../types";
import { CartItemRow } from "./cart-item-row";
import { Locale } from "@/types";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CartDrawerItemsProps {
  items: CartItem[];
  generalNote: string;
  onGeneralNoteChange: (note: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  locale: Locale;
}

export const CartDrawerItems: React.FC<CartDrawerItemsProps> = ({
  items,
  generalNote,
  onGeneralNoteChange,
  onUpdateQuantity,
  onRemove,
  onUpdateNote,
  locale,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;
  const hasUnavailable = items.some((i) => !i.is_available);

  return (
    <div className="space-y-4">
      {hasUnavailable && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{t.cart.itemUnavailableWarning}</span>
        </div>
      )}

      <div className="space-y-2.5">
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            locale={locale}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            onUpdateNote={onUpdateNote}
          />
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          {t.cart.generalNotes}
        </label>
        <textarea
          data-testid="general-notes-input"
          value={generalNote}
          onChange={(e) => onGeneralNoteChange(e.target.value)}
          placeholder={t.cart.generalNotesPlaceholder}
          maxLength={200}
          rows={2}
          className="w-full text-xs p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </div>
    </div>
  );
};

