import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { BirthdayIdentity } from "@/lib/almanac";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import type { HistoricalWeather } from "@/lib/weather";
import { Share2, Copy, RotateCcw, Check } from "lucide-react";
import { prefersReducedMotion } from "@/utils/motion";

interface SceneShareEndingProps {
  day: number;
  monthName: string;
  year: number;
  identity: BirthdayIdentity;
  moon: MoonPhaseInfo;
  weather: HistoricalWeather;
  onReset: () => void;
}

export function SceneShareEnding({
  day, monthName, year, identity, moon, weather, onReset,
}: SceneShareEndingProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formattedDate = `${monthName} ${day}, ${year}`;
  const shareText = `${formattedDate} · ${identity.western.name} · ${moon.phaseName} · ${Math.round(weather.maxTempC)}°C`;
  const shareUrl = window.location.href;

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

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h + h * 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.6 + 0.1),
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.28 + 0.04,
      hue: 40, // amber only — no random violet
    }));

    if (prefersReducedMotion()) {
      // Static: just draw particles once
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(40,70%,65%,${p.alpha})`; ctx.fill();
      }
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      // No pulsing center glow — just particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},70%,65%,${p.alpha})`; ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `BackToYourDay · ${formattedDate}`, text: shareText, url: shareUrl });
        return;
      } catch { /* fallback */ }
    }
    handleCopy();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Plain text labels — no emoji as design system elements (Rule #34)
  const summary = [
    { label: "Sign", val: identity.western.name },
    { label: "Moon", val: moon.phaseName },
    { label: "Stone", val: identity.birthstone.primary },
    { label: "Flower", val: identity.botanicals.primary.name },
    { label: "Temp", val: `${Math.round(weather.maxTempC)}°C` },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-6">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Date — readable contrast, not ghost text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/45 mb-4"
        >
          {formattedDate}
        </motion.div>

        {/* Primary reveal — the only element that gets the full entrance */}
        <motion.h2
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-white leading-none mb-8"
          style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}
        >
          Your
          <br />
          <span className="text-accent">Story.</span>
        </motion.h2>

        {/* Summary chips — plain text labels, no emoji */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {summary.map(s => (
            <div
              key={s.label}
              className="px-3 py-1.5 flex items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{s.label}</span>
              <span className="font-mono text-[11px] text-white/70 font-medium">{s.val}</span>
            </div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-3 cursor-pointer transition-colors"
            style={{
              background: "rgba(229,169,60,0.10)",
              border: "1px solid rgba(229,169,60,0.35)",
              color: "#e5a93c",
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(229,169,60,0.2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(229,169,60,0.10)"; }}
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-6 py-3 cursor-pointer transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: copied ? "#e5a93c" : "rgba(255,255,255,0.6)",
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </motion.div>

        {/* Reset — readable, specific label */}
        <motion.button
          type="button"
          onClick={onReset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex items-center justify-center gap-2 mx-auto cursor-pointer transition-colors text-white/35 hover:text-white/60"
          style={{ background: "none", border: "none", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          <RotateCcw className="w-3 h-3" />
          Choose Another Date
        </motion.button>
      </div>
    </div>
  );
}
