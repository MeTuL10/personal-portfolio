/**
 * ScrollRevealBlock
 * framer-motion whileInView scroll reveal.
 * Replaces the old IntersectionObserver plain-JS hook.
 *
 * Props:
 *   children   React children
 *   delay      number (seconds)  default 0
 *   y          px offset          default 30
 *   once       animate once only  default true
 *   className  optional class
 *   style      optional style
 */
import { motion } from 'framer-motion';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ScrollRevealBlock({
  children,
  delay = 0,
  y = 30,
  once = true,
  className,
  style,
}) {
  if (REDUCED) return <div className={className} style={style}>{children}</div>;

  const mobileY = typeof window !== 'undefined' && window.innerWidth < 768
    ? Math.min(y, 16)
    : y;

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: mobileY, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
