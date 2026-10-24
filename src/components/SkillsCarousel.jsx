import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skills } from "../data.js";
import BlurText from "../reactbits/BlurText.jsx";
import BorderGlow from "../reactbits/BorderGlow.jsx";
import styles from "../styles/SkillsCarousel.module.css";

export default function SkillsCarousel() {
  const skillGroups = useMemo(() => Object.values(skills), []);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeGroup = skillGroups[activeIdx];

  return (
    <motion.section
      className={styles.skillsSection}
      aria-labelledby="skills-title"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.headingWrap} id="skills-title">
        <BlurText
          text="Skill Set"
          as="h2"
          animateBy="words"
          delay={80}
          duration={0.6}
          className={styles.sectionLabel}
        />
      </div>

      <div className={styles.console}>
        <div className={styles.categoryTabs} role="tablist" aria-label="Skill categories">
          {skillGroups.map((group, index) => {
            const isActive = activeIdx === index;
            return (
              <button
                type="button"
                className={`${styles.categoryTab} ${isActive ? styles.categoryTabActive : ""}`}
                key={group.label}
                role="tab"
                aria-selected={isActive}
                aria-controls="skill-panel"
                onClick={() => setActiveIdx(index)}
              >
                <i className={group.icon} aria-hidden="true" />
                <span>{group.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <BorderGlow theme="dev" glowSize={300} className={styles.consoleGlow}>
          <AnimatePresence mode="wait">
            <motion.div
              className={styles.skillPanel}
              id="skill-panel"
              key={activeGroup.label}
              role="tabpanel"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <header className={styles.panelHeader}>
                <div>
                  <h3>{activeGroup.label}</h3>
                </div>
                <div className={styles.panelMetric}>
                  <i className={activeGroup.icon} aria-hidden="true" />
                  <span>{String(activeGroup.items.length).padStart(2, "0")} tools</span>
                </div>
              </header>

              <ul className={styles.skillList}>
                {activeGroup.items.map((item, index) => (
                  <motion.li
                    className={styles.skillTag}
                    key={item}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.035, duration: 0.2 }}
                    whileHover={{ y: -3, transition: { duration: 0.16 } }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </BorderGlow>
      </div>
    </motion.section>
  );
}
