"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  max?: number;
  onDecrease: () => void;
  onIncrease: () => void;
  className?: string;
}

export function QuantityStepper({
  quantity,
  max,
  onDecrease,
  onIncrease,
  className,
}: QuantityStepperProps) {
  const atMax = typeof max === "number" && quantity >= max;
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-gray-200 bg-white",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:text-shop_dark_green hoverEffect"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={atMax}
        aria-label="Increase quantity"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:text-shop_dark_green hoverEffect",
          atMax && "cursor-not-allowed opacity-40 hover:text-gray-600",
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
