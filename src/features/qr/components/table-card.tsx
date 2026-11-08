"use client";

import React from "react";
import Image from "next/image";
import { TableQRCard, QRGeneratorConfig } from "../types";
import { Store } from "@/features/menu/types";
import { useLanguage } from "@/lib/i18n/language-context";
import { Download, Wifi } from "lucide-react";

interface TableCardProps {
  card: TableQRCard;
  store: Store;
  config: QRGeneratorConfig;
  onDownload: (card: TableQRCard) => void;
}

export const TableCard: React.FC<TableCardProps> = ({
  card,
  store,
  config,
  onDownload,
}) => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const storeName = isAr ? store.name_ar : store.name_en;

  return (
    <div className="relative bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md print:shadow-none print:border-slate-400 print:bg-white print:dark:bg-white print:break-inside-avoid print:p-4">
      {/* Store Header / Logo */}
      <div className="flex flex-col items-center gap-2 mb-3">
        {config.showLogo && store.logo_url && (
          <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 relative shadow-2xs">
            <Image
              src={store.logo_url}
              alt={storeName}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        )}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white print:text-black">
          {storeName}
        </h3>
      </div>

      {/* Table Badge or Mode Badge */}
      <div className="mb-4">
        {card.tableNumber !== undefined ? (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 print:bg-slate-100 print:text-black print:border print:border-slate-300">
            {isAr ? `طاولة رقم ${card.tableNumber}` : `Table #${card.tableNumber}`}
          </span>
        ) : (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 print:bg-slate-100 print:text-black print:border print:border-slate-300">
            {isAr ? "الطلب والتوصيل المباشر" : "Order & Delivery"}
          </span>
        )}
      </div>

      {/* High-Resolution QR Code */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs mb-4 print:border-none print:shadow-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.qrDataUrl}
          alt={`QR Code for ${card.title}`}
          width={220}
          height={220}
          className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
        />
      </div>

      {/* Call to Action Subtitle */}
      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 max-w-[240px] print:text-black">
        {card.subtitle || (isAr ? "امسح الكود بالكاميرا لتصفح المنيو" : "Scan with camera to view menu")}
      </p>

      {/* Optional WiFi Information */}
      {config.showWifi && config.wifiSsid && (
        <div className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 mb-4 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 print:bg-slate-50 print:text-black print:border-slate-300">
          <div className="flex items-center justify-center gap-1 font-semibold mb-1 text-emerald-700 dark:text-emerald-400 print:text-black">
            <Wifi className="w-3.5 h-3.5" />
            <span>WiFi</span>
          </div>
          <div className="flex justify-center gap-3">
            <span><strong>{isAr ? "الشبكة:" : "SSID:"}</strong> {config.wifiSsid}</span>
            {config.wifiPassword && (
              <span><strong>{isAr ? "الرمز:" : "Pass:"}</strong> {config.wifiPassword}</span>
            )}
          </div>
        </div>
      )}

      {/* Screen-Only Download Action */}
      <div className="w-full mt-auto pt-2 print:hidden">
        <button
          type="button"
          onClick={() => onDownload(card)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold min-h-[44px] transition-colors"
        >
          <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{isAr ? "تحميل صورة PNG" : "Download PNG"}</span>
        </button>
      </div>
    </div>
  );
};
