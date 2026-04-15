"use client";

import { useEffect, useRef } from "react";
import { X, ArrowLeft } from "lucide-react";

export default function Drawer({ open, onClose, title, children }) {
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Elite Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Centered Modal - Glass Premium */}
      <div className={`fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none transition-all duration-200 ${open ? "opacity-100" : "opacity-0 delay-100"}`}>
        <aside
          ref={drawerRef}
          className={`relative w-full max-w-5xl max-h-[95vh] bg-[#0a0a0a]/95 border border-white/10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)]
            flex flex-col overflow-hidden pointer-events-auto transition-transform duration-300 ease-out
            ${open ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Header - High Fidelity */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0 bg-black/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
               <button 
                 onClick={onClose}
                 className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 md:hidden"
               >
                 <ArrowLeft className="w-5 h-5" />
               </button>
               <h2 className="text-2xl font-black tracking-tighter premium-gradient">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all border border-white/10 group"
              aria-label="Close popup"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Scrollable Content - Boutique Scrollbar */}
          <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar overscroll-contain transform-gpu">
            <div className="mx-auto">
               {children}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
