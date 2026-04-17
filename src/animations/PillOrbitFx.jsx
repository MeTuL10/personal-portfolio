/**
 * PillOrbitFx — framer-motion animated glow orbs behind the "Currently learning" pills.
 * Uses motion values + useAnimationFrame for smooth orbiting.
 * No plain canvas — purely framer-motion motion values.
 */
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ORBS = [
  { size: 180, x: 0.12, y: 0.5,  speed: 0.00018, phaseX: 0,   phaseY: 1.2, opacity: 0.22, bright: false },
  { size: 130, x: 0.78, y: 0.35, speed: 0.00024, phaseX: 2.1, phaseY: 0.6, opacity: 0.16, bright: true  },
  { size: 100, x: 0.55, y: 0.8,  speed: 0.00020, phaseX: 4.2, phaseY: 3.0, opacity: 0.14, bright: false },
  { size: 80,  x: 0.88, y: 0.7,  speed: 0.00015, phaseX: 1.5, phaseY: 4.5, opacity: 0.12, bright: true  },
];

function AnimatedOrb({ orb }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame((t) => {
    x.set(Math.sin(t * orb.speed + orb.phaseX) * 60);
    y.set(Math.cos(t * orb.speed * 0.7 + orb.phaseY) * 40);
  });

  const color = orb.bright ? 'var(--art-bright)' : 'var(--art-color)';

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${orb.x * 100}%`,
        top:  `${orb.y * 100}%`,
        width:  orb.size,
        height: orb.size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: orb.opacity,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        filter: 'blur(18px)',
        x,
        y,
      }}
    />
  );
}

export default function PillOrbitFx() {
  if (REDUCED) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-40px',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'visible',
      }}
    >
      {ORBS.map((orb, i) => (
        <AnimatedOrb key={i} orb={orb} />
      ))}
    </div>
  );
}
