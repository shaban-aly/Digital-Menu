"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface QuotaProgressBarProps {
  label: string;
  current: number;
  max: number;
  percentage: number;
  isExceeded: boolean;
  className?: string;
}

export const QuotaProgressBar: React.FC<QuotaProgressBarProps> = ({
  label,
  current,
  max,
  percentage,
  isExceeded,
  className,
}) => {
  const isWarning = percentage >= 75 && !isExceeded;
  const isDanger = isExceeded || percentage >= 100;

  const barColor = isDanger
    ? "bg-rose-500"
    : isWarning
    ? "bg-amber-500"
    : "bg-brand-600";

  const textColor = isDanger
    ? "text-rose-600 dark:text-rose-400"
    : isWarning
    ? "text-amber-600 dark:text-amber-400"
    : "text-neutral-700 dark:text-neutral-300";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-neutral-800 dark:text-neutral-200">
          {label}
        </span>
        <div className="flex items-center gap-1.5 font-medium">
          <span className={textColor}>
            {current} / {max >= 999999 ? "∞" : max}
          </span>
          <span className="text-[11px] text-neutral-400">
            ({Math.min(100, percentage)}%)
          </span>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className={cn("h-full transition-all duration-300 rounded-full", barColor)}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};
