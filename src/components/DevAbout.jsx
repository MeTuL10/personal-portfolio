import { useEffect, useMemo, useRef, useState } from 'react';
import { skills } from '../data.js';
import styles from '../styles/DevAbout.module.css';

export default function DevAbout() {
  const nameRef = useRef(null);
  const skillsTrackRef = useRef(null);
  const scrollRafRef = useRef(null);
  const skillGroups = useMemo(() => Object.values(skills), []);
  const loopedGroups = useMemo(() => {
    if (!skillGroups.length) return [];
    return [skillGroups[skillGroups.length - 1], ...skillGroups, skillGroups[0]];
  }, [skillGroups]);
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);
  const [activeLoopIdx, setActiveLoopIdx] = useState(1);

  const getLoopCard = (loopIndex) => {
    const track = skillsTrackRef.current;
    if (!track) return 0;
    return track.querySelector(`[data-loop-index="${loopIndex}"]`);
  };

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

  const scrollToLoopIndex = (loopIndex, behavior = 'smooth') => {
    const track = skillsTrackRef.current;
    if (!track) return;
    const target = getLoopCard(loopIndex);
    if (!target) return;
    const centeredLeft = target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;

    track.scrollTo({
      left: centeredLeft,
      behavior,
    });
  };

  const rotateSkills = (delta) => {
    if (!skillGroups.length) return;
    const nextLoopIdx = activeLoopIdx + delta;
    setActiveLoopIdx(nextLoopIdx);
    scrollToLoopIndex(nextLoopIdx);
  };

  const handleSkillsScroll = () => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      const track = skillsTrackRef.current;
      if (!track) {
        scrollRafRef.current = null;
        return;
      }

      if (!skillGroups.length || !loopedGroups.length) {
        scrollRafRef.current = null;
        return;
      }

      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let nearestLoopIdx = activeLoopIdx;
      let nearestDistance = Number.POSITIVE_INFINITY;
      loopedGroups.forEach((_, idx) => {
        const card = getLoopCard(idx);
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - trackCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestLoopIdx = idx;
        }
      });

      const maxLoopIdx = skillGroups.length + 1;

      if (nearestLoopIdx <= 0) {
        nearestLoopIdx = skillGroups.length;
        scrollToLoopIndex(nearestLoopIdx, 'auto');
      } else if (nearestLoopIdx >= maxLoopIdx) {
        nearestLoopIdx = 1;
        scrollToLoopIndex(nearestLoopIdx, 'auto');
      }

      setActiveLoopIdx(nearestLoopIdx);
      const mappedActiveIdx = nearestLoopIdx - 1;
      if (mappedActiveIdx !== activeSkillIdx) setActiveSkillIdx(mappedActiveIdx);
      scrollRafRef.current = null;
    });
  };

  const handleSkillsWheel = (event) => {
    const track = skillsTrackRef.current;
    if (!track) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    track.scrollBy({ left: event.deltaY, behavior: 'auto' });
  };

  useEffect(() => {
    if (!skillGroups.length) return undefined;
    scrollToLoopIndex(1, 'auto');
    return () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [skillGroups.length, loopedGroups.length]);

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

      <div className={styles.skillsSection}>
        <h2 className={styles.sectionLabel}>Skill Set</h2>

        <div className={styles.skillsCarousel}>
          <div
            className={styles.skillsGrid}
            ref={skillsTrackRef}
            onScroll={handleSkillsScroll}
            onWheel={handleSkillsWheel}
          >
            {loopedGroups.map((group, idx) => {
              let realIdx = idx - 1;
              if (idx === 0) realIdx = skillGroups.length - 1;
              if (idx === loopedGroups.length - 1) realIdx = 0;
              return (
              <div
                className={`${styles.skillCard} ${
                  realIdx === activeSkillIdx ? styles.skillCardActive : styles.skillCardSide
                }`}
                key={`${group.label}-${idx}`}
                data-loop-index={idx}
              >
                <div className={styles.skillCardHeader}>
                  <h3 className={styles.skillTitle}>{group.label}</h3>
                  <i className={`${group.icon} ${styles.skillHeaderIcon}`} aria-hidden="true"></i>
                </div>

                <ul className={styles.skillList}>
                  {group.items.map((item) => (
                    <li key={item} className={styles.skillTag}>{item}</li>
                  ))}
                </ul>
              </div>
            );
            })}
          </div>
        </div>

        <div className={styles.skillsNav}>
          <button
            type="button"
            className={styles.skillsArrow}
            onClick={() => rotateSkills(-1)}
            aria-label="Previous skill card"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className={styles.skillsNavBar} aria-hidden="true" />
          <button
            type="button"
            className={styles.skillsArrow}
            onClick={() => rotateSkills(1)}
            aria-label="Next skill card"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

