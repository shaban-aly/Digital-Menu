import { Restaurant } from "@/features/menu/types";
import { CUSTOM_STORES_STORAGE_KEY } from "../types";

export function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage; } catch { return null; }
}

export function getCustomStores(): Restaurant[] {
  const storage = safeLocalStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(CUSTOM_STORES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCustomStores(stores: Restaurant[]) {
  const storage = safeLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(CUSTOM_STORES_STORAGE_KEY, JSON.stringify(stores));
  } catch (e) {
    console.error("Failed to save custom stores", e);
  }
}

export function buildDefaultSchedule() {
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
