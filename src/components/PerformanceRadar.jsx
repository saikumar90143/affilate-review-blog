"use client";

import { motion } from "framer-motion";

export default function PerformanceRadar({ scores }) {
  // Default scores if none provided
  const data = scores || {
    performance: 85,
    value: 80,
    build: 90,
    features: 85,
    design: 88,
  };

  const labels = ["Performance", "Value", "Build", "Features", "Design"];
  const keys = ["performance", "value", "build", "features", "design"];
  
  const size = 300;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  // Calculate coordinates for a regular pentagon
  const getCoordinates = (value, index) => {
    const factor = value / 100;
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    return {
      x: centerX + radius * factor * Math.cos(angle),
      y: centerY + radius * factor * Math.sin(angle),
    };
  };

  const points = keys.map((key, i) => getCoordinates(data[key], i));
  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Coordinates for the background grid (the pentagons)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];
  const gridPaths = gridLevels.map(level => {
    return keys.map((_, i) => {
      const p = getCoordinates(level * 100, i);
      return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }).join(" ") + " Z";
  });

  return (
    <div className="flex flex-col items-center justify-center p-8 glass rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">
        {/* Background Grids */}
        {gridPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {keys.map((_, i) => {
          const p = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Path */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d={pathData}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#3b82f6"
            className="shadow-glow"
          />
        ))}

        {/* Labels */}
        {labels.map((label, i) => {
          const p = getCoordinates(120, i); // Place labels slightly outside
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              fill="rgba(255, 255, 255, 0.4)"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              dominantBaseline="middle"
              className="uppercase tracking-widest"
            >
              {label}
            </text>
          );
        })}
      </svg>

      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 relative z-10 w-full px-4">
        {keys.map((key, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{labels[i]}</span>
            <span className="text-[10px] font-black text-primary-400">{data[key]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
