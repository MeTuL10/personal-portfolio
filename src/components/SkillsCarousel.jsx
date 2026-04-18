import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "../data.js";
import BlurText from "../reactbits/BlurText.jsx";
import BorderGlow from "../reactbits/BorderGlow.jsx";
import styles from "../styles/SkillsCarousel.module.css";

const cardVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 110 : -110,
    opacity: 0,
    scale: 0.93,
    filter: "blur(5px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 280, damping: 26, mass: 0.8 },
  },
  exit: (dir) => ({
    x: dir > 0 ? -110 : 110,
    opacity: 0,
    scale: 0.93,
    filter: "blur(5px)",
    transition: { duration: 0.26, ease: [0.4, 0, 0.6, 1] },
  }),
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.78 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.04 + 0.08,
      type: "spring",
      stiffness: 300,
      damping: 22,
    },
  }),
};

export default function SkillsCarousel() {
  const skillGroups = useMemo(() => Object.values(skills), []);
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const rotate = (delta) => {
    setDirection(delta);
    setActiveIdx((p) => (p + delta + skillGroups.length) % skillGroups.length);
  };

  const prevIdx = (activeIdx - 1 + skillGroups.length) % skillGroups.length;
  const nextIdx = (activeIdx + 1) % skillGroups.length;

  return (
    <motion.div
      className={styles.skillsSection}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <BlurText
        text="Skill Set"
        as="h2"
        animateBy="words"
        delay={80}
        duration={0.6}
        className={styles.sectionLabel}
      />

      <div className={styles.skillsCarousel}>
        <div className={styles.skillsGrid}>
          {/* Prev ghost — no fx, just dim */}
          <div
            className={`${styles.skillCard} ${styles.skillCardSide} ${styles.skillCardPrev}`}
            aria-hidden="true"
          >
            <div className={styles.skillCardHeader}>
              <h3 className={styles.skillTitle}>
                {skillGroups[prevIdx].label}
              </h3>
            </div>
          </div>

          {/* Active card with BorderGlow hover effect */}
          <div
            style={{ position: "relative", width: "var(--skills-card-width)" }}
          >
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={activeIdx}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ width: "100%" }}
              >
                {/* BorderGlow wraps the entire card — no extra canvas overlay */}
                <BorderGlow theme="dev" glowSize={260}>
                  <div
                    className={`${styles.skillCard} ${styles.skillCardActive} ${styles.skillCardInteractive}`}
                    style={{ position: "relative", border: "none" }}
                  >
                    <div className={styles.skillCardHeader}>
                      <h3 className={styles.skillTitle}>
                        {skillGroups[activeIdx].label}
                      </h3>
                      <i
                        className={`${skillGroups[activeIdx].icon} ${styles.skillHeaderIcon}`}
                        aria-hidden="true"
                      />
                    </div>
                    <motion.ul
                      className={styles.skillList}
                      initial="hidden"
                      animate="visible"
                    >
                      {skillGroups[activeIdx].items.map((item, i) => (
                        <motion.li
                          key={item}
                          className={styles.skillTag}
                          variants={tagVariants}
                          custom={i}
                          whileHover={{
                            scale: 1.06,
                            transition: { duration: 0.16 },
                          }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </BorderGlow>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next ghost */}
          <div
            className={`${styles.skillCard} ${styles.skillCardSide} ${styles.skillCardNext}`}
            aria-hidden="true"
          >
            <div className={styles.skillCardHeader}>
              <h3 className={styles.skillTitle}>
                {skillGroups[nextIdx].label}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.skillsNav}>
        <motion.button
          type="button"
          className={styles.skillsArrow}
          onClick={() => rotate(-1)}
          aria-label="Previous skill"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <i className="fa-solid fa-chevron-left" />
        </motion.button>
        <span className={styles.skillsNavBar} aria-hidden="true" />
        <motion.button
          type="button"
          className={styles.skillsArrow}
          onClick={() => rotate(1)}
          aria-label="Next skill"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <i className="fa-solid fa-chevron-right" />
        </motion.button>
      </div>
    </motion.div>
  );
}
