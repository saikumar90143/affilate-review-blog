"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Zap, Menu, X, Search, Bookmark } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const MobileMenu = dynamic(() => import("./MobileMenu"), { ssr: false });
const SearchOverlay = dynamic(() => import("./SearchOverlay"), { ssr: false });

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Close everything on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Global Keyboard Shortcut: Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock scroll
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen, isSearchOpen]);

  return (
    <>
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
          <Link href="/products" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Products</Link>
          <Link href="/comparison" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Compare</Link>
          <Link href="/watchlist" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5" /> Watchlist
          </Link>
          
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-400 hover:text-primary-500 transition-colors bg-white/5 rounded-lg border border-white/10" 
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsSearchOpen(true)}
             className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white transition-all shadow-glow" 
             aria-label="Search"
           >
             <Search className="w-5 h-5" />
           </button>
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="md:hidden relative z-[101] p-2.5 rounded-xl bg-white/5 border border-white/10 text-white transition-all active:scale-90"
             aria-label="Toggle menu"
           >
             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>
      </header>

      {/* Mobile & Search Overlays */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
