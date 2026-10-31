// Public storefront configuration for the guest-only Rackvise storefront.
// Values resolve from NEXT_PUBLIC_* env vars. Both baseUrl and apiKey are
// required — there is no baked-in fallback because shipping a live API key in
// the client bundle exposes the tenant catalog to anyone who reads it.

declare const process: { env: Record<string, string | undefined> };

const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL;
const apiKey = process.env.NEXT_PUBLIC_STOREFRONT_API_KEY;

if (!baseUrl || !apiKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_STOREFRONT_URL or NEXT_PUBLIC_STOREFRONT_API_KEY. " +
      "Copy .env.example to .env.local and fill in your tenant values.",
  );
}

export const storefrontConfig = {
  baseUrl,
  apiKey,
  currency: process.env.NEXT_PUBLIC_STOREFRONT_CURRENCY || "USD",
};
