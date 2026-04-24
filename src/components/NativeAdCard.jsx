"use client";

import GlowCard from "./GlowCard";
import { ExternalLink, Sparkles } from "lucide-react";

export default function NativeAdCard({ 
  title = "Unlock Your Ultimate Setup", 
  description = "Get 20% off the highest-rated gear across all categories. Limited time offer for Elite Intelligence readers.", 
  cta = "Shop Sale Now", 
  link = "#", 
  image = "https://res.cloudinary.com/dvsb7rq4q/image/upload/v1776586909/affiliate-blog/fn9vifoon6k9mdt5d5hx.avif" 
}) {
  return (
    <div className="scroll-mt-24">
      <div className="flex items-center gap-4 mb-4 opacity-50">
        <div className="w-12 h-12 flex items-center justify-center font-black text-xs uppercase tracking-widest text-primary-400">
          Ad
        </div>
      </div>
      
      <GlowCard className="bg-[#08080c] rounded-3xl overflow-hidden border border-primary-500/10 flex flex-col md:flex-row group" spotlightColor="rgba(59, 130, 246, 0.05)">
        <div className="relative w-full md:w-1/3 p-8 min-h-[250px] shrink-0 border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center bg-[url('/noise.svg')] bg-opacity-20 blend-overlay">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 to-transparent"></div>
          <img 
            src={image} 
            alt="Advertisement" 
            className="w-full h-full object-cover rounded-2xl border border-white/10 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 relative z-10" 
          />
        </div>
        <div className="p-8 flex flex-col justify-between w-full relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-full mb-4 border border-white/10">
              <Sparkles className="w-3 h-3 text-primary-400" />
              Sponsor Showcase
            </div>
            <h3 className="text-2xl font-black mb-3">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {description}
            </p>
          </div>
          
          <div className="flex">
            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-white/10 hover:bg-primary-600 text-white rounded-xl font-bold text-center text-xs uppercase tracking-wider transition-all border border-white/10 group-hover:border-primary-500">
              {cta} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
