import { motion, useReducedMotion } from "framer-motion";

export function Loader({ message }: { message: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-5 py-16 text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative h-[78px] w-[78px] rounded-full border-[2px] border-accent-electric bg-surface shadow-[0_0_30px_rgba(56,189,248,0.2)]">
        <motion.span
          className="absolute left-1/2 bottom-1/2 h-7 w-[2px] -translate-x-1/2 rounded-full bg-accent-electric"
          style={{ transformOrigin: "50% 100%" }}
          animate={reduce ? { rotate: 45 } : { rotate: 360 }}
          transition={
            reduce
              ? { duration: 0 }
              : { repeat: Infinity, duration: 1.1, ease: "linear" }
          }
        />
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-[0_0_8px_#fff]" />
      </div>
      <p className="m-0 font-mono text-sm tracking-widest uppercase text-foreground-muted">{message}</p>
    </motion.div>
  );
}
