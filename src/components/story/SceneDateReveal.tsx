import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BirthdayIdentity } from "@/lib/almanac";
import { prefersReducedMotion } from "@/utils/motion";

interface SceneDateRevealProps {
  monthName: string;
  day: number;
  year: number;
  weekday: string;
  identity?: BirthdayIdentity;
}

export function SceneDateReveal({ monthName, day, year, weekday, identity }: SceneDateRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ambient radial particle canvas
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

    const pts = Array.from({ length: 80 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * Math.min(w, h) * 0.45 + 40,
      speed: (Math.random() - 0.5) * 0.003,
      size: Math.random() * 2.5 + 0.5,
      hue: Math.random() > 0.5 ? 40 : 195,
    }));

    if (prefersReducedMotion()) {
      // Static: compass rose snapshot
      const cx = w / 2, cy = h / 2;
      ctx.save(); ctx.translate(cx, cy);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.strokeStyle = "rgba(229,169,60,0.025)"; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * Math.min(w,h) * 0.42, Math.sin(a) * Math.min(w,h) * 0.42); ctx.stroke();
      }
      ctx.restore();
      for (const p of pts) {
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,70%,0.3)`; ctx.fill();
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      // Rotating faint compass rose lines
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.0003);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const len = Math.min(w, h) * 0.42;
        ctx.strokeStyle = `rgba(229,169,60,0.025)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        ctx.stroke();
      }
      // Concentric rings
      for (let r = 60; r < Math.min(w, h) * 0.5; r += 80) {
        ctx.strokeStyle = `rgba(229,169,60,0.04)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      for (const p of pts) {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,70%,0.35)`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  const stats = identity ? [
    { label: "Season", val: identity.metrics.season },
    { label: "Solar Sign", val: identity.western.name },
    { label: "Chinese Year", val: `${identity.chinese.animal}` },
  ] : [];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Ambient canvas */}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(229,169,60,0.06) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-start justify-center w-full px-8 sm:px-16 lg:px-24 max-w-screen-xl mx-auto"
      >
        {/* Tiny eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/50 mb-4"
        >
          {weekday}
        </motion.div>

        {/* Massive stacked date */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white leading-[0.88] tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 12vw, 11rem)" }}
          >
            {monthName}
          </motion.div>
        </div>
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.22, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black leading-[0.88] tracking-tight"
            style={{ fontSize: "clamp(4rem, 18vw, 16rem)", color: "#e5a93c" }}
          >
            {day}
          </motion.div>
        </div>
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white/50 leading-[0.88] tracking-tight"
            style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
          >
            {year}
          </motion.div>
        </div>

        {/* Floating stats chips — secondary: plain opacity */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {stats.map(s => (
              <div
                key={s.label}
                className="flex items-center gap-2 px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">{s.label}</span>
                <span className="font-mono text-[12px] font-semibold text-white/70">{s.val}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
