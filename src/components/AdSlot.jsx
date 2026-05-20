"use client";

import { useEffect, useRef, useState } from "react";
import { Info, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

const FALLBACK_BANNERS = [
  {
    title: "Compare Gear Head-to-Head",
    description: "Select, match, and analyze products side-by-side in our interactive Comparison Studio.",
    btnText: "Open Comparison Studio",
    link: "/comparison",
    badge: "Interactive Tool",
    gradient: "from-primary-600/20 via-[#0d0d15] to-cyan-500/10 border-primary-500/30",
  },
  {
    title: "Lab-Tested Product Database",
    description: "Browse sponsor-free evaluations and detailed ratings on elite consumer tech.",
    btnText: "Browse Reviews",
    link: "/products",
    badge: "Tested by Experts",
    gradient: "from-purple-600/20 via-[#0d0d15] to-primary-500/10 border-purple-500/30",
  },
  {
    title: "S24 Ultra Deep Dive",
    description: "Check out our hands-on performance benchmark and display analysis of Samsung's flagship.",
    btnText: "Read S24 Ultra Review",
    link: "/reviews/samsung-s24-ultra",
    badge: "Top Pick Review",
    gradient: "from-cyan-600/20 via-[#0d0d15] to-blue-500/10 border-cyan-500/30",
  }
];

export default function AdSlot({ className = "", responsive = true }) {
  const adRef = useRef(null);
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

  const [isBlocked, setIsBlocked] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    // Avoid SSR hydration issues by choosing index on client mount
    setBannerIndex(Math.floor(Math.random() * FALLBACK_BANNERS.length));
  }, []);

  useEffect(() => {
    if (!adClient || typeof window === "undefined") return;

    // Use a small delay to push Google adsbygoogle array
    const timer = setTimeout(() => {
      try {
        if (adRef.current && adRef.current.offsetWidth > 0) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.error("AdSense render error:", e);
      }
    }, 500);

    // Dynamic Ad Blocker Detection
    const checkAdBlocker = async () => {
      try {
        // Try fetching a signature AdSense URL (will fail if blocked by adblockers)
        await fetch(
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
          {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-store",
          }
        );
        
        // Even if the fetch succeeds, verify if the display height is zero after layout settles
        setTimeout(() => {
          if (adRef.current && adRef.current.clientHeight === 0) {
            setIsBlocked(true);
          }
        }, 1500);
      } catch (error) {
        console.log("[AdSlot] AdBlock detected via blocked AdSense request.");
        setIsBlocked(true);
      }
    };

    checkAdBlocker();

    return () => clearTimeout(timer);
  }, [adClient]);

  // If no AdSense configured, display the placeholder
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

  // If ad blocker is detected, render the premium fallback affiliate banner
  if (isBlocked) {
    const banner = FALLBACK_BANNERS[bannerIndex];
    return (
      <div className={`relative group overflow-hidden rounded-2xl border transition-all duration-500 ${banner.gradient} ${className}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[200px] z-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[9px] font-black uppercase tracking-widest text-primary-400 mb-3">
              <Shield className="w-3.5 h-3.5 text-primary-400" /> {banner.badge}
            </span>
            <h4 className="text-lg md:text-xl font-black text-white mb-2 tracking-tight">
              {banner.title}
            </h4>
            <p className="text-gray-400 text-xs md:text-sm font-light max-w-xl leading-relaxed">
              {banner.description}
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link
              href={banner.link}
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
            >
              {banner.btnText} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 border border-white/5 rounded text-[8px] text-gray-600 uppercase pointer-events-none">
          Ad Sponsor
        </div>
      </div>
    );
  }

  // Normal Ad slot
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
