"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { MenuItem, CategoryWithItems } from "@/features/menu/types";
import { Locale } from "@/types";
import { AiTranslateButton } from "./ai-translate-button";
import { ItemDescriptionFields } from "./item-description-fields";
import { ItemPricingFields } from "./item-pricing-fields";
import { useItemForm } from "../hooks/use-item-form";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  categories: CategoryWithItems[];
  locale: Locale;
  storeSlug?: string;
  onSave: (
    itemData: Partial<MenuItem> & {
      name_ar: string;
      name_en: string;
      price: number;
      category_id: string;
    }
  ) => Promise<boolean>;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  item,
  categories,
  locale,
  storeSlug,
  onSave,
}) => {
  const t = locale === "ar" ? arTranslations.admin.items : enTranslations.admin.items;
  const isEdit = Boolean(item);

  const form = useItemForm({
    item,
    categories,
    isOpen,
    onSave,
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t.editItem : t.addItem}
    >
      <form onSubmit={form.handleSubmit} className="p-4 space-y-3.5 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {t.nameAr} *
              </label>
              <AiTranslateButton
                sourceText={form.nameAr}
                onTranslated={(v) => form.setNameEn(v)}
                testId="translate-item-name-btn"
              />
            </div>
            <input
              data-testid="item-name-ar-input"
              type="text"
              value={form.nameAr}
              onChange={(e) => form.setNameAr(e.target.value)}
              className={form.inputCls(form.errors.name_ar)}
            />
            {form.errors.name_ar && <p className="text-[10px] text-rose-600">{form.errors.name_ar}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {t.nameEn} *
            </label>
            <input
              data-testid="item-name-en-input"
              type="text"
              value={form.nameEn}
              onChange={(e) => form.setNameEn(e.target.value)}
              className={form.inputCls(form.errors.name_en)}
            />
            {form.errors.name_en && <p className="text-[10px] text-rose-600">{form.errors.name_en}</p>}
          </div>
        </div>

        <ItemDescriptionFields
          shortDescAr={form.shortDescAr}
          setShortDescAr={form.setShortDescAr}
          shortDescEn={form.shortDescEn}
          setShortDescEn={form.setShortDescEn}
          fullDescAr={form.fullDescAr}
          setFullDescAr={form.setFullDescAr}
          fullDescEn={form.fullDescEn}
          setFullDescEn={form.setFullDescEn}
          inputCls={form.inputCls}
        />

        <ItemPricingFields
          categories={categories}
          categoryId={form.categoryId}
          setCategoryId={form.setCategoryId}
          price={form.price}
          setPrice={form.setPrice}
          unitAr={form.unitAr}
          setUnitAr={form.setUnitAr}
          unitEn={form.unitEn}
          setUnitEn={form.setUnitEn}
          imageUrl={form.imageUrl}
          setImageUrl={form.setImageUrl}
          errors={form.errors}
          inputCls={form.inputCls}
          locale={locale}
          storeSlug={storeSlug}
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            {t.cancelBtn}
          </button>
          <button
            data-testid="save-item-submit-btn"
            type="submit"
            disabled={form.isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
          >
            {t.save}
          </button>
        </div>
      </form>
    </Modal>
  );
};
