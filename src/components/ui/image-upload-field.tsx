"use client";

import React, { useState } from "react";
import { Camera, Trash2, RefreshCw, UploadCloud, ImageIcon } from "lucide-react";
import { ImageUploadModal } from "./image-upload-modal";
import { AssetFolder } from "@/lib/storage/image-storage-service";
import { useLanguage } from "@/lib/i18n/language-context";
import { cn } from "@/lib/utils";

export interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  folder: AssetFolder;
  storeSlug: string;
  helperText?: string;
  aspectRatio?: "square" | "cover";
  disabled?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label,
  folder,
  storeSlug,
  helperText,
  aspectRatio = "square",
  disabled = false,
}) => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCover = aspectRatio === "cover";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 text-start">
        {label}
      </label>

      {value ? (
        <div className={cn("space-y-2", isCover ? "w-full" : "inline-block")}>
          <div
            className={cn(
              "relative overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 group shadow-2xs",
              isCover
                ? "w-full h-36 sm:h-44 rounded-2xl"
                : "w-28 h-28 sm:w-32 sm:h-32 rounded-2xl aspect-square"
            )}
          >
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg min-h-[36px] transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isAr ? "تغيير" : "Change"}</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange("")}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-lg min-h-[36px] transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isAr ? "حذف" : "Remove"}</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-brand-500 dark:hover:border-brand-400 bg-neutral-50/50 dark:bg-neutral-800/40 rounded-2xl transition-colors flex flex-col items-center justify-center text-center cursor-pointer disabled:opacity-50 disabled:pointer-events-none group",
            isCover ? "w-full h-36 sm:h-44 p-4" : "w-28 h-28 sm:w-32 sm:h-32 p-3 aspect-square"
          )}
        >
          {isCover ? (
            <>
              <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-brand-500 mb-2 transition-colors" />
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-brand-600">
                {isAr ? "رفع صورة الغلاف" : "Upload Cover Image"}
              </span>
              <span className="text-[11px] text-neutral-400 mt-0.5">
                {isAr ? "التقاط بالكاميرا أو رفع ملف" : "Camera or File"}
              </span>
            </>
          ) : (
            <>
              <Camera className="w-6 h-6 text-neutral-400 group-hover:text-brand-500 mb-1 transition-colors" />
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-brand-600 leading-tight">
                {isAr ? "إضافة صورة" : "Add Image"}
              </span>
            </>
          )}
        </button>
      )}

      {helperText && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-start">
          {helperText}
        </p>
      )}

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageUploaded={(url) => {
          onChange(url);
          setIsModalOpen(false);
        }}
        folder={folder}
        storeSlug={storeSlug}
        title={label}
      />
    </div>
  );
};
