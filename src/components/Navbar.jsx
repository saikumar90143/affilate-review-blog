"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock scroll
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full glass-premium border-b border-white/5 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 relative z-[101]">
          <div className="bg-primary-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-glow">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter premium-gradient">EliteReviews</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link href="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link href="/blog" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Blog</Link>
          <Link href="/comparison" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Compare</Link>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-6">
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="md:hidden relative z-[101] p-2.5 rounded-xl bg-white/5 border border-white/10 text-white transition-all active:scale-90"
             aria-label="Toggle menu"
           >
             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* Boutique Mobile Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
