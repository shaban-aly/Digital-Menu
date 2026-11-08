import React from "react";
import { StoreOperatingStatus } from "../types";
import { Locale } from "@/types";
import { AlertCircle, Clock, PauseCircle } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface ClosedGuardBannerProps {
  operatingStatus: StoreOperatingStatus;
  locale: Locale;
}

export const ClosedGuardBanner: React.FC<ClosedGuardBannerProps> = ({
  operatingStatus,
  locale,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;
  const {
    isOpen,
    isPaused,
    canPlaceOrder,
    nextOpeningDateTextAr,
    nextOpeningDateTextEn,
    pauseNoteAr,
    pauseNoteEn,
  } = operatingStatus;

  if (isOpen) return null;

  const nextText =
    locale === "ar" ? nextOpeningDateTextAr : nextOpeningDateTextEn;
  const pauseNote = locale === "ar" ? pauseNoteAr : pauseNoteEn;

  if (isPaused) {
    return (
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <PauseCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{t.schedule.pausedNow}</span>
        </div>
        {pauseNote ? (
          <p className="leading-relaxed opacity-90">{pauseNote}</p>
        ) : (
          <p className="leading-relaxed opacity-90">
            {locale === "ar"
              ? "نعتذر عن استقبال طلبات جديدة في الوقت الحالي لضغط العمل."
              : "Apologies, we are temporarily pausing new orders due to rush."}
          </p>
        )}
      </div>
    );
  }

  if (canPlaceOrder) {
    return (
      <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            {locale === "ar"
              ? "طلب مسبق لموعد الفتح"
              : "Pre-Order for Next Opening"}
          </span>
        </div>
        <p className="leading-relaxed opacity-90">
          {locale === "ar"
            ? `المتجر مغلق حالياً. سيتم تسجيل طلبك كطلب مسبق ليتم تجهيزه فور الفتح (${nextText || "في الموعد المحدد"}).`
            : `Store is closed. Your order will be placed as a pre-order for opening (${nextText || "next shift"}).`}
        </p>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 text-xs space-y-1">
      <div className="flex items-center gap-1.5 font-bold">
        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
        <span>{t.schedule.closedNow}</span>
      </div>
      <p className="leading-relaxed opacity-90">
        {t.schedule.closedNotice}
        {nextText && (
          <span className="block mt-1 font-semibold">
            {locale === "ar" ? `موعد الفتح: ${nextText}` : `Next opening: ${nextText}`}
          </span>
        )}
      </p>
    </div>
  );
};
