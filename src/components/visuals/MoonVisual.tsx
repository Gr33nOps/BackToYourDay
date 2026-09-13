import { useMemo } from "react";
import { motion } from "framer-motion";

interface MoonVisualProps {
  illumination: number; // 0 to 100
  phaseFraction: number; // 0 to 1
  isWaxing: boolean;
  size?: number;
  className?: string;
}

export function MoonVisual({
  illumination,
  phaseFraction,
  isWaxing,
  size = 280,
  className = "",
}: MoonVisualProps) {
  // Generate accurate terminator path using an elliptical arc
  // phaseFraction: 0 (new), 0.25 (first quarter), 0.5 (full), 0.75 (last quarter), 1.0 (new)
  const terminatorPath = useMemo(() => {
    const r = 98; // radius within 200x200 viewport (center at 100,100)
    // Normalized phase angle 0 to 2PI
    const k = -Math.cos(phaseFraction * 2 * Math.PI); // -1 (new) to 1 (full)
    const rx = Math.max(0.1, Math.abs(k) * r);

    if (illumination <= 1) {
      return "";
    }
    if (illumination >= 99) {
      return `M 100,${100 - r} A ${r},${r} 0 1,1 100,${100 + r} A ${r},${r} 0 1,1 100,${100 - r} Z`;
    }

    if (isWaxing) {
      if (k <= 0) {
        return `M 100,${100 - r} A ${r},${r} 0 0,1 100,${100 + r} A ${rx},${r} 0 0,1 100,${100 - r} Z`;
      } else {
        return `M 100,${100 - r} A ${r},${r} 0 0,1 100,${100 + r} A ${rx},${r} 0 0,0 100,${100 - r} Z`;
      }
    } else {
      if (k <= 0) {
        return `M 100,${100 - r} A ${r},${r} 0 0,0 100,${100 + r} A ${rx},${r} 0 0,0 100,${100 - r} Z`;
      } else {
        return `M 100,${100 - r} A ${r},${r} 0 0,0 100,${100 + r} A ${rx},${r} 0 0,1 100,${100 - r} Z`;
      }
    }
  }, [illumination, phaseFraction, isWaxing]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Lunar Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: Math.max(0.2, illumination / 100), scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255, 255, 255, ${0.15 + (illumination / 100) * 0.25}) 0%, rgba(255, 255, 255, 0.03) 50%, transparent 72%)`,
          filter: "blur(24px)",
          transform: "scale(1.3)",
        }}
      />

      {/* SVG Moon Disc */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_16px_50px_rgba(0,0,0,0.8)]"
        aria-label={`Moon phase illumination ${illumination}%`}
      >
        <defs>
          <radialGradient id="darkSide" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#181a22" />
            <stop offset="85%" stopColor="#0f1116" />
            <stop offset="100%" stopColor="#07080b" />
          </radialGradient>

          <radialGradient id="litSurface" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#f5f7fa" />
            <stop offset="70%" stopColor="#dde3ee" />
            <stop offset="92%" stopColor="#c3cddc" />
            <stop offset="100%" stopColor="#9ba7bb" />
          </radialGradient>

          <clipPath id="litClip">
            <path d={terminatorPath || ""} />
          </clipPath>
        </defs>

        {/* Outer Dark Moon Body */}
        <circle cx="100" cy="100" r="98" fill="url(#darkSide)" />

        {/* Subtle earthshine rim */}
        <circle
          cx="100"
          cy="100"
          r="97"
          fill="none"
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth="1"
        />

        {/* Lit Lunar Face */}
        {terminatorPath && (
          <path
            d={terminatorPath}
            fill="url(#litSurface)"
            filter="drop-shadow(0 0 5px rgba(255,255,255,0.35))"
          />
        )}

        {/* Lunar Seas / Maria (Texture dots & shading clipped to lit side) */}
        {terminatorPath && (
          <g clipPath="url(#litClip)" opacity="0.32">
            <ellipse cx="120" cy="85" rx="22" ry="18" fill="#586578" />
            <ellipse cx="135" cy="70" rx="16" ry="14" fill="#505d6e" />
            <ellipse cx="72" cy="95" rx="28" ry="32" fill="#556275" />
            <circle cx="152" cy="80" r="10" fill="#4d596a" />
            <circle cx="85" cy="65" r="22" fill="#515d6f" />
            <circle cx="95" cy="155" r="5" fill="#f8fafc" opacity="0.9" />
            <circle cx="80" cy="98" r="4" fill="#f8fafc" opacity="0.8" />
          </g>
        )}

        {/* Outer Delicate Luminous Rim */}
        <circle
          cx="100"
          cy="100"
          r="98"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}
