import { OrderRepository } from "@/features/orders/services/order-repository";
import { buildWhatsAppOrderUrl } from "./whatsapp-service";
import { CartItem, OrderType } from "../types";
import { Locale } from "@/types";

export interface SubmitOrderParams {
  storeSlug: string;
  restaurantName: string;
  restaurantPhone: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  deliveryAddress: string;
  deliveryFee: number;
  generalNote: string;
  items: CartItem[];
  itemsTotal: number;
  totalPrice: number;
  locale: Locale;
}

export async function submitCartOrder(params: SubmitOrderParams): Promise<{ orderId: string; whatsappUrl: string }> {
  const order = await OrderRepository.createOrder({
    storeSlug: params.storeSlug || "oriental-grill",
    storeName_ar: params.restaurantName,
    storeName_en: params.restaurantName,
    storePhone: params.restaurantPhone,
    customerName: params.customerName.trim() || (params.locale === "ar" ? "عميل صالة" : "Dine-in Guest"),
    customerPhone: params.customerPhone.trim() || params.restaurantPhone,
    orderType: params.orderType,
    deliveryAddress: params.orderType === "delivery" ? params.deliveryAddress.trim() : "",
    deliveryFee: params.orderType === "delivery" ? params.deliveryFee : 0,
    generalNote: params.generalNote.trim(),
    items: params.items.map((i) => ({
      menuItemId: i.menuItemId,
      name_ar: i.name_ar,
      name_en: i.name_en,
      price: i.price,
      quantity: i.quantity,
      unit_ar: i.unit_ar,
      unit_en: i.unit_en,
      itemNote: i.itemNote,
    })),
  });

  const whatsappUrl = buildWhatsAppOrderUrl({
    restaurantName: params.restaurantName,
    restaurantPhone: params.restaurantPhone,
    orderReference: order.reference,
    orderType: params.orderType,
    customerName: params.customerName.trim(),
    customerPhone: params.customerPhone.trim(),
    deliveryAddress: params.orderType === "delivery" ? params.deliveryAddress.trim() : "",
    generalNote: params.generalNote.trim(),
    items: params.items,
    itemsTotal: params.itemsTotal,
    deliveryFee: params.orderType === "delivery" ? params.deliveryFee : 0,
    totalPrice: params.totalPrice,
    locale: params.locale,
  });

  return { orderId: order.id, whatsappUrl };
}
