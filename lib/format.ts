import { storefrontConfig } from "./storefront";

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  MAD: "DH",
};

/** Resolve the display symbol for a currency code ("USD" → "$"). */
export function currencySymbol(code?: string | null): string {
  if (!code) return "$";
  return currencySymbols[code.toUpperCase()] ?? code.toUpperCase();
}

/**
 * Format an amount with an explicit currency symbol.
 * The symbol should come from the store config API (`currencySymbol`) so the
 * storefront always matches the merchant's setup; env currency is the
 * pre-load fallback.
 */
export function formatPrice(
  amount: number | null | undefined,
  symbol: string = currencySymbol(storefrontConfig.currency),
  options?: Intl.NumberFormatOptions,
): string {
  const value = Number(amount ?? 0);
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });
  const isPrefix = symbol.length === 1;
  return isPrefix ? `${symbol}${formatted}` : `${formatted} ${symbol}`;
}

/** Percentage saved between an old price and the current price. */
export function discountPercent(
  price: number,
  oldPrice?: number | null,
): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
