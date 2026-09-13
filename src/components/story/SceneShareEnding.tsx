import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { BirthdayIdentity } from "@/lib/almanac";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import type { HistoricalWeather } from "@/lib/weather";
import { Share2, Copy, RotateCcw, Check } from "lucide-react";
import { prefersReducedMotion } from "@/utils/motion";

import { PillTag } from "@/components/ui/PillTag";
import { ShimmerButton, GlassButton, GhostPillButton } from "@/components/ui/ShimmerButton";

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

  const summary = [
    { label: "Sign", val: identity.western.name },
    { label: "Moon", val: moon.phaseName },
    { label: "Stone", val: identity.birthstone.primary },
    { label: "Flower", val: identity.botanicals.primary.name },
    { label: "Temp", val: `${Math.round(weather.maxTempC)}°C` },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-y-auto px-4 py-16 sm:py-12">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full z-0" />

      <div className="relative z-10 w-full max-w-lg text-center my-auto">
        {/* Date */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-white/50 mb-2 sm:mb-4"
        >
          {formattedDate}
        </motion.div>

        {/* Primary reveal */}
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-white leading-none mb-6 sm:mb-8"
          style={{ fontSize: "clamp(2.5rem, 11vw, 7rem)" }}
        >
          Your
          <br />
          <span className="text-accent">Story.</span>
        </motion.h2>

        {/* Summary tags (21st MCP modern glass pill tags) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-7 sm:mb-9"
        >
          {summary.map((s, idx) => (
            <PillTag
              key={s.label}
              label={s.label}
              value={s.val}
              dot={idx === 0}
              dotColor="amber"
              variant="glass"
            />
          ))}
        </motion.div>

        {/* Action buttons (21st MCP shimmer & glass buttons) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-sm sm:max-w-none mx-auto"
        >
          <ShimmerButton
            onClick={handleShare}
            icon={<Share2 className="w-3.5 h-3.5" />}
          >
            Share
          </ShimmerButton>

          <GlassButton
            onClick={handleCopy}
            icon={copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? "Copied!" : "Copy Link"}
          </GlassButton>
        </motion.div>

        {/* Reset — safe clearance above mobile nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-6 mb-4 sm:mb-0 flex justify-center"
        >
          <GhostPillButton
            onClick={onReset}
            icon={<RotateCcw className="w-3 h-3" />}
          >
            Choose Another Date
          </GhostPillButton>
        </motion.div>
      </div>
    </div>
  );
}
