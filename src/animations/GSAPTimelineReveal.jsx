/**
 * GSAPTimelineReveal
 * Uses GSAP + ScrollTrigger to drive cinematic stagger entrance
 * for timeline items. Each item slides in from the left with a
 * spring-like ease, the date "pops" with a scale bounce, and the
 * connector line draws from top to bottom.
 *
 * This is a HOC — wrap the timeline container with it.
 * It reads children via ref and applies GSAP to real DOM nodes.
 *
 * NOTE: GSAP is imported dynamically so it never blocks initial paint.
 */
import { useEffect, useRef } from 'react';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function GSAPTimelineReveal({ children, className, style }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (REDUCED || !containerRef.current) return;

    let ctx;

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const container = containerRef.current;
          if (!container) return;

          // Timeline items — MUI renders as .MuiTimelineItem-root
          const items = container.querySelectorAll('.MuiTimelineItem-root');
          const dots  = container.querySelectorAll('.MuiTimelineDot-root');
          const connectors = container.querySelectorAll('.MuiTimelineConnector-root');
          const periods = container.querySelectorAll('.MuiTimelineOppositeContent-root');
          const contents = container.querySelectorAll('.MuiTimelineContent-root');

          if (!items.length) return;

          // Set initial states
          gsap.set(items,    { opacity: 0 });
          gsap.set(periods,  { x: -24, opacity: 0 });
          gsap.set(contents, { x: 20,  opacity: 0 });
          gsap.set(dots,     { scale: 0, opacity: 0 });
          gsap.set(connectors, { scaleY: 0, transformOrigin: 'top center' });

          // Master timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top 78%',
              once: true,
            },
          });

          // Stagger each row
          items.forEach((item, i) => {
            const period  = periods[i];
            const content = contents[i];
            const dot     = dots[i];
            const conn    = connectors[i];

            const base = i * 0.13;

            tl.to(item, { opacity: 1, duration: 0.01 }, base)
              .to(period,
                { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
                base)
              .to(dot,
                { scale: 1, opacity: 1, duration: 0.5,
                  ease: 'back.out(2.4)' },
                base + 0.06)
              .to(content,
                { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
                base + 0.1);

            if (conn) {
              tl.to(conn,
                { scaleY: 1, duration: 0.45, ease: 'power2.inOut' },
                base + 0.2);
            }
          });
        }, containerRef);
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}
