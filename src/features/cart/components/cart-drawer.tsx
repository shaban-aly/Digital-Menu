"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../hooks/use-cart";
import { CartDrawerItems } from "./cart-drawer-items";
import { OrderTypeSelector, OrderValidationErrors } from "./order-type-selector";
import { CartDrawerHeader } from "./cart-drawer-header";
import { CartDrawerEmpty } from "./cart-drawer-empty";
import { CartDrawerFooter } from "./cart-drawer-footer";
import { buildWhatsAppOrderUrl } from "../services/whatsapp-service";
import { Locale } from "@/types";

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
    customerName,
    customerPhone,
    deliveryAddress,
    generalNote,
    totalCount,
    itemsTotal,
    totalPrice,
    supportedOrderTypes,
    deliveryFee,
    updateQuantity,
    removeItem,
    updateItemNote,
    setOrderType,
    setCustomerName,
    setCustomerPhone,
    setDeliveryAddress,
    setGeneralNote,
    clearCart,
  } = useCart();

  const [errors, setErrors] = useState<OrderValidationErrors>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitWhatsApp = () => {
    const errs: OrderValidationErrors = {};
    if (orderType === "takeaway" || orderType === "delivery") {
      if (!customerName.trim()) errs.name = true;
      if (!customerPhone.trim()) errs.phone = true;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) errs.address = true;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const url = buildWhatsAppOrderUrl({
      restaurantName,
      restaurantPhone,
      orderType,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: orderType === "delivery" ? deliveryAddress.trim() : "",
      generalNote: generalNote.trim(),
      items,
      itemsTotal,
      deliveryFee: orderType === "delivery" ? deliveryFee : 0,
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
              <CartDrawerItems
                items={items}
                generalNote={generalNote}
                onGeneralNoteChange={setGeneralNote}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                onUpdateNote={updateItemNote}
                locale={locale}
              />

              <OrderTypeSelector
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                supportedOrderTypes={supportedOrderTypes}
                customerName={customerName}
                onCustomerNameChange={(val) => { setCustomerName(val); if (val.trim()) setErrors((p) => ({ ...p, name: false })); }}
                customerPhone={customerPhone}
                onCustomerPhoneChange={(val) => { setCustomerPhone(val); if (val.trim()) setErrors((p) => ({ ...p, phone: false })); }}
                deliveryAddress={deliveryAddress}
                onDeliveryAddressChange={(val) => { setDeliveryAddress(val); if (val.trim()) setErrors((p) => ({ ...p, address: false })); }}
                deliveryFee={deliveryFee}
                errors={errors}
                locale={locale}
              />
            </>
          )}
        </div>

        {items.length > 0 && (
          <CartDrawerFooter
            itemsTotal={itemsTotal}
            deliveryFee={deliveryFee}
            orderType={orderType}
            totalPrice={totalPrice}
            locale={locale}
            onSubmitWhatsApp={handleSubmitWhatsApp}
          />
        )}
      </div>
    </div>
  );
};
