import { motion } from "framer-motion";

interface GemstoneVisualProps {
  name: string;
  colorHex: string;
  size?: number;
  className?: string;
}

export function GemstoneVisual({
  name,
  size = 280,
  className = "",
}: GemstoneVisualProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Subtle Archival Warm Ambient Aura */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(229, 169, 60, 0.2) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 70%)",
          filter: "blur(28px)",
          transform: "scale(1.2)",
        }}
      />

      {/* Architectural Faceted Gemstone Vector */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.8)]"
        aria-label={`${name} gemstone specimen`}
      >
        <defs>
          <linearGradient id={`facetGrad-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#8a91a0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#14161d" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="gemTable" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#e5a93c" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#262933" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Outer Pavilion Facets */}
        <polygon
          points="100,185 45,95 100,135"
          fill="#1c1f2b"
          stroke="#ffffff"
          strokeOpacity="0.3"
          strokeWidth="0.8"
        />
        <polygon
          points="100,185 155,95 100,135"
          fill="#262933"
          stroke="#ffffff"
          strokeOpacity="0.3"
          strokeWidth="0.8"
        />

        {/* Lower Side Facets */}
        <polygon
          points="45,95 25,75 70,85"
          fill="#14161d"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="0.8"
        />
        <polygon
          points="155,95 175,75 130,85"
          fill="#1a1d26"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="0.8"
        />

        {/* Crown Kites */}
        <polygon
          points="70,40 100,15 130,40 100,55"
          fill="#ffffff"
          fillOpacity="0.4"
          stroke="#ffffff"
          strokeOpacity="0.5"
          strokeWidth="0.8"
        />
        <polygon
          points="45,55 70,40 100,55 65,80"
          fill="#262933"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="0.8"
        />
        <polygon
          points="155,55 130,40 100,55 135,80"
          fill="#323745"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="0.8"
        />

        {/* Star Facets */}
        <polygon
          points="45,55 25,75 65,80"
          fill="#181b24"
          stroke="#ffffff"
          strokeOpacity="0.3"
          strokeWidth="0.8"
        />
        <polygon
          points="155,55 175,75 135,80"
          fill="#1f232f"
          stroke="#ffffff"
          strokeOpacity="0.3"
          strokeWidth="0.8"
        />

        {/* Central Table (Main top reflection in Archival Amber & Platinum) */}
        <polygon
          points="65,80 100,55 135,80 100,135"
          fill="url(#gemTable)"
          stroke="#e5a93c"
          strokeOpacity="0.7"
          strokeWidth="1.2"
        />

        {/* Inner brilliant reflections */}
        <polygon
          points="100,55 100,135 85,95"
          fill="#ffffff"
          fillOpacity="0.2"
        />
        <polygon
          points="100,55 100,135 115,95"
          fill="#ffffff"
          fillOpacity="0.35"
        />

        {/* Precision Glint in Archival Amber */}
        <circle cx="96" cy="62" r="3" fill="#e5a93c" opacity="0.9" />
        <line x1="96" y1="52" x2="96" y2="72" stroke="#ffffff" strokeWidth="1" opacity="0.85" />
        <line x1="86" y1="62" x2="106" y2="62" stroke="#ffffff" strokeWidth="1" opacity="0.85" />
      </svg>
    </div>
  );
}
