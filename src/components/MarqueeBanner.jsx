"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function MarqueeBanner({ messages = [] }) {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="bg-primary-600 text-white overflow-hidden py-2.5 border-b border-white/10 relative z-50">
      <div className="flex w-max">
        {/* We animate two sets of messages to create a seamless infinite scroll */}
        <motion.div
          className="flex space-x-12 px-6 shrink-0 items-center"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {messages.map((msg, i) => (
            <div key={`a-${i}`} className="flex items-center gap-2 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.2em]">
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              {msg}
            </div>
          ))}
        </motion.div>
        
        <motion.div
          className="flex space-x-12 px-6 shrink-0 items-center"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {messages.map((msg, i) => (
            <div key={`b-${i}`} className="flex items-center gap-2 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.2em]">
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              {msg}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
