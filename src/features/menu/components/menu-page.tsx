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
import { StoreRepository, STORE_UPDATED_EVENT } from "@/features/admin/services/store-repository";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface MenuPageProps {
  initialData: MenuData;
  initialLocale?: Locale;
}

const MenuContent: React.FC<MenuPageProps> = ({
  initialData,
}) => {
  const { locale, toggleLanguage } = useLanguage();
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
      if (hash?.startsWith("#item-")) {
        const id = hash.replace("#item-", "");
        const found = initialData.categories.flatMap((c) => c.items).find((it) => it.id === id);
        if (found) { setSelectedItem(found); return; }
      }
      setSelectedItem(null);
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
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-50 dark:bg-neutral-950 pb-28 sm:pb-32">
      <RestaurantHeader
        restaurant={initialData.restaurant}
        locale={locale}
        onToggleLanguage={toggleLanguage}
      />

      <div className="max-w-4xl mx-auto w-full">
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
        scheduleConfig={initialData.restaurant.schedule}
      />
    </div>
  );
};

export const MenuPage: React.FC<MenuPageProps> = (props) => {
  const [storeData, setStoreData] = useState<MenuData>(props.initialData);

  useEffect(() => {
    const sync = async () => {
      const updated = await StoreRepository.getStore(props.initialData.restaurant.slug);
      if (updated) setStoreData(updated);
    };
    sync();

    const handleUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ slug: string }>;
      if (!ce.detail || ce.detail.slug === props.initialData.restaurant.slug) sync();
    };
    window.addEventListener(STORE_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(STORE_UPDATED_EVENT, handleUpdate);
  }, [props.initialData.restaurant.slug]);

  return (
    <CartProvider
      storeSlug={storeData.restaurant.slug}
      supportedOrderTypes={storeData.restaurant.supported_order_types}
      deliveryFee={storeData.restaurant.delivery_fee}
    >
      <MenuContent {...props} initialData={storeData} />
    </CartProvider>
  );
};
