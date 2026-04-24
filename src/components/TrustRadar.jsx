export default function TrustRadar({ scores = {} }) {
  const metrics = [
    { label: "Performance", key: "performance", color: "#60a5fa" },
    { label: "Value",       key: "value",       color: "#34d399" },
    { label: "Build",       key: "build",       color: "#a78bfa" },
    { label: "Features",    key: "features",    color: "#f59e0b" },
    { label: "Design",      key: "design",      color: "#f43f5e" },
  ];

  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 100;
  const levels = 4;
  const total = metrics.length;

  const angleFor = (i) => (Math.PI * 2 * i) / total - Math.PI / 2;

  const pointOnAxis = (i, r) => ({
    x: cx + r * Math.cos(angleFor(i)),
    y: cy + r * Math.sin(angleFor(i)),
  });

  // Build grid rings
  const rings = Array.from({ length: levels }, (_, l) => {
    const r = (maxR * (l + 1)) / levels;
    return metrics.map((_, i) => pointOnAxis(i, r));
  });

  // Build data polygon (scores are 0-100)
  const dataPoints = metrics.map((m, i) => {
    const val = scores[m.key] ?? 80;
    const r = (Math.min(100, Math.max(0, val)) / 100) * maxR;
    return pointOnAxis(i, r);
  });

  const toPolygon = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="glass-premium rounded-[2rem] border border-white/5 p-8 my-16">
      <h3 className="text-xl font-black text-white tracking-tighter mb-1">
        Expert Trust Score
      </h3>
      <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-8">
        Verified performance intelligence
      </p>

      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* SVG Radar */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-64 h-64 shrink-0"
        >
          {/* Grid rings */}
          {rings.map((pts, li) => (
            <polygon
              key={li}
              points={toPolygon(pts)}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {metrics.map((_, i) => {
            const outer = pointOnAxis(i, maxR);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={toPolygon(dataPoints)}
            fill="rgba(59,130,246,0.15)"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Data point dots */}
          {dataPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill={metrics[i].color}
              stroke="#0d0d12"
              strokeWidth="2"
            />
          ))}

          {/* Axis labels */}
          {metrics.map((m, i) => {
            const lp = pointOnAxis(i, maxR + 22);
            return (
              <text
                key={i}
                x={lp.x}
                y={lp.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight="900"
                fill="rgba(255,255,255,0.5)"
                letterSpacing="0.08em"
                fontFamily="sans-serif"
              >
                {m.label.toUpperCase()}
              </text>
            );
          })}
        </svg>

        {/* Score bars */}
        <div className="flex-1 w-full space-y-4">
          {metrics.map((m) => {
            const val = scores[m.key] ?? 80;
            return (
              <div key={m.key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {m.label}
                  </span>
                  <span
                    className="text-sm font-black"
                    style={{ color: m.color }}
                  >
                    {val}%
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${val}%`,
                      background: `linear-gradient(90deg, ${m.color}80, ${m.color})`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
