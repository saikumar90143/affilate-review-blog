"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Replace with actual WhatsApp number
  const phoneNumber = "+919014386620";
  const defaultMessage = encodeURIComponent("Hi, I am interested in your Web Design / Google Ads services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // Hide tooltip automatically after 10 seconds to not be annoying
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-4 pointer-events-none">
      {/* Tooltip */}
      {showTooltip && (
        <div className="relative pointer-events-auto flex items-center bg-dark-bg/90 backdrop-blur-xl border border-white/10 p-3 pr-8 rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.15)] animate-in slide-in-from-bottom-4 fade-in duration-500">
          <button
            onClick={(e) => { e.preventDefault(); setShowTooltip(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#25D366] mb-0.5">Need Clients?</span>
            <span className="text-xs text-white font-medium">Let's grow your business.</span>
          </div>
          {/* Arrow pointing to button */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-dark-bg border-b border-r border-white/10 rotate-45 translate-y-1/2"></div>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <div className="relative group pointer-events-auto">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border border-[#25D366] animate-ping opacity-20 duration-1000"></div>

        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform duration-300"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="w-8 h-8 fill-white/20" />
        </Link>
      </div>
    </div>
  );
}
