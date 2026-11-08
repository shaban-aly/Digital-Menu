import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          "disabled:opacity-50 disabled:pointer-events-none rounded-xl",
          // Minimum 44x44px touch target per Constitution Principle IV
          "min-h-[44px] min-w-[44px]",
          {
            "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800":
              variant === "primary",
            "bg-brand-100 text-brand-800 hover:bg-brand-200":
              variant === "secondary",
            "border border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100":
              variant === "outline",
            "bg-transparent hover:bg-neutral-100": variant === "ghost",
            "text-sm px-3 py-1.5": size === "sm",
            "text-base px-4 py-2": size === "md",
            "text-lg px-6 py-3": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

