"use client";

import Link from "next/link";
import { ArrowRight, Code2, Zap } from "lucide-react";

export default function ServicesSection() {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-dark-bg/50 border-t border-white/5">
      <div className="max-w-5xl mx-auto relative z-10 glass-premium p-10 md:p-16 rounded-[3rem] border border-white/10 text-center group hover:border-primary-500/30 transition-all duration-500 hover-lift shadow-premium">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem] pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-glow">
          <Zap className="w-3.5 h-3.5" /> Elite Digital Agency
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
          Looking for an <span className="premium-gradient">Expert Web Designer</span> <br className="hidden md:block" />
          & Google Ads Manager?
        </h2>
        
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed mb-10">
          We don't just review elite tech—we build elite businesses. Partner with us for high-performance Web Design and precision-targeted Google Ads campaigns designed to dominate your market.
        </p>

        <Link 
          href="/services" 
          className="inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-white text-black text-sm md:text-base font-black transition-all hover:bg-gray-200 hover:scale-105 shadow-[0_10px_40px_rgba(255,255,255,0.2)] gap-3"
        >
          View Our Expert Services <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
