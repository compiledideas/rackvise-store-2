"use client";

import { useStorefrontStats } from "@rackvise/storefront-sdk";
import type { StorefrontStats } from "@rackvise/storefront-sdk";
import { cn } from "@/lib/utils";

// The live API also returns deliveredOrders / onlineOrders; the SDK's
// StorefrontStats type (v0.5.0) only declares totalOrders. Accept both shapes.
type LiveStorefrontStats = StorefrontStats & {
  deliveredOrders?: number;
  onlineOrders?: number;
};

/**
 * Store totals as an editorial figures row — big display numerals divided by
 * hairlines. Adapts to whichever stats the API returns.
 */
export function StatStrip() {
  const { data, isLoading } = useStorefrontStats();
  const stats = data as LiveStorefrontStats | undefined;

  const hasOrderSplit =
    typeof stats?.deliveredOrders === "number" ||
    typeof stats?.onlineOrders === "number";

  const figures = [
    { label: "Products in catalogue", value: stats?.totalProducts },
    { label: "Units in stock", value: stats?.totalStock },
    ...(hasOrderSplit
      ? [
          { label: "Orders delivered", value: stats?.deliveredOrders ?? 0 },
          { label: "Online orders", value: stats?.onlineOrders ?? 0 },
        ]
      : [{ label: "Orders placed", value: stats?.totalOrders }]),
  ];

  return (
    <section className="page-wrap">
      <dl
        className={cn(
          "grid grid-cols-2 gap-px border border-line bg-line",
          figures.length === 4 ? "lg:grid-cols-4" : "sm:grid-cols-3",
        )}
      >
        {figures.map(({ label, value }) => (
          <div key={label} className="bg-surface p-6">
            <dd className="display-title text-3xl text-ink tabular-nums sm:text-4xl">
              {isLoading ? "—" : (value ?? 0).toLocaleString("en-US")}
            </dd>
            <dt className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
              {label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
