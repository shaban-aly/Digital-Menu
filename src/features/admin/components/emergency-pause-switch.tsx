import React, { useState } from "react";
import { Locale } from "@/types";
import { AlertTriangle, PauseCircle, PlayCircle } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface EmergencyPauseSwitchProps {
  isPaused: boolean;
  pauseNoteAr: string;
  pauseNoteEn: string;
  locale: Locale;
  onTogglePause: (isPaused: boolean, noteAr: string, noteEn: string) => void;
}

export const EmergencyPauseSwitch: React.FC<EmergencyPauseSwitchProps> = ({
  isPaused,
  pauseNoteAr,
  pauseNoteEn,
  locale,
  onTogglePause,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;
  const [noteAr, setNoteAr] = useState(pauseNoteAr);
  const [noteEn, setNoteEn] = useState(pauseNoteEn);

  const handleToggle = () => {
    onTogglePause(!isPaused, noteAr, noteEn);
  };

  const handleSaveNote = () => {
    onTogglePause(isPaused, noteAr, noteEn);
  };

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isPaused
          ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 shadow-sm"
          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xs"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl mt-0.5 ${
              isPaused
                ? "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
            }`}
          >
            {isPaused ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <PauseCircle className="w-5 h-5" />
            )}
          </div>

          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-100">
              {t.admin.schedule.emergencyPauseTitle}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
              {t.admin.schedule.emergencyPauseDesc}
            </p>
          </div>
        </div>

        {/* Toggle Action */}
        <button
          type="button"
          onClick={handleToggle}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer min-h-[44px] ${
            isPaused
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20"
              : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
          }`}
        >
          {isPaused ? (
            <>
              <PlayCircle className="w-4 h-4" />
              <span>{locale === "ar" ? "استئناف استقبال الطلبات" : "Resume Orders"}</span>
            </>
          ) : (
            <>
              <PauseCircle className="w-4 h-4" />
              <span>{locale === "ar" ? "إيقاف مؤقت للطلبات الآن" : "Pause Orders Now"}</span>
            </>
          )}
        </button>
      </div>

      {/* Expanded Note Field when Paused */}
      {isPaused && (
        <div className="mt-4 pt-4 border-t border-amber-200/80 dark:border-amber-900/50 space-y-3 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
              {t.admin.schedule.pauseNoteLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locale === "ar" ? noteAr : noteEn}
                onChange={(e) => {
                  if (locale === "ar") setNoteAr(e.target.value);
                  else setNoteEn(e.target.value);
                }}
                onBlur={handleSaveNote}
                placeholder={t.admin.schedule.pauseNotePlaceholder}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-amber-300 dark:border-amber-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[40px]"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {locale === "ar" ? "تحديث" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
