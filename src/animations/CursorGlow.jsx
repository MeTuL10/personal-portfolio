/**
 * CursorGlow
 * A soft radial glow that follows the cursor with framer-motion spring physics.
 * Desktop only (hidden on touch devices). Theme-aware.
 * Renders as a fixed, pointer-events-none element behind everything.
 *
 * Props:
 *   theme  'dev' | 'artist'
 */
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH = typeof window !== 'undefined' &&
  window.matchMedia('(hover: none)').matches;

const COLORS = {
  dev:    'rgba(155, 63, 255, 0.12)',
  artist: 'rgba(96, 170, 236, 0.12)',
};
const BORDER_COLORS = {
  dev:    'rgba(155, 63, 255, 0.25)',
  artist: 'rgba(96, 170, 236, 0.25)',
};

export default function CursorGlow({ theme = 'dev' }) {
  if (REDUCED || IS_TOUCH) return null;

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  const x = useSpring(rawX, { stiffness: 90, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 90, damping: 20, mass: 0.5 });

  // Slightly faster inner dot
  const dotX = useSpring(rawX, { stiffness: 300, damping: 22, mass: 0.3 });
  const dotY = useSpring(rawY, { stiffness: 300, damping: 22, mass: 0.3 });

  useEffect(() => {
    const onMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [rawX, rawY]);

  return (
    <>
      {/* Large glow orb */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS[theme]}, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: '-50%',
          translateY: '-50%',
          x,
          y,
          willChange: 'transform',
          mixBlendMode: 'screen',
        }}
      />

      {/* Tight ring */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `1px solid ${BORDER_COLORS[theme]}`,
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: '-50%',
          translateY: '-50%',
          x: dotX,
          y: dotY,
          willChange: 'transform',
        }}
      />
    </>
  );
}
