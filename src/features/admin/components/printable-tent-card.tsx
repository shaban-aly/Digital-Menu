"use client";

import React from "react";
import Image from "next/image";
import { Restaurant } from "@/features/menu/types";
import { Locale } from "@/types";
import { Wifi } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface PrintableTentCardProps {
  restaurant: Restaurant;
  qrDataUrl: string;
  wifiSsid?: string;
  wifiPassword?: string;
  locale: Locale;
}

export const PrintableTentCard: React.FC<PrintableTentCardProps> = ({
  restaurant,
  qrDataUrl,
  wifiSsid,
  wifiPassword,
  locale,
}) => {
  const t = locale === "ar" ? arTranslations.admin.qr : enTranslations.admin.qr;
  const storeName = locale === "ar" ? restaurant.name_ar : restaurant.name_en;

  return (
    <div
      data-testid="printable-tent-card"
      className="w-full max-w-sm mx-auto bg-white p-8 rounded-3xl border-2 border-neutral-200 shadow-md flex flex-col items-center text-center space-y-5 print:border-none print:shadow-none print:p-0"
    >
      {/* Brand header */}
      <div className="space-y-1">
        <h2 className="text-xl font-black text-neutral-900 tracking-tight">
          {storeName}
        </h2>
        <p className="text-xs font-semibold text-neutral-500">
          {t.scanInstructions}
        </p>
      </div>

      {/* QR Code */}
      <div className="relative w-52 h-52 p-3 bg-white rounded-2xl border-2 border-neutral-900 shadow-inner flex items-center justify-center">
        {qrDataUrl ? (
          <Image
            src={qrDataUrl}
            alt="Store QR Code"
            width={190}
            height={190}
            className="w-full h-full object-contain"
            priority
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
            Generating...
          </div>
        )}
      </div>

      {/* Optional Wi-Fi info */}
      {(wifiSsid || wifiPassword) && (
        <div className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-start space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
            <Wifi className="w-3.5 h-3.5 text-brand-600" />
            <span>Wi-Fi</span>
          </div>
          {wifiSsid && (
            <p className="text-[11px] text-neutral-600">
              <span className="font-semibold">{t.wifiSsid}:</span> {wifiSsid}
            </p>
          )}
          {wifiPassword && (
            <p className="text-[11px] text-neutral-600">
              <span className="font-semibold">{t.wifiPassword}:</span> {wifiPassword}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

