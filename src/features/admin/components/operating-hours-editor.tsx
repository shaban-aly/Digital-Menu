import React from "react";
import { StoreScheduleConfig, DaySchedule } from "@/features/schedule/types";
import { Locale } from "@/types";
import { Clock, CalendarCheck } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface OperatingHoursEditorProps {
  scheduleConfig: StoreScheduleConfig;
  locale: Locale;
  onChange: (updated: StoreScheduleConfig) => void;
}

export const OperatingHoursEditor: React.FC<OperatingHoursEditorProps> = ({
  scheduleConfig,
  locale,
  onChange,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;
  const daysMap = t.schedule.days;

  const handleDayChange = (
    dayIndex: number,
    field: keyof DaySchedule,
    value: boolean | string
  ) => {
    const updatedWeekly = scheduleConfig.weekly_schedule.map((item) => {
      if (item.day === dayIndex) {
        return { ...item, [field]: value };
      }
      return item;
    });

    onChange({
      ...scheduleConfig,
      weekly_schedule: updatedWeekly,
    });
  };

  const handlePreordersToggle = (enabled: boolean) => {
    onChange({
      ...scheduleConfig,
      allow_preorders: enabled,
    });
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mt-0.5">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-100">
            {t.admin.schedule.title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {t.admin.schedule.subtitle}
          </p>
        </div>
      </div>

      {/* Pre-Orders Toggle */}
      <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {t.admin.schedule.allowPreorders}
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            {t.admin.schedule.allowPreordersHint}
          </p>
        </div>
        <input
          type="checkbox"
          checked={scheduleConfig.allow_preorders}
          onChange={(e) => handlePreordersToggle(e.target.checked)}
          className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
        />
      </div>

      {/* 7 Days Table */}
      <div className="space-y-2.5">
        <span className="text-xs font-extrabold text-neutral-600 dark:text-neutral-300 block">
          {locale === "ar" ? "جدول ساعات العمل اليومية" : "Daily Shifts Schedule"}
        </span>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          {scheduleConfig.weekly_schedule.map((dayItem) => {
            const dayName =
              daysMap[String(dayItem.day) as keyof typeof daysMap] ||
              `Day ${dayItem.day}`;

            return (
              <div
                key={dayItem.day}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-neutral-50/30 dark:bg-neutral-900/40 text-xs"
              >
                {/* Day Active Toggle */}
                <div className="flex items-center gap-2.5 min-w-[130px]">
                  <input
                    type="checkbox"
                    id={`day-${dayItem.day}`}
                    checked={dayItem.is_enabled}
                    onChange={(e) =>
                      handleDayChange(dayItem.day, "is_enabled", e.target.checked)
                    }
                    className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
                  />
                  <label
                    htmlFor={`day-${dayItem.day}`}
                    className={`font-bold cursor-pointer ${
                      dayItem.is_enabled
                        ? "text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-400 dark:text-neutral-500 line-through"
                    }`}
                  >
                    {dayName}
                  </label>
                </div>

                {/* Hours Inputs */}
                {dayItem.is_enabled ? (
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <span className="text-[11px] text-neutral-400">
                      {t.admin.schedule.openTime}:
                    </span>
                    <input
                      type="time"
                      value={dayItem.open_time}
                      onChange={(e) =>
                        handleDayChange(dayItem.day, "open_time", e.target.value)
                      }
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:ring-1 focus:ring-brand-500"
                    />
                    <span className="text-[11px] text-neutral-400">
                      {t.admin.schedule.closeTime}:
                    </span>
                    <input
                      type="time"
                      value={dayItem.close_time}
                      onChange={(e) =>
                        handleDayChange(dayItem.day, "close_time", e.target.value)
                      }
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400">
                    {t.admin.schedule.dayDisabled}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
