"use client";

import React from "react";
import Link from "next/link";
import { useOrderTracking } from "../hooks/use-order-tracking";
import { useLanguage } from "@/features/menu/hooks/use-language";
import { OrderStatusStepper } from "./order-status-stepper";
import { OrderSummaryCard } from "./order-summary-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowLeft, ArrowRight, UtensilsCrossed } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface OrderTrackingViewProps {
  orderId: string;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ orderId }) => {
  const { locale } = useLanguage();
  const t = locale === "ar" ? arTranslations.tracking : enTranslations.tracking;
  const { order, isLoading, error } = useOrderTracking(orderId);

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto p-4 space-y-4 pt-10">
        <Skeleton className="h-16 w-full rounded-3xl" />
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 text-center space-y-3">
        <EmptyState message={t.notFoundTitle} />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-xs hover:bg-brand-700 transition-colors"
        >
          <span>{t.backToMenu}</span>
        </Link>
      </div>
    );
  }

  const storeName = locale === "ar" ? order.storeName_ar : order.storeName_en;
  const BackIcon = locale === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
      {/* Top Bar */}
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href={`/menu/${order.storeSlug}`}
            className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <BackIcon className="w-4 h-4" />
            <span>{t.backToMenu}</span>
          </Link>

          <div className="text-center">
            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
              {storeName}
            </span>
            <h1 className="text-sm font-black text-neutral-900 dark:text-neutral-100">
              {order.reference}
            </h1>
          </div>

          <div className="w-12 flex justify-end">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4 pt-5">
        {/* Visual Stepper */}
        <OrderStatusStepper
          status={order.status}
          orderType={order.orderType}
          locale={locale}
        />

        {/* Itemized Order Breakdown */}
        <OrderSummaryCard order={order} locale={locale} />
      </main>
    </div>
  );
};
