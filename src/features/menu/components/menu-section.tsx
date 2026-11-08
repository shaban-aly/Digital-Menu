import React from "react";
import { CategoryWithItems, MenuItem } from "@/features/menu/types";
import { Locale } from "@/types";
import { MenuItemCard } from "./menu-item-card";

interface MenuSectionProps {
  category: CategoryWithItems;
  locale: Locale;
  onSelectItem: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  category,
  locale,
  onSelectItem,
}) => {
  const categoryName =
    locale === "ar" ? category.name_ar : category.name_en;

  if (!category.items || category.items.length === 0) {
    return null;
  }

  return (
    <section
      id={`category-${category.id}`}
      data-category-id={category.id}
      className="scroll-mt-28 mb-8"
    >
      <div className="sticky top-14 z-20 bg-background/90 backdrop-blur-md py-2.5 px-4 mb-3 border-b border-neutral-100 dark:border-neutral-800">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {categoryName}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 px-4">
        {category.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            locale={locale}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    </section>
  );
};

