import { z } from "zod";
import type { MenuItem } from "@/features/menu/types";

export const OrderTypeSchema = z.enum(["dine_in", "takeaway", "delivery"]);
export type OrderType = z.infer<typeof OrderTypeSchema>;

export const CartItemSchema = z.object({
  id: z.string().min(1),
  menuItemId: z.string().min(1),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  price: z.number().nonnegative(),
  unit_ar: z.string().nullable().optional(),
  unit_en: z.string().nullable().optional(),
  quantity: z.number().int().min(1).max(99),
  itemNote: z.string().max(150).optional().default(""),
  image_url: z.string().url().nullable().optional(),
  is_available: z.boolean().default(true),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CartStateSchema = z.object({
  storeSlug: z.string().default("oriental-grill"),
  items: z.array(CartItemSchema).default([]),
  orderType: OrderTypeSchema.default("dine_in"),
  customerName: z.string().max(50).optional().default(""),
  customerPhone: z.string().max(20).optional().default(""),
  deliveryAddress: z.string().max(300).optional().default(""),
  generalNote: z.string().max(200).optional().default(""),
});
export type CartState = z.infer<typeof CartStateSchema>;

export const WhatsAppOrderPayloadSchema = z.object({
  restaurantName: z.string().min(1),
  restaurantPhone: z.string().min(7),
  orderType: OrderTypeSchema,
  customerName: z.string().max(50).optional(),
  customerPhone: z.string().max(20).optional(),
  deliveryAddress: z.string().max(300).optional(),
  generalNote: z.string().max(200).optional(),
  items: z.array(CartItemSchema).min(1),
  itemsTotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative().default(0),
  totalPrice: z.number().nonnegative(),
  locale: z.enum(["ar", "en"]),
  currency: z.string().optional(),
  isPreOrder: z.boolean().optional(),
  preOrderOpeningText: z.string().optional(),
});
export type WhatsAppOrderPayload = z.infer<typeof WhatsAppOrderPayloadSchema>;

export interface CartContextValue {
  storeSlug: string;
  supportedOrderTypes: OrderType[];
  deliveryFee: number;
  currency?: string;
  items: CartItem[];
  orderType: OrderType;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  generalNote: string;
  totalCount: number;
  itemsTotal: number;
  totalPrice: number;
  isHydrated: boolean;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemNote: (itemId: string, note: string) => void;
  setOrderType: (type: OrderType) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setDeliveryAddress: (address: string) => void;
  setGeneralNote: (note: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
}
