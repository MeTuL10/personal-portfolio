/**
 * MagneticButton
 * framer-motion magnetic cursor-follow effect.
 * On hover the element follows the cursor with a spring,
 * snapping back on leave. Wraps any children.
 *
 * Props:
 *   children     React children
 *   strength     magnetic pull strength 0–1  default 0.35
 *   className / style  passed to wrapper div
 */
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function MagneticButton({ children, strength = 0.35, className, style }) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 18, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 200, damping: 18, mass: 0.6 });

  if (REDUCED) return <div className={className} style={style}>{children}</div>;

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    rawX.set((e.clientX - cx) * strength);
    rawY.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, x, y }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
