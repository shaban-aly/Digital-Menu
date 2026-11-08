"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { CartItem, CartState, OrderType, CartContextValue } from "@/features/cart/types";
import { MenuItem } from "@/features/menu/types";

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: React.ReactNode;
  storeSlug?: string;
  supportedOrderTypes?: OrderType[];
  deliveryFee?: number;
}

export const CartProvider: React.FC<CartProviderProps> = ({
  children,
  storeSlug = "oriental-grill",
  supportedOrderTypes = ["dine_in", "takeaway", "delivery"],
  deliveryFee = 20,
}) => {
  const storageKey = `cart_${storeSlug}`;
  const initialDefaultType = supportedOrderTypes.includes("dine_in")
    ? "dine_in"
    : supportedOrderTypes[0] || "takeaway";

  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>(initialDefaultType);
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [generalNote, setGeneralNote] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const p: CartState = JSON.parse(saved);
        if (p.items?.length) setItems(p.items);
        if (p.orderType && supportedOrderTypes.includes(p.orderType)) setOrderType(p.orderType);
        if (p.tableNumber) setTableNumber(p.tableNumber);
        if (p.customerName) setCustomerName(p.customerName);
        if (p.customerPhone) setCustomerPhone(p.customerPhone);
        if (p.deliveryAddress) setDeliveryAddress(p.deliveryAddress);
        if (p.generalNote) setGeneralNote(p.generalNote);
      }
      if (typeof window !== "undefined") {
        const urlTable = new URLSearchParams(window.location.search).get("table");
        if (urlTable && supportedOrderTypes.includes("dine_in")) {
          setTableNumber(urlTable);
          setOrderType("dine_in");
        }
      }
    } catch (e) {
      console.warn("Failed reading cart", e);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey, supportedOrderTypes]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave: CartState = {
        storeSlug,
        items,
        orderType,
        tableNumber,
        customerName,
        customerPhone,
        deliveryAddress,
        generalNote,
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Failed writing cart", e);
    }
  }, [items, orderType, tableNumber, customerName, customerPhone, deliveryAddress, generalNote, isHydrated, storageKey, storeSlug]);

  const addItem = (item: MenuItem, qty = 1) => {
    if (!item.is_available) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.menuItemId === item.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: Math.min(99, copy[idx].quantity + qty) };
        return copy;
      }
      return [...prev, {
        id: item.id,
        menuItemId: item.id,
        name_ar: item.name_ar,
        name_en: item.name_en,
        price: item.price,
        unit_ar: item.unit_ar,
        unit_en: item.unit_en,
        quantity: Math.min(99, Math.max(1, qty)),
        itemNote: "",
        image_url: item.image_url,
        is_available: item.is_available,
      }];
    });
  };

  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id && i.menuItemId !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeItem(id);
    setItems((p) => p.map((i) => (i.id === id || i.menuItemId === id ? { ...i, quantity: Math.min(99, qty) } : i)));
  };
  const updateItemNote = (id: string, note: string) => {
    setItems((p) => p.map((i) => (i.id === id || i.menuItemId === id ? { ...i, itemNote: note.slice(0, 150) } : i)));
  };
  const clearCart = () => {
    setItems([]);
    setGeneralNote("");
    try { localStorage.removeItem(storageKey); } catch {}
  };
  const getItemQuantity = (id: string) => items.find((i) => i.id === id || i.menuItemId === id)?.quantity || 0;

  const totalCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const itemsTotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => (orderType === "delivery" ? itemsTotal + deliveryFee : itemsTotal),
    [itemsTotal, orderType, deliveryFee]
  );

  return (
    <CartContext.Provider
      value={{
        storeSlug,
        supportedOrderTypes,
        deliveryFee,
        items,
        orderType,
        tableNumber,
        customerName,
        customerPhone,
        deliveryAddress,
        generalNote,
        totalCount,
        itemsTotal,
        totalPrice,
        isHydrated,
        addItem,
        removeItem,
        updateQuantity,
        updateItemNote,
        setOrderType,
        setTableNumber,
        setCustomerName,
        setCustomerPhone,
        setDeliveryAddress,
        setGeneralNote,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
