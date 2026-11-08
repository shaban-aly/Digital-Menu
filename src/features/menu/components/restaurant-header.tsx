import React, { useState } from "react";
import Image from "next/image";
import { Restaurant } from "@/features/menu/types";
import { Locale } from "@/types";
import { Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreSchedule } from "@/features/schedule/hooks/use-store-schedule";
import { StoreStatusBadge } from "@/features/schedule/components/store-status-badge";
import { ScheduleModal } from "@/features/schedule/components/schedule-modal";
import { formatCurrency } from "@/lib/utils";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  locale: Locale;
  onToggleLanguage: () => void;
}

const businessTypeLabels: Record<string, { ar: string; en: string }> = {
  restaurant: { ar: "مطعم", en: "Restaurant" },
  cafe: { ar: "كافيه", en: "Café" },
  supermarket: { ar: "سوبر ماركت", en: "Supermarket" },
  store: { ar: "متجر", en: "Store" },
};

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  restaurant,
  locale,
  onToggleLanguage,
}) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { operatingStatus, scheduleConfig } = useStoreSchedule(
    restaurant.schedule
  );

  const name = locale === "ar" ? restaurant.name_ar : restaurant.name_en;
  const targetLanguageLabel = locale === "ar" ? "English" : "العربية";
  const typeLabel = businessTypeLabels[restaurant.business_type] || {
    ar: restaurant.business_type,
    en: restaurant.business_type,
  };

  return (
    <>
      <header className="relative w-full bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-3 sm:px-4 py-3 sm:py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 border border-neutral-100 dark:border-neutral-800 shadow-sm bg-neutral-100">
              {restaurant.logo_url && !logoError ? (
                <Image
                  src={restaurant.logo_url}
                  alt={name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                  onError={() => setLogoError(true)}
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

                <span
                  data-testid="store-business-type"
                  className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                >
                  {locale === "ar" ? typeLabel.ar : typeLabel.en}
                </span>

                {restaurant.delivery_fee > 0 && (
                  <span
                    data-testid="store-delivery-fee"
                    className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                  >
                    {locale === "ar" ? "توصيل:" : "Delivery:"}{" "}
                    {formatCurrency(restaurant.delivery_fee, locale, restaurant.currency)}
                  </span>
                )}

                {restaurant.phone_number && (
                  <a
                    href={`tel:${restaurant.phone_number}`}
                    data-testid="store-phone-number"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    aria-label={restaurant.phone_number}
                  >
                    <Phone className="w-3 h-3" />
                    <span dir="ltr">+{restaurant.phone_number.replace(/^\+/, "")}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

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
