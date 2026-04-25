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
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  serverExternalPackages: ["jsdom", "cheerio", "sanitize-html"],
};

export default nextConfig;
