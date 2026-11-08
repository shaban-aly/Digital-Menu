"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderRecord } from "../types";
import { OrderRepository, ORDER_UPDATED_EVENT } from "../services/order-repository";

export function useCustomerOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    const list = await OrderRepository.getCustomerRecentOrders();
    setOrders(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
    window.addEventListener(ORDER_UPDATED_EVENT, loadOrders);
    window.addEventListener("storage", loadOrders);
    return () => {
      window.removeEventListener(ORDER_UPDATED_EVENT, loadOrders);
      window.removeEventListener("storage", loadOrders);
    };
  }, [loadOrders]);

  return { orders, isLoading, refresh: loadOrders };
}
