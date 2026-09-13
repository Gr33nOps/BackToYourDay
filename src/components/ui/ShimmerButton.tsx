import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * ShimmerButton: Luxury ambient gold glass button with specular edge reflection
 * inspired by 21st.dev Shimmer Button.
 */
export function ShimmerButton({
  children,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full",
        "px-6 sm:px-7 py-3 sm:py-3.5 min-h-[44px]",
        "bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-amber-500/15",
        "border border-amber-400/45 hover:border-amber-400/80",
        "text-amber-300 hover:text-amber-200",
        "font-mono text-[11px] font-bold uppercase tracking-[0.22em]",
        "backdrop-blur-xl shadow-[0_0_24px_rgba(229,169,60,0.18),inset_0_1px_0_0_rgba(255,255,255,0.35)]",
        "hover:shadow-[0_0_32px_rgba(229,169,60,0.35),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
        "transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none",
        className
      )}
      {...props}
    >
      {/* Moving specular shimmer sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />

      {/* Content */}
      {icon && (
        <span className="relative z-10 shrink-0 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/**
 * GlassButton: Refined frosted glass button with subtle top rim specular reflection
 * inspired by 21st.dev Glass Button.
 */
export function GlassButton({
  children,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full",
        "px-6 sm:px-7 py-3 sm:py-3.5 min-h-[44px]",
        "bg-white/[0.04] hover:bg-white/[0.08]",
        "border border-white/15 hover:border-white/30",
        "text-white/80 hover:text-white",
        "font-mono text-[11px] font-bold uppercase tracking-[0.22em]",
        "backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_4px_20px_rgba(0,0,0,0.35)]",
        "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_6px_24px_rgba(0,0,0,0.5)]",
        "transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none",
        className
      )}
      {...props}
    >
      {/* Moving specular sheen on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      {icon && (
        <span className="relative z-10 shrink-0 text-white/65 group-hover:text-white transition-colors duration-200">
          {icon}
        </span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/**
 * GhostPillButton: Minimalist rounded pill button for secondary flows (e.g. Choose Another Date)
 */
export function GhostPillButton({
  children,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2",
        "text-white/45 hover:text-white/80 hover:bg-white/[0.05]",
        "border border-transparent hover:border-white/10",
        "font-mono text-[11px] uppercase tracking-[0.22em]",
        "transition-all duration-200 active:scale-[0.98] cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// Backwards compatibility alias for ActionButton
export const ActionButton = ShimmerButton;
export default ShimmerButton;
