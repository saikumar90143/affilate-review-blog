"use client";

import Link from "next/link";
import { ArrowRight, Globe, Cpu, Code, ShieldCheck, Mail } from "lucide-react";

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Compare", href: "/comparison" },
  ];

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Cinematic Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-bg/40 backdrop-blur-3xl"
        onClick={onClose}
      ></div>

      {/* Solid Opaque Panel - Slide Down */}
      <div className="absolute inset-x-0 top-0 h-[85vh] bg-dark-bg border-b border-white/5 flex flex-col pt-32 pb-12 px-8 reveal-down shadow-[0_20px_100px_rgba(0,0,0,0.8)]">
        
        {/* Navigation Content */}
        <div className="flex-1 space-y-12">
           <div className="flex flex-col gap-2">
              <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Universal Access</span>
              <nav className="flex flex-col">
                {navItems.map((item, idx) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className="text-3xl font-black tracking-tighter text-white hover:text-primary-400 transition-colors py-3 flex items-center justify-between group"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {item.label}
                    <ArrowRight className="w-8 h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-500" />
                  </Link>
                ))}
              </nav>
           </div>

           <div className="h-px bg-white/5 w-2/3"></div>


        </div>

        {/* Boutique Footer Segment */}
        <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-8">
           <div className="flex gap-8 text-gray-500">
              <Globe className="w-5 h-5 hover:text-white transition-colors" />
              <Code className="w-5 h-5 hover:text-white transition-colors" />
              <Cpu className="w-5 h-5 hover:text-white transition-colors" />
              <Mail className="w-5 h-5 hover:text-white transition-colors" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
             © 2026 EliteReviews Edition
           </p>
        </div>
      </div>
    </div>
  );
}
