import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
}

export function ActionButton({
  children,
  className,
  variant = "primary",
  onClick,
  disabled,
  ...props
}: ActionButtonProps) {
  const variantStyles = {
    primary: "bg-white text-canvas hover:bg-neutral-200 border border-white/20 active:scale-[0.98]",
    secondary: "bg-surface hover:bg-surface-raised text-foreground border border-surface-border hover:border-foreground-dim active:scale-[0.98]",
    accent: "bg-accent hover:bg-accent-hover text-canvas font-bold border border-accent active:scale-[0.98]",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none",
        variantStyles[variant],
        className
      )}
      {...(props as any)}
    >
      <span className="relative z-10 flex items-center gap-2 font-display">
        {children}
      </span>
    </motion.button>
  );
}
