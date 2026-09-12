import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Spark = { id: number; x: number; y: number };

export function CursorTrail({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const lastRef = useRef(0);
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lastRef.current < 45) return;
      lastRef.current = now;

      const rect = el!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const id = idRef.current++;
      setSparks((prev) => [...prev, { id, x, y }].slice(-16));
    }

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  if (reduce) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.span
            key={spark.id}
            className="absolute h-1.5 w-1.5 rounded-full bg-terracotta"
            style={{ left: spark.x, top: spark.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0.65, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            onAnimationComplete={() =>
              setSparks((prev) => prev.filter((s) => s.id !== spark.id))
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
