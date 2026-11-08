import React from "react";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
  iconClassName?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  className,
  iconClassName,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400 select-none",
        className
      )}
      aria-hidden="true"
    >
      <Utensils className={cn("w-8 h-8 opacity-40", iconClassName)} />
    </div>
  );
};

