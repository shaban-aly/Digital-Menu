"use client";

import React from "react";
import { AiTranslateButton } from "./ai-translate-button";

interface ItemDescriptionFieldsProps {
  shortDescAr: string;
  setShortDescAr: (v: string) => void;
  shortDescEn: string;
  setShortDescEn: (v: string) => void;
  fullDescAr: string;
  setFullDescAr: (v: string) => void;
  fullDescEn: string;
  setFullDescEn: (v: string) => void;
  inputCls: (err?: string) => string;
}

export const ItemDescriptionFields: React.FC<ItemDescriptionFieldsProps> = ({
  shortDescAr,
  setShortDescAr,
  shortDescEn,
  setShortDescEn,
  fullDescAr,
  setFullDescAr,
  fullDescEn,
  setFullDescEn,
  inputCls,
}) => {
  return (
    <div className="space-y-3 pt-1">
      {/* Short Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              الوصف المختصر (عربي)
            </label>
            <AiTranslateButton
              sourceText={shortDescAr}
              onTranslated={(val) => setShortDescEn(val)}
              testId="translate-short-desc-btn"
            />
          </div>
          <input
            data-testid="item-short-desc-ar-input"
            type="text"
            value={shortDescAr}
            onChange={(e) => setShortDescAr(e.target.value)}
            placeholder="مثال: طازج ولذيذ محضر يومياً"
            className={inputCls()}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Short Description (EN)
          </label>
          <input
            data-testid="item-short-desc-en-input"
            type="text"
            value={shortDescEn}
            onChange={(e) => setShortDescEn(e.target.value)}
            placeholder="e.g. Fresh & delicious daily"
            className={inputCls()}
          />
        </div>
      </div>

      {/* Full Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              الوصف الكامل (عربي)
            </label>
            <AiTranslateButton
              sourceText={fullDescAr}
              onTranslated={(val) => setFullDescEn(val)}
              testId="translate-full-desc-btn"
            />
          </div>
          <textarea
            data-testid="item-full-desc-ar-input"
            rows={2}
            value={fullDescAr}
            onChange={(e) => setFullDescAr(e.target.value)}
            placeholder="تفاصيل المكونات وطريقة التقديم..."
            className={inputCls()}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Full Description (EN)
          </label>
          <textarea
            data-testid="item-full-desc-en-input"
            rows={2}
            value={fullDescEn}
            onChange={(e) => setFullDescEn(e.target.value)}
            placeholder="Detailed ingredients and serving..."
            className={inputCls()}
          />
        </div>
      </div>
    </div>
  );
};
