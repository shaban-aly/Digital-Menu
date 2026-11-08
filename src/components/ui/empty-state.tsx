import React from "react";
import { SearchX } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  message: string;
  clearText?: string;
  onClear?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  clearText,
  onClear,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-8">
      <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mb-3">
        <SearchX className="w-6 h-6" />
      </div>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
        {message}
      </p>
      {clearText && onClear && (
        <Button onClick={onClear} variant="outline" size="sm">
          {clearText}
        </Button>
      )}
    </div>
  );
};

