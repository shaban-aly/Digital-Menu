"use client";

import React from "react";
import Image from "next/image";
import { MenuItem } from "@/features/menu/types";
import { Locale } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface ItemRowCardProps {
  item: MenuItem;
  categoryName?: string;
  locale: Locale;
  onToggleStock: (itemId: string, currentStatus: boolean) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export const ItemRowCard: React.FC<ItemRowCardProps> = ({
  item,
  categoryName,
  locale,
  onToggleStock,
  onEdit,
  onDelete,
}) => {
  const t = locale === "ar" ? arTranslations.admin : enTranslations.admin;
  const itemName = locale === "ar" ? item.name_ar : item.name_en;
  const secondaryName = locale === "ar" ? item.name_en : item.name_ar;
  const unit = locale === "ar" ? item.unit_ar : item.unit_en;

  return (
    <div
      data-testid={`admin-item-card-${item.id}`}
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-3.5 rounded-2xl border transition-all",
        item.is_available
          ? "bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 shadow-xs"
          : "bg-neutral-50 dark:bg-neutral-950/60 border-neutral-200/40 dark:border-neutral-800/50 opacity-80"
      )}
    >
      {/* Item info */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={itemName}
              fill
              sizes="56px"
              className={cn("object-cover", !item.is_available && "grayscale")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-neutral-400">
              {itemName.slice(0, 2)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
              {itemName}
            </h4>
            {categoryName && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {categoryName}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
            {secondaryName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              {formatCurrency(item.price, locale)}
            </span>
            {unit && (
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                / {unit}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
        {/* Availability Toggle Switch */}
        <button
          type="button"
          data-testid={`stock-toggle-${item.id}`}
          onClick={() => onToggleStock(item.id, item.is_available)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[38px]",
            item.is_available
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100"
          )}
          title={t.items.toggleStock}
        >
          {item.is_available ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.items.inStock}</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" />
              <span>{t.items.outOfStock}</span>
            </>
          )}
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            data-testid={`edit-item-${item.id}`}
            onClick={() => onEdit(item)}
            className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={t.items.editItem}
            aria-label={t.items.editItem}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-testid={`delete-item-${item.id}`}
            onClick={() => onDelete(item)}
            className="p-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title={t.items.deleteItem}
            aria-label={t.items.deleteItem}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

