"use client";

import React from "react";
import Link from "next/link";
import { Store } from "@/features/menu/types";
import { useQRGenerator } from "../hooks/use-qr-generator";
import { QRGeneratorForm } from "./qr-generator-form";
import { QRPreviewGrid } from "./qr-preview-grid";
import { useLanguage } from "@/lib/i18n/language-context";
import { ArrowLeft, ArrowRight, Printer, QrCode, Globe } from "lucide-react";

interface QRGeneratorScreenProps {
  store: Store;
}

export const QRGeneratorScreen: React.FC<QRGeneratorScreenProps> = ({ store }) => {
  const { locale, toggleLanguage } = useLanguage();
  const isAr = locale === "ar";
  const { config, cards, isLoading, updateConfig, downloadCard, printCards } =
    useQRGenerator(store);

  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const storeName = isAr ? store.name_ar : store.name_en;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 print:p-0 print:bg-white print:text-black">
      {/* Top Bar (Screen Only) */}
      <header className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href={`/menu/${store.slug}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] transition-colors"
          >
            <BackIcon className="w-4 h-4" />
            <span>{isAr ? "العودة للمنيو" : "Back to Menu"}</span>
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? "مولد بطاقات الطاولات و QR" : "QR Table Stand Generator"}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {storeName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ms-auto">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isAr ? "English" : "العربية"}</span>
          </button>
          <button
            type="button"
            onClick={printCards}
            disabled={cards.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs min-h-[44px] transition-all disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>{isAr ? "طباعة البطاقات (A4)" : "Print Cards (A4)"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto space-y-6">
        <QRGeneratorForm
          store={store}
          config={config}
          onUpdate={updateConfig}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between print:hidden">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {isAr
                ? `معاينة البطاقات (${cards.length} بطاقة جاهزة للطباعة)`
                : `Cards Preview (${cards.length} ready to print)`}
            </h2>
            <span className="text-xs text-slate-500">
              {isAr ? "تنسيق 2 بطاقة في كل ورقة A4" : "Formatted 2 cards per A4 sheet"}
            </span>
          </div>

          <QRPreviewGrid
            cards={cards}
            store={store}
            config={config}
            isLoading={isLoading}
            onDownload={downloadCard}
          />
        </div>
      </main>
    </div>
  );
};
