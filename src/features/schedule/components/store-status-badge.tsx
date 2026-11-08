import React from "react";
import { StoreOperatingStatus } from "../types";
import { Locale } from "@/types";
import { Clock } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface StoreStatusBadgeProps {
  operatingStatus: StoreOperatingStatus;
  locale: Locale;
  onClickSchedule?: () => void;
}

export const StoreStatusBadge: React.FC<StoreStatusBadgeProps> = ({
  operatingStatus,
  locale,
  onClickSchedule,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;
  const { isOpen, isPaused, nextOpeningDateTextAr, nextOpeningDateTextEn } =
    operatingStatus;

  const nextText =
    locale === "ar" ? nextOpeningDateTextAr : nextOpeningDateTextEn;

  let badgeStyles =
    "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60";
  let dotStyles = "bg-emerald-500";
  let label = t.schedule.openNow;

  if (isPaused) {
    badgeStyles =
      "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60";
    dotStyles = "bg-amber-500";
    label = t.schedule.pausedNow;
  } else if (!isOpen) {
    badgeStyles =
      "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60";
    dotStyles = "bg-rose-500";
    label = t.schedule.closedNow;
  }

  return (
    <button
      type="button"
      onClick={onClickSchedule}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all hover:opacity-90 active:scale-95 cursor-pointer max-w-full truncate ${badgeStyles}`}
      title={t.schedule.viewSchedule}
      aria-label={`${label} - ${t.schedule.viewSchedule}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {isOpen && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotStyles}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${dotStyles}`}
        />
      </span>

      <span className="truncate">{label}</span>

      {!isOpen && !isPaused && nextText && (
        <span className="opacity-80 text-[11px] font-normal truncate hidden sm:inline">
          • {nextText}
        </span>
      )}

      <Clock className="w-3 h-3 ms-0.5 opacity-60 shrink-0" />
    </button>
  );
};
