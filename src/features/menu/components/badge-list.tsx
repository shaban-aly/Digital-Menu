import React from "react";
import { Flame, Leaf, Award } from "lucide-react";
import { BadgeType } from "@/features/menu/types";
import { Locale } from "@/types";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface BadgeListProps {
  badges: BadgeType[];
  locale: Locale;
}

export const BadgeList: React.FC<BadgeListProps> = ({ badges, locale }) => {
  if (!badges || badges.length === 0) return null;

  const t = locale === "ar" ? arTranslations : enTranslations;

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {badges.map((badge) => {
        if (badge === "spicy") {
          return (
            <span
              key={badge}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/40"
            >
              <Flame className="w-3 h-3 text-red-500" />
              <span>{t.menu.badges.spicy}</span>
            </span>
          );
        }
        if (badge === "vegetarian") {
          return (
            <span
              key={badge}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40"
            >
              <Leaf className="w-3 h-3 text-emerald-500" />
              <span>{t.menu.badges.vegetarian}</span>
            </span>
          );
        }
        if (badge === "best_seller") {
          return (
            <span
              key={badge}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40"
            >
              <Award className="w-3 h-3 text-amber-500" />
              <span>{t.menu.badges.best_seller}</span>
            </span>
          );
        }
        return null;
      })}
    </div>
  );
};

