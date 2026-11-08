import React from "react";
import Image from "next/image";
import { Restaurant } from "@/features/menu/types";
import { Locale } from "@/types";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  locale: Locale;
  onToggleLanguage: () => void;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  restaurant,
  locale,
  onToggleLanguage,
}) => {
  const name = locale === "ar" ? restaurant.name_ar : restaurant.name_en;
  const targetLanguageLabel = locale === "ar" ? "English" : "العربية";

  return (
    <header className="relative w-full bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-4 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 border border-neutral-100 dark:border-neutral-800 shadow-sm bg-neutral-100">
            {restaurant.logo_url ? (
              <Image
                src={restaurant.logo_url}
                alt={name}
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg">
                {name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {name}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {locale === "ar" ? "قائمة طعام رقمية" : "Digital Menu"}
            </p>
          </div>
        </div>

        {/* Language Switcher Button (Min 44x44px touch target) */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold min-h-[44px]"
          aria-label={
            locale === "ar"
              ? "التحويل إلى اللغة الإنجليزية"
              : "Switch to Arabic language"
          }
        >
          <Globe className="w-4 h-4 text-brand-600" />
          <span>{targetLanguageLabel}</span>
        </Button>
      </div>
    </header>
  );
};
