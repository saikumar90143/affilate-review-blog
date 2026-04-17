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
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  serverExternalPackages: ["isomorphic-dompurify", "jsdom", "html-encoding-sniffer"],
};

export default nextConfig;
