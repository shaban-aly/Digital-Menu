"use client";

import React from "react";
import { UtensilsCrossed, Coffee, ShoppingBasket, Store as StoreIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";
import { cn } from "@/lib/utils";

export type OnboardingBusinessType = "restaurant" | "cafe" | "supermarket" | "store";

interface BusinessTypeSelectorProps {
  value: OnboardingBusinessType;
  onChange: (type: OnboardingBusinessType) => void;
}

export const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const { locale } = useLanguage();
  const t = locale === "ar" ? arTranslations : enTranslations;

  const types: {
    id: OnboardingBusinessType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "restaurant", label: t.onboarding.restaurant, icon: UtensilsCrossed },
    { id: "cafe", label: t.onboarding.cafe, icon: Coffee },
    { id: "supermarket", label: t.onboarding.supermarket, icon: ShoppingBasket },
    { id: "store", label: t.onboarding.store, icon: StoreIcon },
  ];

  return (
    <div>
      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2 text-start">
        {t.onboarding.businessType}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {types.map((type) => {
          const Icon = type.icon;
          const isSelected = value === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={cn(
                "min-h-[64px] p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer select-none",
                isSelected
                  ? "border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 shadow-xs ring-2 ring-brand-500/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700"
              )}
            >
              <Icon className={cn("w-5 h-5", isSelected ? "text-brand-600 dark:text-brand-400" : "text-neutral-400")} />
              <span className="text-xs font-bold">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
