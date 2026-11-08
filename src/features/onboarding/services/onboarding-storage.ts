import { StoreScheduleConfig } from "@/features/schedule/types";

/**
 * Builds the default operating schedule for newly onboarded stores.
 * Cairo timezone, standard 10:00 - 23:00 (Friday 13:00 - 23:00) shifts.
 */
export function buildDefaultSchedule(): StoreScheduleConfig {
  const times = [
    { day: 0, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 1, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 2, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 3, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 4, is_enabled: true, open_time: "10:00", close_time: "23:00" },
    { day: 5, is_enabled: true, open_time: "13:00", close_time: "23:00" },
    { day: 6, is_enabled: true, open_time: "10:00", close_time: "23:00" },
  ];
  return {
    timezone: "Africa/Cairo",
    allow_preorders: true,
    is_manually_paused: false,
    pause_note_ar: "",
    pause_note_en: "",
    weekly_schedule: times,
  };
}
