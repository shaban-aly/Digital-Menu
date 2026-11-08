"use client";

import React from "react";
import { Check, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface StoreIdentityFieldsProps {
  nameAr: string;
  setNameAr: (v: string) => void;
  nameEn: string;
  setNameEn: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  slugStatus: "idle" | "checking" | "available" | "taken";
}

export const StoreIdentityFields: React.FC<StoreIdentityFieldsProps> = ({
  nameAr,
  setNameAr,
  nameEn,
  setNameEn,
  slug,
  setSlug,
  slugStatus,
}) => {
  const { locale } = useLanguage();
  const t = locale === "ar" ? arTranslations : enTranslations;

  const handleNameEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNameEn(val);
    if (!slug || slugStatus !== "taken") {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name-ar"
            className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 text-start"
          >
            {t.onboarding.nameAr}
          </label>
          <input
            id="name-ar"
            type="text"
            required
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder={locale === "ar" ? "شاورما البرنس" : "Arabic store name"}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 text-start text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="name-en"
            className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 text-start"
          >
            {t.onboarding.nameEn}
          </label>
          <input
            id="name-en"
            type="text"
            required
            value={nameEn}
            onChange={handleNameEnChange}
            placeholder="Prince Shawarma"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 text-start text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="store-slug"
          className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 text-start"
        >
          {t.onboarding.slug}
        </label>
        <div className="relative">
          <input
            id="store-slug"
            type="text"
            required
            dir="ltr"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="my-cool-restaurant"
            className="w-full min-h-[44px] ps-3.5 pe-10 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 text-start font-mono text-sm"
          />
          <div className="absolute inset-y-0 end-3 flex items-center">
            {slugStatus === "checking" && (
              <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
            )}
            {slugStatus === "available" && (
              <Check className="w-4 h-4 text-green-600" />
            )}
            {slugStatus === "taken" && <X className="w-4 h-4 text-red-600" />}
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px]">
          <span className="text-neutral-400 font-mono">
            menu/{slug || "[slug]"}
          </span>
          {slugStatus === "available" && (
            <span className="text-green-600 font-bold">
              {t.onboarding.slugAvailable}
            </span>
          )}
          {slugStatus === "taken" && (
            <span className="text-red-600 font-bold">
              {t.onboarding.slugTaken}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
