"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQ({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-20 pt-16 border-t border-white/5 reveal-up">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-primary-500" />
        </div>
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter">Proprietary <span className="premium-gradient">Intel FAQ</span></h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-1">Cross-referenced archives</p>
        </div>
      </div>

      <div className="grid gap-4 max-w-4xl">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`group rounded-3xl border transition-all duration-500 ${
              openIndex === index 
                ? "bg-white/5 border-primary-500/30 shadow-glow" 
                : "bg-white/2 border-white/10 hover:border-white/20"
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none"
            >
              <span className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors pr-8">
                {faq.question}
              </span>
              <ChevronDown className={`w-5 h-5 text-primary-500 transition-transform duration-500 ${openIndex === index ? "rotate-180" : ""}`} />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6 sm:px-8 sm:pb-8 text-gray-400 font-light leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
