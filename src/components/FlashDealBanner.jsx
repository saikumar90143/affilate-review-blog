"use client";

import { useState, useEffect } from "react";
import { Copy, Gift, CheckCircle2 } from "lucide-react";

export default function FlashDealBanner({ headline, code, expiresAt }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  useEffect(() => {
    if (!expiresAt) return;
    
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt) - new Date();
      if (difference <= 0) return "Expired";
      
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const displayTime = expiresAt ? timeLeft : "Limited Time";

  if (displayTime === "Expired") return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 mb-8 border border-white/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] pointer-events-none" />
      
      <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-center md:justify-start">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
           <Gift className="w-4 h-4 text-white" />
        </div>
        <p className="font-bold text-sm tracking-wide">{headline}</p>
      </div>

      <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-center md:justify-end">
        {code && (
           <button 
             onClick={copyCode}
             className="flex items-center gap-2 bg-black/30 hover:bg-black/40 border border-white/20 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-colors backdrop-blur-md"
           >
             {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
             {copied ? "Copied" : code}
           </button>
        )}
        <div className="bg-black/50 px-3 py-1.5 rounded-lg text-xs font-black tracking-widest text-red-300 backdrop-blur-md">
           ⏳ {displayTime}
        </div>
      </div>
    </div>
  );
}
