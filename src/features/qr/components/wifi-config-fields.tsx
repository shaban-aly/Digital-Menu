"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Wifi } from "lucide-react";

interface WiFiConfigFieldsProps {
  showWifi: boolean;
  wifiSsid: string;
  wifiPassword: string;
  onToggleWifi: (show: boolean) => void;
  onChangeSsid: (ssid: string) => void;
  onChangePassword: (password: string) => void;
}

export const WiFiConfigFields: React.FC<WiFiConfigFieldsProps> = ({
  showWifi,
  wifiSsid,
  wifiPassword,
  onToggleWifi,
  onChangeSsid,
  onChangePassword,
}) => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100">
          <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{isAr ? "إضافة بيانات الواي فاي (WiFi)" : "Add WiFi Credentials"}</span>
        </label>
        <input
          type="checkbox"
          checked={showWifi}
          onChange={(e) => onToggleWifi(e.target.checked)}
          className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
        />
      </div>

      {showWifi && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              {isAr ? "اسم الشبكة (SSID)" : "Network Name (SSID)"}
            </label>
            <input
              type="text"
              value={wifiSsid}
              placeholder={isAr ? "مثال: Grill_Guest" : "e.g. Grill_Guest"}
              onChange={(e) => onChangeSsid(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              {isAr ? "كلمة المرور" : "WiFi Password"}
            </label>
            <input
              type="text"
              value={wifiPassword}
              placeholder={isAr ? "مثال: welcome2026" : "e.g. welcome2026"}
              onChange={(e) => onChangePassword(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
