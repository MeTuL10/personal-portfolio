import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from '@mui/lab';
import { Typography } from '@mui/material';
import { skills, devTimeline } from '../data.js';
import styles from '../styles/DevAbout.module.css';

export default function DevAbout() {
  const nameRef = useRef(null);
  const skillGroups = useMemo(() => Object.values(skills), []);
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);

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

  const rotateSkills = (delta) => {
    if (!skillGroups.length) return;
    setActiveSkillIdx((prev) => (prev + delta + skillGroups.length) % skillGroups.length);
  };

  const visibleSkillCards = useMemo(() => {
    const total = skillGroups.length;
    if (!total) return [];
    if (total === 1) {
      return [{ slot: 'active', group: skillGroups[0], key: `active-${skillGroups[0].label}-0` }];
    }

    const prevIdx = (activeSkillIdx - 1 + total) % total;
    const nextIdx = (activeSkillIdx + 1) % total;

    return [
      { slot: 'prev', group: skillGroups[prevIdx], key: `prev-${skillGroups[prevIdx].label}-${prevIdx}` },
      { slot: 'active', group: skillGroups[activeSkillIdx], key: `active-${skillGroups[activeSkillIdx].label}-${activeSkillIdx}` },
      { slot: 'next', group: skillGroups[nextIdx], key: `next-${skillGroups[nextIdx].label}-${nextIdx}` },
    ];
  }, [activeSkillIdx, skillGroups]);

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

      <div className={styles.timelineSection}>
        <h2 className={styles.sectionLabel}>Experience Timeline</h2>
        <Timeline className={styles.timeline} position="right">
          {devTimeline.map((entry, idx) => (
            <TimelineItem key={`${entry.range}-${entry.role}`} className={styles.timelineItem}>
              <TimelineOppositeContent className={styles.timelinePeriod}>
                {entry.range}
              </TimelineOppositeContent>
              <TimelineSeparator className={styles.timelineSeparator}>
                <TimelineDot className={styles.timelineDot} />
                {idx < devTimeline.length - 1 ? (
                  <TimelineConnector className={styles.timelineConnector} />
                ) : null}
              </TimelineSeparator>
              <TimelineContent className={styles.timelineContent}>
                <Typography component="p" className={styles.timelineMobilePeriod}>
                  {entry.range}
                </Typography>
                <Typography component="h3" className={styles.timelineRole}>
                  {entry.role}
                </Typography>
                <Typography component="p" className={styles.timelineCompany}>
                  {entry.company}
                </Typography>
                <Typography component="p" className={styles.timelineDesc}>
                  {entry.description}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>

      <div className={styles.skillsSection}>
        <h2 className={styles.sectionLabel}>Skill Set</h2>

        <div className={styles.skillsCarousel}>
          <div className={styles.skillsGrid}>
            {visibleSkillCards.map(({ slot, group, key }) => (
              <div
                className={`${styles.skillCard} ${
                  slot === 'active' ? styles.skillCardActive : styles.skillCardSide
                } ${
                  slot === 'prev' ? styles.skillCardPrev : slot === 'next' ? styles.skillCardNext : ''
                }`}
                key={key}
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
            ))}
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

