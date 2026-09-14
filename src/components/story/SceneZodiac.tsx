import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ZodiacGlyph } from "@/components/visuals/ZodiacGlyph";
import { WesternZodiac } from "@/lib/almanac";
import { prefersReducedMotion } from "@/utils/motion";
import { Compass } from "lucide-react";

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
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const numStars = 14;
    const baseR = Math.min(w, h) * 0.38;
    const stars = Array.from({ length: numStars }, (_, i) => {
      const a = (i / numStars) * Math.PI * 2 - Math.PI / 2;
      const jitter = (Math.random() - 0.5) * baseR * 0.4;
      return {
        bx: w / 2 + Math.cos(a) * (baseR + jitter),
        by: h / 2 + Math.sin(a) * (baseR + jitter),
        x: 0,
        y: 0,
        r: Math.random() * 2 + 1,
        twinkle: Math.random() * Math.PI * 2,
      };
    });

    const bgStars = Array.from({ length: 140 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    if (prefersReducedMotion()) {
      for (const s of bgStars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fill();
      }
      for (let i = 0; i < stars.length; i++) {
        stars[i].x = stars[i].bx;
        stars[i].y = stars[i].by;
      }
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        const b = stars[(i + 1) % stars.length];
        ctx.strokeStyle = "rgba(229,169,60,0.12)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(229,169,60,0.5)";
        ctx.fill();
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      for (const s of bgStars) {
        s.twinkle += 0.015;
        const a = (Math.sin(s.twinkle) + 1) * 0.15 + 0.05;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }

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
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(drawX, drawY);
        ctx.stroke();
      }

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinkle = (s.twinkle ?? 0) + 0.025;
        const alpha = (Math.sin(s.twinkle ?? 0) + 1) * 0.25 + 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,169,60,${alpha})`;
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
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none w-full h-full z-0"
      />

      {/* Top Header Badge */}
      <div className="shrink-0 pt-2 relative z-10">
        <div className="archival-badge">
          <Compass className="w-3 h-3 text-accent" />
          <span>Act III · The Zodiac</span>
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
          {/* Centered Glyph with animated breathing glow */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
            style={{ filter: "drop-shadow(0 0 50px rgba(229,169,60,0.35))" }}
          >
            <div className="sm:hidden">
              <ZodiacGlyph sign={zodiac.name} size={130} />
            </div>
            <div className="hidden sm:block">
              <ZodiacGlyph sign={zodiac.name} size={180} />
            </div>
          </motion.div>

          {/* Sign Name */}
          <h2
            className="font-serif font-black text-white leading-tight tracking-tight px-2 text-4xl sm:text-6xl md:text-7xl"
          >
            {zodiac.name}
          </h2>

          {/* Element & Dates */}
          <div className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-white/70">
            {zodiac.element} Element · {zodiac.dates}
          </div>

          {/* Latin Motto */}
          {zodiac.latinMotto && (
            <div className="font-serif italic text-accent/80 text-sm sm:text-base max-w-sm">
              "{zodiac.latinMotto}"
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom spacer for clearance above HUD */}
      <div className="shrink-0 mb-12 sm:mb-14" />
    </div>
  );
}
