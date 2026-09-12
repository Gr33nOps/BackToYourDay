import { motion, useReducedMotion } from "framer-motion";

type RevealImageProps = {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
};

export function RevealImage({ src, alt, className, onError }: RevealImageProps) {
  const reduce = useReducedMotion();

  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      onError={onError}
      className={className}
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)", scale: 1.05 }}
      whileInView={reduce ? undefined : { clipPath: "inset(0 0 0% 0)", scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 0.68, 0.32, 1] }}
    />
  );
}
