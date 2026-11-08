"use client";

import React from "react";
import { useStoreAdmin } from "../hooks/use-store-admin";
import { useLanguage } from "@/features/menu/hooks/use-language";
import { useStoreSchedule } from "@/features/schedule/hooks/use-store-schedule";
import { AdminHeader } from "./admin-header";
import { ItemsTab } from "./items-tab";
import { CategoriesTab } from "./categories-tab";
import { SettingsTab } from "./settings-tab";
import { QRTab } from "./qr-tab";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminDashboardPageProps {
  slug: string;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ slug }) => {
  const { locale, toggleLanguage } = useLanguage();
  const {
    store,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    notification,
    toggleItemAvailability,
    saveItem,
    deleteItem,
    saveCategory,
    deleteCategory,
    updateSettings,
    resetToDefaults,
  } = useStoreAdmin(slug);

  const { operatingStatus } = useStoreSchedule(store?.restaurant?.schedule);
  const storeName = store ? (locale === "ar" ? store.restaurant.name_ar : store.restaurant.name_en) : "";

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 space-y-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-rose-200 dark:border-rose-900/40">
        <h3 className="font-bold text-sm text-rose-600">خطأ في تحميل المتجر</h3>
        <p className="text-xs text-neutral-500 mt-1">{error || "لم يتم العثور على بيانات المتجر"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-20">
      <AdminHeader
        currentSlug={slug}
        storeName={storeName}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locale={locale}
        onToggleLanguage={toggleLanguage}
        operatingStatus={operatingStatus}
        onClickSchedule={() => setActiveTab("settings")}
      />

      {/* Floating notification toast */}
      {notification && (
        <div
          data-testid="admin-notification-toast"
          className={cn(
            "fixed bottom-6 start-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200",
            notification.type === "success"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-rose-600 text-white"
          )}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === "items" && (
          <ItemsTab
            categories={store.categories}
            locale={locale}
            onToggleStock={toggleItemAvailability}
            onSaveItem={saveItem}
            onDeleteItem={deleteItem}
          />
        )}

        {activeTab === "categories" && (
          <CategoriesTab
            categories={store.categories}
            locale={locale}
            onSaveCategory={saveCategory}
            onDeleteCategory={deleteCategory}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            restaurant={store.restaurant}
            locale={locale}
            onSaveSettings={updateSettings}
            onResetDefaults={resetToDefaults}
          />
        )}

        {activeTab === "qr" && (
          <QRTab
            restaurant={store.restaurant}
            locale={locale}
          />
        )}
      </main>
    </div>
  );
};

