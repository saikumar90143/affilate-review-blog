import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Allow any HTTPS image source — required for an affiliate/review site
        // where product images come from Amazon, Flipkart, Cloudinary, Unsplash, etc.
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Tuned to real breakpoints — avoids generating oversized intermediate sizes
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 30 days (default is 60s)
    minimumCacheTTL: 2592000,
    // Reduce default quality slightly — AVIF/WebP compensate with better compression
    dangerouslyAllowSVG: false,
    qualities: [60, 70, 75, 80, 82, 85],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  serverExternalPackages: ["jsdom", "cheerio", "sanitize-html"],
};

export default nextConfig;
