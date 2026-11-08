"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { SuperAdminStoreSummary, SuperAdminPlanKey } from "../types";
import { useLanguage } from "@/features/menu/hooks/use-language";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface StoresTableProps {
  stores: SuperAdminStoreSummary[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPlanChange: (slug: string, plan: SuperAdminPlanKey) => void;
  onToggleStatus: (slug: string, currentStatus: boolean) => void;
}

export const StoresTable: React.FC<StoresTableProps> = ({
  stores,
  searchQuery,
  onSearchChange,
  onPlanChange,
  onToggleStatus,
}) => {
  const { locale } = useLanguage();
  const t =
    locale === "ar" ? arTranslations.superadmin : enTranslations.superadmin;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchStores}
          className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <table className="w-full text-sm text-start">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 text-xs border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="py-3 px-4 text-start font-medium">Store</th>
              <th className="py-3 px-4 text-start font-medium">{t.status}</th>
              <th className="py-3 px-4 text-start font-medium">
                {t.changePlan}
              </th>
              <th className="py-3 px-4 text-end font-medium">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {stores.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-400">
                  No matching stores found
                </td>
              </tr>
            ) : (
              stores.map((s) => (
                <tr
                  key={s.slug}
                  className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                >
                  <td className="py-3 px-4 text-start">
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {locale === "ar" ? s.name_ar : s.name_en}
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono">/{s.slug}</span>
                      <span>•</span>
                      <span>{s.productsCount} items</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-start">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(s.slug, s.is_active)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        s.is_active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100"
                      }`}
                    >
                      {s.is_active ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{s.is_active ? t.active : t.suspended}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-start">
                    <select
                      value={s.plan}
                      onChange={(e) =>
                        onPlanChange(
                          s.slug,
                          e.target.value as SuperAdminPlanKey
                        )
                      }
                      className="text-xs font-medium py-1.5 ps-2.5 pe-6 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="free">Free Starter</option>
                      <option value="pro_monthly">Pro (Monthly)</option>
                      <option value="pro_yearly">Pro (Yearly)</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/menu/${s.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Menu</span>
                      </Link>
                      <Link
                        href={`/dashboard/${s.slug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
