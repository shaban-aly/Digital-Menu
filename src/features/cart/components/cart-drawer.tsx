"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useCart } from "../hooks/use-cart";
import { CartItemRow } from "./cart-item-row";
import { OrderTypeSelector } from "./order-type-selector";
import { CartDrawerHeader } from "./cart-drawer-header";
import { CartDrawerEmpty } from "./cart-drawer-empty";
import { CartDrawerFooter } from "./cart-drawer-footer";
import { buildWhatsAppOrderUrl } from "../services/whatsapp-service";
import { Locale } from "@/types";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantPhone: string;
  locale: Locale;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  restaurantName,
  restaurantPhone,
  locale,
}) => {
  const {
    items,
    orderType,
    tableNumber,
    customerName,
    generalNote,
    totalCount,
    totalPrice,
    updateQuantity,
    removeItem,
    updateItemNote,
    setOrderType,
    setTableNumber,
    setCustomerName,
    setGeneralNote,
    clearCart,
  } = useCart();

  const [hasTableError, setHasTableError] = useState(false);
  const t = locale === "ar" ? arTranslations : enTranslations;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitWhatsApp = () => {
    if (orderType === "dine_in" && !tableNumber.trim()) {
      setHasTableError(true);
      return;
    }
    setHasTableError(false);

    const url = buildWhatsAppOrderUrl({
      restaurantName,
      restaurantPhone,
      orderType,
      tableNumber: orderType === "dine_in" ? tableNumber.trim() : "",
      customerName: customerName.trim(),
      generalNote: generalNote.trim(),
      items,
      totalPrice,
      locale,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        data-testid="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="relative z-10 w-full max-w-lg mx-auto bg-white dark:bg-neutral-900 rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl border-t border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-bottom duration-300"
      >
        <CartDrawerHeader
          totalCount={totalCount}
          hasItems={items.length > 0}
          onClearCart={clearCart}
          onClose={onClose}
          locale={locale}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <CartDrawerEmpty locale={locale} onClose={onClose} />
          ) : (
            <>
              {items.some((i) => !i.is_available) && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{t.cart.itemUnavailableWarning}</span>
                </div>
              )}

              <div className="space-y-2.5">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    locale={locale}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    onUpdateNote={updateItemNote}
                  />
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.cart.generalNotes}
                </label>
                <textarea
                  data-testid="general-notes-input"
                  value={generalNote}
                  onChange={(e) => setGeneralNote(e.target.value)}
                  placeholder={t.cart.generalNotesPlaceholder}
                  maxLength={200}
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <OrderTypeSelector
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                tableNumber={tableNumber}
                onTableNumberChange={(val) => {
                  setTableNumber(val);
                  if (val.trim()) setHasTableError(false);
                }}
                customerName={customerName}
                onCustomerNameChange={setCustomerName}
                hasTableError={hasTableError}
                locale={locale}
              />
            </>
          )}
        </div>

        {items.length > 0 && (
          <CartDrawerFooter
            totalPrice={totalPrice}
            locale={locale}
            onSubmitWhatsApp={handleSubmitWhatsApp}
          />
        )}
      </div>
    </div>
  );
};
