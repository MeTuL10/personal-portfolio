import { motion } from "framer-motion";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import { education } from "../data.js";
import BlurText from "../reactbits/BlurText.jsx";
import styles from "../styles/Education.module.css";

export default function Education() {
  return (
    <section className={styles.education} aria-labelledby="education-title">
      <div className={styles.headingRow}>
        <div id="education-title">
          <BlurText
            text="Education"
            as="h2"
            animateBy="words"
            delay={70}
            duration={0.6}
            className={styles.title}
          />
        </div>
      </div>

      <Timeline className={styles.timeline} position="right">
        {education.map((entry, index) => (
          <TimelineItem className={styles.entry} key={entry.id}>
            <TimelineOppositeContent className={styles.period}>
              <time>{entry.range}</time>
            </TimelineOppositeContent>

            <TimelineSeparator className={styles.separator}>
              <motion.div
                className={entry.status ? styles.currentDot : undefined}
                whileHover={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                <TimelineDot className={styles.dot} />
              </motion.div>
              {index < education.length - 1 && <TimelineConnector className={styles.connector} />}
            </TimelineSeparator>

            <TimelineContent className={styles.content}>
              <time className={styles.mobilePeriod}>{entry.range}</time>
              <div className={styles.institutionRow}>
                <h3>{entry.institution}</h3>
                {entry.status && (
                  <motion.span
                    className={styles.status}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {entry.status}
                  </motion.span>
                )}
              </div>
              <p>{entry.qualification}</p>
              {entry.metric && (
                <motion.span
                  className={styles.metric}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {entry.metric}
                </motion.span>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
