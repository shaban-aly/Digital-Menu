"use client";

import React, { useState } from "react";
import { CategoryWithItems } from "@/features/menu/types";
import { Locale } from "@/types";
import { CategoryModal } from "./category-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Edit2, Trash2 } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CategoriesTabProps {
  categories: CategoryWithItems[];
  locale: Locale;
  onSaveCategory: (cat: { id?: string; name_ar: string; name_en: string }) => Promise<boolean>;
  onDeleteCategory: (id: string) => Promise<boolean>;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  locale,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const t = locale === "ar" ? arTranslations.admin : enTranslations.admin;
  const [editingCategory, setEditingCategory] = useState<CategoryWithItems | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingCat, setDeletingCat] = useState<CategoryWithItems | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{t.categories.title}</h3>
        <button
          type="button"
          data-testid="add-category-btn"
          onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t.categories.addCategory}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            data-testid={`category-row-${cat.id}`}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800"
          >
            <div>
              <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                {locale === "ar" ? cat.name_ar : cat.name_en}
              </h4>
              <p className="text-[11px] text-neutral-400">
                {locale === "ar" ? cat.name_en : cat.name_ar} • {cat.items.length} {t.categories.itemsCount}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title={t.categories.editCategory}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                data-testid={`delete-category-${cat.id}`}
                onClick={() => setDeletingCat(cat)}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                title={t.categories.deleteCategory}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        locale={locale}
        onSave={onSaveCategory}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingCat)}
        title={t.categories.deleteCategory}
        message={
          deletingCat && deletingCat.items.length > 0
            ? `${t.categories.categoryInUse} (${deletingCat.items.length})`
            : t.categories.confirmDelete
        }
        confirmLabel={t.items.confirmDeleteBtn}
        cancelLabel={t.items.cancelBtn}
        onConfirm={async () => {
          if (deletingCat) {
            await onDeleteCategory(deletingCat.id);
            setDeletingCat(null);
          }
        }}
        onCancel={() => setDeletingCat(null)}
      />
    </div>
  );
};

