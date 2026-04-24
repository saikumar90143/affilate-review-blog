"use client";

import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import Image from "next/image";
import AffiliateButton from "./AffiliateButton";

export default function ComparisonMatrix({ currentProduct, rivals, postSlug }) {
  if (!currentProduct || !rivals || rivals.length === 0) return null;

  const allProducts = [currentProduct, ...rivals].slice(0, 3);

  const features = [
    { name: "Global Rating", key: "rating" },
    { name: "Performance", key: "scores.performance" },
    { name: "Build Quality", key: "scores.build" },
    { name: "Value Score", key: "scores.value" }
  ];

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div className="my-16 reveal-up">
      <div className="glass-premium rounded-[3rem] border border-primary-500/20 shadow-premium overflow-hidden">
        <div className="bg-primary-500/5 p-8 border-b border-white/5">
          <h3 className="text-2xl font-black text-white flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary-500" />
            Intelligence Comparison Matrix
          </h3>
          <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">Scanning top tier category rivals</p>
        </div>

        <div className="overflow-x-auto no-scrollbar mask-edge-right relative">
          {/* Mobile Swipe Hint */}
          <div className="md:hidden absolute top-4 right-4 z-30 pointer-events-none animate-pulse flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-600/80 backdrop-blur-md border border-white/20 text-[8px] font-black uppercase tracking-[0.2em] shadow-glow">
            Swipe Intel <ArrowRight className="w-2.5 h-2.5" />
          </div>

          <table className="w-full text-left border-separate border-spacing-0 min-w-[650px] table-fixed">
            <thead>
              <tr className="border-b border-white/5 bg-black/40">
                <th className="p-4 md:p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] w-32 md:w-48 sticky left-0 z-20 bg-[#0d0d12] border-r border-white/5">Feature Intel</th>
                {allProducts.map((p, i) => (
                  <th key={p._id} className="p-4 md:p-6 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl p-2 shadow-glow">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>
                      <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider ${i === 0 ? 'text-primary-400' : 'text-white'} line-clamp-1 px-1`}>
                        {p.title}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {features.map((feature, fIdx) => (
                <tr key={fIdx} className="hover:bg-white/5 transition-colors border-b border-white/5">
                  <td className="p-4 md:p-6 py-6 md:py-8 sticky left-0 z-20 bg-[#0d0d12] border-r border-white/5">
                    <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">{feature.name}</span>
                  </td>
                {allProducts.map((p, i) => {
                  const val = getNestedValue(p, feature.key);
                  const isBest = val >= Math.max(...allProducts.map(prod => getNestedValue(prod, feature.key)));

                  return (
                    <td key={p._id} className="p-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-lg font-black ${isBest ? 'text-primary-400' : 'text-white'}`}>
                          {feature.key === "rating" ? `${val}/5` : `${val}%`}
                        </span>
                        {isBest && (
                          <span className="text-[8px] font-black text-primary-500 uppercase tracking-[0.2em]">Top Pick</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
              ))}

              {/* Pro Comparison */}
              <tr className="bg-black/60 border-b border-white/5">
                <td className="p-4 md:p-6 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest sticky left-0 z-20 bg-[#0d0d12] border-r border-white/5">Core Advantage</td>
                {allProducts.map((p) => (
                  <td key={p._id} className="p-6 px-4">
                    <div className="flex items-start gap-2 justify-center">
                      <Check className="w-3 h-3 text-green-500 mt-1 shrink-0" />
                      <span className="text-[10px] font-bold text-gray-300 leading-tight">{p.pros?.[0] || "N/A"}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 md:p-6 sticky left-0 z-20 bg-[#0d0d12] border-r border-white/5"></td>
                {allProducts.map((p) => (
                  <td key={p._id} className="p-6 text-center">
                    <AffiliateButton
                      url={p.affiliateLink}
                      productId={p._id}
                      postSlug={postSlug}
                      className="px-4 py-3 text-[9px] font-black rounded-xl w-full"
                      text="Check Price"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
