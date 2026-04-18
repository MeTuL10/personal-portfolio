/**
 * FadeContent — ReactBits.dev Animations component
 * https://reactbits.dev/animations/fade-content
 *
 * Fades in content as it enters the viewport.
 * Optional blur for a modern frosted reveal effect.
 * Pure framer-motion, zero Three.js overhead.
 */
import { motion } from "framer-motion";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function FadeContent({
  children,
  blur = false,
  duration = 0.65,
  delay = 0,
  easing = [0.16, 1, 0.3, 1],
  initialOpacity = 0,
  className,
  style,
}) {
  if (REDUCED)
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );

  const initial = {
    opacity: initialOpacity,
    y: 18,
    ...(blur ? { filter: "blur(8px)" } : {}),
  };

  const animate = {
    opacity: 1,
    y: 0,
    ...(blur ? { filter: "blur(0px)" } : {}),
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: easing }}
    >
      {children}
    </motion.div>
  );
}
