"use client";

import { ShoppingCart, ExternalLink, Box } from "lucide-react";

export default function AffiliateButton({ url, platform, text, productId, postSlug, className = "" }) {
  const handleClick = () => {
    if (!productId) return;
    
    // Fire and forget tracking
    fetch("/api/tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, platform, postSlug }),
    }).catch(() => {}); // silent fail
  };

  // Auto-detect platform from URL if not provided
  const getPlatformInfo = () => {
    const lowUrl = url?.toLowerCase() || "";
    
    // Explicit platform or auto-detect
    const target = platform || (
      lowUrl.includes("amazon") ? "Amazon" :
      lowUrl.includes("flipkart") ? "Flipkart" :
      lowUrl.includes("walmart") ? "Walmart" :
      lowUrl.includes("ebay") ? "eBay" :
      "Store"
    );

    const configs = {
      "Amazon": {
        bg: "bg-[#FF9900]",
        text: "text-black",
        label: text || "Check on Amazon",
        icon: <ShoppingCart className="w-4 h-4 mr-2" />
      },
      "Flipkart": {
        bg: "bg-[#2874f0]",
        text: "text-white",
        label: text || "Buy on Flipkart",
        icon: <Box className="w-4 h-4 mr-2" />
      },
      "Walmart": {
        bg: "bg-[#0071ce]",
        text: "text-white",
        label: text || "View on Walmart",
        icon: <ShoppingCart className="w-4 h-4 mr-2" />
      },
      "Default": {
        bg: "bg-primary-600",
        text: "text-white",
        label: text || `Check Price`,
        icon: <ExternalLink className="w-4 h-4 mr-2" />
      }
    };

    return configs[target] || configs["Default"];
  };

  const info = getPlatformInfo();

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold transition-all hover:scale-105 shadow-lg ${info.bg} ${info.text} ${className}`}
    >
      {info.icon}
      {info.label}
    </a>
  );
}
