import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BotanicalVisual } from "@/components/visuals/BotanicalVisual";
import type { BirthBotanicals } from "@/lib/almanac";
import { prefersReducedMotion } from "@/utils/motion";

interface SceneBotanicalProps {
  botanicals: BirthBotanicals;
}

export function SceneBotanical({ botanicals }: SceneBotanicalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flower = botanicals.primary;

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

    const petals = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h + h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.2 + 0.4),
      r: Math.random() * 6 + 2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      alpha: Math.random() * 0.38 + 0.08,
    }));

    if (prefersReducedMotion()) {
      // Static: ambient glow + scattered petals
      const grd = ctx.createRadialGradient(w / 2, h * 0.6, 0, w / 2, h * 0.6, Math.min(w, h) * 0.6);
      grd.addColorStop(0, "rgba(100,180,100,0.05)"); grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
      for (const p of petals.slice(0, 20)) {
        p.y = Math.random() * h;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(180,220,160,${p.alpha * 0.6})`;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r * 0.5, p.r, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      const grd = ctx.createRadialGradient(w / 2, h * 0.6, 0, w / 2, h * 0.6, Math.min(w, h) * 0.6);
      grd.addColorStop(0, "rgba(100,180,100,0.05)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);

      for (const p of petals) {
        p.x += p.vx + Math.sin(t / 40 + p.y / 100) * 0.4;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(180,220,160,${p.alpha})`;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r * 0.5, p.r, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      <div className="absolute bottom-0 left-0 right-0 h-1/3 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(5,5,7,0.6), transparent)" }} />

      {/* Flower name — top with clearance below HUD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="absolute top-14 sm:top-12 left-0 right-0 text-center z-20 px-6"
      >
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-white/50 mb-1.5 sm:mb-2">Birth Flower</div>
        <div
          className="font-display font-black text-white leading-none"
          style={{ fontSize: "clamp(2.2rem, 9vw, 7.5rem)" }}
        >
          {flower.name}
        </div>
      </motion.div>

      {/* Botanical visual — center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-auto"
        style={{ filter: "drop-shadow(0 16px 50px rgba(100,200,100,0.22))" }}
      >
        <div className="sm:hidden"><BotanicalVisual name={flower.name} size={160} /></div>
        <div className="hidden sm:block"><BotanicalVisual name={flower.name} size={280} /></div>
      </motion.div>

      {/* Meaning — bottom with clearance above mobile nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="absolute bottom-16 sm:bottom-12 left-0 right-0 text-center z-20 px-6"
      >
        <div className="font-mono text-xs sm:text-sm text-white/60 italic">{flower.meaning}</div>
        {botanicals.secondary && (
          <div className="font-mono text-[10px] sm:text-[11px] text-white/40 mt-1 uppercase tracking-widest">
            Also: {botanicals.secondary.name}
          </div>
        )}
      </motion.div>
    </div>
  );
}
