import { useEffect, useRef } from 'react';
import styles from './ArtAbout.module.css';

export default function ArtAbout() {
  const nameRef = useRef(null);

  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={styles.about} id="about">
      <div className={styles.glowOrb} />
      <div className={styles.glowOrb2} />

      <div className={styles.intro}>
        <p className={styles.greeting}>Hi, I'm also</p>
        <h1 className={styles.name} ref={nameRef}>Metul Prabhu</h1>
        <h2 className={styles.role}>Digital Artist & <span>Animator in training</span></h2>

        <p className={styles.bio}>
          I'm a self-taught digital artist passionate about fan art, character illustration and
          storytelling through visuals. I'm currently learning animation, environment art and
          perspective techniques. Most of my work lives on DeviantArt, where I share my progress
          and finished pieces.
        </p>

        <div className={styles.socialRow}>
          <a
            href="https://www.deviantart.com/metalex10"
            className={styles.daBtn}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-deviantart"></i> Visit my DeviantArt
          </a>
        </div>

        <div className={styles.learningSection}>
          <h2 className={styles.sectionLabel}>Currently learning</h2>
          <div className={styles.pillRow}>
            {['Animation', 'Environment Art', 'Perspective & Depth', 'Character Design', 'Lighting & Shading'].map((item) => (
              <span key={item} className={styles.pill}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
