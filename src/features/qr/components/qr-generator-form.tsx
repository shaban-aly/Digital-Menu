"use client";

import React from "react";
import { Store } from "@/features/menu/types";
import { QRGeneratorConfig } from "../types";
import { useLanguage } from "@/lib/i18n/language-context";
import { WiFiConfigFields } from "./wifi-config-fields";
import { Store as StoreIcon, UtensilsCrossed } from "lucide-react";

interface QRGeneratorFormProps {
  store: Store;
  config: QRGeneratorConfig;
  onUpdate: (patch: Partial<QRGeneratorConfig>) => void;
}

export const QRGeneratorForm: React.FC<QRGeneratorFormProps> = ({
  store,
  config,
  onUpdate,
}) => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const isSupermarket = store.business_type === "supermarket";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 print:hidden">
      {!isSupermarket && (
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onUpdate({ mode: "tables" })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
              config.mode === "tables"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>{isAr ? "طاولات الصالة (Dine-in)" : "Dining Tables"}</span>
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ mode: "storefront" })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all min-h-[44px] ${
              config.mode === "storefront"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <StoreIcon className="w-4 h-4" />
            <span>{isAr ? "كود عام / للتوصيل" : "Storefront / Delivery"}</span>
          </button>
        </div>
      )}

      {config.mode === "tables" && !isSupermarket ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? "عدد الطاولات (1 - 100)" : "Table Count (1 - 100)"}
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={config.tableCount}
              onChange={(e) =>
                onUpdate({
                  tableCount: Math.max(1, Math.min(100, Number(e.target.value) || 1)),
                })
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? "يبدأ من طاولة رقم" : "Start Table Number"}
            </label>
            <input
              type="number"
              min={1}
              value={config.startNumber}
              onChange={(e) =>
                onUpdate({ startNumber: Math.max(1, Number(e.target.value) || 1) })
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isAr ? "بادئة الطاولة (اختياري)" : "Table Prefix (Optional)"}
            </label>
            <input
              type="text"
              value={config.tablePrefix}
              placeholder={isAr ? "مثال: T أو صالة-" : "e.g. T- or VIP-"}
              onChange={(e) => onUpdate({ tablePrefix: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[44px]"
            />
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300">
          {isAr
            ? "سيتم توليد كود QR مباشر بدون رقم طاولة، مخصص للافتة المحل أو أكياس التوصيل."
            : "Generating a direct storefront QR code without table parameters, ideal for store banners or delivery bags."}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={config.showLogo}
            onChange={(e) => onUpdate({ showLogo: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <span>{isAr ? "إظهار شعار المطعم أعلى البطاقة" : "Show Store Logo on Card"}</span>
        </label>
      </div>

      <WiFiConfigFields
        showWifi={config.showWifi}
        wifiSsid={config.wifiSsid}
        wifiPassword={config.wifiPassword}
        onToggleWifi={(showWifi) => onUpdate({ showWifi })}
        onChangeSsid={(wifiSsid) => onUpdate({ wifiSsid })}
        onChangePassword={(wifiPassword) => onUpdate({ wifiPassword })}
      />
    </div>
  );
};
