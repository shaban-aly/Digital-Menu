import { StoreScheduleConfig, StoreOperatingStatus } from "../types";

const DAY_NAMES_AR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

const DAY_NAMES_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const formatScheduleTime = (
  timeStr: string,
  locale: "ar" | "en"
): string => {
  const [hStr, mStr] = timeStr.split(":");
  let hour = parseInt(hStr, 10);
  const minutes = mStr || "00";
  const isPm = hour >= 12;
  const suffix = isPm
    ? locale === "ar" ? "م" : "PM"
    : locale === "ar" ? "ص" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minutes} ${suffix}`;
};

export const getDefaultScheduleConfig = (): StoreScheduleConfig => ({
  timezone: "Africa/Cairo",
  allow_preorders: true,
  is_manually_paused: false,
  pause_note_ar: "",
  pause_note_en: "",
  weekly_schedule: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day,
    is_enabled: true,
    open_time: "10:00",
    close_time: "23:00",
  })),
});

export const evaluateStoreStatus = (
  config: StoreScheduleConfig,
  referenceDate?: Date
): StoreOperatingStatus => {
  const now = referenceDate || new Date();
  const currentDay = now.getDay();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${hours}:${minutes}`;

  let isOpen = false;
  const todaySchedule = config.weekly_schedule.find((s) => s.day === currentDay);

  if (todaySchedule?.is_enabled) {
    const { open_time, close_time } = todaySchedule;
    if (open_time <= close_time) {
      if (currentTime >= open_time && currentTime < close_time) {
        isOpen = true;
      }
    } else {
      // Overnight shift starting today
      if (currentTime >= open_time) {
        isOpen = true;
      }
    }
  }

  // Check if yesterday had an overnight shift ending today
  if (!isOpen) {
    const yesterday = (currentDay + 6) % 7;
    const yestSchedule = config.weekly_schedule.find((s) => s.day === yesterday);
    if (yestSchedule?.is_enabled && yestSchedule.open_time > yestSchedule.close_time) {
      if (currentTime < yestSchedule.close_time) {
        isOpen = true;
      }
    }
  }

  // Handle manual pause override
  if (config.is_manually_paused) {
    return {
      status: "paused",
      isOpen: false,
      isPaused: true,
      canPlaceOrder: false,
      isPreOrder: false,
      currentDay,
      nextOpeningTime: null,
      nextOpeningDateTextAr: "الطلبات معلقة مؤقتاً",
      nextOpeningDateTextEn: "Orders temporarily paused",
      pauseNoteAr: config.pause_note_ar,
      pauseNoteEn: config.pause_note_en,
    };
  }

  if (isOpen) {
    return {
      status: "open",
      isOpen: true,
      isPaused: false,
      canPlaceOrder: true,
      isPreOrder: false,
      currentDay,
      nextOpeningTime: null,
      nextOpeningDateTextAr: "",
      nextOpeningDateTextEn: "",
    };
  }

  // Find next opening window
  let nextOpeningTime: string | null = null;
  let nextOpeningDateTextAr = "";
  let nextOpeningDateTextEn = "";

  if (todaySchedule?.is_enabled && currentTime < todaySchedule.open_time) {
    nextOpeningTime = todaySchedule.open_time;
    const formattedAr = formatScheduleTime(todaySchedule.open_time, "ar");
    const formattedEn = formatScheduleTime(todaySchedule.open_time, "en");
    nextOpeningDateTextAr = `اليوم الساعة ${formattedAr}`;
    nextOpeningDateTextEn = `Today at ${formattedEn}`;
  } else {
    for (let offset = 1; offset <= 7; offset++) {
      const targetDay = (currentDay + offset) % 7;
      const targetSched = config.weekly_schedule.find((s) => s.day === targetDay);
      if (targetSched?.is_enabled) {
        nextOpeningTime = targetSched.open_time;
        const formattedAr = formatScheduleTime(targetSched.open_time, "ar");
        const formattedEn = formatScheduleTime(targetSched.open_time, "en");
        if (offset === 1) {
          nextOpeningDateTextAr = `غداً الساعة ${formattedAr}`;
          nextOpeningDateTextEn = `Tomorrow at ${formattedEn}`;
        } else {
          nextOpeningDateTextAr = `يوم ${DAY_NAMES_AR[targetDay]} الساعة ${formattedAr}`;
          nextOpeningDateTextEn = `${DAY_NAMES_EN[targetDay]} at ${formattedEn}`;
        }
        break;
      }
    }
  }

  return {
    status: "closed",
    isOpen: false,
    isPaused: false,
    canPlaceOrder: config.allow_preorders,
    isPreOrder: config.allow_preorders,
    currentDay,
    nextOpeningTime,
    nextOpeningDateTextAr,
    nextOpeningDateTextEn,
  };
};

export const ScheduleService = {
  formatTime: formatScheduleTime,
  getDefaultScheduleConfig,
  evaluateStoreStatus,
};
