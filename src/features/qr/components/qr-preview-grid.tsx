"use client";

import React from "react";
import { TableQRCard, QRGeneratorConfig } from "../types";
import { Store } from "@/features/menu/types";
import { TableCard } from "./table-card";
import { useLanguage } from "@/lib/i18n/language-context";

interface QRPreviewGridProps {
  cards: TableQRCard[];
  store: Store;
  config: QRGeneratorConfig;
  isLoading: boolean;
  onDownload: (card: TableQRCard) => void;
}

export const QRPreviewGrid: React.FC<QRPreviewGridProps> = ({
  cards,
  store,
  config,
  isLoading,
  onDownload,
}) => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  if (isLoading && cards.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">
          {isAr ? "لا توجد بطاقات طاولات مولدة" : "No QR cards generated"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Cards Grid: Screen (1 to 3 cols) | Print (2 per sheet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-6 print:m-0 print:p-0">
        {cards.map((card) => (
          <TableCard
            key={card.id}
            card={card}
            store={store}
            config={config}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
};
