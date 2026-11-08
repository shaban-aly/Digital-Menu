/**
 * Contract: Smart Operating Hours & Availability Engine
 */

import { StoreScheduleConfig, StoreOperatingStatus } from "../data-model";

export interface IScheduleService {
  /**
   * Evaluates real-time store availability against configured weekly schedule and manual pauses.
   * @param config The store's operating schedule configuration
   * @param referenceDate Optional mock date for deterministic testing (defaults to new Date())
   */
  evaluateStoreStatus(
    config: StoreScheduleConfig,
    referenceDate?: Date
  ): StoreOperatingStatus;

  /**
   * Generates a default 7-day schedule with standard business hours.
   */
  getDefaultScheduleConfig(): StoreScheduleConfig;

  /**
   * Formats 24h time "HH:mm" into localized 12h format.
   * e.g. "13:00" -> "1:00 م" in Arabic, "1:00 PM" in English.
   */
  formatTime(timeStr: string, locale: "ar" | "en"): string;
}
