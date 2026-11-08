"use client";

import React from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { useCustomerOrders } from "../hooks/use-customer-orders";
import { Locale } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({
  isOpen,
  onClose,
  locale,
}) => {
  const t = locale === "ar" ? arTranslations.tracking : enTranslations.tracking;
  const { orders, isLoading } = useCustomerOrders();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.myOrders}>
      <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-neutral-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            {t.emptyHistory}
          </div>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              onClick={onClose}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                    {order.reference}
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
                    {locale === "ar" ? order.storeName_ar : order.storeName_en}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })} • {order.items.length} {locale === "ar" ? "أصناف" : "items"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(order.totalPrice, locale)}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </Link>
          ))
        )}
      </div>
    </Modal>
  );
};
