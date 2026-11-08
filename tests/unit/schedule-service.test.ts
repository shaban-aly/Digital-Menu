import { describe, it, expect } from "vitest";
import {
  ScheduleService,
  formatScheduleTime,
  getDefaultScheduleConfig,
} from "@/features/schedule/services/schedule-service";
import { StoreScheduleConfig } from "@/features/schedule/types";

describe("ScheduleService", () => {
  const baseConfig: StoreScheduleConfig = {
    timezone: "Africa/Cairo",
    allow_preorders: true,
    is_manually_paused: false,
    pause_note_ar: "",
    pause_note_en: "",
    weekly_schedule: [
      { day: 0, is_enabled: true, open_time: "10:00", close_time: "22:00" }, // Sunday
      { day: 1, is_enabled: true, open_time: "10:00", close_time: "22:00" }, // Monday
      { day: 2, is_enabled: false, open_time: "10:00", close_time: "22:00" }, // Tuesday off
      { day: 3, is_enabled: true, open_time: "10:00", close_time: "22:00" }, // Wednesday
      { day: 4, is_enabled: true, open_time: "10:00", close_time: "22:00" }, // Thursday
      { day: 5, is_enabled: true, open_time: "18:00", close_time: "03:00" }, // Friday overnight
      { day: 6, is_enabled: true, open_time: "12:00", close_time: "23:00" }, // Saturday
    ],
  };

  it("identifies store as open during normal shift", () => {
    // Sunday at 14:30
    const testDate = new Date(2026, 10, 8, 14, 30); // Note: Month is 0-indexed, Nov 8, 2026 is Sunday
    const status = ScheduleService.evaluateStoreStatus(baseConfig, testDate);
    expect(status.isOpen).toBe(true);
    expect(status.status).toBe("open");
    expect(status.canPlaceOrder).toBe(true);
  });

  it("identifies store as closed before shift and predicts today opening", () => {
    // Sunday at 08:30
    const testDate = new Date(2026, 10, 8, 8, 30);
    const status = ScheduleService.evaluateStoreStatus(baseConfig, testDate);
    expect(status.isOpen).toBe(false);
    expect(status.status).toBe("closed");
    expect(status.isPreOrder).toBe(true);
    expect(status.nextOpeningDateTextAr).toContain("اليوم الساعة");
    expect(status.nextOpeningDateTextEn).toContain("Today at");
  });

  it("handles overnight shifts both before and after midnight", () => {
    // Friday at 23:30 (before midnight)
    const friNight = new Date(2026, 10, 13, 23, 30); // Nov 13, 2026 is Friday
    const statusFri = ScheduleService.evaluateStoreStatus(baseConfig, friNight);
    expect(statusFri.isOpen).toBe(true);

    // Saturday at 01:30 (after midnight, part of Friday's overnight shift)
    const satEarly = new Date(2026, 10, 14, 1, 30); // Nov 14, 2026 is Saturday
    const statusSat = ScheduleService.evaluateStoreStatus(baseConfig, satEarly);
    expect(statusSat.isOpen).toBe(true);
  });

  it("handles scheduled day off and points to next available day", () => {
    // Tuesday (Nov 10, 2026) is disabled in baseConfig -> next is Wednesday (tomorrow)
    const tuesday = new Date(2026, 10, 10, 15, 0);
    const status = ScheduleService.evaluateStoreStatus(baseConfig, tuesday);
    expect(status.isOpen).toBe(false);
    expect(status.status).toBe("closed");
    expect(status.nextOpeningDateTextAr).toContain("غداً الساعة");
    expect(status.nextOpeningDateTextEn).toContain("Tomorrow at");
  });

  it("emergency pause overrides schedule immediately", () => {
    const pausedConfig: StoreScheduleConfig = {
      ...baseConfig,
      is_manually_paused: true,
      pause_note_ar: "إيقاف مؤقت لضغط الطلبات",
      pause_note_en: "Paused due to rush",
    };
    // Sunday at 14:30 (normally open)
    const testDate = new Date(2026, 10, 8, 14, 30);
    const status = ScheduleService.evaluateStoreStatus(pausedConfig, testDate);
    expect(status.isOpen).toBe(false);
    expect(status.status).toBe("paused");
    expect(status.canPlaceOrder).toBe(false);
    expect(status.pauseNoteAr).toBe("إيقاف مؤقت لضغط الطلبات");
  });

  it("formats time strings cleanly in Arabic and English", () => {
    expect(formatScheduleTime("13:00", "ar")).toBe("1:00 م");
    expect(formatScheduleTime("13:00", "en")).toBe("1:00 PM");
    expect(formatScheduleTime("00:30", "ar")).toBe("12:30 ص");
    expect(formatScheduleTime("09:15", "en")).toBe("9:15 AM");
  });

  it("provides valid default schedule", () => {
    const def = getDefaultScheduleConfig();
    expect(def.weekly_schedule).toHaveLength(7);
    expect(def.allow_preorders).toBe(true);
    expect(def.is_manually_paused).toBe(false);
  });
});
