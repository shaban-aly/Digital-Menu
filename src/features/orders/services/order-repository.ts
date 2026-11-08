import { OrderRecord, OrderStatus, OrderItem } from "../types";

export const ORDER_UPDATED_EVENT = "digital_menu_order_updated";

export interface CreateOrderParams {
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
    id?: string;
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

function getStoreOrdersKey(slug: string) {
  return `orders_store_${slug}`;
}

const CUSTOMER_ORDERS_KEY = "customer_recent_orders";
const SEQUENCE_KEY = "order_sequence_counter";

function getNextReference(): string {
  if (typeof window === "undefined") return `#ORD-${Date.now().toString().slice(-4)}`;
  try {
    const raw = window.localStorage.getItem(SEQUENCE_KEY);
    const count = raw ? parseInt(raw, 10) : 1000;
    const next = count + 1;
    window.localStorage.setItem(SEQUENCE_KEY, String(next));
    return `#ORD-${next}`;
  } catch {
    return `#ORD-${Date.now().toString().slice(-4)}`;
  }
}

function notifyOrderUpdate(order: OrderRecord) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(ORDER_UPDATED_EVENT, {
      detail: { orderId: order.id, storeSlug: order.storeSlug, status: order.status },
    })
  );
}

export const OrderRepository = {
  async createOrder(params: CreateOrderParams): Promise<OrderRecord> {
    const id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const reference = getNextReference();
    const now = new Date().toISOString();

    const items: OrderItem[] = params.items.map((it) => ({
      id: it.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      menuItemId: it.menuItemId,
      name_ar: it.name_ar,
      name_en: it.name_en,
      price: it.price,
      quantity: it.quantity,
      unit_ar: it.unit_ar ?? null,
      unit_en: it.unit_en ?? null,
      itemNote: it.itemNote || "",
    }));

    const itemsTotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const deliveryFee = params.orderType === "delivery" ? params.deliveryFee || 0 : 0;
    const totalPrice = itemsTotal + deliveryFee;

    const newOrder: OrderRecord = {
      id,
      reference,
      storeSlug: params.storeSlug,
      storeName_ar: params.storeName_ar,
      storeName_en: params.storeName_en,
      storePhone: params.storePhone,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      orderType: params.orderType,
      deliveryAddress: params.deliveryAddress || "",
      deliveryFee,
      generalNote: params.generalNote || "",
      items,
      itemsTotal,
      totalPrice,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    if (typeof window !== "undefined") {
      try {
        // Save to store orders
        const key = getStoreOrdersKey(params.storeSlug);
        const existing: OrderRecord[] = JSON.parse(window.localStorage.getItem(key) || "[]");
        window.localStorage.setItem(key, JSON.stringify([newOrder, ...existing]));

        // Save to customer personal history
        const customerOrders: OrderRecord[] = JSON.parse(
          window.localStorage.getItem(CUSTOMER_ORDERS_KEY) || "[]"
        );
        window.localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify([newOrder, ...customerOrders]));
      } catch (e) {
        console.error("Failed saving order locally", e);
      }
    }

    notifyOrderUpdate(newOrder);
    return newOrder;
  },

  async getOrderById(orderId: string): Promise<OrderRecord | null> {
    if (typeof window === "undefined") return null;
    try {
      const customerOrders: OrderRecord[] = JSON.parse(
        window.localStorage.getItem(CUSTOMER_ORDERS_KEY) || "[]"
      );
      const found = customerOrders.find((o) => o.id === orderId);
      if (found) return found;

      // Scan all stores in localStorage
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith("orders_store_")) {
          const list: OrderRecord[] = JSON.parse(window.localStorage.getItem(key) || "[]");
          const item = list.find((o) => o.id === orderId);
          if (item) return item;
        }
      }
    } catch {
      return null;
    }
    return null;
  },

  async getOrdersByStore(slug: string, statusFilter?: OrderStatus | "all"): Promise<OrderRecord[]> {
    if (typeof window === "undefined") return [];
    try {
      const list: OrderRecord[] = JSON.parse(
        window.localStorage.getItem(getStoreOrdersKey(slug)) || "[]"
      );
      if (!statusFilter || statusFilter === "all") return list;
      return list.filter((o) => o.status === statusFilter);
    } catch {
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderRecord | null> {
    if (typeof window === "undefined") return null;
    let targetOrder: OrderRecord | null = null;
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && (key.startsWith("orders_store_") || key === CUSTOMER_ORDERS_KEY)) {
          const list: OrderRecord[] = JSON.parse(window.localStorage.getItem(key) || "[]");
          const idx = list.findIndex((o) => o.id === orderId);
          if (idx !== -1) {
            list[idx].status = status;
            list[idx].updatedAt = new Date().toISOString();
            targetOrder = list[idx];
            window.localStorage.setItem(key, JSON.stringify(list));
          }
        }
      }
    } catch (e) {
      console.error("Failed updating order status", e);
    }

    if (targetOrder) notifyOrderUpdate(targetOrder);
    return targetOrder;
  },

  async getCustomerRecentOrders(): Promise<OrderRecord[]> {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(CUSTOMER_ORDERS_KEY) || "[]");
    } catch {
      return [];
    }
  },
};
