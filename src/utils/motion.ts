/**
 * Returns true when the user has requested reduced motion via OS or browser settings.
 * Use this in canvas useEffect hooks before starting requestAnimationFrame loops.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
