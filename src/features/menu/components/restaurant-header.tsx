import React, { useState } from "react";
import Image from "next/image";
import { Restaurant } from "@/features/menu/types";
import { Locale } from "@/types";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreSchedule } from "@/features/schedule/hooks/use-store-schedule";
import { StoreStatusBadge } from "@/features/schedule/components/store-status-badge";
import { ScheduleModal } from "@/features/schedule/components/schedule-modal";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  locale: Locale;
  onToggleLanguage: () => void;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  restaurant,
  locale,
  onToggleLanguage,
}) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const { operatingStatus, scheduleConfig } = useStoreSchedule(
    restaurant.schedule
  );

  const name = locale === "ar" ? restaurant.name_ar : restaurant.name_en;
  const targetLanguageLabel = locale === "ar" ? "English" : "العربية";

  return (
    <>
      <header className="relative w-full bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-3 sm:px-4 py-3 sm:py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 border border-neutral-100 dark:border-neutral-800 shadow-sm bg-neutral-100">
              {restaurant.logo_url ? (
                <Image
                  src={restaurant.logo_url}
                  alt={name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-brand-500 text-white flex items-center justify-center font-bold text-base sm:text-lg">
                  {name.charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <h1 className="text-base sm:text-xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
                {name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <StoreStatusBadge
                  operatingStatus={operatingStatus}
                  locale={locale}
                  onClickSchedule={() => setIsScheduleOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* Language Switcher Button (Min 44x44px touch target) */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleLanguage}
            className="shrink-0 flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 text-xs font-semibold min-h-[44px]"
            aria-label={
              locale === "ar"
                ? "التحويل إلى اللغة الإنجليزية"
                : "Switch to Arabic language"
            }
          >
            <Globe className="w-4 h-4 text-brand-600" />
            <span>{targetLanguageLabel}</span>
          </Button>
        </div>
      </header>

      {/* 7-Day Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        scheduleConfig={scheduleConfig}
        currentDay={operatingStatus.currentDay}
        locale={locale}
        restaurantName={name}
      />
    </>
  );
};
