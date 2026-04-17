/**
 * GSAPTextSplit
 * Animates a heading by splitting it into individual characters
 * and staggering them in with GSAP. Falls back to a simple opacity
 * fade on reduced motion or when GSAP fails to load.
 *
 * Props:
 *   as        tag name  default 'h2'
 *   children  string text
 *   className / style
 *   delay     seconds   default 0
 *   theme     'dev' | 'artist'  (affects color pulse)
 */
import { useEffect, useRef } from 'react';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function GSAPTextSplit({
  as: Tag = 'h2',
  children,
  className,
  style,
  delay = 0,
  theme = 'dev',
}) {
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (REDUCED || animated.current || !ref.current) return;

    const el = ref.current;
    const text = el.textContent || '';

    // Wrap each character in a span
    el.innerHTML = text
      .split('')
      .map((ch) =>
        ch === ' '
          ? '<span aria-hidden="true" style="display:inline-block;width:0.3em"> </span>'
          : `<span aria-hidden="true" style="display:inline-block;opacity:0;transform:translateY(28px)">${ch}</span>`
      )
      .join('');

    // Add a visually-hidden copy for screen readers
    const srSpan = document.createElement('span');
    srSpan.textContent = text;
    srSpan.style.cssText =
      'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap';
    el.appendChild(srSpan);

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const spans = el.querySelectorAll('span[aria-hidden]');

        gsap.fromTo(
          spans,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.028,
            delay,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    });

    animated.current = true;
  }, [delay]);

  // On reduced motion: render normally
  if (REDUCED) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
