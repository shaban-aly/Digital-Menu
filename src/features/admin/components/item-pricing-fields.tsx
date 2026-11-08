"use client";

import React from "react";
import { CategoryWithItems } from "@/features/menu/types";
import { Locale } from "@/types";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface ItemPricingFieldsProps {
  categories: CategoryWithItems[];
  categoryId: string;
  setCategoryId: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  unitAr: string;
  setUnitAr: (v: string) => void;
  unitEn: string;
  setUnitEn: (v: string) => void;
  imageUrl: string;
  setImageUrl: (v: string) => void;
  errors: Record<string, string>;
  inputCls: (err?: string) => string;
  locale: Locale;
  storeSlug?: string;
}

export const ItemPricingFields: React.FC<ItemPricingFieldsProps> = ({
  categories,
  categoryId,
  setCategoryId,
  price,
  setPrice,
  unitAr,
  setUnitAr,
  unitEn,
  setUnitEn,
  imageUrl,
  setImageUrl,
  errors,
  inputCls,
  locale,
  storeSlug = "",
}) => {
  const t = locale === "ar" ? arTranslations.admin.items : enTranslations.admin.items;

  return (
    <div className="space-y-3 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {t.category} *
          </label>
          <select
            data-testid="item-category-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputCls(errors.category_id)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {locale === "ar" ? c.name_ar : c.name_en}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="text-[10px] text-rose-600">{errors.category_id}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {t.price} *
          </label>
          <input
            data-testid="item-price-input"
            type="number"
            step="any"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputCls(errors.price)}
          />
          {errors.price && <p className="text-[10px] text-rose-600">{errors.price}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {t.unitAr}
          </label>
          <input
            type="text"
            value={unitAr}
            onChange={(e) => setUnitAr(e.target.value)}
            placeholder="مثال: كجم"
            className={inputCls()}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {t.unitEn}
          </label>
          <input
            type="text"
            value={unitEn}
            onChange={(e) => setUnitEn(e.target.value)}
            placeholder="e.g. kg"
            className={inputCls()}
          />
        </div>
      </div>

      <div className="space-y-1">
        <ImageUploadField
          value={imageUrl}
          onChange={setImageUrl}
          folder="products"
          storeSlug={storeSlug}
          label={t.imageUrl}
        />
        {errors.image_url && <p className="text-[10px] text-rose-600">{errors.image_url}</p>}
      </div>
    </div>
  );
};
