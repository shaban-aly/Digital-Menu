import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllStores } from "@/features/menu/services/menu-service";
import { Locale } from "@/types";
import { StoreOrderType } from "@/features/menu/types";
import { Utensils, Coffee, ShoppingBasket, Truck, ShoppingBag, Globe, ArrowRight, ArrowLeft } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function PilotLandingPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "ar";
  const t = locale === "ar" ? arTranslations : enTranslations;
  const isAr = locale === "ar";
  const stores = await getAllStores();

  const getBusinessIcon = (type: string) => {
    switch (type) {
      case "cafe":
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case "supermarket":
        return <ShoppingBasket className="w-5 h-5 text-emerald-600" />;
      default:
        return <Utensils className="w-5 h-5 text-brand-600" />;
    }
  };

  const getOrderTypeBadge = (orderType: StoreOrderType) => {
    switch (orderType) {
      case "dine_in":
        return { label: t.cart.dineIn, icon: <Utensils className="w-3 h-3" /> };
      case "takeaway":
        return { label: t.cart.takeaway, icon: <ShoppingBag className="w-3 h-3" /> };
      case "delivery":
        return { label: t.cart.delivery, icon: <Truck className="w-3 h-3" /> };
    }
  };

  const otherLocale = isAr ? "en" : "ar";
  const otherLocaleLabel = isAr ? "English" : "العربية";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Header & Language Switcher */}
        <header className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100">
              {t.home.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {t.home.subtitle}
            </p>
          </div>

          <Link
            href={`/${otherLocale}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-h-[44px] min-w-[44px]"
            aria-label={`Switch to ${otherLocaleLabel}`}
          >
            <Globe className="w-4 h-4" />
            <span>{otherLocaleLabel}</span>
          </Link>
        </header>

        {/* Stores List */}
        <div className="space-y-4">
          {stores.map((store) => {
            const name = isAr ? store.name_ar : store.name_en;
            const desc = isAr ? store.description_ar : store.description_en;
            const businessLabel =
              t.home.businessTypes[store.business_type as keyof typeof t.home.businessTypes] ||
              store.business_type;

            return (
              <div
                key={store.id}
                className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Store Logo */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-neutral-100 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={store.logo_url}
                      alt={name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Store Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {getBusinessIcon(store.business_type)}
                        {businessLabel}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1.5 leading-snug">
                      {name}
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Supported Order Types Badges */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {t.home.orderTypesLabel}
                    </span>
                    {store.supported_order_types.map((type) => {
                      const badge = getOrderTypeBadge(type);
                      return (
                        <span
                          key={type}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900/40"
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Navigation Button */}
                  <Link
                    href={`/${locale}/${store.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 transition-colors shadow-xs min-h-[44px]"
                  >
                    <span>{t.home.viewStore}</span>
                    {isAr ? (
                      <ArrowLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
