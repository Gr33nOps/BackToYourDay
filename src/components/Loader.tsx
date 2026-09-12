import { motion, useReducedMotion } from "framer-motion";

export function Loader({ message }: { message: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-5 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative h-[78px] w-[78px] rounded-full border-[3px] border-terracotta bg-card shadow-[0_10px_26px_-14px_rgba(74,54,28,0.45),inset_0_0_0_6px_rgba(184,80,42,0.08)]">
        <span
          className="absolute inset-2 rounded-full"
          style={{
            background:
              "repeating-conic-gradient(var(--border) 0deg 3deg, transparent 3deg 30deg)",
            WebkitMask: "radial-gradient(circle, transparent 26px, #000 27px)",
            mask: "radial-gradient(circle, transparent 26px, #000 27px)",
          }}
        />
        <motion.span
          className="absolute left-1/2 bottom-1/2 h-7 w-[3px] -translate-x-1/2 rounded-[3px] bg-terracotta"
          style={{ transformOrigin: "50% 100%" }}
          animate={reduce ? { rotate: 45 } : { rotate: 360 }}
          transition={
            reduce
              ? { duration: 0 }
              : { repeat: Infinity, duration: 1.1, ease: "linear" }
          }
        />
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta-deep" />
      </div>
      <p className="m-0 font-display text-[1.25rem] italic text-terracotta-deep">{message}</p>
    </motion.div>
  );
}
