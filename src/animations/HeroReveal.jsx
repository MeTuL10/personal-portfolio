/**
 * HeroReveal
 * Wraps hero section children and drives their entrance with:
 *  - framer-motion staggered slide+fade for each child
 *  - A clip-path wipe that reveals the name from left → right
 *  - A "scan line" shimmer that runs once across the name
 *
 * Uses framer-motion (already in deps) — no plain JS.
 *
 * Props:
 *   theme     'dev' | 'artist'
 *   play      boolean — trigger animation
 *   children  React children (each gets staggered)
 */
import { useRef, useEffect } from 'react';
import { motion, useAnimate, stagger } from 'framer-motion';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Individual animated child */
export function HeroRevealItem({ children, delay = 0, style, className }) {
  if (REDUCED) return <div style={style} className={className}>{children}</div>;

  return (
    <motion.div
      style={style}
      className={className}
      initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        delay,
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* Name wipe — clip-path reveal left→right with shimmer line */
export function HeroNameReveal({ children, theme = 'dev', delay = 0.12, className, style }) {
  const shimmerColor = theme === 'artist' ? 'rgba(96,170,236,0.7)' : 'rgba(155,63,255,0.7)';

  if (REDUCED) return <div style={style} className={className}>{children}</div>;

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }} className={className}>
      {/* Clip-path wipe reveals text left→right */}
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ delay, duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        style={{ display: 'block' }}
      >
        {children}
      </motion.div>

      {/* Shimmer scan line — runs once after wipe */}
      <motion.div
        aria-hidden="true"
        initial={{ left: '-6%', opacity: 0 }}
        animate={{ left: ['−6%', '106%'], opacity: [0, 1, 0] }}
        transition={{ delay: delay + 0.5, duration: 0.55, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          width: '8%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}

/* Staggered container — wraps all hero content */
export default function HeroReveal({ children, play = true }) {
  if (!play || REDUCED) return <>{children}</>;
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
}
