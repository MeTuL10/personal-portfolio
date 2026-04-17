import { Suspense, lazy, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineDot,
  TimelineConnector, TimelineContent, TimelineOppositeContent,
} from '@mui/lab';
import { Typography } from '@mui/material';
import { devTimeline } from '../data.js';
import FadeContent from '../reactbits/FadeContent.jsx';
import BlurText from '../reactbits/BlurText.jsx';
import styles from '../styles/DevTimeline.module.css';

const TimelineConnectorFx = lazy(() => import('../animations/TimelineConnectorFx.jsx'));

export default function DevTimeline() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className={styles.timelineSection}>
      {/* GSAP character-split heading */}
      <BlurText text="Experience Timeline" as="h2" animateBy="words" delay={70} duration={0.6} className={styles.sectionLabel} />

      {/* GSAP ScrollTrigger stagger for all timeline rows */}
      <FadeContent blur delay={0} duration={0.75}>
        <Timeline className={styles.timeline} position="right">
          {devTimeline.map((entry, idx) => (
            <TimelineItem
              key={`${entry.range}-${entry.role}`}
              className={`${styles.timelineItem} ${
                hoveredIdx === idx ? styles.timelineItemConnectorActive : ''
              }`}
            >
              <TimelineOppositeContent className={styles.timelinePeriod}>
                {entry.range}
              </TimelineOppositeContent>

              <TimelineSeparator
                className={styles.timelineSeparator}
                onPointerEnter={() => setHoveredIdx(idx)}
                onPointerLeave={() => setHoveredIdx((c) => (c === idx ? null : c))}
              >
                <span className={styles.timelineSeparatorFx} aria-hidden="true">
                  <Suspense fallback={null}>
                    <TimelineConnectorFx active={hoveredIdx === idx} />
                  </Suspense>
                </span>

                {/* Framer-motion spring pop on the dot for hover */}
                <motion.div
                  whileHover={{ scale: 1.35 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  <TimelineDot className={styles.timelineDot} />
                </motion.div>

                {idx < devTimeline.length - 1 && (
                  <TimelineConnector className={styles.timelineConnector} />
                )}
              </TimelineSeparator>

              <TimelineContent className={styles.timelineContent}>
                <Typography component="p" className={styles.timelineMobilePeriod}>
                  {entry.range}
                </Typography>
                <Typography component="h3" className={styles.timelineRole}>
                  {entry.role}
                </Typography>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Typography component="p" className={styles.timelineCompany}>
                    {entry.company}
                  </Typography>
                </motion.div>
                <Typography component="p" className={styles.timelineDesc}>
                  {entry.description}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </FadeContent>
    </div>
  );
}
