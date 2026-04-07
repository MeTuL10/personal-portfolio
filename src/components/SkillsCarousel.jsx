import { Suspense, lazy, useMemo, useState } from 'react';
import { skills } from '../data.js';
import styles from '../styles/SkillsCarousel.module.css';

const SkillGlossFx = lazy(() => import('../animations/SkillGlossFx.jsx'));

export default function SkillsCarousel() {
  const skillGroups = useMemo(() => Object.values(skills), []);
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  const rotateSkills = (delta) => {
    if (!skillGroups.length) return;
    setActiveSkillIdx((prev) => (prev + delta + skillGroups.length) % skillGroups.length);
    setIsCardHovered(false);
    setPointer({ x: 0.5, y: 0.5 });
  };

  const handleCardPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setPointer({
      x: Math.min(Math.max(x, 0), 1),
      y: Math.min(Math.max(y, 0), 1),
    });
  };

  const activeCardStyle = useMemo(() => {
    if (!isCardHovered) {
      return {
        '--skill-tilt-x': '0deg',
        '--skill-tilt-y': '0deg',
      };
    }

    const rotateX = (0.5 - pointer.y) * 5.8;
    const rotateY = (pointer.x - 0.5) * 8.2;
    return {
      '--skill-tilt-x': `${rotateX.toFixed(2)}deg`,
      '--skill-tilt-y': `${rotateY.toFixed(2)}deg`,
    };
  }, [isCardHovered, pointer.x, pointer.y]);

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
              } ${slot === 'active' ? styles.skillCardInteractive : ''} ${
                slot === 'active' && isCardHovered ? styles.skillCardHovering : ''
              }`}
              key={key}
              style={slot === 'active' ? activeCardStyle : undefined}
              onPointerEnter={slot === 'active' ? () => setIsCardHovered(true) : undefined}
              onPointerMove={slot === 'active' ? handleCardPointerMove : undefined}
              onPointerLeave={
                slot === 'active'
                  ? () => {
                      setIsCardHovered(false);
                      setPointer({ x: 0.5, y: 0.5 });
                    }
                  : undefined
              }
            >
              {slot === 'active' && (
                <div className={styles.skillCardFx} aria-hidden="true">
                  <Suspense fallback={null}>
                    <SkillGlossFx active={isCardHovered} pointer={pointer} />
                  </Suspense>
                </div>
              )}

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
