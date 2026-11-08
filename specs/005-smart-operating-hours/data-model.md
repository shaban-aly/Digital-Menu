# Data Model: Smart Operating Hours & Availability Engine

**Feature**: `005-smart-operating-hours`  
**Date**: 2026-11-08  

---

## 1. Schema Definitions (Zod & TypeScript)

```typescript
import { z } from "zod";

// Day of week enum (0 = Sunday ... 6 = Saturday)
export const DayOfWeekSchema = z.enum(["0", "1", "2", "3", "4", "5", "6"]);
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;

// Operating hours for a single day
export const DayScheduleSchema = z.object({
  day: z.number().min(0).max(6), // 0: Sunday, 1: Monday, ... 6: Saturday
  is_enabled: z.boolean().default(true),
  open_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid HH:mm format").default("10:00"),
  close_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid HH:mm format").default("23:00"),
});
export type DaySchedule = z.infer<typeof DayScheduleSchema>;

// Full Store Schedule configuration attached to Restaurant / Store
export const StoreScheduleConfigSchema = z.object({
  timezone: z.string().default("Africa/Cairo"),
  allow_preorders: z.boolean().default(true),
  is_manually_paused: z.boolean().default(false),
  pause_note_ar: z.string().optional().default(""),
  pause_note_en: z.string().optional().default(""),
  weekly_schedule: z.array(DayScheduleSchema).length(7),
});
export type StoreScheduleConfig = z.infer<typeof StoreScheduleConfigSchema>;

// Evaluated Real-Time Status Output
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
```

---

## 2. Default Initial Schedules for Pilot Stores

### Oriental Grill (`oriental-grill`)
- Restaurant schedule: 12:00 PM to 01:00 AM (Overnight 13h shift).
- Pre-orders: Allowed (`allow_preorders: true`).

### Specialty Café (`specialty-cafe`)
- Cafe schedule: 07:00 AM to 11:30 PM (Daily).
- Pre-orders: Allowed (`allow_preorders: true`).

### Fresh Market (`fresh-market`)
- Supermarket schedule: 08:00 AM to 02:00 AM (Daily).
- Pre-orders: Allowed (`allow_preorders: true`).
