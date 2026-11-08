"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { CategoryWithItems } from "@/features/menu/types";
import { Locale } from "@/types";
import { CategorySchema } from "../types";
import { AiTranslateButton } from "./ai-translate-button";
import { cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryWithItems | null;
  locale: Locale;
  onSave: (data: { id?: string; name_ar: string; name_en: string }) => Promise<boolean>;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  locale,
  onSave,
}) => {
  const t = locale === "ar" ? arTranslations.admin : enTranslations.admin;
  const isEdit = Boolean(category);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setNameAr(category.name_ar);
      setNameEn(category.name_en);
    } else {
      setNameAr("");
      setNameEn("");
    }
    setErrors({});
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const candidate = {
      id: category?.id || "temp_cat_id",
      name_ar: nameAr.trim(),
      name_en: nameEn.trim(),
    };

    const validation = CategorySchema.safeParse(candidate);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        errMap[issue.path[0] as string] = issue.message;
      }
      setErrors(errMap);
      return;
    }

    setIsSubmitting(true);
    const success = await onSave({
      ...(category ? { id: category.id } : {}),
      name_ar: candidate.name_ar,
      name_en: candidate.name_en,
    });
    setIsSubmitting(false);
    if (success) onClose();
  };

  const inputCls = (err?: string) =>
    cn(
      "w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2",
      err ? "border-rose-500 focus:ring-rose-500" : "border-neutral-200 dark:border-neutral-700 focus:ring-brand-500"
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? t.categories.editCategory : t.categories.addCategory}>
      <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {t.categories.nameAr} *
            </label>
            <AiTranslateButton
              sourceText={nameAr}
              onTranslated={(translated) => setNameEn(translated)}
              testId="translate-category-name-btn"
            />
          </div>
          <input
            data-testid="cat-name-ar-input"
            type="text"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className={inputCls(errors.name_ar)}
          />
          {errors.name_ar && <p className="text-[10px] text-rose-600">{errors.name_ar}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {t.categories.nameEn} *
          </label>
          <input
            data-testid="cat-name-en-input"
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className={inputCls(errors.name_en)}
          />
          {errors.name_en && <p className="text-[10px] text-rose-600">{errors.name_en}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            {t.items.cancelBtn}
          </button>
          <button
            data-testid="save-category-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
          >
            {t.categories.save}
          </button>
        </div>
      </form>
    </Modal>
  );
};
