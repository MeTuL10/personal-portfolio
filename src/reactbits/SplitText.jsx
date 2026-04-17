/**
 * SplitText — ReactBits.dev component (JS + CSS variant)
 * https://reactbits.dev/text-animations/split-text
 *
 * Splits text into chars/words and animates each with GSAP + ScrollTrigger.
 * GSAP is dynamically imported — no perf hit at initial paint.
 */
import { useEffect, useRef } from 'react';

export default function SplitText({
  text = '',
  delay = 80,
  duration = 0.55,
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to   = { opacity: 1, y: 0 },
  threshold = 0.1,
  ease = 'power3.out',
  onLetterAnimationComplete,
  className,
  style,
  as: Tag = 'p',
}) {
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !ref.current) return;

    const el = ref.current;
    let gsapCtx;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Split manually (no GSAP SplitText plugin needed)
      const rawText = el.textContent || '';
      const parts = splitType === 'chars'
        ? rawText.split('')
        : rawText.split(' ');

      el.innerHTML = parts
        .map((p, i) =>
          p === '' ? ' ' :
          `<span class="rb-split-el" aria-hidden="true" style="display:inline-block;overflow:hidden">${
            splitType === 'words' && i < parts.length - 1 ? p + '\u00a0' : p
          }</span>`
        )
        .join('');

      // Screen-reader accessible copy
      const sr = document.createElement('span');
      sr.textContent = rawText;
      sr.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
      el.appendChild(sr);

      const spans = el.querySelectorAll('.rb-split-el');

      gsapCtx = gsap.context(() => {
        gsap.fromTo(spans, from, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
          onComplete: onLetterAnimationComplete,
        });
      });

      done.current = true;
    })();

    return () => gsapCtx?.revert();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: 'block', ...style }}
    >
      {text}
    </Tag>
  );
}
