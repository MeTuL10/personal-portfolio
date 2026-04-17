/**
 * ShinyText — ReactBits.dev (JS + CSS variant)
 * https://www.reactbits.dev/text-animations/shiny-text
 *
 * Animated gradient sweep contained entirely within the text glyphs
 * via background-clip:text — no bleeding outside the characters.
 */
import './ShinyText.css';

export default function ShinyText({
  text = '',
  disabled = false,
  speed = 3.5,
  // Gradient end colour — matches the theme's bright accent
  colorA = '#ffffff',
  colorB = 'var(--dev-bright, #8030e8)',
  className = '',
  style,
  as: Tag = 'h1',
}) {
  return (
    <Tag
      className={`rb-shiny${disabled ? ' rb-shiny-off' : ''} ${className}`}
      style={{
        '--shiny-speed':   `${speed}s`,
        '--rb-shiny-color-a': colorA,
        '--rb-shiny-color-b': colorB,
        '--rb-shiny-shine':   'rgba(255,255,255,0.92)',
        ...style,
      }}
    >
      {text}
    </Tag>
  );
}
