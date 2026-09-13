import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { BirthdayIdentity } from "@/lib/almanac";
import { NumberTicker } from "@/components/ui/number-ticker";
import { prefersReducedMotion } from "@/utils/motion";

interface SceneDaysLivedProps {
  daysLived: number;
  identity?: BirthdayIdentity;
}

export function SceneDaysLived({ daysLived, identity }: SceneDaysLivedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const breathsTakenM = Math.round((daysLived * 20000) / 1_000_000);
  const solarOrbits = identity?.metrics.earthOrbits ?? Math.floor(daysLived / 365.25);
  const approximateHeartbeatsM = identity
    ? Math.round(identity.metrics.approximateHeartbeats / 1_000_000)
    : Math.round((daysLived * 100000) / 1_000_000);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    // Each particle = a day lived
    const count = Math.min(daysLived, 3000);
    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number };
    const particles: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.35 + 0.05,
    }));

    if (prefersReducedMotion()) {
      // Static: just draw particles in place
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,169,60,${p.alpha * 0.7})`; ctx.fill();
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      // No pulsing center glow — the particles ARE the metaphor (Rule #9)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,169,60,${p.alpha})`; ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, [daysLived]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      {/* Section label with clearance below HUD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="absolute top-14 sm:top-12 left-0 right-0 text-center z-20"
      >
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-white/50">Life in Numbers</div>
      </motion.div>

      {/* Massive number — center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center my-auto px-4"
      >
        <div
          className="font-display font-black text-white leading-none tabular-nums"
          style={{ fontSize: "clamp(3.5rem, 18vw, 15rem)" }}
        >
          <NumberTicker value={daysLived} delay={0.1} />
        </div>
        <div className="font-mono text-xs sm:text-sm uppercase tracking-[0.35em] text-white/50 mt-2 sm:mt-3">
          days on earth
        </div>

        {/* Next birthday badge — centered under days lived */}
        {identity && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white/60">
              Next birthday in {identity.metrics.daysUntilNextBirthday} days
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Stats — bottom with safe clearance above mobile nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="absolute bottom-16 sm:bottom-12 left-0 right-0 z-20 flex justify-center gap-5 sm:gap-12 px-4"
      >
        {[
          { val: `${solarOrbits}×`, label: "solar orbits" },
          { val: `~${breathsTakenM}M`, label: "breaths drawn" },
          { val: `~${approximateHeartbeatsM}M`, label: "heartbeats" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="font-display font-bold text-accent" style={{ fontSize: "clamp(1rem, 2.8vw, 1.8rem)" }}>
              {s.val}
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-white/45 mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
