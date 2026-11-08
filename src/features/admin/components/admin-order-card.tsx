"use client";

import React, { useState } from "react";
import { OrderRecord, OrderStatus } from "@/features/orders/types";
import { Locale } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Phone, MapPin, CheckCircle, Clock } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface AdminOrderCardProps {
  order: OrderRecord;
  locale: Locale;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onCancelOrder: (order: OrderRecord) => void;
}

export const AdminOrderCard: React.FC<AdminOrderCardProps> = ({
  order,
  locale,
  onUpdateStatus,
  onCancelOrder,
}) => {
  const t = locale === "ar" ? arTranslations.admin.orders : enTranslations.admin.orders;
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors: Record<OrderStatus, string> = {
    pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200",
    preparing: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200",
    out_for_delivery: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200",
    ready: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200",
    completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200",
  };

  const statusLabels: Record<OrderStatus, string> = {
    pending: t.filterPending,
    preparing: t.filterPreparing,
    out_for_delivery: t.filterOutForDelivery,
    ready: t.filterReady,
    completed: t.filterCompleted,
    cancelled: t.filterCancelled,
  };

  return (
    <div
      data-testid={`admin-order-card-${order.id}`}
      className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3"
    >
      {/* Header: Reference, Customer, Status, Price */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
            {order.reference}
          </span>
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              {order.customerName}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <a href={`tel:${order.customerPhone}`} className="hover:underline">
                  {order.customerPhone}
                </a>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(order.createdAt).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Status selector & Price */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <select
            data-testid={`order-status-select-${order.id}`}
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer",
              statusColors[order.status]
            )}
          >
            {(["pending", "preparing", "out_for_delivery", "ready", "completed", "cancelled"] as OrderStatus[]).map(
              (s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              )
            )}
          </select>

          <span className="text-xs font-black text-brand-600 dark:text-brand-400">
            {formatCurrency(order.totalPrice, locale)}
          </span>
        </div>
      </div>

      {/* Details expander */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        <span>
          {order.items.length} {locale === "ar" ? "أصناف" : "items"}
        </span>
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isExpanded && (
        <div className="space-y-2 pt-1 text-xs border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in duration-150">
          {order.deliveryAddress && (
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{order.deliveryAddress}</span>
            </div>
          )}

          <div className="space-y-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between text-[11px]">
                <span>
                  {it.quantity}x {locale === "ar" ? it.name_ar : it.name_en}
                  {it.itemNote && <span className="text-neutral-400 ms-1">({it.itemNote})</span>}
                </span>
                <span className="font-medium text-neutral-600 dark:text-neutral-300">
                  {formatCurrency(it.price * it.quantity, locale)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
