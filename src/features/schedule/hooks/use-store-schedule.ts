import { useState, useEffect, useCallback, useMemo } from "react";
import { StoreScheduleConfig, StoreOperatingStatus } from "../types";
import { ScheduleService } from "../services/schedule-service";
import { STORE_UPDATED_EVENT } from "@/features/admin/services/store-repository";

export const useStoreSchedule = (initialConfig?: StoreScheduleConfig) => {
  const config = useMemo(() => {
    return initialConfig || ScheduleService.getDefaultScheduleConfig();
  }, [initialConfig]);

  const [operatingStatus, setOperatingStatus] = useState<StoreOperatingStatus>(
    () => ScheduleService.evaluateStoreStatus(config)
  );

  const refresh = useCallback(() => {
    setOperatingStatus(ScheduleService.evaluateStoreStatus(config));
  }, [config]);

  useEffect(() => {
    refresh();

    // Check status every 30 seconds to catch threshold changes
    const timer = setInterval(refresh, 30000);

    // Re-evaluate immediately when user returns to the tab
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    // Re-evaluate if store was updated in admin panel
    const handleStoreUpdate = () => refresh();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener(STORE_UPDATED_EVENT, handleStoreUpdate);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener(STORE_UPDATED_EVENT, handleStoreUpdate);
    };
  }, [refresh]);

  return {
    operatingStatus,
    scheduleConfig: config,
    refresh,
  };
};
