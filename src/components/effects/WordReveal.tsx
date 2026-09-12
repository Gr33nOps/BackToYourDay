import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type WordRevealProps = {
  text: string;
  className?: string;
  delay?: number;
};

const EASE = [0.22, 0.68, 0.32, 1] as const;

export function WordReveal({ text, className, delay = 0 }: WordRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("inline-flex flex-wrap justify-center", className)} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em]">
          <motion.span
            className="inline-block"
            initial={{ y: "0.95em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: delay + i * 0.09, duration: 0.6, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
