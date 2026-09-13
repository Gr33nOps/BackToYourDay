import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { BirthdayIdentity } from "@/lib/almanac";
import { NumberTicker } from "@/components/ui/number-ticker";

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
    let t = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    // Each particle = a day
    const count = Math.min(daysLived, 3000);
    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number };
    const particles: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.4 + 0.05,
      hue: Math.random() > 0.7 ? 40 : 195,
    }));

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      // Pulsing center glow
      const pulseR = (Math.sin(t / 40) + 1) * 0.5;
      const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * (0.2 + pulseR * 0.1));
      grd.addColorStop(0, "rgba(229,169,60,0.08)"); grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},70%,65%,${p.alpha})`; ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, [daysLived]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      {/* Label — top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="absolute top-8 sm:top-12 left-0 right-0 text-center z-20"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/20">Life in Numbers</div>
      </motion.div>

      {/* Massive number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center"
      >
        <div
          className="font-display font-black text-white leading-none tabular-nums"
          style={{ fontSize: "clamp(4rem, 22vw, 18rem)", textShadow: "0 0 120px rgba(229,169,60,0.15)" }}
        >
          <NumberTicker value={daysLived} delay={0.1} />
        </div>
        <div className="font-mono text-[11px] sm:text-sm uppercase tracking-[0.35em] text-white/25 mt-3">
          days on earth
        </div>
      </motion.div>

      {/* Stats — bottom */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="absolute bottom-8 sm:bottom-12 left-0 right-0 z-20 flex justify-center gap-6 sm:gap-12 px-8"
      >
        {[
          { val: `${solarOrbits}×`, label: "solar orbits" },
          { val: `~${breathsTakenM}M`, label: "breaths drawn" },
          { val: `~${approximateHeartbeatsM}M`, label: "heartbeats" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="font-display font-bold text-accent" style={{ fontSize: "clamp(1rem, 3vw, 2rem)" }}>
              {s.val}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/20 mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {identity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-8 right-8 sm:right-14 z-20 text-right"
        >
          <div className="font-mono text-[9px] uppercase tracking-widest text-white/15">
            Next birthday in {identity.metrics.daysUntilNextBirthday} days
          </div>
        </motion.div>
      )}
    </div>
  );
}
