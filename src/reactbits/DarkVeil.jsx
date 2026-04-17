/**
 * DarkVeil — ReactBits.dev Backgrounds (exact implementation)
 * https://www.reactbits.dev/backgrounds/dark-veil
 *
 * Animated dark atmospheric background with:
 * - Multiple soft radial blob lights that drift slowly
 * - Fine grain noise overlay
 * - Deep vignette
 * All driven by CSS animations — zero canvas, zero Three.js.
 */
import './DarkVeil.css';

const BLOBS = [
  // top-right accent
  { id: 'tr', cx: 80, cy: 15, rx: 52, ry: 38, dur: 9,  delay: 0,   dir: 1 },
  // bottom-left accent
  { id: 'bl', cx: 12, cy: 82, rx: 44, ry: 32, dur: 11, delay: -3,  dir: -1 },
  // centre-right mid tone
  { id: 'cr', cx: 70, cy: 55, rx: 30, ry: 26, dur: 14, delay: -6,  dir: 1 },
  // top-left subtle
  { id: 'tl', cx: 22, cy: 28, rx: 28, ry: 22, dur: 17, delay: -9,  dir: -1 },
];

export default function DarkVeil({ theme = 'dev' }) {
  const isDev = theme !== 'artist';

  // Primary / secondary blob colours
  const blobA = isDev
    ? 'rgba(85, 3, 160, 0.32)'
    : 'rgba(19, 77, 135, 0.32)';
  const blobB = isDev
    ? 'rgba(55, 2, 105, 0.18)'
    : 'rgba(12, 52, 95, 0.18)';

  return (
    <div className="rb-dv-root" aria-hidden="true">
      {/* Base dark fill */}
      <div className="rb-dv-base" />

      {/* Animated soft blobs */}
      {BLOBS.map((b, i) => (
        <div
          key={b.id}
          className="rb-dv-blob"
          style={{
            left:   `${b.cx}%`,
            top:    `${b.cy}%`,
            width:  `${b.rx * 2}%`,
            height: `${b.ry * 2}%`,
            background: i % 2 === 0 ? blobA : blobB,
            animationDuration:  `${b.dur}s`,
            animationDelay:     `${b.delay}s`,
            animationDirection: b.dir > 0 ? 'alternate' : 'alternate-reverse',
          }}
        />
      ))}

      {/* Grain noise overlay */}
      <div className="rb-dv-grain" />

      {/* Vignette */}
      <div className="rb-dv-vignette" />
    </div>
  );
}
