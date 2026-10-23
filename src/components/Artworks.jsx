import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { artworks } from "../data.js";
import FadeContent from "../reactbits/FadeContent.jsx";
import BlurText from "../reactbits/BlurText.jsx";
import Stack from "../reactbits/Stack.jsx";
import styles from "../styles/Artworks.module.css";

function groupByYear(items) {
  const map = new Map();
  for (const item of items) {
    const date = new Date(item.date);
    if (Number.isNaN(date.getTime())) continue;
    const year = date.getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year).push(item);
  }

  return [...map.keys()]
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
      items: map.get(year).sort((a, b) => new Date(b.date) - new Date(a.date)),
    }));
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const MASONRY_ROW_HEIGHT = 8;
const MASONRY_GAP = 16;

function ArtworkCard({ item, onOpen }) {
  const cardRef = useRef(null);
  const [rowSpan, setRowSpan] = useState(null);

  const updateRowSpan = useCallback(() => {
    const card = cardRef.current;
    const image = card?.querySelector("img");
    if (!card || !image?.naturalWidth) return;

    const imageHeight = (card.clientWidth * image.naturalHeight) / image.naturalWidth;
    const span = Math.ceil((imageHeight + MASONRY_GAP) / (MASONRY_ROW_HEIGHT + MASONRY_GAP));
    setRowSpan(span);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const observer = new ResizeObserver(updateRowSpan);
    observer.observe(card);
    return () => observer.disconnect();
  }, [updateRowSpan]);

  return (
    <motion.button
      layout
      ref={cardRef}
      type="button"
      className={styles.artworkCard}
      style={rowSpan ? { gridRowEnd: `span ${rowSpan}` } : undefined}
      onClick={() => onOpen(item)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      <img src={item.image} alt={item.title} loading="lazy" onLoad={updateRowSpan} />
      <span className={styles.cardShade} />
      <span className={styles.cardMeta}>
        <span>{formatDate(item.date)}</span>
        <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
      </span>
      <span className={styles.cardTitle}>{item.title}</span>
    </motion.button>
  );
}

function ArtworkViewer({ item, items, onClose, onSelect }) {
  const currentIndex = items.findIndex((artwork) => artwork.id === item.id);
  const previous = items[(currentIndex - 1 + items.length) % items.length];
  const next = items[(currentIndex + 1) % items.length];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onSelect(previous);
      if (event.key === "ArrowRight") onSelect(next);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, onClose, onSelect, previous]);

  return createPortal(
    <motion.div
      className={styles.viewerBackdrop}
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        className={styles.viewer}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} artwork viewer`}
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.viewerToolbar}>
          <span className={styles.viewerCounter}>
            {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            className={styles.viewerClose}
            onClick={onClose}
            aria-label="Close artwork viewer"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className={styles.viewerArtwork}>
          <img src={item.image} alt={item.title} />
        </div>

        <footer className={styles.viewerFooter}>
          <div>
            <p className={styles.viewerDate}>{formatDate(item.date)}</p>
            <h3>{item.title}</h3>
          </div>
          <div className={styles.viewerActions}>
            <button
              type="button"
              className={styles.viewerArrow}
              onClick={() => onSelect(previous)}
              aria-label="Previous artwork"
            >
              <i className="fa-solid fa-arrow-left" />
            </button>
            <button
              type="button"
              className={styles.viewerArrow}
              onClick={() => onSelect(next)}
              aria-label="Next artwork"
            >
              <i className="fa-solid fa-arrow-right" />
            </button>
            <a href={item.link} target="_blank" rel="noreferrer" className={styles.viewerLink}>
              <i className="fa-brands fa-deviantart" /> View on DeviantArt
            </a>
          </div>
        </footer>
      </motion.section>
    </motion.div>,
    document.body,
  );
}

export default function Artworks({ align = "left" }) {
  const groups = useMemo(() => groupByYear(artworks), []);
  const [activeYear, setActiveYear] = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const allArtworks = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const visibleArtworks =
    activeYear === "all"
      ? allArtworks
      : groups.find((group) => group.year === activeYear)?.items ?? [];
  const featuredItems = groups[0]?.items.slice(0, 4) ?? [];

  return (
    <section
      className={`${styles.artworks} ${align === "right" ? styles.artworksRight : ""}`}
      id="projects"
    >
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
          <p className={styles.galleryIntro}>
            A growing collection of illustrations, studies, and fan art. Pick a piece to step inside the frame.
          </p>
        </div>
      </FadeContent>

      {featuredItems.length > 0 && (
        <FadeContent blur delay={0.08} duration={0.7}>
          <section className={styles.featured} aria-labelledby="featured-artwork-title">
            <div className={styles.featuredCopy}>
              <span>Latest sketchbook</span>
              <h3 id="featured-artwork-title">{groups[0].year} highlights</h3>
              <p>Swipe through a few recent pieces, then explore the complete archive below.</p>
            </div>
            <div className={styles.featuredStack}>
              <Stack items={featuredItems} theme="artist" />
            </div>
          </section>
        </FadeContent>
      )}

      <div className={styles.galleryControls} id="artwork-gallery">
        <div>
          <span className={styles.galleryKicker}>Gallery archive</span>
          <h3>Browse the collection</h3>
        </div>
        <div className={styles.yearFilters} aria-label="Filter artworks by year">
          <button
            type="button"
            className={`${styles.yearFilter} ${activeYear === "all" ? styles.yearFilterActive : ""}`}
            onClick={() => setActiveYear("all")}
          >
            All <span>{allArtworks.length}</span>
          </button>
          {groups.map(({ year, items }) => (
            <button
              type="button"
              key={year}
              className={`${styles.yearFilter} ${activeYear === year ? styles.yearFilterActive : ""}`}
              onClick={() => setActiveYear(year)}
            >
              {year} <span>{items.length}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className={styles.artworkGrid}>
        <AnimatePresence mode="popLayout">
          {visibleArtworks.map((item) => (
            <ArtworkCard key={item.id} item={item} onOpen={setSelectedArtwork} />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedArtwork && (
          <ArtworkViewer
            item={selectedArtwork}
            items={visibleArtworks}
            onClose={() => setSelectedArtwork(null)}
            onSelect={setSelectedArtwork}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
