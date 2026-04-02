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
import { devTimeline } from '../data.js';
import styles from '../styles/DevTimeline.module.css';

export default function DevTimeline() {
  return (
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
  );
}
