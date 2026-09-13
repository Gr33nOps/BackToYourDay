import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ZodiacGlyph } from "@/components/visuals/ZodiacGlyph";
import { WesternZodiac } from "@/lib/almanac";

interface SceneZodiacProps {
  zodiac: WesternZodiac;
}

export function SceneZodiac({ zodiac }: SceneZodiacProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Constellation stars arranged in a circle + connecting lines
    const numStars = 14;
    const baseR = Math.min(w, h) * 0.38;
    const stars = Array.from({ length: numStars }, (_, i) => {
      const a = (i / numStars) * Math.PI * 2 - Math.PI / 2;
      const jitter = (Math.random() - 0.5) * baseR * 0.4;
      return {
        bx: w / 2 + Math.cos(a) * (baseR + jitter),
        by: h / 2 + Math.sin(a) * (baseR + jitter),
        x: 0, y: 0,
        r: Math.random() * 2 + 1,
        twinkle: Math.random() * Math.PI * 2,
      };
    });

    // Extra bg stars
    const bgStars = Array.from({ length: 150 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() + 0.2, twinkle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      // Bg stars
      for (const s of bgStars) {
        s.twinkle += 0.015;
        const a = (Math.sin(s.twinkle) + 1) * 0.15 + 0.05;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
      }

      // Rotating ring
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(t * 0.0004);
      ctx.strokeStyle = "rgba(229,169,60,0.06)";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, baseR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Update + draw constellation lines (slowly drawing in)
      const progress = Math.min(1, t / 180);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x = s.bx + Math.sin(t / 60 + i) * 5;
        s.y = s.by + Math.cos(t / 80 + i) * 4;
      }
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        const b = stars[(i + 1) % stars.length];
        const drawX = a.x + (b.x - a.x) * progress;
        const drawY = a.y + (b.y - a.y) * progress;
        ctx.strokeStyle = `rgba(229,169,60,${0.15 * progress})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(drawX, drawY); ctx.stroke();
      }

      // Star nodes
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinkle = (s.twinkle ?? 0) + 0.025;
        const alpha = (Math.sin((s.twinkle ?? 0)) + 1) * 0.25 + 0.3;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,169,60,${alpha})`; ctx.fill();
        // Glow
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
        grd.addColorStop(0, "rgba(229,169,60,0.3)"); grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(s.x, s.y, 8, 0, Math.PI * 2); ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      {/* Center glyph with glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
        style={{ filter: "drop-shadow(0 0 60px rgba(229,169,60,0.4))" }}
      >
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="sm:hidden"><ZodiacGlyph sign={zodiac.name} size={110} /></div>
          <div className="hidden sm:block"><ZodiacGlyph sign={zodiac.name} size={180} /></div>
        </motion.div>
      </motion.div>

      {/* Sign name — left */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-8 sm:left-14 top-1/2 -translate-y-1/2 z-20"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/40 mb-2">Sun Sign</div>
        <div
          className="font-display font-black text-white leading-none"
          style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
        >
          {zodiac.name}
        </div>
        <div className="font-mono text-xs text-white/25 mt-2 uppercase tracking-wider">{zodiac.element} · {zodiac.dates}</div>
      </motion.div>

      {/* Motto — bottom */}
      {zodiac.latinMotto && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="absolute bottom-8 sm:bottom-12 left-0 right-0 text-center z-20"
        >
          <div className="font-mono text-xs italic text-accent/50">"{zodiac.latinMotto}"</div>
        </motion.div>
      )}
    </div>
  );
}
