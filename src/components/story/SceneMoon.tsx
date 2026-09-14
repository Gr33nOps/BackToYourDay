import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MoonVisual } from "@/components/visuals/MoonVisual";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import { prefersReducedMotion } from "@/utils/motion";
import { Moon } from "lucide-react";

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
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.01,
    }));

    const blobs = [
      { x: w * 0.5, y: h * 0.45, r: w * 0.35, hue: 220 },
      { x: w * 0.3, y: h * 0.7, r: w * 0.25, hue: 260 },
    ];

    if (prefersReducedMotion()) {
      ctx.clearRect(0, 0, w, h);
      for (const b of blobs) {
        const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grd.addColorStop(0, `hsla(${b.hue},60%,40%,0.06)`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fill();
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of blobs) {
        const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grd.addColorStop(0, `hsla(${b.hue},60%,40%,0.06)`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const s of stars) {
        s.twinkle += s.speed;
        const alpha = (Math.sin(s.twinkle) + 1) * 0.28 + 0.08;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between px-4 sm:px-8 py-6 sm:py-8 max-w-3xl mx-auto z-10 select-none text-center">
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none w-full h-full z-0"
      />

      {/* Top Header Badge */}
      <div className="shrink-0 pt-2 relative z-10">
        <div className="archival-badge">
          <Moon className="w-3 h-3 text-accent" />
          <span>Act II · The Moon Phase</span>
        </div>
      </div>

      {/* Main Center Stage: Pure Center-Aligned Single Focus */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto w-full py-2 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 max-w-xl w-full"
        >
          {/* Moon Visual with subtle glow */}
          <div
            className="relative"
            style={{ filter: "drop-shadow(0 0 50px rgba(200,215,255,0.25))" }}
          >
            <div className="sm:hidden">
              <MoonVisual
                illumination={moon.illumination}
                phaseFraction={moon.phaseFraction}
                isWaxing={moon.isWaxing}
                size={180}
              />
            </div>
            <div className="hidden sm:block">
              <MoonVisual
                illumination={moon.illumination}
                phaseFraction={moon.phaseFraction}
                isWaxing={moon.isWaxing}
                size={250}
              />
            </div>
          </div>

          {/* Phase Name */}
          <h2
            className="font-serif font-black text-white leading-tight tracking-tight px-2 text-3xl sm:text-5xl md:text-6xl"
          >
            {moon.phaseName}
          </h2>

          {/* Illumination & Trajectory */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="font-display font-black text-accent text-xl sm:text-2xl">
              {moon.illumination}%
            </span>
            <span className="text-white/40">·</span>
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-white/70">
              {moon.isWaxing ? "Waxing" : "Waning"}
            </span>
            <span className="text-white/40">·</span>
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-white/50">
              Day {moon.ageDays} of Cycle
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom spacer for clearance above HUD */}
      <div className="shrink-0 mb-12 sm:mb-14" />
    </div>
  );
}
