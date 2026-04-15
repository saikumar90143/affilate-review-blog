"use client";

import { useState, useEffect, useRef } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export default function TableOfContents({ htmlContent }) {
  const [headings, setHeadings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef(null);

  useEffect(() => {
    // Parse the HTML content to find H2 and H3 tags
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

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    if (headingElements.length === 0) return;

    // Create an intersection observer to track which heading is currently in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find visible entries
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 1.0 }
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
      const offset = 100; // Account for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsOpen(false);
      setActiveId(id); // Set it actively upon click as well
    }
  };

  return (
    <div className="mb-10 lg:mb-0 lg:sticky lg:top-24 lg:h-fit z-10 glass-premium rounded-3xl lg:p-6 p-0 border lg:border-white/10 border-transparent bg-transparent lg:bg-[#0a0a0a]/80 shadow-none lg:shadow-xl">
      {/* Mobile Collapsible */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-800 border border-border rounded-2xl text-left shadow-lg"
        >
          <div className="flex items-center gap-3">
            <List className="w-5 h-5 text-primary-500" />
            <span className="font-bold">Table of Contents</span>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {isOpen && (
          <nav className="mt-2 p-4 bg-gray-800 border border-border rounded-2xl animate-in slide-in-from-top-2 duration-200">
            <ul className="space-y-3">
              {headings.map((h, i) => (
                <li
                  key={i}
                  style={{ paddingLeft: h.level === "h3" ? "1.5rem" : "0" }}
                  className="text-sm"
                >
                  <button
                    onClick={() => handleScroll(h.id)}
                    className={`transition-colors text-left font-medium ${activeId === h.id ? 'text-primary-400 font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-full bg-dark-card">
        <h4 className="flex items-center gap-2 font-black mb-6 text-white uppercase tracking-widest text-xs opacity-70">
          <List className="w-4 h-4 text-primary-500" /> On this page
        </h4>
        <nav>
          <ul className="space-y-3 border-l-2 border-white/5 relative">
            {headings.map((h, i) => (
              <li
                key={i}
                className={`text-sm transition-all relative ${h.level === "h3" ? "pl-6" : "pl-4"}`}
              >
                {/* Active Highlight Line */}
                {activeId === h.id && (
                  <span className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-primary-500 shadow-glow rounded-r" />
                )}

                <button
                  onClick={() => handleScroll(h.id)}
                  className={`transition-colors text-left mt-0.5 ${activeId === h.id ? 'text-white font-bold' : 'text-gray-400 hover:text-white font-medium'}`}
                >
                  {h.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
