import { z } from "zod";
import { OrderTypeSchema } from "@/features/cart/types";

export const OrderStatusSchema = z.enum([
  "pending",
  "preparing",
  "out_for_delivery",
  "ready",
  "completed",
  "cancelled",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderItemSchema = z.object({
  id: z.string().min(1),
  menuItemId: z.string().min(1),
  name_ar: z.string().min(1),
  name_en: z.string().min(1),
  price: z.number().nonnegative(),
  unit_ar: z.string().nullable().optional(),
  unit_en: z.string().nullable().optional(),
  quantity: z.number().int().min(1),
  itemNote: z.string().optional().default(""),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderRecordSchema = z.object({
  id: z.string().min(1),
  reference: z.string().min(1),
  storeSlug: z.string().min(1),
  storeName_ar: z.string().min(1),
  storeName_en: z.string().min(1),
  storePhone: z.string().min(7),
  customerName: z.string().min(1, "اسم العميل مطلوب"),
  customerPhone: z.string().min(7, "رقم الهاتف مطلوب"),
  orderType: OrderTypeSchema,
  deliveryAddress: z.string().optional().default(""),
  deliveryFee: z.number().nonnegative().default(0),
  generalNote: z.string().optional().default(""),
  items: z.array(OrderItemSchema).min(1),
  itemsTotal: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  status: OrderStatusSchema.default("pending"),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type OrderRecord = z.infer<typeof OrderRecordSchema>;
