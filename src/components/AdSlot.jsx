"use client";

import { useEffect, useRef } from "react";
import { Info } from "lucide-react";

export default function AdSlot({ className = "", responsive = true }) {
  const adRef = useRef(null);
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

  useEffect(() => {
    if (adClient && typeof window !== "undefined") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [adClient]);

  if (!adClient) {
    return (
      <div className={`relative group ${className}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-dark-card/50 border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px] text-center overflow-hidden">
          <div className="bg-gray-800 p-3 rounded-full mb-4">
            <Info className="w-6 h-6 text-gray-500" />
          </div>
          <h5 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Space for Revenue</h5>
          <p className="text-gray-500 text-[10px] max-w-[180px] leading-relaxed">
            Add <code>NEXT_PUBLIC_ADSENSE_CLIENT_ID</code> in your .env to activate actual AdSense display here.
          </p>
          <div className="absolute top-2 right-2 px-1.5 py-0.5 border border-white/5 rounded text-[8px] text-gray-600 uppercase">
            Placeholder
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-[250px] flex items-center justify-center overflow-hidden rounded-2xl bg-black/20 border border-white/5 ${className}`}>
      <div className="absolute top-2 right-2 px-1.5 py-0.5 border border-white/5 rounded text-[8px] text-gray-600 uppercase z-10 pointer-events-none">
        Advertisement
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client={adClient}
        data-ad-slot={adSlotId || "auto"}
        data-ad-format={responsive ? "auto" : "rectangle"}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
