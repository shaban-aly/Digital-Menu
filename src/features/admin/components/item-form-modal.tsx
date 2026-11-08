"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { MenuItem, CategoryWithItems } from "@/features/menu/types";
import { Locale } from "@/types";
import { AdminMenuItemSchema } from "../types";
import { cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  categories: CategoryWithItems[];
  locale: Locale;
  onSave: (itemData: Partial<MenuItem> & { name_ar: string; name_en: string; price: number; category_id: string }) => Promise<boolean>;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  item,
  categories,
  locale,
  onSave,
}) => {
  const t = locale === "ar" ? arTranslations.admin : enTranslations.admin;
  const isEdit = Boolean(item);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [unitAr, setUnitAr] = useState("");
  const [unitEn, setUnitEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setNameAr(item.name_ar);
      setNameEn(item.name_en);
      setCategoryId(item.category_id);
      setPrice(String(item.price));
      setUnitAr(item.unit_ar || "");
      setUnitEn(item.unit_en || "");
      setImageUrl(item.image_url || "");
    } else {
      setNameAr("");
      setNameEn("");
      setCategoryId(categories[0]?.id || "");
      setPrice("");
      setUnitAr("");
      setUnitEn("");
      setImageUrl("");
    }
    setErrors({});
  }, [item, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsedPrice = parseFloat(price);
    const candidate = {
      id: item?.id || "temp_id",
      name_ar: nameAr.trim(),
      name_en: nameEn.trim(),
      category_id: categoryId,
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      unit_ar: unitAr.trim() || null,
      unit_en: unitEn.trim() || null,
      image_url: imageUrl.trim() || null,
    };

    const validation = AdminMenuItemSchema.safeParse(candidate);
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
      ...(item ? { id: item.id } : {}),
      name_ar: candidate.name_ar,
      name_en: candidate.name_en,
      category_id: candidate.category_id,
      price: candidate.price,
      unit_ar: candidate.unit_ar,
      unit_en: candidate.unit_en,
      image_url: candidate.image_url,
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? t.items.editItem : t.items.addItem}>
      <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.items.nameAr} *</label>
            <input data-testid="item-name-ar-input" type="text" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={inputCls(errors.name_ar)} />
            {errors.name_ar && <p className="text-[10px] text-rose-600">{errors.name_ar}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.items.nameEn} *</label>
            <input data-testid="item-name-en-input" type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className={inputCls(errors.name_en)} />
            {errors.name_en && <p className="text-[10px] text-rose-600">{errors.name_en}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.items.category} *</label>
            <select data-testid="item-category-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls(errors.category_id)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{locale === "ar" ? c.name_ar : c.name_en}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-[10px] text-rose-600">{errors.category_id}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.items.price} *</label>
            <input data-testid="item-price-input" type="number" step="any" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls(errors.price)} />
            {errors.price && <p className="text-[10px] text-rose-600">{errors.price}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.items.unitAr}</label>
            <input type="text" value={unitAr} onChange={(e) => setUnitAr(e.target.value)} placeholder="مثال: كجم" className={inputCls()} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.items.unitEn}</label>
            <input type="text" value={unitEn} onChange={(e) => setUnitEn(e.target.value)} placeholder="e.g. kg" className={inputCls()} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.items.imageUrl}</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className={inputCls(errors.image_url)} />
          {errors.image_url && <p className="text-[10px] text-rose-600">{errors.image_url}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">{t.items.cancelBtn}</button>
          <button data-testid="save-item-submit-btn" type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50">{t.items.save}</button>
        </div>
      </form>
    </Modal>
  );
};

