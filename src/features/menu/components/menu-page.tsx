"use client";

import React, { useState, useEffect } from "react";
import { MenuData, MenuItem } from "@/features/menu/types";
import { Locale } from "@/types";
import { RestaurantHeader } from "./restaurant-header";
import { MenuSearch } from "./menu-search";
import { CategoryBar } from "./category-bar";
import { MenuSection } from "./menu-section";
import { ItemDetailModal } from "./item-detail-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { useCategoryScroll } from "../hooks/use-category-scroll";
import { useMenuSearch } from "../hooks/use-menu-search";
import { useLanguage } from "../hooks/use-language";
import { CartProvider } from "@/features/cart/hooks/use-cart";
import { CartBar } from "@/features/cart/components/cart-bar";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface MenuPageProps {
  initialData: MenuData;
  initialLocale: Locale;
}

const MenuContent: React.FC<MenuPageProps> = ({
  initialData,
  initialLocale,
}) => {
  const { locale, toggleLanguage } = useLanguage(initialLocale);
  const t = locale === "ar" ? arTranslations : enTranslations;

  const {
    searchQuery,
    setSearchQuery,
    filteredCategories,
    isSearching,
    clearSearch,
  } = useMenuSearch(initialData.categories, locale);

  const { activeCategoryId, scrollToCategory } =
    useCategoryScroll(filteredCategories);

  // Detail Modal & URL Hash management
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#item-")) {
        const itemId = hash.replace("#item-", "");
        for (const cat of initialData.categories) {
          const found = cat.items.find((it) => it.id === itemId);
          if (found) {
            setSelectedItem(found);
            return;
          }
        }
      } else {
        setSelectedItem(null);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [initialData.categories]);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    window.location.hash = `item-${item.id}`;
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    if (window.location.hash) {
      history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-28 sm:pb-32">
      <RestaurantHeader
        restaurant={initialData.restaurant}
        locale={locale}
        onToggleLanguage={toggleLanguage}
      />

      <div className="max-w-4xl mx-auto">
        <MenuSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={clearSearch}
          locale={locale}
        />

        {!isSearching && (
          <CategoryBar
            categories={filteredCategories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={scrollToCategory}
            locale={locale}
          />
        )}

        <main className="mt-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <MenuSection
                key={category.id}
                category={category}
                locale={locale}
                onSelectItem={handleSelectItem}
              />
            ))
          ) : (
            <EmptyState
              message={t.menu.noResults}
              clearText={t.menu.clearSearch}
              onClear={clearSearch}
            />
          )}
        </main>
      </div>

      <ItemDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={handleCloseModal}
        locale={locale}
      />

      <CartBar
        locale={locale}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        restaurantName={
          locale === "ar"
            ? initialData.restaurant.name_ar
            : initialData.restaurant.name_en
        }
        restaurantPhone={initialData.restaurant.phone_number}
        locale={locale}
      />
    </div>
  );
};

export const MenuPage: React.FC<MenuPageProps> = (props) => {
  return (
    <CartProvider
      storeSlug={props.initialData.restaurant.slug}
      supportedOrderTypes={props.initialData.restaurant.supported_order_types}
      deliveryFee={props.initialData.restaurant.delivery_fee}
    >
      <MenuContent {...props} />
    </CartProvider>
  );
};
