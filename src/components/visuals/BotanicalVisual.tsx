import { motion } from "framer-motion";

interface BotanicalVisualProps {
  name: string;
  size?: number;
  className?: string;
}

export function BotanicalVisual({
  name,
  size = 280,
  className = "",
}: BotanicalVisualProps) {
  // Normalize flower name
  const flower = name.toLowerCase();

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Organic subtle archival warm aura */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(229, 169, 60, 0.16) 0%, rgba(255, 255, 255, 0.04) 45%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />

      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_16px_35px_rgba(0,0,0,0.5)]"
        aria-label={`${name} botanical illustration`}
      >
        <defs>
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8a91a0" />
            <stop offset="100%" stopColor="#262933" />
          </linearGradient>

          <linearGradient id="petalMono" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#8a91a0" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#1a1d26" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="petalInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#d4d8e2" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#525866" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Stem and foliage */}
        <path
          d="M 100,105 Q 102,150 95,190"
          fill="none"
          stroke="url(#stemGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Leaves */}
        <path
          d="M 98,135 Q 130,130 135,115 Q 120,145 98,140 Z"
          fill="#1e212b"
          stroke="#8a91a0"
          strokeWidth="0.8"
          opacity="0.85"
        />
        <path
          d="M 97,155 Q 65,150 60,135 Q 75,165 97,160 Z"
          fill="#181b24"
          stroke="#525866"
          strokeWidth="0.8"
          opacity="0.85"
        />

        {/* Dynamic Petals based on flower class */}
        {flower.includes("rose") || flower.includes("carnation") ? (
          /* Rose / Carnation layered ruffled petals */
          <g transform="translate(100, 85)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-28"
                rx="18"
                ry="32"
                transform={`rotate(${angle})`}
                fill="url(#petalMono)"
                stroke="#ffffff"
                strokeWidth="0.6"
                strokeOpacity="0.4"
                opacity="0.8"
              />
            ))}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
              <ellipse
                key={`inner-${i}`}
                cx="0"
                cy="-18"
                rx="14"
                ry="22"
                transform={`rotate(${angle})`}
                fill="url(#petalInner)"
                stroke="#ffffff"
                strokeWidth="0.6"
                strokeOpacity="0.5"
                opacity="0.9"
              />
            ))}
            <circle cx="0" cy="0" r="10" fill="#e5a93c" />
            <circle cx="0" cy="0" r="5" fill="#ffffff" />
          </g>
        ) : flower.includes("aster") || flower.includes("daisy") || flower.includes("chrysanthemum") ? (
          /* Aster / Daisy / Chrysanthemum radial ray florets */
          <g transform="translate(100, 85)">
            {Array.from({ length: 16 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-36"
                rx="6"
                ry="32"
                transform={`rotate(${i * 22.5})`}
                fill="url(#petalMono)"
                opacity="0.88"
                stroke="#ffffff"
                strokeOpacity="0.4"
                strokeWidth="0.6"
              />
            ))}
            {/* Center disc floret in Archival Amber */}
            <circle cx="0" cy="0" r="15" fill="#e5a93c" />
            <circle cx="0" cy="0" r="11" fill="#d4962b" />
            <circle cx="0" cy="0" r="6" fill="#14161d" />
          </g>
        ) : flower.includes("violet") || flower.includes("larkspur") ? (
          /* Violet / Larkspur asymmetrical graceful blooms */
          <g transform="translate(100, 85)">
            <ellipse cx="-20" cy="-25" rx="18" ry="26" transform="rotate(-20)" fill="url(#petalMono)" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.4" opacity="0.85" />
            <ellipse cx="20" cy="-25" rx="18" ry="26" transform="rotate(20)" fill="url(#petalMono)" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.4" opacity="0.85" />
            <ellipse cx="-25" cy="10" rx="16" ry="24" transform="rotate(-65)" fill="url(#petalMono)" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.4" opacity="0.9" />
            <ellipse cx="25" cy="10" rx="16" ry="24" transform="rotate(65)" fill="url(#petalMono)" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.4" opacity="0.9" />
            <ellipse cx="0" cy="22" rx="22" ry="28" fill="url(#petalInner)" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.5" opacity="0.95" />
            {/* Center eye in Archival Amber */}
            <circle cx="0" cy="5" r="7" fill="#e5a93c" />
            <circle cx="0" cy="5" r="3" fill="#ffffff" />
          </g>
        ) : (
          /* Daffodil / Lily / Marigold Trumpet & Star */
          <g transform="translate(100, 85)">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <path
                key={i}
                d="M 0,0 Q 22,-35 0,-50 Q -22,-35 0,0"
                transform={`rotate(${angle})`}
                fill="url(#petalMono)"
                opacity="0.85"
                stroke="#ffffff"
                strokeOpacity="0.4"
                strokeWidth="0.6"
              />
            ))}
            {/* Cup in Archival Amber */}
            <circle cx="0" cy="0" r="16" fill="#e5a93c" opacity="0.95" />
            <circle cx="0" cy="0" r="10" fill="#d4962b" />
            <circle cx="0" cy="0" r="5" fill="#ffffff" opacity="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
}
