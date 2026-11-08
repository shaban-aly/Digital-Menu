"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Locale } from "@/types";
import { AdminActiveTab } from "../types";
import { Utensils, FolderTree, Settings, QrCode, ExternalLink, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface AdminHeaderProps {
  currentSlug: string;
  storeName: string;
  activeTab: AdminActiveTab;
  onTabChange: (tab: AdminActiveTab) => void;
  locale: Locale;
  onToggleLanguage: () => void;
}

const STORES = [
  { slug: "oriental-grill", name_ar: "مطعم مشويات البركة", name_en: "Oriental Grill" },
  { slug: "specialty-cafe", name_ar: "كافيه ومخبوزات أروما", name_en: "Aroma Cafe" },
  { slug: "fresh-market", name_ar: "سوبر ماركت فريش ماركت", name_en: "Fresh Market" },
];

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentSlug,
  storeName,
  activeTab,
  onTabChange,
  locale,
  onToggleLanguage,
}) => {
  const router = useRouter();
  const t = locale === "ar" ? arTranslations.admin : enTranslations.admin;

  const tabs: { id: AdminActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "items", label: t.tabs.items, icon: <Utensils className="w-4 h-4" /> },
    { id: "categories", label: t.tabs.categories, icon: <FolderTree className="w-4 h-4" /> },
    { id: "settings", label: t.tabs.settings, icon: <Settings className="w-4 h-4" /> },
    { id: "qr", label: t.tabs.qr, icon: <QrCode className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3.5 space-y-3">
        {/* Top bar: Store title, switcher, external preview link, and language toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {t.title}
              </span>
              <h1 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 truncate">
                {storeName}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Store switcher */}
            <select
              value={currentSlug}
              data-testid="admin-store-switcher"
              onChange={(e) => router.push(`/admin/${e.target.value}`)}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {STORES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {locale === "ar" ? s.name_ar : s.name_en}
                </option>
              ))}
            </select>

            {/* Language switch */}
            <button
              type="button"
              data-testid="admin-lang-toggle"
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* View Customer Menu link */}
            <Link
              href={`/menu/${currentSlug}`}
              target="_blank"
              data-testid="admin-view-customer-menu"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.viewCustomerMenu}</span>
            </Link>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-testid={`admin-tab-${tab.id}`}
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

