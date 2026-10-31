import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are stored on UploadThing (served from utfs.io). Locking
    // this down to the real CDN host(s) prevents the Next image optimizer from
    // being abused as an open proxy / SSRF surface (the previous "**" wildcard
    // allowed any host over both http and https).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.utfs.io",
      },
      {
        protocol: "https",
        hostname: "uploadthingusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.uploadthingusercontent.com",
      },
    ],
  },
};

export default nextConfig;
