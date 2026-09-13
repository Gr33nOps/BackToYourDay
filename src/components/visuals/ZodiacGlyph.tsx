import { motion } from "framer-motion";

interface ZodiacGlyphProps {
  sign: string;
  className?: string;
  size?: number;
}

export function ZodiacGlyph({ sign, className = "", size = 96 }: ZodiacGlyphProps) {
  const normalized = sign.toLowerCase();

  const renderPath = () => {
    switch (normalized) {
      case "aries":
        return (
          <path
            d="M 20,80 C 20,40 45,25 60,35 C 75,45 60,85 50,90 M 80,80 C 80,40 55,25 40,35 C 25,45 40,85 50,90 L 50,90"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "taurus":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
            <path d="M 20,30 C 35,15 65,15 80,30" />
            <circle cx="50" cy="62" r="26" />
          </g>
        );
      case "gemini":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
            <path d="M 20,25 C 40,35 60,35 80,25" />
            <path d="M 20,75 C 40,65 60,65 80,75" />
            <line x1="38" y1="30" x2="38" y2="70" />
            <line x1="62" y1="30" x2="62" y2="70" />
          </g>
        );
      case "cancer":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
            <circle cx="34" cy="40" r="14" />
            <path d="M 34,26 C 60,26 75,45 75,55" />
            <circle cx="66" cy="60" r="14" />
            <path d="M 66,74 C 40,74 25,55 25,45" />
          </g>
        );
      case "leo":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
            <circle cx="30" cy="60" r="12" />
            <path d="M 40,54 C 45,30 65,22 75,35 C 85,48 70,75 85,80" />
          </g>
        );
      case "virgo":
        return (
          <path
            d="M 20,75 L 20,35 C 20,25 35,25 35,35 L 35,75 M 35,35 C 35,25 50,25 50,35 L 50,75 M 50,35 C 50,25 65,25 65,35 L 65,70 C 65,85 52,90 48,82 C 45,75 55,65 78,85"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "libra":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
            <path d="M 18,50 L 34,50 C 34,35 42,32 50,32 C 58,32 66,35 66,50 L 82,50" />
            <line x1="18" y1="72" x2="82" y2="72" />
          </g>
        );
      case "scorpio":
        return (
          <path
            d="M 20,75 L 20,35 C 20,25 35,25 35,35 L 35,75 M 35,35 C 35,25 50,25 50,35 L 50,75 M 50,35 C 50,25 65,25 65,35 L 65,72 C 65,78 72,80 78,74 M 72,70 L 78,74 L 75,64"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "sagittarius":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="25" y1="75" x2="75" y2="25" />
            <path d="M 50,25 L 75,25 L 75,50" />
            <line x1="38" y1="48" x2="52" y2="62" />
          </g>
        );
      case "capricorn":
        return (
          <path
            d="M 25,35 L 35,70 L 48,35 C 52,48 58,55 64,55 C 74,55 78,45 74,38 C 70,30 58,35 60,65 C 61,78 52,85 45,78"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "aquarius":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 18,40 L 32,32 L 46,40 L 60,32 L 74,40 L 82,35" />
            <path d="M 18,62 L 32,54 L 46,62 L 60,54 L 74,62 L 82,57" />
          </g>
        );
      case "pisces":
        return (
          <g fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
            <path d="M 32,20 C 44,40 44,60 32,80" />
            <path d="M 68,20 C 56,40 56,60 68,80" />
            <line x1="22" y1="50" x2="78" y2="50" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`select-none ${className}`}
      aria-label={`${sign} astrological glyph`}
    >
      {renderPath()}
    </motion.svg>
  );
}
