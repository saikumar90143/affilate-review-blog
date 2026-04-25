"use client";

import { useState, useEffect, useRef } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TableOfContents({ htmlContent }) {
  const [headings, setHeadings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef(null);

  useEffect(() => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    const foundHeadings = Array.from(doc.querySelectorAll("h2, h3")).map((el) => ({
      id: el.innerText.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
      text: el.innerText,
      level: el.tagName.toLowerCase(),
    }));
    setHeadings(foundHeadings);
  }, [htmlContent]);

  useEffect(() => {
    if (headings.length === 0) return;

    if (observerRef.current) observerRef.current.disconnect();

    const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find all visible entries and pick the one closest to the top
        const visibleEntries = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0.1 }
    );

    headingElements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      // Use offsetTop instead of getBoundingClientRect to avoid forced reflow
      const offsetPosition = element.offsetTop - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsOpen(false);
      setActiveId(id);
    }
  };

  return (
    <div className="mb-10 lg:mb-0 lg:sticky lg:top-28 lg:h-fit z-10">
      {/* Mobile Collapsible */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-5 glass rounded-[1.5rem] border border-white/10 text-left shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors" />
          <div className="flex items-center gap-3 relative z-10">
            <List className="w-5 h-5 text-primary-500" />
            <span className="font-black text-xs uppercase tracking-widest text-white">Table of Contents</span>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-6 glass rounded-3xl border border-white/10 shadow-2xl"
            >
              <ul className="space-y-4">
                {headings.map((h, i) => (
                  <li
                    key={i}
                    style={{ paddingLeft: h.level === "h3" ? "1.5rem" : "0" }}
                  >
                    <button
                      onClick={() => handleScroll(h.id)}
                      className={`text-sm transition-all text-left block w-full ${
                        activeId === h.id 
                        ? 'text-primary-400 font-bold scale-105' 
                        : 'text-gray-500 hover:text-white font-medium'
                      }`}
                    >
                      {h.text}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-full">
        <div className="glass-premium rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
          <h4 className="flex items-center gap-3 font-black mb-8 text-white uppercase tracking-[0.2em] text-[10px] opacity-60">
            <List className="w-4 h-4 text-primary-500" /> 
            Contents
          </h4>
          <nav className="relative">
             {/* Progress Line */}
             <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5" />
             
            <ul className="space-y-4 relative">
              {headings.map((h, i) => (
                <li
                  key={i}
                  className={`text-sm transition-all relative ${h.level === "h3" ? "pl-8" : "pl-6"}`}
                >
                  {/* Indicator Line with Framer Motion */}
                  {activeId === h.id && (
                    <motion.div 
                      layoutId="toc-indicator"
                      className="absolute left-[-1px] top-0 bottom-0 w-[4px] bg-primary-500 shadow-glow rounded-r-lg z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <button
                    onClick={() => handleScroll(h.id)}
                    className={`transition-all text-left py-1 inline-block ${
                      activeId === h.id 
                      ? 'text-white font-black translate-x-1' 
                      : 'text-gray-500 hover:text-primary-400 font-bold'
                    }`}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
