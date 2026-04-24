"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

export default function MagneticButton({ children, href, className = "", onClick, ...props }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values to track mouse displacement from center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the movement with a spring
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance of cursor from the center of the button
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Apply a subtle pull (20% of the distance)
    x.set(distanceX * 0.2);
    y.set(distanceY * 0.2);
  };

  const reset = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ x: springX, y: springY }}
      className="inline-block relative z-10 w-full md:w-auto"
    >
      {href ? (
        <Link href={href} className={className} onClick={onClick} {...props}>
          {children}
        </Link>
      ) : (
        <button className={className} onClick={onClick} {...props}>
          {children}
        </button>
      )}
    </motion.div>
  );
}
