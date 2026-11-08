"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { requestAiTranslation } from "../services/translation-service";
import { cn } from "@/lib/utils";

interface AiTranslateButtonProps {
  sourceText: string;
  onTranslated: (translated: string) => void;
  className?: string;
  label?: string;
  testId?: string;
}

export const AiTranslateButton: React.FC<AiTranslateButtonProps> = ({
  sourceText,
  onTranslated,
  className,
  label = "ترجمة ذكية",
  testId = "ai-translate-btn",
}) => {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = sourceText.trim();
    if (!trimmed || isTranslating) return;

    setIsTranslating(true);
    try {
      const result = await requestAiTranslation(trimmed);
      if (result) {
        onTranslated(result);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const isDisabled = !sourceText.trim() || isTranslating;

  return (
    <button
      type="button"
      data-testid={testId}
      onClick={handleTranslate}
      disabled={isDisabled}
      title={label}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none",
        "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200",
        "dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 dark:border-purple-800",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
    >
      {isTranslating ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600 dark:text-purple-400" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
      )}
      <span className="text-[11px] font-bold">{label}</span>
    </button>
  );
};
