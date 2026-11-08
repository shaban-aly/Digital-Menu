import { WhatsAppOrderPayload } from "@/features/cart/types";
import { formatCurrency } from "@/lib/utils";

export function formatWhatsAppMessage(payload: WhatsAppOrderPayload): string {
  const isAr = payload.locale === "ar";
  const lines: string[] = [];

  // 1. Header
  if (isAr) {
    lines.push(`🍽️ *طلب جديد من منيو ${payload.restaurantName}*`);
    lines.push("------------------------------");
    const orderTypeLabel =
      payload.orderType === "dine_in" ? "داخل المطعم" : "استلام من الفرع (سفري)";
    lines.push(`📍 *نوع الطلب:* ${orderTypeLabel}`);

    if (payload.orderType === "dine_in" && payload.tableNumber) {
      lines.push(`🪑 *رقم الطاولة:* طاولة ${payload.tableNumber}`);
    }
    if (payload.customerName && payload.customerName.trim()) {
      lines.push(`👤 *اسم العميل:* ${payload.customerName.trim()}`);
    }

    lines.push("");
    lines.push("📋 *تفاصيل الأصناف المطلوبة:*");
  } else {
    lines.push(`🍽️ *New Order from ${payload.restaurantName}*`);
    lines.push("------------------------------");
    const orderTypeLabel =
      payload.orderType === "dine_in" ? "Dine-in" : "Takeaway";
    lines.push(`📍 *Order Type:* ${orderTypeLabel}`);

    if (payload.orderType === "dine_in" && payload.tableNumber) {
      lines.push(`🪑 *Table Number:* Table ${payload.tableNumber}`);
    }
    if (payload.customerName && payload.customerName.trim()) {
      lines.push(`👤 *Customer Name:* ${payload.customerName.trim()}`);
    }

    lines.push("");
    lines.push("📋 *Ordered Items:*");
  }

  // 2. Items List
  payload.items.forEach((item) => {
    const itemName = isAr ? item.name_ar : item.name_en;
    const subtotal = item.price * item.quantity;
    const formattedSubtotal = formatCurrency(subtotal, payload.locale);

    lines.push(`• ${item.quantity}x ${itemName} (${formattedSubtotal})`);
    if (item.itemNote && item.itemNote.trim()) {
      lines.push(
        isAr
          ? `  _ملاحظة: ${item.itemNote.trim()}_`
          : `  _Note: ${item.itemNote.trim()}_`
      );
    }
  });

  // 3. General Notes
  if (payload.generalNote && payload.generalNote.trim()) {
    lines.push("");
    lines.push(
      isAr
        ? `📝 *ملاحظات عامة على الطلب:*\n${payload.generalNote.trim()}`
        : `📝 *General Order Notes:*\n${payload.generalNote.trim()}`
    );
  }

  // 4. Grand Total
  lines.push("------------------------------");
  const formattedTotal = formatCurrency(payload.totalPrice, payload.locale);
  lines.push(
    isAr ? `💰 *الإجمالي النهائي: ${formattedTotal}*` : `💰 *Grand Total: ${formattedTotal}*`
  );

  return lines.join("\n");
}

export function buildWhatsAppOrderUrl(payload: WhatsAppOrderPayload): string {
  const cleanPhone = payload.restaurantPhone.replace(/\D/g, "");
  const message = formatWhatsAppMessage(payload);
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
