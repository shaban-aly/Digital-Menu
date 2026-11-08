"use client";

import React from "react";
import { OrderRecord } from "../types";
import { Locale } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Truck, Utensils, MessageSquare } from "lucide-react";
import { buildWhatsAppOrderUrl } from "@/features/cart/services/whatsapp-service";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface OrderSummaryCardProps {
  order: OrderRecord;
  locale: Locale;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order, locale }) => {
  const tTracking = locale === "ar" ? arTranslations.tracking : enTranslations.tracking;
  const tCart = locale === "ar" ? arTranslations.cart : enTranslations.cart;

  const orderTypeIcon =
    order.orderType === "dine_in" ? (
      <Utensils className="w-4 h-4 text-brand-600" />
    ) : order.orderType === "delivery" ? (
      <Truck className="w-4 h-4 text-brand-600" />
    ) : (
      <ShoppingBag className="w-4 h-4 text-brand-600" />
    );

  const orderTypeLabel =
    order.orderType === "dine_in"
      ? tCart.dineIn
      : order.orderType === "delivery"
      ? tCart.delivery
      : tCart.takeaway;

  const handleOpenWhatsApp = () => {
    const url = buildWhatsAppOrderUrl({
      restaurantName: locale === "ar" ? order.storeName_ar : order.storeName_en,
      restaurantPhone: order.storePhone,
      orderReference: order.reference,
      orderType: order.orderType,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      generalNote: order.generalNote,
      items: order.items.map((it) => ({
        ...it,
        is_available: true,
      })),
      itemsTotal: order.itemsTotal,
      deliveryFee: order.deliveryFee,
      totalPrice: order.totalPrice,
      locale,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
      {/* Fulfillment & Customer Info */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
          {orderTypeIcon}
          <span>{orderTypeLabel}</span>
        </div>
        <span className="text-xs text-neutral-500 font-medium">
          {order.customerName} • {order.customerPhone}
        </span>
      </div>

      {order.orderType === "delivery" && order.deliveryAddress && (
        <div className="text-xs text-neutral-600 dark:text-neutral-300 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60">
          <span className="font-bold">{tCart.deliveryAddress}:</span> {order.deliveryAddress}
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2.5">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start justify-between text-xs gap-3">
            <div className="min-w-0 flex-1">
              <span className="font-bold text-neutral-900 dark:text-neutral-100">
                {item.quantity}x {locale === "ar" ? item.name_ar : item.name_en}
              </span>
              {item.itemNote && (
                <p className="text-[11px] text-brand-600 dark:text-brand-400 mt-0.5">
                  &quot;{item.itemNote}&quot;
                </p>
              )}
            </div>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
              {formatCurrency(item.price * item.quantity, locale)}
            </span>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5 text-xs">
        <div className="flex justify-between text-neutral-500">
          <span>{tCart.subtotal}</span>
          <span>{formatCurrency(order.itemsTotal, locale)}</span>
        </div>
        {order.deliveryFee > 0 && (
          <div className="flex justify-between text-neutral-500">
            <span>{tCart.deliveryFee}</span>
            <span>{formatCurrency(order.deliveryFee, locale)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-black text-neutral-900 dark:text-neutral-100 pt-1.5 border-t border-neutral-100 dark:border-neutral-800">
          <span>{tCart.total}</span>
          <span className="text-brand-600 dark:text-brand-400">{formatCurrency(order.totalPrice, locale)}</span>
        </div>
      </div>

      {/* Action Button: Re-open WhatsApp */}
      <button
        type="button"
        data-testid="reopen-whatsapp-btn"
        onClick={handleOpenWhatsApp}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors min-h-[44px]"
      >
        <MessageSquare className="w-4 h-4" />
        <span>{tTracking.reopenWhatsApp}</span>
      </button>
    </div>
  );
};
