"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  max?: number;
  onDecrease: () => void;
  onIncrease: () => void;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  quantity,
  max,
  onDecrease,
  onIncrease,
  size = "sm",
  className,
}: QuantityStepperProps) {
  const atMax = typeof max === "number" && quantity >= max;
  const btn = size === "md" ? "size-10" : "size-8";

  return (
    <div
      role="group"
      aria-label="Quantity"
      className={cn(
        "inline-flex items-center rounded-sm border border-ink",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className={cn(
          btn,
          "flex items-center justify-center text-ink-soft transition-colors duration-300 hover:bg-ink hover:text-paper",
        )}
      >
        <Minus className="size-3.5" />
      </button>
      <span
        className="w-8 border-x border-ink text-center text-sm font-semibold tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={atMax}
        aria-label="Increase quantity"
        className={cn(
          btn,
          "flex items-center justify-center text-ink-soft transition-colors duration-300 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
