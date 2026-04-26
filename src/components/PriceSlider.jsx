"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Info, Star } from "lucide-react";
import AffiliateButton from "./AffiliateButton";

export default function PriceSlider({ products }) {
  // Find actual min/max from products to set slider bounds
  const bounds = useMemo(() => {
    const prices = products.map(p => p.price).filter(p => p > 0);
    if (!prices.length) return { min: 0, max: 200000 };
    return {
      min: Math.max(0, Math.floor(Math.min(...prices) / 1000) * 1000),
      max: Math.ceil(Math.max(...prices) / 1000) * 1000 + 1000 // Add small buffer
    };
  }, [products]);

  const [priceRange, setPriceRange] = useState(200000);

  // Sync priceRange if bounds change (e.g. products load)
  useEffect(() => {
    if (bounds.max > 0) {
      setPriceRange(bounds.max);
    }
  }, [bounds]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.price <= priceRange && p.price > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [products, priceRange]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden bg-[#050508]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 md:mb-24 gap-12">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Price Navigator
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              Find the Best Mobile <br />
              <span className="premium-gradient">In Your Budget</span>
            </h2>
            <p className="text-gray-400 font-light text-sm md:text-lg">
              Drag the slider to filter our database of laboratory-tested smartphones based on your spending limit.
            </p>
          </div>

          {/* Slider UI Card */}
          <div className="w-full max-w-md glass-premium p-8 rounded-[2.5rem] border-white/10 shadow-2xl">
            <div className="flex justify-between items-end mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Your Budget</span>
                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                  {formatPrice(priceRange)}
                </span>
              </div>
              <div className="text-[10px] font-black text-primary-500 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-lg">
                Flexible Limit
              </div>
            </div>

            <div className="relative h-12 flex items-center group">
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={5000}
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-400 transition-all focus:outline-none"
                style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(priceRange - bounds.min) / (bounds.max - bounds.min) * 100}%, rgba(255,255,255,0.1) ${(priceRange - bounds.min) / (bounds.max - bounds.min) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              {/* Custom Tooltip on Thumb would be better but let's keep it clean */}
            </div>
            
            <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              <span>{formatPrice(bounds.min)}</span>
              <span>{formatPrice(bounds.max)}</span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod, idx) => (
                <motion.div
                  key={prod._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-[#0d0d12] rounded-[2.5rem] p-4 border border-white/5 hover:border-primary-500/30 transition-all duration-500 shadow-premium flex flex-col h-full"
                >
                  <div className="relative aspect-square bg-white rounded-[2rem] overflow-hidden mb-8 shadow-inner flex items-center justify-center p-8 shrink-0">
                    <Image 
                      src={prod.image || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} 
                      alt={prod.title} 
                      fill 
                      sizes="(max-width: 640px) 50vw, 250px" 
                      className="object-contain p-6 group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                      {formatPrice(prod.price)}
                    </div>
                  </div>

                  <div className="px-4 pb-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-black">{prod.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Expert Pick</span>
                    </div>
                    
                    <h3 className="text-lg font-black mb-auto line-clamp-1 group-hover:text-primary-400 transition-colors">
                      {prod.title}
                    </h3>

                    <div className="mt-8 space-y-3">
                      <AffiliateButton url={prod.affiliateLink} text="Check Price" className="w-full py-3.5 text-xs font-black rounded-xl" />
                      <Link href={`/reviews/${prod.slug}`} className="w-full py-3 px-4 rounded-xl border border-white/5 hover:bg-white/5 text-[9px] font-black text-gray-500 flex items-center justify-center gap-2 uppercase tracking-[0.2em] transition-all">
                        Deep Intel <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full py-20 text-center glass-premium rounded-[3rem] border-dashed border-white/10"
              >
                <div className="p-6 bg-white/5 w-fit mx-auto rounded-full mb-6">
                  <Info className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-black mb-2">No Lab Reports in this Range</h3>
                <p className="text-gray-500 font-light">Try increasing your budget for flagship results.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
