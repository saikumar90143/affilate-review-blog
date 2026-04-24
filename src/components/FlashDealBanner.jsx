"use client";

import { useState, useEffect } from "react";
import { Copy, Gift, CheckCircle2, Clock } from "lucide-react";

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center px-2 py-1 bg-black/40 rounded-lg min-w-[40px] backdrop-blur-sm border border-white/10">
      <span className="text-base font-black tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[8px] font-black uppercase tracking-widest text-white/50 mt-0.5">
        {label}
      </span>
    </div>
  );
}

export default function FlashDealBanner({ headline, code, expiresAt }) {
  const [copied, setCopied] = useState(false);
  const [expired, setExpired] = useState(false);
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  useEffect(() => {
    if (!expiresAt) {
      setTime({ h: 24, m: 0, s: 0 }); // No expiry — show static value
      return;
    }

    const tick = () => {
      const diff = new Date(expiresAt) - new Date();
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTime({
        h: Math.floor(diff / (1000 * 60 * 60)),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (expired) return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white py-3 px-4 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border border-white/20">
      {/* Glare effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-20 w-24 h-24 bg-white/20 rounded-full blur-[40px] pointer-events-none" />

      {/* Left: Headline */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
          <Gift className="w-4 h-4" />
        </div>
        <p className="font-black text-sm tracking-wide">{headline}</p>
      </div>

      {/* Right: Code + Countdown */}
      <div className="flex items-center gap-3 relative z-10">
        {code && (
          <button
            onClick={copyCode}
            className="flex items-center gap-2 bg-black/30 hover:bg-black/50 border border-white/20 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all backdrop-blur-md"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : code}
          </button>
        )}

        {/* Segmented Countdown */}
        <div className="flex items-center gap-1 text-white">
          <Clock className="w-3.5 h-3.5 opacity-70 shrink-0" />
          {expiresAt ? (
            <div className="flex items-center gap-1">
              <TimeBlock value={time.h} label="HRS" />
              <span className="font-black text-sm opacity-70">:</span>
              <TimeBlock value={time.m} label="MIN" />
              <span className="font-black text-sm opacity-70">:</span>
              <TimeBlock value={time.s} label="SEC" />
            </div>
          ) : (
            <span className="text-xs font-black bg-black/30 px-3 py-1.5 rounded-xl tracking-widest">
              Limited Time
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
