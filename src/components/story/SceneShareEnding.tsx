import { useState } from "react";
import { motion } from "framer-motion";
import type { BirthdayIdentity } from "@/lib/almanac";
import type { MoonPhaseInfo } from "@/lib/astronomy";
import type { HistoricalWeather } from "@/lib/weather";
import { ActionButton } from "@/components/ui/ActionButton";
import { Share2, Copy, RotateCcw, Check } from "lucide-react";

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
  day,
  monthName,
  year,
  identity,
  moon,
  weather,
  onReset,
}: SceneShareEndingProps) {
  const [copied, setCopied] = useState(false);

  const formattedDate = `${monthName} ${day}, ${year}`;
  const shareTitle = `BackToYourDay · ${formattedDate}`;
  const shareText = `I explored the day I was born: ${formattedDate} (${identity.western.name}, ${moon.phaseName}, ${Math.round(weather.maxTempC)}°C). Discover yours:`;
  const shareUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    handleCopyLink();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center px-4 py-4 text-center select-none"
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-foreground-muted uppercase mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span>Certified Archive Dossier &bull; Keepsake Record</span>
      </div>

      {/* Keepsake Certificate Panel */}
      <div className="w-full p-6 sm:p-8 border border-surface-border bg-surface/90 text-left mb-6 shadow-2xl relative">
        {/* Dossier Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Personal Archival Dossier
            </span>
          </div>
          <span className="text-[11px] font-mono font-medium text-accent px-2 py-0.5 border border-accent/20 bg-accent/5">
            {identity.metrics.weekdayBorn.toUpperCase()}
          </span>
        </div>

        {/* Date Headline */}
        <div className="mb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-dim block mb-1">
            RECORDED BIRTHDAY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {formattedDate}
          </h2>
          <p className="text-xs font-mono text-foreground-muted mt-1.5 uppercase tracking-wide">
            Season of {identity.metrics.season} &bull; Year of the {identity.chinese.animal}
          </p>
        </div>

        {/* Archival Ledger Rows */}
        <div className="border-t border-surface-border divide-y divide-surface-border text-xs sm:text-sm mb-6">
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground-dim">
              Sun Sign
            </span>
            <span className="font-mono font-medium text-white">
              {identity.western.symbol} {identity.western.name} <span className="text-accent">({identity.western.element})</span>
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground-dim">
              Birthstone
            </span>
            <span className="font-sans font-medium text-white">
              {identity.birthstone.primary}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground-dim">
              Birth Flower
            </span>
            <span className="font-sans font-medium text-white">
              {identity.botanicals.primary.name}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground-dim">
              Lunar Phase
            </span>
            <span className="font-sans font-medium text-white">
              {moon.phaseName} <span className="text-accent font-mono text-xs">({moon.illumination}%)</span>
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground-dim">
              Climate
            </span>
            <span className="font-sans font-medium text-white">
              {Math.round(weather.maxTempC)}°C &bull; {weather.condition}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-1">
          <ActionButton
            onClick={handleShare}
            className="flex-1 text-xs py-3"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Keepsake</span>
          </ActionButton>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 border border-surface-border bg-surface-subtle hover:bg-surface-raised text-white text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
            title="Copy link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-accent" />
                <span className="text-accent">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-foreground-muted" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reset CTA */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-foreground-muted hover:text-white border border-surface-border bg-surface/30 hover:bg-surface/80 transition-all cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5 text-accent" />
        <span>Explore Another Birthday</span>
      </button>
    </motion.div>
  );
}

