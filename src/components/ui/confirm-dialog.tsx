"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-neutral-100 dark:border-neutral-800 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0",
              isDanger
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
            )}
          >
            {isDanger ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>
          <div>
            <h3
              id="confirm-dialog-title"
              className="text-base font-bold text-neutral-900 dark:text-neutral-100"
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed text-start">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            data-testid="confirm-dialog-cancel"
            onClick={onCancel}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors min-h-[44px] cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            data-testid="confirm-dialog-confirm"
            onClick={onConfirm}
            className={cn(
              "w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-colors min-h-[44px] cursor-pointer shadow-xs",
              isDanger
                ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
                : "bg-brand-600 hover:bg-brand-700 active:bg-brand-800"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
