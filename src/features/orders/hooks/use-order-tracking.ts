"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderRecord } from "../types";
import { OrderRepository, ORDER_UPDATED_EVENT } from "../services/order-repository";

export function useOrderTracking(orderId: string) {
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await OrderRepository.getOrderById(orderId);
      if (!data) {
        setError("Order not found");
      } else {
        setOrder(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed loading order");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();

    const handleUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ orderId: string }>;
      if (!ce.detail || ce.detail.orderId === orderId) {
        loadOrder();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("orders_store_") || e.key === "customer_recent_orders") {
        loadOrder();
      }
    };

    window.addEventListener(ORDER_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(ORDER_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadOrder, orderId]);

  return {
    order,
    isLoading,
    error,
    refresh: loadOrder,
  };
}
