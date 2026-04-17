/**
 * SectionDivider
 * A decorative animated horizontal rule that draws itself left→right
 * using framer-motion pathLength on scroll entry. Theme-aware.
 *
 * Props:
 *   theme  'dev' | 'artist'
 */
import { motion } from 'framer-motion';

const COLORS = {
  dev:    ['#6804ba', '#9b3fff'],
  artist: ['#185fa5', '#60aaec'],
};

export default function SectionDivider({ theme = 'dev' }) {
  const [c1, c2] = COLORS[theme] ?? COLORS.dev;

  return (
    <motion.div
      aria-hidden="true"
      style={{ padding: '0 8vw', marginBottom: '0.5rem' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4 }}
    >
      <svg
        width="100%"
        height="2"
        viewBox="0 0 800 2"
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`divGrad-${theme}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={c1} stopOpacity="0" />
            <stop offset="30%"  stopColor={c1} stopOpacity="0.9" />
            <stop offset="70%"  stopColor={c2} stopOpacity="0.6" />
            <stop offset="100%" stopColor={c2} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.line
          x1="0" y1="1" x2="800" y2="1"
          stroke={`url(#divGrad-${theme})`}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </motion.div>
  );
}
