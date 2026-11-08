"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Locale } from "@/types";
import { DashboardTab } from "../types";
import { SubscriptionPlanKey } from "@/features/subscription/types";
import { Utensils, FolderTree, Settings, QrCode, ExternalLink, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface DashboardHeaderProps {
  currentSlug: string;
  storeName: string;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  locale: Locale;
  onToggleLanguage: () => void;
  planKey?: SubscriptionPlanKey;
}

const STORES = [
  { slug: "oriental-grill", name_ar: "مطعم مشويات البركة", name_en: "Oriental Grill" },
  { slug: "specialty-cafe", name_ar: "كافيه ومخبوزات أروما", name_en: "Aroma Cafe" },
  { slug: "fresh-market", name_ar: "سوبر ماركت فريش ماركت", name_en: "Fresh Market" },
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentSlug,
  storeName,
  activeTab,
  onTabChange,
  locale,
  onToggleLanguage,
  planKey = "free",
}) => {
  const router = useRouter();
  const t = locale === "ar" ? arTranslations.admin : enTranslations.admin;
  const isArabic = locale === "ar";

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: "items", label: t.tabs.items, icon: <Utensils className="w-4 h-4" /> },
    { id: "categories", label: t.tabs.categories, icon: <FolderTree className="w-4 h-4" /> },
    { id: "settings", label: t.tabs.settings, icon: <Settings className="w-4 h-4" /> },
    { id: "qr", label: t.tabs.qr, icon: <QrCode className="w-4 h-4" /> },
  ];

  const planBadge =
    planKey === "pro" ? (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60">
        <Sparkles className="w-3 h-3" />
        {isArabic ? "باقة Pro" : "Pro Plan"}
      </span>
    ) : planKey === "enterprise" ? (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60">
        <Sparkles className="w-3 h-3" />
        {isArabic ? "باقة Enterprise" : "Enterprise"}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
        {isArabic ? "باقة مجانية" : "Free Plan"}
      </span>
    );

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 w-full sm:w-auto">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {t.title}
              </span>
              {planBadge}
              <h1 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-neutral-100 truncate">
                {storeName}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            <select
              value={currentSlug}
              data-testid="dashboard-store-switcher"
              onChange={(e) => router.push(`/dashboard/${e.target.value}`)}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {STORES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {isArabic ? s.name_ar : s.name_en}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="dashboard-lang-toggle"
                onClick={onToggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors min-h-[36px]"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isArabic ? "English" : "العربية"}</span>
              </button>

              <Link
                href={`/menu/${currentSlug}`}
                target="_blank"
                data-testid="dashboard-view-customer-menu"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors min-h-[36px]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.viewCustomerMenu}</span>
              </Link>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-testid={`dashboard-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px]",
                activeTab === tab.id
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/80"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
