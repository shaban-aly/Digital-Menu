import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title: string;
  description: string;
  retryText: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  retryText,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-sm text-sm mb-6">
        {description}
      </p>
      <Button
        onClick={onRetry}
        className="flex items-center gap-2"
        variant="primary"
      >
        <RefreshCw className="w-4 h-4" />
        <span>{retryText}</span>
      </Button>
    </div>
  );
};

