"use client";

import React from "react";
import { Restaurant } from "@/features/menu/types";
import { Locale } from "@/types";
import { useStoreQR } from "../hooks/use-store-qr";
import { PrintableTentCard } from "./printable-tent-card";
import { Download, Printer, ExternalLink } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface QRTabProps {
  restaurant: Restaurant;
  locale: Locale;
  printBasePath?: string;
}

export const QRTab: React.FC<QRTabProps> = ({ restaurant, locale, printBasePath = "/dashboard" }) => {
  const t = locale === "ar" ? arTranslations.admin.qr : enTranslations.admin.qr;
  const {
    qrDataUrl,
    targetUrl,
    wifiSsid,
    setWifiSsid,
    wifiPassword,
    setWifiPassword,
    downloadQR,
  } = useStoreQR(restaurant.slug);

  const handlePrint = () => {
    window.open(`${printBasePath}/${restaurant.slug}/print-qr?ssid=${encodeURIComponent(wifiSsid)}&pass=${encodeURIComponent(wifiPassword)}`, "_blank");
  };

  const inputCls =
    "w-full text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Controls & Configuration */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
        <div>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{t.title}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{t.desc}</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.menuUrl}</label>
          <div className="flex items-center gap-2">
            <input type="text" readOnly value={targetUrl} className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 select-all" />
            <a href={targetUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.wifiSsid}</label>
            <input data-testid="qr-wifi-ssid-input" type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="e.g. Cafe-Guest" className={inputCls} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.wifiPassword}</label>
            <input data-testid="qr-wifi-pass-input" type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} placeholder="e.g. 12345678" className={inputCls} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            data-testid="print-tent-card-btn"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printTentCard}</span>
          </button>

          <button
            type="button"
            data-testid="download-qr-btn"
            onClick={downloadQR}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t.downloadQr}</span>
          </button>
        </div>
      </div>

      {/* Live Tent Card Preview */}
      <div className="p-4 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
        <PrintableTentCard
          restaurant={restaurant}
          qrDataUrl={qrDataUrl}
          wifiSsid={wifiSsid}
          wifiPassword={wifiPassword}
          locale={locale}
        />
      </div>
    </div>
  );
};

