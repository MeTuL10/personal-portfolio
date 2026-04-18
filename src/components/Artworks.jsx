import { useMemo } from "react";
import { artworks } from "../data.js";
import FadeContent from "../reactbits/FadeContent.jsx";
import BlurText from "../reactbits/BlurText.jsx";
import Stack from "../reactbits/Stack.jsx";
import styles from "../styles/Artworks.module.css";

function groupByYear(items) {
  const map = new Map();
  for (const item of items) {
    const d = new Date(item.date);
    if (Number.isNaN(d.getTime())) continue;
    const y = d.getFullYear();
    if (!map.has(y)) map.set(y, []);
    map.get(y).push(item);
  }
  const years = [...map.keys()].sort((a, b) => b - a);
  return years.map((y) => ({
    year: y,
    items: map.get(y).sort((a, b) => new Date(b.date) - new Date(a.date)),
  }));
}

export default function Artworks({ align = "left" }) {
  const groups = useMemo(() => groupByYear(artworks), []);

  return (
    <section
      className={`${styles.artworks} ${align === "right" ? styles.artworksRight : ""}`}
      id="projects"
    >
      {/* Section heading */}
      <FadeContent blur delay={0} duration={0.6}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>— sketchbook</span>
          <BlurText
            text="My Artwork"
            as="h2"
            animateBy="words"
            delay={80}
            duration={0.65}
            className={styles.sectionTitle}
          />
        </div>
      </FadeContent>

      {/* All years stacked vertically, newest first */}
      <div className={styles.booksColumn}>
        {groups.map(({ year, items }, i) => (
          <FadeContent key={year} blur delay={i * 0.1} duration={0.7}>
            <div className={styles.yearBlock}>
              {/* Year header — bold, prominent, above the stack */}
              <div className={styles.yearHeader}>
                <span className={styles.yearHeading}>{year}</span>
                <span className={styles.yearPill}>
                  {items.length} piece{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Stack card viewer */}
              <Stack items={items} theme="artist" />
            </div>
          </FadeContent>
        ))}
      </div>
    </section>
  );
}
