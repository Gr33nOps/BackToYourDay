import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { BirthdayIdentity } from "@/lib/almanac";
import { NumberTicker } from "@/components/ui/number-ticker";
import { prefersReducedMotion } from "@/utils/motion";
import { Hourglass } from "lucide-react";

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
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const count = Math.min(daysLived, 2500);
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
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,169,60,${p.alpha * 0.7})`;
        ctx.fill();
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,169,60,${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [daysLived]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between px-4 sm:px-8 py-6 sm:py-8 max-w-3xl mx-auto z-10 select-none text-center">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none w-full h-full z-0"
      />

      {/* Top Header Badge */}
      <div className="shrink-0 pt-2 relative z-10">
        <div className="archival-badge">
          <Hourglass className="w-3 h-3 text-accent" />
          <span>Act VIII · Life in Days</span>
        </div>
      </div>

      {/* Main Center Stage: Pure Center-Aligned Single Focus */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto w-full py-2 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-xl w-full"
        >
          {/* Massive Number */}
          <div
            className="font-display font-black text-white leading-none tabular-nums"
            style={{ fontSize: "clamp(4.5rem, 20vw, 13rem)" }}
          >
            <NumberTicker value={daysLived} delay={0.1} />
          </div>

          <div className="font-mono text-xs sm:text-sm uppercase tracking-[0.35em] text-white/50">
            Days Traversed Upon Earth
          </div>

          {/* Next Birthday Badge */}
          {identity && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70">
                Next solar return in {identity.metrics.daysUntilNextBirthday} days
              </span>
            </motion.div>
          )}

          {/* Bottom stats row */}
          <div className="pt-4 sm:pt-6 flex justify-center gap-6 sm:gap-12">
            {[
              { val: `${solarOrbits}×`, label: "Solar Orbits" },
              { val: `~${breathsTakenM}M`, label: "Breaths Drawn" },
              { val: `~${approximateHeartbeatsM}M`, label: "Heartbeats" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-display font-bold text-accent"
                  style={{ fontSize: "clamp(1.1rem, 3vw, 1.8rem)" }}
                >
                  {s.val}
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/50 mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom spacer for clearance above HUD */}
      <div className="shrink-0 mb-12 sm:mb-14" />
    </div>
  );
}
