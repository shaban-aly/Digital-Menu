"use client";

import React, { useState } from "react";
import { Plus, Minus, Trash2, MessageSquare } from "lucide-react";
import { CartItem } from "../types";
import { Locale } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CartItemRowProps {
  item: CartItem;
  locale: Locale;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  locale,
  onUpdateQuantity,
  onRemove,
  onUpdateNote,
}) => {
  const [showNoteInput, setShowNoteInput] = useState(Boolean(item.itemNote));
  const t = locale === "ar" ? arTranslations : enTranslations;
  const name = locale === "ar" ? item.name_ar : item.name_en;

  return (
    <div
      data-testid={`cart-row-${item.id}`}
      className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Item Title & Subtotal */}
        <div className="flex-1">
          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
            {name}
          </h4>
          <span className="text-xs font-bold text-brand-700 dark:text-brand-400 mt-1 inline-block">
            {formatCurrency(item.price * item.quantity, locale)}
          </span>
          {item.quantity > 1 && (
            <span className="text-[11px] text-neutral-400 ms-1.5">
              ({formatCurrency(item.price, locale)} × {item.quantity})
            </span>
          )}
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${name} from cart`}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] -m-1 text-neutral-400 hover:text-rose-600 active:text-rose-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Controls Row: Stepper & Note Toggle */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-50 dark:border-neutral-800/60">
        <button
          type="button"
          onClick={() => setShowNoteInput((prev) => !prev)}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors min-h-[44px]",
            item.itemNote
              ? "text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40"
              : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{item.itemNote ? t.cart.editNote : t.cart.addNote}</span>
        </button>

        {/* Quantity Stepper */}
        <div className="inline-flex items-center rounded-xl bg-neutral-100 dark:bg-neutral-800 p-0.5">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span
            data-testid={`quantity-${item.id}`}
            className="min-w-[32px] text-center font-bold text-sm text-neutral-900 dark:text-neutral-100"
          >
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Input */}
      {showNoteInput && (
        <div className="animate-in fade-in duration-150">
          <input
            type="text"
            value={item.itemNote || ""}
            onChange={(e) => onUpdateNote(item.id, e.target.value)}
            placeholder={t.cart.notePlaceholder}
            maxLength={150}
            className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      )}
    </div>
  );
};
