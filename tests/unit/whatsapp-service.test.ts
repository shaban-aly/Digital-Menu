import { describe, it, expect } from "vitest";
import {
  formatWhatsAppMessage,
  buildWhatsAppOrderUrl,
} from "@/features/cart/services/whatsapp-service";
import { WhatsAppOrderPayload } from "@/features/cart/types";

describe("whatsapp-service", () => {
  const samplePayload: WhatsAppOrderPayload = {
    restaurantName: "مطعم البركة",
    restaurantPhone: "+201012345678",
    orderType: "dine_in",
    tableNumber: "5",
    customerName: "كريم",
    generalNote: "بدون تأخير",
    items: [
      {
        id: "item-101",
        menuItemId: "item-101",
        name_ar: "شوربة لسان عصفور",
        name_en: "Orzo Soup",
        price: 55,
        quantity: 2,
        itemNote: "ليمون زيادة",
        is_available: true,
      },
    ],
    itemsTotal: 110,
    deliveryFee: 0,
    totalPrice: 110,
    locale: "ar",
  };

  it("should format Arabic message with table number, item notes, and total in EGP", () => {
    const message = formatWhatsAppMessage(samplePayload);
    expect(message).toContain("طلب جديد من منيو مطعم البركة");
    expect(message).toContain("طاولة 5");
    expect(message).toContain("2x شوربة لسان عصفور");
    expect(message).toContain("ملاحظة: ليمون زيادة");
    expect(message).toContain("ج.م");
  });

  it("should format Delivery order with address, customer phone, and delivery fee", () => {
    const deliveryPayload: WhatsAppOrderPayload = {
      ...samplePayload,
      orderType: "delivery",
      customerName: "أحمد علي",
      customerPhone: "01099887766",
      deliveryAddress: "المعادي، شارع 9، عمارة 12، شقة 4",
      itemsTotal: 110,
      deliveryFee: 25,
      totalPrice: 135,
    };
    const message = formatWhatsAppMessage(deliveryPayload);
    expect(message).toContain("توصيل للمنزل");
    expect(message).toContain("01099887766");
    expect(message).toContain("المعادي، شارع 9");
    expect(message).toContain("رسوم التوصيل");
  });

  it("should generate valid https://wa.me/ URL with stripped phone and encoded text", () => {
    const url = buildWhatsAppOrderUrl(samplePayload);
    expect(url.startsWith("https://wa.me/201012345678?text=")).toBe(true);
    expect(url).toContain(encodeURIComponent("شوربة لسان عصفور"));
  });

  it("should format English message when locale is en", () => {
    const enPayload: WhatsAppOrderPayload = {
      ...samplePayload,
      locale: "en",
      orderType: "takeaway",
    };
    const message = formatWhatsAppMessage(enPayload);
    expect(message).toContain("New Order from مطعم البركة");
    expect(message).toContain("Takeaway");
    expect(message).toContain("110 EGP");
  });
});
