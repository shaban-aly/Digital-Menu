"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useLanguage } from "@/features/menu/hooks/use-language";
import { useStoreSchedule } from "@/features/schedule/hooks/use-store-schedule";
import { useDashboardStore } from "../hooks/use-dashboard-store";
import { DashboardHeader } from "./dashboard-header";
import { DashboardQuotaCards } from "./dashboard-quota-cards";
import { ItemsTab } from "@/features/admin/components/items-tab";
import { CategoriesTab } from "@/features/admin/components/categories-tab";
import { SettingsTab } from "@/features/admin/components/settings-tab";
import { QRTab } from "@/features/admin/components/qr-tab";
import { QuotaUpgradeModal } from "@/features/subscription/components/quota-upgrade-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardViewProps } from "../types";

export const DashboardView: React.FC<DashboardViewProps> = ({ slug }) => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const { locale, toggleLanguage } = useLanguage();
  const {
    store, isLoading: isStoreLoading, error, activeTab, setActiveTab,
    planKey, quotaUsage, isQuotaModalOpen, quotaModalType,
    setIsQuotaModalOpen, setQuotaModalType, checkCanAddCategory,
    checkCanAddProduct, notification, toggleItemAvailability,
    saveItem, deleteItem, saveCategory, deleteCategory,
    updateSettings, resetToDefaults,
  } = useDashboardStore(slug);

  const { operatingStatus } = useStoreSchedule(store?.restaurant?.schedule);
  const storeName = store ? (locale === "ar" ? store.restaurant.name_ar : store.restaurant.name_en) : "";
  const isSuperAdmin = user?.role === "superadmin";
  const isOwner = !!user?.storeSlug && user.storeSlug === slug;
  const isAuthorized = !isAuthLoading && !!user && (isSuperAdmin || isOwner);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "superadmin") return;
    if (!user.storeSlug) {
      router.replace("/onboarding");
      return;
    }
    if (user.storeSlug !== slug) {
      router.replace(`/dashboard/${user.storeSlug}`);
    }
  }, [isAuthLoading, user, slug, router]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace("/login");
  }, [logout, router]);

  if (isAuthLoading || !isAuthorized || isStoreLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 space-y-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
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
        <h3 className="font-bold text-sm text-rose-600">
          {locale === "ar" ? "خطأ في تحميل المتجر" : "Error loading store"}
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          {error || (locale === "ar" ? "لم يتم العثور على بيانات المتجر" : "Store data not found")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pb-20">
      <DashboardHeader
        currentSlug={slug}
        storeName={storeName}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locale={locale}
        onToggleLanguage={toggleLanguage}
        planKey={planKey}
        operatingStatus={operatingStatus}
        onClickSchedule={() => setActiveTab("settings")}
        onLogout={handleLogout}
      />

      {notification && (
        <div
          data-testid="dashboard-notification-toast"
          className={cn(
            "fixed bottom-6 start-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200",
            notification.type === "success" ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "bg-rose-600 text-white"
          )}
        >
          {notification.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <DashboardQuotaCards
          quotaUsage={quotaUsage}
          planKey={planKey}
          locale={locale}
          onUpgradeClick={() => {
            setQuotaModalType("category");
            setIsQuotaModalOpen(true);
          }}
        />

        {activeTab === "items" && (
          <ItemsTab
            categories={store.categories}
            locale={locale}
            storeSlug={store.restaurant.slug}
            onToggleStock={toggleItemAvailability}
            onSaveItem={saveItem}
            onDeleteItem={deleteItem}
            onBeforeAdd={checkCanAddProduct}
          />
        )}
        {activeTab === "categories" && (
          <CategoriesTab
            categories={store.categories}
            locale={locale}
            onSaveCategory={saveCategory}
            onDeleteCategory={deleteCategory}
            onBeforeAdd={checkCanAddCategory}
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
          <QRTab restaurant={store.restaurant} locale={locale} printBasePath="/dashboard" />
        )}
      </main>

      <QuotaUpgradeModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        type={quotaModalType}
        currentCount={quotaModalType === "category" ? quotaUsage.categoriesCount : quotaUsage.productsCount}
        maxCount={quotaModalType === "category" ? quotaUsage.maxCategories : quotaUsage.maxProducts}
        storeName={storeName}
        storeSlug={slug}
        locale={locale}
      />
    </div>
  );
};
