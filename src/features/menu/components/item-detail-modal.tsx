import React from "react";
import Image from "next/image";
import { MenuItem } from "@/features/menu/types";
import { Locale } from "@/types";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { BadgeList } from "./badge-list";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Flame, ShieldAlert } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  locale,
}) => {
  if (!item) return null;

  const t = locale === "ar" ? arTranslations : enTranslations;
  const name = locale === "ar" ? item.name_ar : item.name_en;
  const fullDesc = locale === "ar" ? item.full_desc_ar : item.full_desc_en;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={name}>
      <div className="space-y-4">
        {/* Large Image Header */}
        <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 480px"
              priority
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder className="w-full h-full" iconClassName="w-12 h-12" />
          )}
        </div>

        {/* Title, Badges & Price */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {name}
            </h3>
            <span className="text-lg font-black text-brand-700 dark:text-brand-400 whitespace-nowrap">
              {formatCurrency(item.price, locale)}
            </span>
          </div>

          <BadgeList badges={item.badges} locale={locale} />
        </div>

        {/* Full Description */}
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {fullDesc}
        </p>

        {/* Nutritional & Allergen Information */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
          {typeof item.calories === "number" && item.calories > 0 && (
            <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{item.calories}</span>
              <span className="text-neutral-500 dark:text-neutral-400">
                {t.menu.calories}
              </span>
            </div>
          )}

          {item.allergens && item.allergens.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>{t.menu.allergens}:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.allergens.map((allergen) => {
                  const allergenName =
                    t.menu.allergenNames[allergen as keyof typeof t.menu.allergenNames] ||
                    allergen;
                  return (
                    <span
                      key={allergen}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                    >
                      {allergenName}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

