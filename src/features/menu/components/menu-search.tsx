import React from "react";
import { Search, X } from "lucide-react";
import { Locale } from "@/types";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  locale: Locale;
}

export const MenuSearch: React.FC<MenuSearchProps> = ({
  value,
  onChange,
  onClear,
  locale,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;

  return (
    <div className="relative px-4 py-3 bg-white dark:bg-neutral-900">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-neutral-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.menu.searchPlaceholder}
          className="w-full min-h-[44px] ps-10 pe-10 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 border border-transparent transition-all"
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 end-0 flex items-center justify-center w-11 h-11 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            aria-label={t.menu.clearSearch}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

