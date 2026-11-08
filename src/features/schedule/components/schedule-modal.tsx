import React from "react";
import { Modal } from "@/components/ui/modal";
import { StoreScheduleConfig } from "../types";
import { ScheduleService } from "../services/schedule-service";
import { Locale } from "@/types";
import { Calendar, Clock, Info } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleConfig: StoreScheduleConfig;
  currentDay: number;
  locale: Locale;
  restaurantName: string;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  scheduleConfig,
  currentDay,
  locale,
  restaurantName,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;
  const daysMap = t.schedule.days;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.schedule.scheduleTitle}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>{restaurantName}</span>
        </div>

        {/* 7-Day Timetable List */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/50">
          {scheduleConfig.weekly_schedule.map((dayItem) => {
            const isToday = dayItem.day === currentDay;
            const dayName =
              daysMap[String(dayItem.day) as keyof typeof daysMap] ||
              `Day ${dayItem.day}`;

            const openFormatted = ScheduleService.formatTime(
              dayItem.open_time,
              locale
            );
            const closeFormatted = ScheduleService.formatTime(
              dayItem.close_time,
              locale
            );

            return (
              <div
                key={dayItem.day}
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  isToday
                    ? "bg-brand-50/80 dark:bg-brand-950/40 font-bold"
                    : "hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={
                      isToday
                        ? "text-brand-900 dark:text-brand-200"
                        : "text-neutral-700 dark:text-neutral-300"
                    }
                  >
                    {dayName}
                  </span>
                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-600 text-white dark:bg-brand-500">
                      {locale === "ar" ? "اليوم" : "Today"}
                    </span>
                  )}
                </div>

                <div>
                  {dayItem.is_enabled ? (
                    <span className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-mono">
                      {openFormatted} - {closeFormatted}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      {t.schedule.closedDay}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pre-order Policy Footnote */}
        {scheduleConfig.allow_preorders && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <p className="leading-relaxed">
              {locale === "ar"
                ? "يمكنك طلب وجباتك ومشترياتك كـ (طلب مسبق) في أي وقت خارج ساعات العمل ليتم تجهيزها مع موعد الفتح."
                : "You can place pre-orders anytime outside operating hours to be prepared upon next opening."}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
