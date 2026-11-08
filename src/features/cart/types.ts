import { z } from "zod";
import type { MenuItem } from "@/features/menu/types";

export const OrderTypeSchema = z.enum(["dine_in", "takeaway"]);
export type OrderType = z.infer<typeof OrderTypeSchema>;

export const CartItemSchema = z.object({
  id: z.string().min(1),
  menuItemId: z.string().min(1),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().min(1).max(99),
  itemNote: z.string().max(150).optional().default(""),
  image_url: z.string().url().nullable().optional(),
  is_available: z.boolean().default(true),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CartStateSchema = z.object({
  items: z.array(CartItemSchema).default([]),
  orderType: OrderTypeSchema.default("dine_in"),
  tableNumber: z.string().max(10).default(""),
  customerName: z.string().max(50).optional().default(""),
  generalNote: z.string().max(200).optional().default(""),
});
export type CartState = z.infer<typeof CartStateSchema>;

export const WhatsAppOrderPayloadSchema = z.object({
  restaurantName: z.string().min(1),
  restaurantPhone: z.string().min(7),
  orderType: OrderTypeSchema,
  tableNumber: z.string().max(10),
  customerName: z.string().max(50).optional(),
  generalNote: z.string().max(200).optional(),
  items: z.array(CartItemSchema).min(1),
  totalPrice: z.number().nonnegative(),
  locale: z.enum(["ar", "en"]),
});
export type WhatsAppOrderPayload = z.infer<typeof WhatsAppOrderPayloadSchema>;

export interface CartContextValue {
  items: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  customerName: string;
  generalNote: string;
  totalCount: number;
  totalPrice: number;
  isHydrated: boolean;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemNote: (itemId: string, note: string) => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (table: string) => void;
  setCustomerName: (name: string) => void;
  setGeneralNote: (note: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
}
