/**
 * Stack — ReactBits.dev Components
 * https://reactbits.dev/components/stack
 *
 * Stacked card deck. Drag or click to cycle through cards.
 * Adapted for the artwork gallery: each card shows one artwork.
 *
 * Props:
 *   items        array of { id, image, title, link, date }
 *   onCardClick  optional callback(item)
 *   theme        'dev' | 'artist'
 */
import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CARD_OFFSET   = 12;   // px stack offset per card behind
const SCALE_FACTOR  = 0.06; // scale reduction per card behind
const MAX_VISIBLE   = 4;    // how many stacked cards visible

function ArtCard({ item, index, total, onSwipe, theme }) {
  const isTop = index === 0;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const accentColor = theme === 'artist' ? 'var(--art-color)' : 'var(--dev-color)';
  const brightColor = theme === 'artist' ? 'var(--art-bright)' : 'var(--dev-bright)';

  const behind = Math.min(index, MAX_VISIBLE - 1);
  const scale  = 1 - behind * SCALE_FACTOR;
  const yOff   = behind * CARD_OFFSET;
  const zIndex = total - index;

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) {
      animate(x, info.offset.x > 0 ? 300 : -300, { duration: 0.3 });
      setTimeout(onSwipe, 280);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 24 });
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex,
        scale,
        y: yOff,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        cursor: isTop ? 'grab' : 'default',
        borderRadius: '1.4rem',
        overflow: 'hidden',
        boxShadow: isTop
          ? `0 2rem 5rem rgba(0,0,0,0.55), 0 0 1.5rem ${accentColor}40`
          : `0 1rem 2.5rem rgba(0,0,0,0.35)`,
        border: `1px solid ${accentColor}55`,
        background: '#060110',
        willChange: isTop ? 'transform' : undefined,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: 'grabbing' } : {}}
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          padding: '1.6rem',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* Caption — only on top card */}
      {isTop && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            padding: '1.2rem 1.8rem',
            background: 'linear-gradient(to top, rgba(0,0,0,0.82), transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
          }}>
            {item.title}
          </span>
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              color: brightColor,
              padding: '0.4rem 0.9rem',
              borderRadius: '3rem',
              border: `1px solid ${accentColor}80`,
              background: `${accentColor}18`,
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fa-brands fa-deviantart" style={{ fontSize: '1.2rem' }} />
            View
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Stack({ items = [], onCardClick, theme = 'artist' }) {
  const [cards, setCards] = useState([...items]);
  const [counter, setCounter] = useState(0);

  if (!cards.length) return null;

  const handleSwipe = () => {
    setCards((prev) => {
      const next = [...prev];
      const top = next.shift();
      next.push(top);
      return next;
    });
    setCounter((c) => c + 1);
  };

  const accentColor = theme === 'artist' ? 'var(--art-color)' : 'var(--dev-color)';
  const brightColor = theme === 'artist' ? 'var(--art-bright)' : 'var(--dev-bright)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.4rem' }}>
      {/* Stack container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '56rem',
        aspectRatio: '4 / 3',
      }}>
        {cards.slice(0, MAX_VISIBLE).map((item, i) => (
          <ArtCard
            key={`${item.id}-${counter}`}
            item={item}
            index={i}
            total={cards.length}
            onSwipe={handleSwipe}
            theme={theme}
          />
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
        <motion.button
          onClick={handleSwipe}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.7rem',
            padding: '0.9rem 2rem',
            border: `1.5px solid ${accentColor}`,
            borderRadius: '4rem',
            background: 'transparent',
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: brightColor,
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          Next <i className="fa-solid fa-arrow-right" />
        </motion.button>

        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.3rem',
          color: `${brightColor}88`,
          letterSpacing: '0.08em',
        }}>
          {counter % items.length + 1} / {items.length}
        </span>

        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.1rem',
          color: `${brightColor}55`,
        }}>
          swipe or drag to cycle
        </span>
      </div>
    </div>
  );
}
