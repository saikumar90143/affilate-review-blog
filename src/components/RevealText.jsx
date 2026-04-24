"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function RevealText({ children, className = "", delay = 0, as: Tag = "h2" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    </div>
  );
}
