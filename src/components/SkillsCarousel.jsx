import { useMemo, useState } from 'react';
import { skills } from '../data.js';
import styles from '../styles/SkillsCarousel.module.css';

export default function SkillsCarousel() {
  const skillGroups = useMemo(() => Object.values(skills), []);
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);

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
  );
}
