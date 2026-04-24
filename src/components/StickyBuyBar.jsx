"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, ExternalLink, Star, X } from "lucide-react";
import AffiliateButton from "./AffiliateButton";

export default function StickyBuyBar({ product }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!dismissed) {
        setVisible(window.scrollY > 400);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  const primaryLink = product.links?.[0]?.url || product.affiliateLink;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#080810]/95 backdrop-blur-3xl border-t border-white/10 shadow-[0_-10px_60px_rgba(0,0,0,0.6)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Product info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-1 text-yellow-400 shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? "fill-current" : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-white font-black text-sm truncate">
              {product.title}
            </span>
            <span className="hidden md:inline text-[10px] font-black text-primary-400 border border-primary-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
              {product.rating}/5 Score
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {product.links && product.links.length > 0 ? (
              product.links.slice(0, 2).map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    i === 0
                      ? "bg-primary-600 hover:bg-primary-500 text-white shadow-glow"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {i === 0 ? "Buy Now" : link.platform}
                </a>
              ))
            ) : (
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-glow"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Check Price
              </a>
            )}

            <button
              onClick={() => setDismissed(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
