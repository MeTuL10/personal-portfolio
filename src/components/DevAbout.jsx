import { useEffect, useRef } from 'react';
import DevTimeline from './DevTimeline';
import SkillsCarousel from './SkillsCarousel';
import styles from '../styles/DevAbout.module.css';

export default function DevAbout({ animateIntro = true }) {
  const nameRef = useRef(null);
  const introHandledRef = useRef(false);

  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;

    if (!animateIntro) {
      introHandledRef.current = true;
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      return;
    }

    if (introHandledRef.current) {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      introHandledRef.current = true;
    }, 100);
    return () => clearTimeout(t);
  }, [animateIntro]);

  return (
    <section className={styles.about} id="about">
      <div className={styles.glowOrb} />

      <div className={styles.intro}>
        <p className={styles.greeting}>Hi, I am</p>
        <h1 className={styles.name} ref={nameRef}>Metul Prabhu</h1>
        <h2 className={styles.role}>Software Developer focused on <span>AI/ML</span></h2>

        <p className={styles.bio}>
          I'm a Software Developer, contributing to the development
          of large-scale, data-driven AI/ML applications. Experienced in building projects
          across ML, DL and RL during my undergraduate studies.
          I'm also experienced in DevOps technologies and have used them in the development and
          deployment of applications.
        </p>

        <div className={styles.socialRow}>
          <a href="https://www.linkedin.com/in/metul-prabhu-215187202/" className={styles.socialIcon} target="_blank" rel="noreferrer" title="LinkedIn">
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a href="https://github.com/MeTuL10" className={styles.socialIcon} target="_blank" rel="noreferrer" title="GitHub">
            <i className="fa-brands fa-github"></i>
          </a>
        </div>
      </div>

      <DevTimeline />
      <SkillsCarousel />
    </section>
  );
}
