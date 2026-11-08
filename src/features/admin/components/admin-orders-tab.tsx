"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { OrderRecord, OrderStatus } from "@/features/orders/types";
import { Locale } from "@/types";
import { OrderRepository, ORDER_UPDATED_EVENT } from "@/features/orders/services/order-repository";
import { AdminOrderCard } from "./admin-order-card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface AdminOrdersTabProps {
  slug: string;
  locale: Locale;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ slug, locale }) => {
  const t = locale === "ar" ? arTranslations.admin.orders : enTranslations.admin.orders;
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderToCancel, setOrderToCancel] = useState<OrderRecord | null>(null);

  const loadOrders = useCallback(async () => {
    const list = await OrderRepository.getOrdersByStore(slug);
    setOrders(list);
  }, [slug]);

  useEffect(() => {
    loadOrders();

    const handleUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ storeSlug: string }>;
      if (!ce.detail || ce.detail.storeSlug === slug) loadOrders();
    };

    window.addEventListener(ORDER_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", loadOrders);
    return () => {
      window.removeEventListener(ORDER_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", loadOrders);
    };
  }, [loadOrders, slug]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await OrderRepository.updateOrderStatus(orderId, status);
    await loadOrders();
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.reference.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const filterTabs: { id: OrderStatus | "all"; label: string }[] = [
    { id: "all", label: t.filterAll },
    { id: "pending", label: t.filterPending },
    { id: "preparing", label: t.filterPreparing },
    { id: "out_for_delivery", label: t.filterOutForDelivery },
    { id: "completed", label: t.filterCompleted },
    { id: "cancelled", label: t.filterCancelled },
  ];

  return (
    <div className="space-y-4">
      {/* Header controls: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            data-testid="admin-order-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "ar" ? "ابحث برقم الطلب أو اسم أو هاتف العميل..." : "Search by order ref, name, or phone..."}
            className="w-full text-xs ps-9 pe-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-testid={`order-filter-${tab.id}`}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                statusFilter === tab.id
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:text-neutral-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              locale={locale}
              onUpdateStatus={handleUpdateStatus}
              onCancelOrder={(ord) => setOrderToCancel(ord)}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
            <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              {t.noOrders}
            </h4>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(orderToCancel)}
        title={t.cancelOrder}
        message={t.confirmCancel}
        confirmLabel={t.cancelOrder}
        cancelLabel={locale === "ar" ? "تراجع" : "Cancel"}
        variant="danger"
        onConfirm={async () => {
          if (orderToCancel) {
            await handleUpdateStatus(orderToCancel.id, "cancelled");
            setOrderToCancel(null);
          }
        }}
        onCancel={() => setOrderToCancel(null)}
      />
    </div>
  );
};
