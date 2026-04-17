/**
 * Magnet — ReactBits.dev Animations component
 * https://reactbits.dev/animations/magnet
 *
 * Spring-based magnetic cursor-follow on hover.
 * Wraps any children. Desktop only (no-op on touch).
 */
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH = typeof window !== 'undefined' &&
  window.matchMedia('(hover: none)').matches;

export default function Magnet({
  children,
  padding = 60,
  disabled = false,
  magnetStrength = 0.4,
  className,
  style,
}) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 18, mass: 0.55 });
  const y = useSpring(rawY, { stiffness: 200, damping: 18, mass: 0.55 });

  if (REDUCED || IS_TOUCH || disabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) * magnetStrength);
    rawY.set((e.clientY - cy) * magnetStrength);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, x, y, display: 'inline-flex' }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
