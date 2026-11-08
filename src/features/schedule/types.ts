import { z } from "zod";

export const DayScheduleSchema = z.object({
  day: z.number().min(0).max(6),
  is_enabled: z.boolean().default(true),
  open_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid HH:mm format")
    .default("10:00"),
  close_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid HH:mm format")
    .default("23:00"),
});
export type DaySchedule = z.infer<typeof DayScheduleSchema>;

export const StoreScheduleConfigSchema = z.object({
  timezone: z.string().default("Africa/Cairo"),
  allow_preorders: z.boolean().default(true),
  is_manually_paused: z.boolean().default(false),
  pause_note_ar: z.string().optional().default(""),
  pause_note_en: z.string().optional().default(""),
  weekly_schedule: z.array(DayScheduleSchema).length(7),
});
export type StoreScheduleConfig = z.infer<typeof StoreScheduleConfigSchema>;

export const StoreOperatingStatusSchema = z.object({
  status: z.enum(["open", "closed", "paused"]),
  isOpen: z.boolean(),
  isPaused: z.boolean(),
  canPlaceOrder: z.boolean(),
  isPreOrder: z.boolean(),
  currentDay: z.number().min(0).max(6),
  nextOpeningTime: z.string().nullable(),
  nextOpeningDateTextAr: z.string(),
  nextOpeningDateTextEn: z.string(),
  pauseNoteAr: z.string().optional(),
  pauseNoteEn: z.string().optional(),
});
export type StoreOperatingStatus = z.infer<typeof StoreOperatingStatusSchema>;
