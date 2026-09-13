import { motion } from "framer-motion";

export function AudioVisualizer({
  isPlaying = true,
  barCount = 12,
  className = "",
  color = "#e5a93c",
}: {
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
  color?: string;
}) {
  return (
    <div className={`flex items-end justify-center gap-[3px] h-6 px-2 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.span
          key={i}
          animate={
            isPlaying
              ? {
                  height: [
                    "20%",
                    `${Math.floor(Math.sin(i * 1.5) * 40 + 55)}%`,
                    `${Math.floor(Math.cos(i * 1.2) * 35 + 60)}%`,
                    "25%",
                  ],
                }
              : { height: "20%" }
          }
          transition={{
            duration: 0.8 + (i % 4) * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: (i * 0.08) % 0.4,
          }}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
