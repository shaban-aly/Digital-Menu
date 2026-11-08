"use client";

import React from "react";
import { Utensils, ShoppingBag, Truck } from "lucide-react";
import { OrderType } from "../types";
import { Locale } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

export interface OrderValidationErrors {
  table?: boolean;
  name?: boolean;
  phone?: boolean;
  address?: boolean;
}

interface OrderTypeSelectorProps {
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  supportedOrderTypes?: OrderType[];
  tableNumber: string;
  onTableNumberChange: (table: string) => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  customerPhone: string;
  onCustomerPhoneChange: (phone: string) => void;
  deliveryAddress: string;
  onDeliveryAddressChange: (address: string) => void;
  deliveryFee?: number;
  errors?: OrderValidationErrors;
  locale: Locale;
}

export const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  orderType,
  onOrderTypeChange,
  supportedOrderTypes = ["dine_in", "takeaway", "delivery"],
  tableNumber,
  onTableNumberChange,
  customerName,
  onCustomerNameChange,
  customerPhone,
  onCustomerPhoneChange,
  deliveryAddress,
  onDeliveryAddressChange,
  deliveryFee = 0,
  errors = {},
  locale,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;
  const allTabs: { type: OrderType; label: string; icon: React.ReactNode }[] = [
    { type: "dine_in", label: t.cart.dineIn, icon: <Utensils className="w-4 h-4" /> },
    { type: "takeaway", label: t.cart.takeaway, icon: <ShoppingBag className="w-4 h-4" /> },
    { type: "delivery", label: t.cart.delivery, icon: <Truck className="w-4 h-4" /> },
  ];
  const tabs = allTabs.filter((tab) => supportedOrderTypes.includes(tab.type));

  const inputCls = (hasErr?: boolean) =>
    cn(
      "w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2",
      hasErr ? "border-rose-500 focus:ring-rose-500" : "border-neutral-200 dark:border-neutral-700 focus:ring-brand-500"
    );

  return (
    <div className="space-y-3 p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{t.cart.orderType}</label>
        {orderType === "delivery" && deliveryFee > 0 && (
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
            {t.cart.deliveryFee}: {formatCurrency(deliveryFee, locale)}
          </span>
        )}
      </div>

      <div className={cn("grid gap-1.5 p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-800", tabs.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
        {tabs.map((tab) => (
          <button
            key={tab.type}
            type="button"
            data-testid={`order-type-${tab.type}`}
            onClick={() => onOrderTypeChange(tab.type)}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all min-h-[44px]",
              orderType === tab.type ? "bg-white dark:bg-neutral-700 text-brand-700 dark:text-brand-300 shadow-xs" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            )}
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {orderType === "dine_in" && (
        <div className="space-y-1 animate-in fade-in duration-200">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.cart.tableNumber} *</label>
          <input data-testid="table-number-input" type="text" value={tableNumber} onChange={(e) => onTableNumberChange(e.target.value)} placeholder={t.cart.tablePlaceholder} maxLength={10} className={inputCls(errors.table)} />
          {errors.table && <p data-testid="table-number-error" className="text-[11px] font-medium text-rose-600">{t.cart.tableRequired}</p>}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          {orderType === "dine_in" ? t.cart.customerNameOptional : `${t.cart.customerName} *`}
        </label>
        <input data-testid="customer-name-input" type="text" value={customerName} onChange={(e) => onCustomerNameChange(e.target.value)} placeholder={t.cart.namePlaceholder} maxLength={50} className={inputCls(errors.name)} />
        {errors.name && <p data-testid="customer-name-error" className="text-[11px] font-medium text-rose-600">{t.cart.nameRequired}</p>}
      </div>

      {orderType !== "dine_in" && (
        <div className="space-y-1 animate-in fade-in duration-200">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.cart.customerPhone} *</label>
          <input data-testid="customer-phone-input" type="tel" value={customerPhone} onChange={(e) => onCustomerPhoneChange(e.target.value)} placeholder={t.cart.phonePlaceholder} maxLength={20} className={inputCls(errors.phone)} />
          {errors.phone && <p data-testid="customer-phone-error" className="text-[11px] font-medium text-rose-600">{t.cart.phoneRequired}</p>}
        </div>
      )}

      {orderType === "delivery" && (
        <div className="space-y-1 animate-in fade-in duration-200">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{t.cart.deliveryAddress} *</label>
          <textarea data-testid="delivery-address-input" value={deliveryAddress} onChange={(e) => onDeliveryAddressChange(e.target.value)} placeholder={t.cart.addressPlaceholder} maxLength={300} rows={2} className={cn(inputCls(errors.address), "resize-none")} />
          {errors.address && <p data-testid="delivery-address-error" className="text-[11px] font-medium text-rose-600">{t.cart.addressRequired}</p>}
        </div>
      )}
    </div>
  );
};
