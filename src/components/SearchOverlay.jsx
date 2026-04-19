"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, X, Loader2, ArrowRight, CornerDownLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SearchOverlay({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Quick search as typing
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setResults(data.posts || []);
      } catch (error) {
        console.error("Quick search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Key handlers
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-start pt-20 sm:pt-32 px-4 sm:px-6">
      <div 
        className="absolute inset-0 bg-[#050505]/95 backdrop-blur-3xl transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl transform transition-all animate-in zoom-in-95 duration-300">
        <div className="glass-premium rounded-[2.5rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="relative p-6 sm:p-8 flex items-center border-b border-white/5">
            <Search className="w-6 h-6 text-primary-500 mr-4" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search intelligence records..."
              className="flex-1 bg-transparent border-none text-white text-xl sm:text-2xl font-light focus:outline-none focus:ring-0 placeholder:text-gray-600"
            />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black tracking-widest text-gray-500 uppercase">
              <CornerDownLeft className="w-3 h-3" /> Enter
            </div>
            <button onClick={onClose} className="ml-6 p-2 rounded-xl hover:bg-white/5 transition-colors text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-4 sm:p-6">
            {loading && query.length >= 2 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Cross-referencing database...</p>
              </div>
            )}
            {!loading && results.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-6 px-4">Instant Matches</p>
                {results.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`} onClick={onClose} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-900 shrink-0 border border-white/5">
                      {post.featuredImage && (
                        <Image 
                          src={post.featuredImage} 
                          alt={post.title} 
                          fill 
                          sizes="64px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-light">{post.excerpt}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
                <button onClick={() => { router.push(`/search?q=${encodeURIComponent(query)}`); onClose(); }} className="w-full mt-6 py-4 rounded-2xl bg-white/5 hover:bg-primary-600 text-white text-[11px] font-black uppercase tracking-widest transition-all">
                  View All Search Records
                </button>
              </div>
            )}
            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500 italic">No specific matches found for this query.</p>
              </div>
            )}
            {!query && (
              <div className="py-12 text-center">
                <p className="text-gray-600 text-[11px] font-black uppercase tracking-[0.2em]">Enter term to search archives</p>
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                   <div className="p-4 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm text-[10px] text-gray-500 uppercase font-black tracking-widest">
                      Press <span className="text-white">Esc</span> to close
                   </div>
                   <div className="p-4 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm text-[10px] text-gray-500 uppercase font-black tracking-widest">
                      Press <span className="text-white">Enter</span> to search
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
