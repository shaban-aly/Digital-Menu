"use client";

import React from "react";
import { Utensils, ShoppingBag } from "lucide-react";
import { OrderType } from "../types";
import { Locale } from "@/types";
import { cn } from "@/lib/utils";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface OrderTypeSelectorProps {
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  tableNumber: string;
  onTableNumberChange: (table: string) => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  hasTableError?: boolean;
  locale: Locale;
}

export const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  orderType,
  onOrderTypeChange,
  tableNumber,
  onTableNumberChange,
  customerName,
  onCustomerNameChange,
  hasTableError = false,
  locale,
}) => {
  const t = locale === "ar" ? arTranslations : enTranslations;

  return (
    <div className="space-y-3 p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
        {t.cart.orderType}
      </label>

      {/* Segmented Control */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-800">
        <button
          type="button"
          data-testid="order-type-dine-in"
          onClick={() => onOrderTypeChange("dine_in")}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all min-h-[44px]",
            orderType === "dine_in"
              ? "bg-white dark:bg-neutral-700 text-brand-700 dark:text-brand-300 shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
          )}
        >
          <Utensils className="w-4 h-4" />
          <span>{t.cart.dineIn}</span>
        </button>

        <button
          type="button"
          data-testid="order-type-takeaway"
          onClick={() => onOrderTypeChange("takeaway")}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all min-h-[44px]",
            orderType === "takeaway"
              ? "bg-white dark:bg-neutral-700 text-brand-700 dark:text-brand-300 shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
          )}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.cart.takeaway}</span>
        </button>
      </div>

      {/* Conditional Table Number for Dine-in */}
      {orderType === "dine_in" && (
        <div className="space-y-1.5 animate-in fade-in duration-200">
          <label
            htmlFor="table-number-input"
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            {t.cart.tableNumber} <span className="text-rose-500">*</span>
          </label>
          <input
            id="table-number-input"
            data-testid="table-number-input"
            type="text"
            value={tableNumber}
            onChange={(e) => onTableNumberChange(e.target.value)}
            placeholder={t.cart.tablePlaceholder}
            maxLength={10}
            className={cn(
              "w-full text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2",
              hasTableError
                ? "border-rose-500 focus:ring-rose-500 bg-rose-50/30"
                : "border-neutral-200 dark:border-neutral-700 focus:ring-brand-500"
            )}
          />
          {hasTableError && (
            <p
              data-testid="table-number-error"
              className="text-xs font-medium text-rose-600 dark:text-rose-400"
            >
              {t.cart.tableRequired}
            </p>
          )}
        </div>
      )}

      {/* Customer Name (Optional) */}
      <div className="space-y-1.5">
        <label
          htmlFor="customer-name-input"
          className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
        >
          {t.cart.customerName}
        </label>
        <input
          id="customer-name-input"
          data-testid="customer-name-input"
          type="text"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          placeholder={t.cart.namePlaceholder}
          maxLength={50}
          className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
    </div>
  );
};
