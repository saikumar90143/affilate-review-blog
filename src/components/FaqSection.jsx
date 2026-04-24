"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqSection({ faqs = [], productTitle }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="my-16">
      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      <div className="flex items-center gap-4 mb-10">
        <div className="p-2.5 rounded-2xl bg-primary-500/10 border border-primary-500/20">
          <HelpCircle className="w-6 h-6 text-primary-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mt-1">
            Expert answers about {productTitle}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`glass-premium rounded-2xl border transition-all duration-300 overflow-hidden ${
              openIndex === i
                ? "border-primary-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                : "border-white/5 hover:border-white/10"
            }`}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-bold text-white pr-8 leading-snug">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0"
              >
                <ChevronDown
                  className={`w-5 h-5 transition-colors ${
                    openIndex === i ? "text-primary-400" : "text-gray-500"
                  }`}
                />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
