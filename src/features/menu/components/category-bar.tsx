import React from "react";
import { CategoryWithItems } from "@/features/menu/types";
import { Locale } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryBarProps {
  categories: CategoryWithItems[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  locale: Locale;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  locale,
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <nav
      className="sticky top-0 z-30 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 shadow-sm"
      aria-label="Menu Categories"
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none px-4 py-2.5 max-w-full">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          const name = locale === "ar" ? cat.name_ar : cat.name_en;

          return (
            <button
              key={cat.id}
              id={`category-chip-${cat.id}`}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "min-h-[44px] px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              )}
            >
              {name}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

