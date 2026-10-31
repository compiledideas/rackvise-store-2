"use client";

import { useStorefrontConfig } from "@rackvise/storefront-sdk";
import { currencySymbol } from "@/lib/format";
import { storefrontConfig } from "@/lib/storefront";

/**
 * Currency symbol for price display. Prefers the merchant's store config
 * (served by the storefront SDK), falling back to the env-configured
 * currency while the config request is in flight.
 */
export function useCurrencySymbol(): string {
  const { data } = useStorefrontConfig({ staleTime: 5 * 60_000 });
  if (data?.currencySymbol) return data.currencySymbol;
  if (data?.currency) return currencySymbol(data.currency);
  return currencySymbol(storefrontConfig.currency);
}
