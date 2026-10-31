"use client";

import { useStorefrontConfig } from "@rackvise/storefront-sdk";
import { useCurrencySymbol } from "@/hooks/useCurrencySymbol";
import { formatPrice } from "@/lib/format";

/**
 * Scrolling value-proposition band under the hero. Content is derived from
 * the store config where possible (e.g. the free-shipping threshold).
 */
export function ValueMarquee() {
  const { data: config } = useStorefrontConfig({ staleTime: 5 * 60_000 });
  const symbol = useCurrencySymbol();

  const items: string[] = [];
  if (config && config.freeShippingThreshold > 0) {
    items.push(
      `Free shipping on orders over ${formatPrice(config.freeShippingThreshold, symbol)}`,
    );
  }
  items.push("Cash on delivery", "No account needed", "Secure checkout", "Easy returns");

  return (
    <div className="overflow-hidden border-b border-line bg-ink py-3 text-paper">
      <div className="animate-marquee flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="flex items-center gap-7 pe-7 text-[12px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap"
              >
                {item}
                <span className="size-1.5 bg-accent" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
