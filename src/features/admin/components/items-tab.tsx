"use client";

import React, { useState, useMemo } from "react";
import { MenuItem, CategoryWithItems } from "@/features/menu/types";
import { Locale } from "@/types";
import { ItemRowCard } from "./item-row-card";
import { ItemFormModal } from "./item-form-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Search } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface ItemsTabProps {
  categories: CategoryWithItems[];
  locale: Locale;
  onToggleStock: (itemId: string, currentStatus: boolean) => void;
  onSaveItem: (itemData: Partial<MenuItem> & { name_ar: string; name_en: string; price: number; category_id: string }) => Promise<boolean>;
  onDeleteItem: (itemId: string) => Promise<boolean>;
  onBeforeAdd?: () => boolean;
}

export const ItemsTab: React.FC<ItemsTabProps> = ({
  categories,
  locale,
  onToggleStock,
  onSaveItem,
  onDeleteItem,
  onBeforeAdd,
}) => {
  const t = locale === "ar" ? arTranslations.admin : enTranslations.admin;
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const allItemsWithCat = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.items.map((item) => ({
        ...item,
        categoryName: locale === "ar" ? cat.name_ar : cat.name_en,
      }))
    );
  }, [categories, locale]);

  const filteredItems = useMemo(() => {
    return allItemsWithCat.filter((item) => {
      const matchesCat = selectedCatId === "all" || item.category_id === selectedCatId;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name_ar.toLowerCase().includes(q) ||
        item.name_en.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allItemsWithCat, selectedCatId, searchQuery]);

  const handleOpenAdd = () => {
    if (onBeforeAdd && !onBeforeAdd()) {
      return;
    }
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header controls: Search, category filter, and add item button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              data-testid="admin-item-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.items.searchPlaceholder}
              className="w-full text-xs ps-9 pe-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            data-testid="admin-category-filter"
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">{t.items.allCategories}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {locale === "ar" ? c.name_ar : c.name_en}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          data-testid="admin-add-item-btn"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t.items.addItem}</span>
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ItemRowCard
              key={item.id}
              item={item}
              categoryName={item.categoryName}
              locale={locale}
              onToggleStock={onToggleStock}
              onEdit={handleOpenEdit}
              onDelete={(it) => setItemToDelete(it)}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
            <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              {t.items.emptyTitle}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {t.items.emptyDesc}
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={editingItem}
        categories={categories}
        locale={locale}
        onSave={onSaveItem}
      />

      {/* Delete Item Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title={t.items.deleteItem}
        message={t.items.confirmDelete}
        confirmLabel={t.items.confirmDeleteBtn}
        cancelLabel={t.items.cancelBtn}
        variant="danger"
        onConfirm={async () => {
          if (itemToDelete) {
            await onDeleteItem(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

