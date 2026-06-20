"use client";

import { StorefrontProvider } from "@rackvise/storefront-sdk";
import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { storefrontConfig } from "@/lib/storefront";

export function StorefrontProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <StorefrontProvider
        baseUrl={storefrontConfig.baseUrl}
        apiKey={storefrontConfig.apiKey}
      >
        {children}
      </StorefrontProvider>
    </QueryProvider>
  );
}
