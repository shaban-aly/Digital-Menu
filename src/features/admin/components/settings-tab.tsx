"use client";

import React, { useState } from "react";
import { Restaurant } from "@/features/menu/types";
import { Locale } from "@/types";
import { StoreSettings } from "../types";
import { StoreScheduleConfig } from "@/features/schedule/types";
import { ScheduleService } from "@/features/schedule/services/schedule-service";
import { StoreProfileForm } from "./store-profile-form";
import { EmergencyPauseSwitch } from "./emergency-pause-switch";
import { OperatingHoursEditor } from "./operating-hours-editor";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import arTranslations from "@/lib/i18n/ar.json";
import enTranslations from "@/lib/i18n/en.json";

interface SettingsTabProps {
  restaurant: Restaurant;
  locale: Locale;
  onSaveSettings: (settings: Partial<StoreSettings>) => Promise<boolean>;
  onResetDefaults: () => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  restaurant,
  locale,
  onSaveSettings,
  onResetDefaults,
}) => {
  const t = locale === "ar" ? arTranslations.admin : enTranslations.admin;
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const scheduleConfig: StoreScheduleConfig =
    restaurant.schedule || ScheduleService.getDefaultScheduleConfig();

  const handleToggleEmergencyPause = async (
    isPaused: boolean,
    noteAr: string,
    noteEn: string
  ) => {
    const updatedSchedule: StoreScheduleConfig = {
      ...scheduleConfig,
      is_manually_paused: isPaused,
      pause_note_ar: noteAr,
      pause_note_en: noteEn,
    };
    await onSaveSettings({ schedule: updatedSchedule });
  };

  const handleScheduleChange = async (updated: StoreScheduleConfig) => {
    await onSaveSettings({ schedule: updated });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 1. Emergency Rush Pause Switch */}
      <EmergencyPauseSwitch
        isPaused={scheduleConfig.is_manually_paused}
        pauseNoteAr={scheduleConfig.pause_note_ar || ""}
        pauseNoteEn={scheduleConfig.pause_note_en || ""}
        locale={locale}
        onTogglePause={handleToggleEmergencyPause}
      />

      {/* 2. Core Profile & Delivery Settings */}
      <StoreProfileForm
        restaurant={restaurant}
        locale={locale}
        onSave={onSaveSettings}
        onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
      />

      {/* 3. 7-Day Operating Hours Timetable */}
      <OperatingHoursEditor
        scheduleConfig={scheduleConfig}
        locale={locale}
        onChange={handleScheduleChange}
      />

      {/* Reusable Confirm Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title={t.settings.resetDefaults}
        message={t.settings.confirmReset}
        confirmLabel={t.settings.resetDefaults}
        cancelLabel={t.items.cancelBtn}
        variant="danger"
        onConfirm={async () => {
          await onResetDefaults();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
