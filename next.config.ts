import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images come from the Rackvise tenant CDN and may live on any host.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
