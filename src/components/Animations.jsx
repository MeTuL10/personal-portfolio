import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { animations } from "../data.js";
import FadeContent from "../reactbits/FadeContent.jsx";
import styles from "../styles/Animations.module.css";

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function Animations() {
  const railRef = useRef(null);
  const orderedAnimations = useMemo(
    () => [...animations].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [],
  );

  if (!orderedAnimations.length) return null;

  const moveRail = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.78, 680), behavior: "smooth" });
  };

  return (
    <section className={styles.animations} id="animations" aria-labelledby="animation-title">
      <FadeContent blur duration={0.65}>
        <header className={styles.sectionHeader}>
          <span className={styles.eyebrow}>— Animations</span>
          <h2 id="animation-title">My Animations</h2>
          <p>Adding some life to my sketches.</p>
        </header>
      </FadeContent>

      <div className={styles.railToolbar}>
        <span>Scroll to browse</span>
        <div className={styles.railControls}>
          <button type="button" onClick={() => moveRail(-1)} aria-label="Show previous animations">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => moveRail(1)} aria-label="Show next animations">
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.animationRail} ref={railRef}>
        {orderedAnimations.map((animation, index) => (
          <motion.article
            className={styles.animationCard}
            key={animation.id}
            initial={{ opacity: 0, y: 24, rotate: index % 2 ? 0.5 : -0.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 0.5 : -0.5 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.frame}>
              <span className={styles.tape} aria-hidden="true" />
              <video
                className={styles.video}
                controls
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={`${animation.title} animation`}
              >
                <source src={animation.video} type="video/mp4" />
                Your browser does not support embedded video.
              </video>
            </div>
            <footer className={styles.cardFooter}>
              <span>Animation {String(index + 1).padStart(2, "0")} · {formatDate(animation.date)}</span>
              <h3>{animation.title}</h3>
              <p>Play animation</p>
            </footer>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
