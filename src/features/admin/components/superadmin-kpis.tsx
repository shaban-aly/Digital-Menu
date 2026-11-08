"use client";

import React from "react";
import {
  Store,
  CheckCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  Package,
  Banknote,
} from "lucide-react";
import { PlatformKPIs } from "../types";
import { useLanguage } from "@/features/menu/hooks/use-language";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface SuperAdminKPIsProps {
  stats: PlatformKPIs;
}

export const SuperAdminKPIs: React.FC<SuperAdminKPIsProps> = ({ stats }) => {
  const { locale } = useLanguage();
  const t =
    locale === "ar" ? arTranslations.superadmin : enTranslations.superadmin;

  const cards = [
    {
      id: "total",
      label: t.totalStores,
      value: stats.totalStores,
      icon: <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900",
    },
    {
      id: "active",
      label: t.activeStores,
      value: stats.activeStores,
      icon: (
        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      ),
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900",
    },
    {
      id: "revenue",
      label: t.monthlyRevenue,
      value: `${(stats.monthlyRevenue ?? 0).toLocaleString()} ${
        locale === "ar" ? "ج.م" : "EGP"
      }`,
      icon: (
        <Banknote className="w-5 h-5 text-teal-600 dark:text-teal-400" />
      ),
      bg: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900",
    },
    {
      id: "free",
      label: t.freeStores,
      value: stats.planBreakdown.free,
      icon: (
        <Sparkles className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      ),
      bg: "bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800",
    },
    {
      id: "pro",
      label: t.proStores,
      value: stats.planBreakdown.pro,
      icon: <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900",
    },
    {
      id: "enterprise",
      label: t.enterpriseStores,
      value: stats.planBreakdown.enterprise,
      icon: (
        <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      ),
      bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900",
    },
    {
      id: "products",
      label: t.totalProducts,
      value: stats.totalProducts,
      icon: (
        <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      ),
      bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {cards.map((c) => (
        <div
          key={c.id}
          className={`p-4 rounded-2xl border transition-all ${c.bg} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-white/80 dark:bg-neutral-800/80 shadow-xs">
              {c.icon}
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              {c.value}
            </div>
            <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 truncate mt-1">
              {c.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
