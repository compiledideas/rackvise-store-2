"use client";

import { useStorefrontConfig } from "@rackvise/storefront-sdk";

export interface ShippingQuote {
  /** Shipping cost for the given subtotal. */
  fee: number;
  /** Flat fee configured on the store (before any free-shipping waiver). */
  baseFee: number;
  /** Free-shipping threshold — 0 means the mechanic is not configured. */
  threshold: number;
  /** Whether this order qualifies for free shipping. */
  freeShipping: boolean;
  /** Amount left to spend to unlock free shipping (0 when not applicable). */
  remainingForFree: number;
}

/**
 * Shipping quote based on the merchant's store config
 * (`shippingFee` + `freeShippingThreshold`), served by the storefront SDK.
 */
export function useShippingQuote(subtotal: number): ShippingQuote {
  const { data: config } = useStorefrontConfig({ staleTime: 5 * 60_000 });

  const baseFee = config?.shippingFee ?? 0;
  const threshold = config?.freeShippingThreshold ?? 0;
  const freeShipping = threshold <= 0 || subtotal >= threshold;
  const fee = freeShipping ? 0 : baseFee;
  const remainingForFree = freeShipping
    ? 0
    : Math.max(threshold - subtotal, 0);

  return { fee, baseFee, threshold, freeShipping, remainingForFree };
}
