"use client";

import { useState, useEffect } from "react";
import { MenuItem, CategoryWithItems } from "@/features/menu/types";
import { AdminMenuItemSchema } from "../types";
import { cn } from "@/lib/utils";

interface UseItemFormProps {
  item: MenuItem | null;
  categories: CategoryWithItems[];
  isOpen: boolean;
  onSave: (
    itemData: Partial<MenuItem> & {
      name_ar: string;
      name_en: string;
      price: number;
      category_id: string;
    }
  ) => Promise<boolean>;
  onClose: () => void;
}

export function useItemForm({
  item,
  categories,
  isOpen,
  onSave,
  onClose,
}: UseItemFormProps) {
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [shortDescAr, setShortDescAr] = useState("");
  const [shortDescEn, setShortDescEn] = useState("");
  const [fullDescAr, setFullDescAr] = useState("");
  const [fullDescEn, setFullDescEn] = useState("");
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
      setShortDescAr(item.short_desc_ar || "");
      setShortDescEn(item.short_desc_en || "");
      setFullDescAr(item.full_desc_ar || "");
      setFullDescEn(item.full_desc_en || "");
      setCategoryId(item.category_id);
      setPrice(String(item.price));
      setUnitAr(item.unit_ar || "");
      setUnitEn(item.unit_en || "");
      setImageUrl(item.image_url || "");
    } else {
      setNameAr("");
      setNameEn("");
      setShortDescAr("");
      setShortDescEn("");
      setFullDescAr("");
      setFullDescEn("");
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
      short_desc_ar: shortDescAr.trim(),
      short_desc_en: shortDescEn.trim(),
      full_desc_ar: fullDescAr.trim(),
      full_desc_en: fullDescEn.trim(),
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
      ...candidate,
    });
    setIsSubmitting(false);
    if (success) onClose();
  };

  const inputCls = (err?: string) =>
    cn(
      "w-full text-xs px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2",
      err
        ? "border-rose-500 focus:ring-rose-500"
        : "border-neutral-200 dark:border-neutral-700 focus:ring-brand-500"
    );

  return {
    nameAr, setNameAr,
    nameEn, setNameEn,
    shortDescAr, setShortDescAr,
    shortDescEn, setShortDescEn,
    fullDescAr, setFullDescAr,
    fullDescEn, setFullDescEn,
    categoryId, setCategoryId,
    price, setPrice,
    unitAr, setUnitAr,
    unitEn, setUnitEn,
    imageUrl, setImageUrl,
    errors,
    isSubmitting,
    handleSubmit,
    inputCls,
  };
}
