/**
 * BlurText — ReactBits.dev component (JS + CSS variant)
 * https://reactbits.dev/text-animations/blur-text
 *
 * Words fade in from blurred/offset to sharp, staggered.
 * Uses framer-motion (already in deps). No extra packages needed.
 */
import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function buildKeyframes({ from, to }) {
  const keys = new Set([...Object.keys(from), ...Object.keys(to)]);
  const kf = {};
  keys.forEach((k) => {
    kf[k] = [from[k] ?? to[k], to[k]];
  });
  return kf;
}

const defaultFrom = { filter: 'blur(10px)', opacity: 0, y: 20 };
const defaultTo   = { filter: 'blur(0px)',  opacity: 1, y: 0 };

export default function BlurText({
  text = '',
  delay = 80,
  duration = 0.6,
  as: Tag = 'p',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.2,
  onAnimationComplete,
  className,
  style,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !triggered) setTriggered(true);
  }, [isInView, triggered]);

  const elements = animateBy === 'words'
    ? text.split(' ').map((w, i) => ({ el: w + (i < text.split(' ').length - 1 ? '\u00a0' : ''), key: i }))
    : text.split('').map((c, i) => ({ el: c === ' ' ? '\u00a0' : c, key: i }));

  const dirOffset = direction === 'top' ? -20 : 20;
  const from = { ...defaultFrom, y: dirOffset };

  const kf = buildKeyframes({ from, to: defaultTo });

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', ...style }}
      aria-label={text}
    >
      {elements.map(({ el, key }) => (
        <motion.span
          key={key}
          style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
          animate={triggered ? kf : { ...from }}
          transition={{
            delay: key * (delay / 1000),
            duration,
            ease: [0.16, 1, 0.3, 1],
          }}
          onAnimationComplete={key === elements.length - 1 ? onAnimationComplete : undefined}
        >
          {el}
        </motion.span>
      ))}
    </Tag>
  );
}
