"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useCurrencySymbol } from "@/hooks/useCurrencySymbol";

interface PriceProps {
  amount: number | null | undefined;
  oldAmount?: number | null | undefined;
  className?: string;
}

/**
 * Formatted price with an optional struck-through old price.
 * Currency symbol comes from the store config via the storefront SDK.
 */
export function Price({ amount, oldAmount, className }: PriceProps) {
  const symbol = useCurrencySymbol();
  const hasOld = !!oldAmount && oldAmount > (amount ?? 0);

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="text-[15px] font-bold text-ink tabular-nums">
        {formatPrice(amount, symbol)}
      </span>
      {hasOld ? (
        <span className="text-xs font-medium text-ink-soft tabular-nums line-through">
          {formatPrice(oldAmount, symbol)}
        </span>
      ) : null}
    </span>
  );
}
