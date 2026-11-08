import { WhatsAppOrderPayload } from "@/features/cart/types";
import { formatCurrency } from "@/lib/utils";

export function formatWhatsAppMessage(payload: WhatsAppOrderPayload): string {
  const isAr = payload.locale === "ar";
  const lines: string[] = [];

  // 1. Header & Order Info
  lines.push(
    isAr
      ? `🍽️ *طلب جديد من منيو ${payload.restaurantName}*`
      : `🍽️ *New Order from ${payload.restaurantName}*`
  );
  lines.push("------------------------------");

  const orderTypeLabels: Record<string, { ar: string; en: string }> = {
    dine_in: { ar: "داخل المطعم (صالة)", en: "Dine-in" },
    takeaway: { ar: "استلام من الفرع (سفري)", en: "Takeaway" },
    delivery: { ar: "توصيل للمنزل", en: "Home Delivery" },
  };

  const currentLabel =
    orderTypeLabels[payload.orderType] || orderTypeLabels.dine_in;
  lines.push(
    isAr
      ? `📍 *نوع الطلب:* ${currentLabel.ar}`
      : `📍 *Order Type:* ${currentLabel.en}`
  );

  if (payload.customerName?.trim()) {
    lines.push(
      isAr
        ? `👤 *اسم العميل:* ${payload.customerName.trim()}`
        : `👤 *Customer Name:* ${payload.customerName.trim()}`
    );
  }

  if (payload.customerPhone?.trim()) {
    lines.push(
      isAr
        ? `📱 *رقم الموبايل:* ${payload.customerPhone.trim()}`
        : `📱 *Phone Number:* ${payload.customerPhone.trim()}`
    );
  }

  if (payload.orderType === "delivery" && payload.deliveryAddress?.trim()) {
    lines.push(
      isAr
        ? `🏠 *عنوان التوصيل:* ${payload.deliveryAddress.trim()}`
        : `🏠 *Delivery Address:* ${payload.deliveryAddress.trim()}`
    );
  }

  lines.push("");
  lines.push(
    isAr ? "📋 *تفاصيل الأصناف المطلوبة:*" : "📋 *Ordered Items:*"
  );

  // 2. Items List
  payload.items.forEach((item) => {
    const itemName = isAr ? item.name_ar : item.name_en;
    const unit = isAr ? item.unit_ar : item.unit_en;
    const subtotal = item.price * item.quantity;
    const formattedSubtotal = formatCurrency(subtotal, payload.locale);
    const unitText = unit ? ` (${unit})` : "";

    lines.push(`• ${item.quantity}x ${itemName}${unitText} (${formattedSubtotal})`);
    if (item.itemNote?.trim()) {
      lines.push(
        isAr
          ? `  _ملاحظة: ${item.itemNote.trim()}_`
          : `  _Note: ${item.itemNote.trim()}_`
      );
    }
  });

  // 3. General Notes
  if (payload.generalNote?.trim()) {
    lines.push("");
    lines.push(
      isAr
        ? `📝 *ملاحظات عامة:*\n${payload.generalNote.trim()}`
        : `📝 *General Notes:*\n${payload.generalNote.trim()}`
    );
  }

  // 4. Financial Breakdown
  lines.push("------------------------------");
  if (payload.orderType === "delivery" && (payload.deliveryFee || 0) > 0) {
    const sub = formatCurrency(payload.itemsTotal, payload.locale);
    const fee = formatCurrency(payload.deliveryFee, payload.locale);
    lines.push(
      isAr ? `💵 *المجموع الفرعي:* ${sub}` : `💵 *Subtotal:* ${sub}`
    );
    lines.push(
      isAr ? `🛵 *رسوم التوصيل:* ${fee}` : `🛵 *Delivery Fee:* ${fee}`
    );
  }

  const formattedTotal = formatCurrency(payload.totalPrice, payload.locale);
  lines.push(
    isAr
      ? `💰 *الإجمالي النهائي: ${formattedTotal}*`
      : `💰 *Grand Total: ${formattedTotal}*`
  );

  return lines.join("\n");
}

export function buildWhatsAppOrderUrl(payload: WhatsAppOrderPayload): string {
  const cleanPhone = payload.restaurantPhone.replace(/\D/g, "");
  const message = formatWhatsAppMessage(payload);
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
