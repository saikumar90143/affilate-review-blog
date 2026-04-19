"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import AffiliateButton from "./AffiliateButton";

export default function QuickConvertBar({ product, postSlug }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 800px or past the initial hero area
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 inset-x-0 z-[70] lg:hidden p-4"
        >
          <div className="glass-premium rounded-[2rem] border border-primary-500/20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
               <div className="relative w-12 h-12 rounded-xl bg-white p-2 shrink-0 shadow-inner">
                  <Image 
                    src={product.image} 
                    alt={product.title} 
                    fill 
                    sizes="48px"
                    className="object-contain" 
                  />
               </div>
               <div className="min-w-0">
                  <h4 className="text-[11px] font-black text-white truncate uppercase tracking-wider">{product.title}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                     <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                     <span className="text-[10px] font-bold text-gray-400">{product.rating} / 5</span>
                  </div>
               </div>
            </div>

            <div className="shrink-0">
               <AffiliateButton 
                 url={product.affiliateLink} 
                 productId={product._id} 
                 postSlug={postSlug}
                 className="px-5 py-3 text-[10px] font-black rounded-2xl shadow-glow py-3" 
                 text="Check Price"
               />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
