import React from "react";
import Image from "next/image";
import { MenuItem } from "@/features/menu/types";
import { Locale } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { BadgeList } from "./badge-list";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
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
        "group relative flex items-stretch p-3.5 rounded-2xl bg-white dark:bg-neutral-900",
        "border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md",
        "transition-all duration-200 cursor-pointer min-h-[44px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        {
          "opacity-60 grayscale-[40%]": !item.is_available,
        }
      )}
    >
      {/* Content Column */}
      <div className="flex-1 flex flex-col justify-between pe-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2">
              {name}
            </h4>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
            {shortDesc}
          </p>
        </div>

        <div>
          <BadgeList badges={item.badges} locale={locale} />

          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-bold text-brand-700 dark:text-brand-400">
              {formatCurrency(item.price, locale)}
            </span>

            {!item.is_available && (
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                {t.menu.unavailable}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Image Column */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={name}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder className="w-full h-full" />
        )}
      </div>
    </div>
  );
};

