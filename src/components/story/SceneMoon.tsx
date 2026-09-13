import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MoonVisual } from "@/components/visuals/MoonVisual";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import { prefersReducedMotion } from "@/utils/motion";

interface SceneMoonProps {
  moon: MoonPhaseInfo;
}

export function SceneMoon({ moon }: SceneMoonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.01,
    }));

    const blobs = [
      { x: w * 0.2, y: h * 0.3, r: w * 0.3, hue: 220 },
      { x: w * 0.8, y: h * 0.7, r: w * 0.25, hue: 270 },
      { x: w * 0.5, y: h * 0.8, r: w * 0.2, hue: 195 },
    ];

    // Render static sky for reduced-motion users
    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of blobs) {
        const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grd.addColorStop(0, `hsla(${b.hue},60%,40%,0.05)`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      }
      for (const s of stars) {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fill();
      }
    };

    if (prefersReducedMotion()) {
      renderStatic();
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of blobs) {
        const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grd.addColorStop(0, `hsla(${b.hue},60%,40%,0.05)`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      }
      for (const s of stars) {
        s.twinkle += s.speed;
        const alpha = (Math.sin(s.twinkle) + 1) * 0.28 + 0.08;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      {/* Phase name — top left with clearance below HUD */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-14 left-6 sm:top-12 sm:left-12 z-20 max-w-[70%]"
      >
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/50 mb-1 sm:mb-2">Lunar Phase</div>
        <div
          className="font-display font-black text-white leading-tight"
          style={{ fontSize: "clamp(1.8rem, 6vw, 5rem)" }}
        >
          {moon.phaseName}
        </div>
      </motion.div>

      {/* Illumination — bottom right with clearance above mobile nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-16 right-6 sm:bottom-12 sm:right-12 z-20 text-right"
      >
        <div
          className="font-display font-black text-accent leading-none tabular-nums"
          style={{ fontSize: "clamp(2.4rem, 9vw, 7.5rem)" }}
        >
          {moon.illumination}
          <span className="text-accent/60" style={{ fontSize: "0.4em" }}>%</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-white/50 mt-1">illuminated</div>
      </motion.div>

      {/* Moon visual — center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-auto"
        style={{ filter: "drop-shadow(0 0 45px rgba(200,210,255,0.25))" }}
      >
        <div className="sm:hidden">
          <MoonVisual illumination={moon.illumination} phaseFraction={moon.phaseFraction} isWaxing={moon.isWaxing} size={170} />
        </div>
        <div className="hidden sm:block">
          <MoonVisual illumination={moon.illumination} phaseFraction={moon.phaseFraction} isWaxing={moon.isWaxing} size={320} />
        </div>
      </motion.div>

      {/* Cycle info — bottom left with clearance above mobile nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-16 left-6 sm:bottom-12 sm:left-12 z-20"
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">Day {moon.ageDays} of cycle</div>
        <div className="font-mono text-xs text-white/70 mt-0.5">{moon.isWaxing ? "↑ Waxing" : "↓ Waning"}</div>
      </motion.div>
    </div>
  );
}
