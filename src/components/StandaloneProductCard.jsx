"use client";

import Image from "next/image";
import AffiliateButton from "./AffiliateButton";
import { useComparison } from "@/context/ComparisonContext";
import { BarChart2, Check, Award, ShieldCheck } from "lucide-react";

export default function StandaloneProductCard({ product, postSlug, badge }) {
  const { selectedIds, toggleProduct } = useComparison();
  if (!product) return null;

  const isSelected = selectedIds.includes(product._id.toString());

  return (
    <div className="my-12 reveal-up">
      <div className="group relative glass-premium rounded-[2.5rem] border-white/5 p-8 md:p-10 shadow-premium hover:border-primary-500/30 transition-all duration-500 hover-lift">
        {/* Award Badge */}
        {badge && (
          <div className="absolute -top-5 left-10 z-20 bg-gradient-to-r from-yellow-500 to-orange-600 text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-tighter shadow-2xl flex items-center gap-2 ring-4 ring-dark-bg animate-pulse-subtle">
             <Award className="w-4 h-4" /> {badge}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Product Image Section */}
          <div className="w-full md:w-2/5 aspect-square relative bg-white rounded-[2rem] p-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] group-hover:shadow-none transition-all duration-500">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 30vw"
            />
            
            {/* Compare Toggle */}
            <button
              onClick={() => toggleProduct(product._id.toString())}
              className={`absolute top-4 left-4 p-3 rounded-2xl border transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl
                ${isSelected
                  ? "bg-primary-600 border-primary-500 text-white scale-105"
                  : "bg-dark-bg/80 backdrop-blur-xl border-white/10 text-white hover:bg-primary-600"
                }`}
            >
              {isSelected ? <Check className="w-3.5 h-3.5" /> : <BarChart2 className="w-3.5 h-3.5" />}
              {isSelected ? "Selected" : "Compare"}
            </button>
          </div>

          {/* Product Details Section */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-6">
               <div className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3" /> Lab Verified
               </div>
               <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                  <StarIcon className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-black text-yellow-500">{product.rating}</span>
               </div>
            </div>

            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter group-hover:text-primary-400 transition-colors">
              {product.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {product.pros && product.pros.length > 0 && (
                <ul className="space-y-2">
                  {product.pros.slice(0, 3).map((p, i) => (
                    <li key={i} className="flex items-start text-sm font-medium text-gray-400">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                         <Check className="w-3 h-3 text-green-500" />
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
              )}
              {product.cons && product.cons.length > 0 && (
                <ul className="space-y-2 opacity-50">
                  {product.cons.slice(0, 3).map((c, i) => (
                    <li key={i} className="flex items-start text-sm font-medium text-gray-500">
                      <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                         <span className="text-[10px]">✕</span>
                      </div>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
              {product.links && product.links.length > 0 ? (
                product.links.map((link, idx) => (
                  <AffiliateButton
                    key={idx}
                    url={link.url}
                    platform={link.platform}
                    productId={product._id.toString()}
                    postSlug={postSlug}
                    className="px-8 py-4 text-sm font-black rounded-2xl shadow-glow"
                  />
                ))
              ) : (
                <AffiliateButton
                  url={product.affiliateLink}
                  productId={product._id?.toString()}
                  postSlug={postSlug}
                  className="px-8 py-4 text-sm font-black rounded-2xl shadow-glow"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
