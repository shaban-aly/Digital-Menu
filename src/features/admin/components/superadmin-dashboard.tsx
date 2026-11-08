"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Globe, CheckCircle2 } from "lucide-react";
import { SuperAdminService } from "../services/superadmin-service";
import {
  SuperAdminStoreSummary,
  PlatformKPIs,
  SuperAdminPlanKey,
} from "../types";
import { SuperAdminKPIs } from "./superadmin-kpis";
import { StoresTable } from "./stores-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/features/menu/hooks/use-language";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

export const SuperAdminDashboard: React.FC = () => {
  const { locale, toggleLanguage } = useLanguage();
  const t =
    locale === "ar" ? arTranslations.superadmin : enTranslations.superadmin;

  const [stats, setStats] = useState<PlatformKPIs | null>(null);
  const [stores, setStores] = useState<SuperAdminStoreSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [fetchedStats, fetchedStores] = await Promise.all([
        SuperAdminService.getPlatformStats(),
        SuperAdminService.listAllStores(),
      ]);
      setStats(fetchedStats);
      setStores(fetchedStores);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handlePlanChange = async (slug: string, plan: SuperAdminPlanKey) => {
    await SuperAdminService.updateStorePlan(slug, plan);
    await loadData();
    showFeedback(
      locale === "ar"
        ? `تم تحديث خطة المتجر (${slug}) بنجاح`
        : `Updated plan for (${slug}) successfully`
    );
  };

  const handleToggleStatus = async (
    slug: string,
    currentStatus: boolean
  ) => {
    await SuperAdminService.toggleStoreStatus(slug, !currentStatus);
    await loadData();
    showFeedback(
      locale === "ar"
        ? `تم تغيير حالة المتجر (${slug}) إلى ${!currentStatus ? "نشط" : "معلق"}`
        : `Store (${slug}) set to ${!currentStatus ? "active" : "suspended"}`
    );
  };

  const filteredStores = SuperAdminService.filterStores(stores, searchQuery);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {t.title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                  Root
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <Globe className="w-4 h-4 text-neutral-500" />
            <span>{locale === "ar" ? "English" : "العربية"}</span>
          </button>
        </header>

        {feedbackMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {isLoading || !stats ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : (
          <>
            <SuperAdminKPIs stats={stats} />
            <StoresTable
              stores={filteredStores}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onPlanChange={handlePlanChange}
              onToggleStatus={handleToggleStatus}
            />
          </>
        )}
      </div>
    </div>
  );
};
