import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

interface PriceProps {
  amount: number | null | undefined;
  className?: string;
  oldAmount?: number | null | undefined;
}

/** Displays a formatted price with an optional struck-through old price. */
export function Price({ amount, className, oldAmount }: PriceProps) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-semibold text-shop_dark_green">
        {formatPrice(amount)}
      </span>
      {oldAmount && oldAmount > (amount ?? 0) ? (
        <span className="text-xs font-normal text-zinc-400 line-through">
          {formatPrice(oldAmount)}
        </span>
      ) : null}
    </span>
  );
}
