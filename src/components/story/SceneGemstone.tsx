import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GemstoneVisual } from "@/components/visuals/GemstoneVisual";
import { BirthstoneInfo } from "@/lib/almanac";
import { prefersReducedMotion } from "@/utils/motion";

// Map stone names to rich backdrop colors
const STONE_COLORS: Record<string, string> = {
  Garnet: "#8b1a2c",
  Amethyst: "#6b4fa0",
  Aquamarine: "#1a7a8a",
  Diamond: "#b0c4de",
  Emerald: "#1a6b3a",
  Pearl: "#d4c8a8",
  Ruby: "#9b1a2a",
  Peridot: "#4a7a2a",
  Sapphire: "#1a3a8b",
  Opal: "#6a4a8b",
  Topaz: "#c87a1a",
  Turquoise: "#1a7a6b",
  "Blue Topaz": "#1a5a8b",
  Tanzanite: "#4a2a8b",
};

interface SceneGemstoneProps {
  birthstone: BirthstoneInfo;
}

export function SceneGemstone({ birthstone }: SceneGemstoneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gemColor = STONE_COLORS[birthstone.primary] ?? "#e5a93c";

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

    // Rotating facet lines radiating from center
    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      for (let i = 1; i <= 5; i++) {
        const r = (i / 5) * Math.min(w, h) * 0.48;
        const grd = ctx.createRadialGradient(cx, cy, r - 1, cx, cy, r + 1);
        grd.addColorStop(0, `${gemColor}18`); grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.save(); ctx.translate(cx, cy);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.strokeStyle = `${gemColor}14`; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * Math.min(w, h) * 0.45, Math.sin(a) * Math.min(w, h) * 0.45); ctx.stroke();
      }
      ctx.restore();
    };

    if (prefersReducedMotion()) { renderStatic(); return () => window.removeEventListener("resize", resize); }

    const render = () => {
      t++;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      // Concentric glowing rings
      for (let i = 1; i <= 5; i++) {
        const r = (i / 5) * Math.min(w, h) * 0.48;
        const grd = ctx.createRadialGradient(cx, cy, r - 1, cx, cy, r + 1);
        grd.addColorStop(0, `${gemColor}18`);
        grd.addColorStop(0.5, `${gemColor}08`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      }

      // Rotating facet lines
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.002);
      const numLines = 12;
      for (let i = 0; i < numLines; i++) {
        const a = (i / numLines) * Math.PI * 2;
        const len = Math.min(w, h) * 0.45;
        ctx.strokeStyle = `${gemColor}12`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        ctx.stroke();
      }
      // Counter-rotate another set
      ctx.rotate(-t * 0.004);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const len = Math.min(w, h) * 0.3;
        ctx.strokeStyle = `${gemColor}18`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, [gemColor]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Deep color backdrop */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${gemColor}22 0%, transparent 70%)` }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-[1]" />

      {/* Gem name — top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="absolute top-8 sm:top-12 left-0 right-0 text-center z-20"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45 mb-2">Birthstone</div>
        <div
          className="font-display font-black text-white leading-none"
          style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
        >
          {birthstone.primary}
        </div>
      </motion.div>

      {/* Gemstone visual — center. No float-y: gemstones are grounded objects. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
        style={{ filter: `drop-shadow(0 0 60px ${gemColor}50)` }}
      >
        <div className="sm:hidden"><GemstoneVisual name={birthstone.primary} colorHex={gemColor} size={160} /></div>
        <div className="hidden sm:block"><GemstoneVisual name={birthstone.primary} colorHex={gemColor} size={260} /></div>
      </motion.div>

      {/* Lore — bottom, secondary: plain opacity reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="absolute bottom-8 sm:bottom-12 left-0 right-0 text-center z-20 px-8"
      >
        <p className="font-sans text-[12px] sm:text-sm text-white/45 max-w-sm mx-auto leading-relaxed">
          {birthstone.lore?.split(" ").slice(0, 18).join(" ")}…
        </p>
      </motion.div>
    </div>
  );
}
