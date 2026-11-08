"use client";

import React from "react";
import { OrderStatus } from "../types";
import { Locale } from "@/types";
import { Check, Clock, ChefHat, Truck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface OrderStatusStepperProps {
  status: OrderStatus;
  orderType: "dine_in" | "takeaway" | "delivery";
  locale: Locale;
}

export const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({
  status,
  orderType,
  locale,
}) => {
  const t = locale === "ar" ? arTranslations.tracking.stepper : enTranslations.tracking.stepper;

  if (status === "cancelled") {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-bold text-xs text-rose-700 dark:text-rose-300">{t.cancelled}</h4>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">{t.cancelledDesc}</p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: "pending", label: t.received, desc: t.receivedDesc, icon: Clock },
    { key: "preparing", label: t.preparing, desc: t.preparingDesc, icon: ChefHat },
    {
      key: orderType === "delivery" ? "out_for_delivery" : "ready",
      label: orderType === "delivery" ? t.outForDelivery : t.ready,
      desc: orderType === "delivery" ? t.outForDeliveryDesc : t.readyDesc,
      icon: Truck,
    },
    { key: "completed", label: t.completed, desc: t.completedDesc, icon: Check },
  ];

  const statusOrder: Record<OrderStatus, number> = {
    pending: 0,
    preparing: 1,
    out_for_delivery: 2,
    ready: 2,
    completed: 3,
    cancelled: -1,
  };

  const currentIdx = statusOrder[status] ?? 0;

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute top-1/2 start-4 end-4 -translate-y-1/2 h-1 bg-neutral-200 dark:bg-neutral-800 -z-0" />
        <div
          className="absolute top-1/2 start-4 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-500 -z-0"
          style={{ width: `${(currentIdx / (steps.length - 1)) * 90}%` }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  isDone
                    ? "bg-brand-600 text-white shadow-xs"
                    : isCurrent
                    ? "bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950/80 animate-pulse"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
                )}
              >
                {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold mt-2 text-center max-w-[65px] truncate",
                  isCurrent
                    ? "text-brand-600 dark:text-brand-400"
                    : isDone
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {steps[currentIdx]?.desc}
        </p>
      </div>
    </div>
  );
};
