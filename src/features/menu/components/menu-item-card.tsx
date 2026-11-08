"use client";

import React from "react";
import Image from "next/image";
import { MenuItem } from "@/features/menu/types";
import { Locale } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { BadgeList } from "./badge-list";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface MenuItemCardProps {
  item: MenuItem;
  locale: Locale;
  onSelect: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  locale,
  onSelect,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;
  const name = locale === "ar" ? item.name_ar : item.name_en;
  const shortDesc = locale === "ar" ? item.short_desc_ar : item.short_desc_en;
  const unit = locale === "ar" ? item.unit_ar : item.unit_en;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className={cn(
        "group relative flex flex-col p-3.5 rounded-2xl bg-white dark:bg-neutral-900",
        "border border-neutral-100 dark:border-neutral-800 shadow-xs hover:shadow-md",
        "transition-all duration-200 cursor-pointer min-h-[44px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        {
          "opacity-60 grayscale-[40%]": !item.is_available,
        }
      )}
    >
      {/* Top Section: Content + Thumbnail */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2">
            {name}
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
            {shortDesc}
          </p>
          <div className="mt-2">
            <BadgeList badges={item.badges} locale={locale} />
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={name}
              fill
              sizes="(max-width: 640px) 80px, 96px"
              loading="lazy"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder className="w-full h-full" />
          )}
        </div>
      </div>

      {/* Card Footer: Price & Unit at Start, (+) Button at Far End */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100/80 dark:border-neutral-800/80">
        <div className="flex items-baseline gap-1 text-start">
          <span className="text-base font-extrabold text-brand-700 dark:text-brand-400">
            {formatCurrency(item.price, locale)}
          </span>
          {unit && (
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              / {unit}
            </span>
          )}
        </div>

        <div className="ms-auto shrink-0">
          {item.is_available ? (
            <AddToCartButton item={item} size="sm" />
          ) : (
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg">
              {t.menu.unavailable}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
