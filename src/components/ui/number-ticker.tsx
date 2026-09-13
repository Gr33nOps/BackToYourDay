import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  formatFn?: (n: number) => string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className = "",
  formatFn = (n: number) => Math.round(n).toLocaleString(),
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(direction === "down" ? value : 0);
  const springVal = useSpring(motionVal, {
    damping: 35,
    stiffness: 75,
  });
  const displayVal = useTransform(springVal, (current) => formatFn(current));

  useEffect(() => {
    const timer = setTimeout(() => {
      motionVal.set(value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [motionVal, value, delay]);

  return (
    <motion.span ref={ref} className={`tabular-nums inline-block ${className}`}>
      {displayVal}
    </motion.span>
  );
}
