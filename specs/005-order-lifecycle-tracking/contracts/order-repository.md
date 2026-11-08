# Service Contract: Order Repository

**Feature**: `005-order-lifecycle-tracking`  
**Date**: 2026-11-08  
**Status**: Completed  

---

## 1. Interface Definition (`IOrderRepository`)

```typescript
import { OrderRecord, OrderStatus } from "../types";

export interface CreateOrderInput {
  storeSlug: string;
  storeName_ar: string;
  storeName_en: string;
  storePhone: string;
  customerName: string;
  customerPhone: string;
  orderType: "dine_in" | "takeaway" | "delivery";
  deliveryAddress?: string;
  deliveryFee?: number;
  generalNote?: string;
  items: {
    menuItemId: string;
    name_ar: string;
    name_en: string;
    price: number;
    quantity: number;
    unit_ar?: string | null;
    unit_en?: string | null;
    itemNote?: string;
  }[];
}

export interface IOrderRepository {
  /**
   * Creates a new order record, assigns unique reference (#ORD-XXXX), and stores it.
   */
  createOrder(input: CreateOrderInput): Promise<OrderRecord>;

  /**
   * Retrieves an order by its unique ID.
   */
  getOrderById(orderId: string): Promise<OrderRecord | null>;

  /**
   * Retrieves an order by its human-friendly reference (#ORD-XXXX).
   */
  getOrderByReference(reference: string): Promise<OrderRecord | null>;

  /**
   * Retrieves all orders for a specific store, ordered newest first.
   */
  getOrdersByStore(storeSlug: string, statusFilter?: OrderStatus | "all"): Promise<OrderRecord[]>;

  /**
   * Updates the status of an existing order and dispatches sync event.
   */
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderRecord>;

  /**
   * Retrieves the customer's personal recent orders list from local storage.
   */
  getCustomerRecentOrders(): Promise<OrderRecord[]>;

  /**
   * Clears orders for a store (testing only).
   */
  clearOrders(storeSlug: string): Promise<void>;
}
```
