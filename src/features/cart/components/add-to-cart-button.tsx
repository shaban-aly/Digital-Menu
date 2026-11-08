"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";
import { MenuItem } from "@/features/menu/types";
import { useCart } from "../hooks/use-cart";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  item: MenuItem;
  size?: "sm" | "md" | "lg";
  className?: string;
  showStepper?: boolean;
  label?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  size = "md",
  className,
  showStepper = true,
  label,
}) => {
  const { getItemQuantity, addItem, updateQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  if (!item.is_available) {
    return null;
  }

  // If item is already in cart and showStepper is true, render (-) [qty] (+)
  if (showStepper && quantity > 0) {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/40 p-1 shadow-sm select-none",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => updateQuantity(item.id, quantity - 1)}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="min-w-[28px] text-center font-bold text-sm text-brand-900 dark:text-brand-100">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => addItem(item, 1)}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Default Quick Add Button (+)
  return (
    <button
      type="button"
      data-testid={`add-to-cart-${item.id}`}
      onClick={(e) => {
        e.stopPropagation();
        addItem(item, 1);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-bold transition-all select-none shadow-sm cursor-pointer",
        "bg-brand-600 text-white hover:bg-brand-700 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        // Minimum 44x44px touch target per Constitution Principle IV
        "min-h-[44px] min-w-[44px]",
        {
          "p-2 text-xs": size === "sm",
          "px-3 py-2 text-sm": size === "md",
          "px-4 py-2.5 text-base": size === "lg",
        },
        className
      )}
      aria-label={`Add ${item.name_ar} to order`}
    >
      <Plus className={cn("w-4 h-4", label && "me-1.5")} />
      {label && <span>{label}</span>}
    </button>
  );
};
