import { describe, it, expect } from "vitest";
import { ScheduleService } from "@/features/schedule/services/schedule-service";
import { StoreScheduleConfigSchema } from "@/features/schedule/types";
import { formatWhatsAppMessage } from "@/features/cart/services/whatsapp-service";

describe("Feature 005: Smart Operating Hours & Availability Engine", () => {
  it("T051: validates 7-day schedule schema and evaluates open, overnight, and paused states", () => {
    const schedule = ScheduleService.getDefaultScheduleConfig();
    expect(StoreScheduleConfigSchema.safeParse(schedule).success).toBe(true);

    // Normal daytime shift (Sunday 14:00 - open 10:00 to 23:00)
    const sunOpen = new Date(2026, 10, 8, 14, 0);
    expect(ScheduleService.evaluateStoreStatus(schedule, sunOpen).isOpen).toBe(true);

    // Overnight shift configuration
    schedule.weekly_schedule[5] = { day: 5, is_enabled: true, open_time: "18:00", close_time: "03:00" };
    const satEarly = new Date(2026, 10, 14, 1, 30); // Saturday 01:30 AM (part of Friday overnight)
    expect(ScheduleService.evaluateStoreStatus(schedule, satEarly).isOpen).toBe(true);

    // Emergency rush pause override
    const paused = { ...schedule, is_manually_paused: true, pause_note_ar: "ضغط عمل مؤقت" };
    const pausedStatus = ScheduleService.evaluateStoreStatus(paused, sunOpen);
    expect(pausedStatus.status).toBe("paused");
    expect(pausedStatus.canPlaceOrder).toBe(false);
    expect(pausedStatus.pauseNoteAr).toBe("ضغط عمل مؤقت");
  });

  it("T051: enforces pre-order guard and prefixes WhatsApp orders during closed hours", () => {
    const schedule = ScheduleService.getDefaultScheduleConfig();
    const closedTime = new Date(2026, 10, 8, 3, 0); // Sunday 03:00 AM (closed)

    // Strict block: allow_preorders = false
    const strictSchedule = { ...schedule, allow_preorders: false };
    const strictStatus = ScheduleService.evaluateStoreStatus(strictSchedule, closedTime);
    expect(strictStatus.canPlaceOrder).toBe(false);
    expect(strictStatus.isPreOrder).toBe(false);

    // Pre-order enabled: allow_preorders = true
    const preSchedule = { ...schedule, allow_preorders: true };
    const preStatus = ScheduleService.evaluateStoreStatus(preSchedule, closedTime);
    expect(preStatus.canPlaceOrder).toBe(true);
    expect(preStatus.isPreOrder).toBe(true);

    const msg = formatWhatsAppMessage({
      restaurantName: "مشويات البركة",
      restaurantPhone: "201012345678",
      orderType: "takeaway",
      customerName: "كريم",
      customerPhone: "01099998888",
      deliveryAddress: "",
      generalNote: "",
      items: [
        {
          id: "1",
          menuItemId: "m1",
          name_ar: "كباب",
          name_en: "Kebab",
          price: 100,
          quantity: 1,
          itemNote: "",
          is_available: true,
        },
      ],
      itemsTotal: 100,
      deliveryFee: 0,
      totalPrice: 100,
      locale: "ar",
      currency: "EGP",
      isPreOrder: true,
      preOrderOpeningText: preStatus.nextOpeningDateTextAr,
    });
    expect(msg).toContain("🔔 *[طلب مسبق لموعد الفتح");
  });
});
