import React from "react";
import { cn } from "@/lib/utils";

export interface PillTagProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  dot?: boolean;
  dotColor?: "amber" | "emerald" | "rose" | "sky" | "white";
  variant?: "glass" | "amber" | "subtle";
  className?: string;
}

export function PillTag({
  label,
  value,
  icon,
  dot = false,
  dotColor = "amber",
  variant = "glass",
  className,
  ...props
}: PillTagProps) {
  const dotColorClasses = {
    amber: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
    emerald: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
    rose: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]",
    sky: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]",
    white: "bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]",
  };

  const variantClasses = {
    glass:
      "bg-white/[0.04] border-white/10 hover:border-amber-400/40 hover:bg-white/[0.07] text-white/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_4px_16px_rgba(0,0,0,0.4)]",
    amber:
      "bg-amber-500/[0.08] border-amber-400/30 hover:border-amber-400/60 hover:bg-amber-500/[0.12] text-amber-200 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2),0_4px_16px_rgba(229,169,60,0.15)]",
    subtle:
      "bg-white/[0.02] border-white/[0.06] hover:border-white/20 text-white/75",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 sm:px-3.5 py-1 sm:py-1.5",
        "backdrop-blur-xl transition-all duration-300 select-none",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* Optional icon or dot indicator */}
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColorClasses[dotColor])}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0 text-white/60">{icon}</span>}

      {/* Category / Prefix */}
      {label && (
        <span className="font-mono text-[9px] sm:text-[10px] text-white/45 uppercase tracking-[0.18em]">
          {label}
        </span>
      )}

      {/* Micro-divider when both label and value are present */}
      {label && value && (
        <span className="h-2.5 w-[1px] bg-white/15 shrink-0" aria-hidden="true" />
      )}

      {/* Main value */}
      <span className="font-mono text-[11px] sm:text-xs text-white/90 font-medium tracking-wide">
        {value}
      </span>
    </div>
  );
}
