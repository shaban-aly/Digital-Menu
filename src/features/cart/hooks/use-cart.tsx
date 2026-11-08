"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { CartItem, CartState, OrderType, CartContextValue } from "@/features/cart/types";
import { MenuItem } from "@/features/menu/types";

const CART_STORAGE_KEY = "digital_menu_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("dine_in");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [generalNote, setGeneralNote] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Initial load from localStorage and URL ?table= query parameter
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed: CartState = JSON.parse(saved);
        if (parsed.items && Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.orderType) setOrderType(parsed.orderType);
        if (parsed.tableNumber) setTableNumber(parsed.tableNumber);
        if (parsed.customerName) setCustomerName(parsed.customerName);
        if (parsed.generalNote) setGeneralNote(parsed.generalNote);
      }

      // Check ?table= query param in URL
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlTable = params.get("table");
        if (urlTable) {
          setTableNumber(urlTable);
          setOrderType("dine_in");
        }
      }
    } catch (e) {
      console.warn("Failed reading cart from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist state to localStorage on every change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave: CartState = {
        items,
        orderType,
        tableNumber,
        customerName,
        generalNote,
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Failed writing cart to localStorage", e);
    }
  }, [items, orderType, tableNumber, customerName, generalNote, isHydrated]);

  const addItem = (menuItem: MenuItem, quantityToAdd = 1) => {
    if (!menuItem.is_available) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItemId === menuItem.id);
      if (existingIndex > -1) {
        const copy = [...prev];
        const newQty = Math.min(99, copy[existingIndex].quantity + quantityToAdd);
        copy[existingIndex] = { ...copy[existingIndex], quantity: newQty };
        return copy;
      }

      const newItem: CartItem = {
        id: menuItem.id,
        menuItemId: menuItem.id,
        name_ar: menuItem.name_ar,
        name_en: menuItem.name_en,
        price: menuItem.price,
        quantity: Math.min(99, Math.max(1, quantityToAdd)),
        itemNote: "",
        image_url: menuItem.image_url,
        is_available: menuItem.is_available,
      };
      return [...prev, newItem];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId && i.menuItemId !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId || i.menuItemId === itemId
          ? { ...i, quantity: Math.min(99, newQty) }
          : i
      )
    );
  };

  const updateItemNote = (itemId: string, note: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId || i.menuItemId === itemId
          ? { ...i, itemNote: note.slice(0, 150) }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setGeneralNote("");
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const getItemQuantity = (itemId: string): number => {
    const found = items.find((i) => i.id === itemId || i.menuItemId === itemId);
    return found ? found.quantity : 0;
  };

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = {
    items,
    orderType,
    tableNumber,
    customerName,
    generalNote,
    totalCount,
    totalPrice,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    updateItemNote,
    setOrderType,
    setTableNumber,
    setCustomerName,
    setGeneralNote,
    clearCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
