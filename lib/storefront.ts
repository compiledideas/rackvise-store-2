// Public storefront configuration for the guest-only Rackvise storefront.
// Values resolve from NEXT_PUBLIC_* env vars, with a demo tenant fallback so
// the app runs out of the box without any setup.

const DEFAULT_BASE_URL = "https://kidoo.compiledideas.dev";
const DEFAULT_API_KEY = "rv_live_32d00408a2c41bb737860d3ec788aa97af961288219efc7c";

declare const process: { env: Record<string, string | undefined> };

export const storefrontConfig = {
  baseUrl: process.env.NEXT_PUBLIC_STOREFRONT_URL || DEFAULT_BASE_URL,
  apiKey: process.env.NEXT_PUBLIC_STOREFRONT_API_KEY || DEFAULT_API_KEY,
  currency: process.env.NEXT_PUBLIC_STOREFRONT_CURRENCY || "USD",
};
