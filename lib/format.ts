import { storefrontConfig } from "./storefront";

const currencyMap: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  MAD: "DH ",
};

/** Format an amount using the configured storefront currency. */
export function formatPrice(amount: number | null | undefined): string {
  const value = Number(amount ?? 0);
  const currency = storefrontConfig.currency;
  if (currency === "MAD") {
    return `${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currencyMap.MAD}`;
  }
  const symbol = currencyMap[currency] ?? "";
  return `${symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Percentage saved between an old price and the current price. */
export function discountPercent(
  price: number,
  oldPrice?: number | null,
): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
