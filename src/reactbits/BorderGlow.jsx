/**
 * BorderGlow — ReactBits.dev Components
 * https://www.reactbits.dev/components/border-glow
 *
 * Wraps a card with an animated glowing border that follows
 * the cursor on hover. Pure CSS + a small pointer-tracking
 * script to set the gradient origin.
 *
 * Usage: wrap any card div with <BorderGlow theme="dev">...</BorderGlow>
 */
import { useRef } from 'react';
import './BorderGlow.css';

const GLOW_COLORS = {
  dev:    { primary: '#8030e8', secondary: '#5503a0' },
  artist: { primary: '#4d96db', secondary: '#134d87' },
};

export default function BorderGlow({
  children,
  theme = 'dev',
  glowSize = 220,
  className = '',
  style,
}) {
  const wrapRef = useRef(null);
  const glowRef = useRef(null);

  const { primary, secondary } = GLOW_COLORS[theme] ?? GLOW_COLORS.dev;

  const handleMove = (e) => {
    const el = wrapRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.background = `radial-gradient(${glowSize}px circle at ${x}px ${y}px, ${primary}70, ${secondary}30, transparent 70%)`;
    glow.style.opacity = '1';
  };

  const handleLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={wrapRef}
      className={`rb-border-glow ${className}`}
      style={{
        '--glow-primary': primary,
        '--glow-secondary': secondary,
        ...style,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {/* Glow border layer */}
      <div ref={glowRef} className="rb-bg-glow-layer" />
      {/* Inner border mask */}
      <div className="rb-bg-border" />
      {/* Content */}
      <div className="rb-bg-content">
        {children}
      </div>
    </div>
  );
}
