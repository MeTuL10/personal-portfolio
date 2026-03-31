import { useEffect, useMemo, useRef, useState } from 'react';
import { artworks } from '../data.js';
import styles from '../styles/Artworks.module.css';

const FLIP_OUT_MS = 220;
const FLIP_IN_MS = 220;
const WHEEL_THRESHOLD = 26;
const SWIPE_THRESHOLD = 48;

function groupByYearFromDate(items) {
  const yearMap = new Map();

  for (const item of items) {
    const parsedDate = new Date(item.date);
    if (Number.isNaN(parsedDate.getTime())) continue;

    const year = parsedDate.getFullYear();
    if (!yearMap.has(year)) yearMap.set(year, []);
    yearMap.get(year).push(item);
  }

  for (const [year, yearItems] of yearMap.entries()) {
    yearMap.set(
      year,
      yearItems.slice().sort((a, b) => new Date(a.date) - new Date(b.date)),
    );
  }

  const existingYears = [...yearMap.keys()];
  const currentYear = new Date().getFullYear();
  const minYear = existingYears.length ? Math.min(...existingYears) : currentYear;
  const maxYear = existingYears.length ? Math.max(...existingYears) : currentYear;
  const topYear = Math.max(currentYear, maxYear);

  const sketchbooks = [];
  for (let year = topYear; year >= minYear; year -= 1) {
    sketchbooks.push({
      year,
      items: yearMap.get(year) ?? [],
    });
  }

  return sketchbooks;
}

export default function Artworks({ align = 'left' }) {
  const sketchbooks = useMemo(() => groupByYearFromDate(artworks), []);

  const [pageByYear, setPageByYear] = useState(() =>
    Object.fromEntries(sketchbooks.map(({ year }) => [year, 0])),
  );
  const [flipPhaseByYear, setFlipPhaseByYear] = useState(() =>
    Object.fromEntries(sketchbooks.map(({ year }) => [year, null])),
  );
  const [selectedYear, setSelectedYear] = useState(sketchbooks[0]?.year ?? null);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const flipTimersRef = useRef({});
  const touchStartXRef = useRef({});

  const markImageReady = (artId) => {
    setLoadedImages((prev) => {
      if (prev[artId]) return prev;
      return { ...prev, [artId]: true };
    });
  };

  const clearFlipTimers = (year) => {
    const timers = flipTimersRef.current[year];
    if (!timers) return;
    if (timers.out) clearTimeout(timers.out);
    if (timers.in) clearTimeout(timers.in);
    delete flipTimersRef.current[year];
  };

  useEffect(() => {
    return () => {
      Object.keys(flipTimersRef.current).forEach((yearKey) => {
        clearFlipTimers(yearKey);
      });
    };
  }, []);

  const goTo = (year, dir, maxArtworkPage) => {
    if (flipPhaseByYear[year]) return;

    const current = pageByYear[year] ?? 0;
    const next = dir === 'next' ? current + 1 : current - 1;

    if (next < 0 || next > maxArtworkPage) return;

    clearFlipTimers(year);

    const outPhase = dir === 'next' ? 'out-next' : 'out-prev';
    const inPhase = dir === 'next' ? 'in-next' : 'in-prev';

    setFlipPhaseByYear((prev) => ({ ...prev, [year]: outPhase }));

    const outTimer = setTimeout(() => {
      setPageByYear((prev) => ({ ...prev, [year]: next }));
      setFlipPhaseByYear((prev) => ({ ...prev, [year]: inPhase }));

      const inTimer = setTimeout(() => {
        setFlipPhaseByYear((prev) => ({ ...prev, [year]: null }));
        delete flipTimersRef.current[year];
      }, FLIP_IN_MS);

      flipTimersRef.current[year] = { ...flipTimersRef.current[year], in: inTimer };
    }, FLIP_OUT_MS);

    flipTimersRef.current[year] = { out: outTimer };
  };

  const handleBookWheel = (event, year, totalArtworks) => {
    if (flipPhaseByYear[year]) return;

    const horizontalDelta =
      Math.abs(event.deltaX) >= Math.abs(event.deltaY)
        ? event.deltaX
        : event.shiftKey
          ? event.deltaY
          : 0;

    if (Math.abs(horizontalDelta) < WHEEL_THRESHOLD) return;

    event.preventDefault();
    goTo(year, horizontalDelta > 0 ? 'next' : 'prev', totalArtworks);
  };

  const handleTouchStart = (event, year) => {
    touchStartXRef.current[year] = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event, year, totalArtworks) => {
    if (flipPhaseByYear[year]) return;

    const startX = touchStartXRef.current[year];
    const endX = event.changedTouches[0]?.clientX;
    if (startX == null || endX == null) return;

    const deltaX = startX - endX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    goTo(year, deltaX > 0 ? 'next' : 'prev', totalArtworks);
    touchStartXRef.current[year] = null;
  };

  return (
    <section
      className={`${styles.artworks} ${align === 'right' ? styles.artworksRight : ''}`}
      id="projects"
    >
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>- sketchbook</span>
        <h2 className={styles.sectionTitle}>My Artwork</h2>
      </div>

      <div className={styles.yearTabs}>
        {sketchbooks.map(({ year }) => (
          <a
            key={year}
            href={`#sketchbook-${year}`}
            className={`${styles.yearTab} ${selectedYear === year ? styles.yearTabActive : ''}`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </a>
        ))}
      </div>

      <div className={styles.booksColumn}>
        {sketchbooks.map(({ year, items }) => {
          const pageIdx = pageByYear[year] ?? 0;
          const flipPhase = flipPhaseByYear[year];
          const isTurning = Boolean(flipPhase);
          const currentArt = pageIdx > 0 ? items[pageIdx - 1] : null;
          const totalArtworks = items.length;
          const isCover = pageIdx === 0;
          const imageReady = currentArt ? Boolean(loadedImages[currentArt.id]) : false;
          const imageFailed = currentArt ? Boolean(imageErrors[currentArt.id]) : false;
          const imageSrc = currentArt ? currentArt.image : '';

          return (
            <article key={year} id={`sketchbook-${year}`} className={styles.sketchbook}>
              <div className={styles.spine}>
                <span className={styles.spineYear}>{year}</span>
              </div>

              <div
                className={`${styles.bookBody} ${isTurning ? styles.bookBodyTurning : ''}`}
                onWheel={(event) => handleBookWheel(event, year, totalArtworks)}
                onTouchStart={(event) => handleTouchStart(event, year)}
                onTouchEnd={(event) => handleTouchEnd(event, year, totalArtworks)}
              >
                {isCover ? (
                  <div
                    className={`${styles.page} ${styles.coverPage} ${
                      flipPhase === 'out-next'
                        ? styles.pageTurnOutNext
                        : flipPhase === 'out-prev'
                          ? styles.pageTurnOutPrev
                          : flipPhase === 'in-next'
                            ? styles.pageTurnInNext
                            : flipPhase === 'in-prev'
                              ? styles.pageTurnInPrev
                              : ''
                    }`}
                  >
                    <span className={styles.coverYear}>{year}</span>
                    <span className={styles.coverSub}>
                      {totalArtworks} piece{totalArtworks !== 1 ? 's' : ''}
                    </span>
                    <button
                      className={styles.openBtn}
                      onClick={() => goTo(year, 'next', totalArtworks)}
                      disabled={totalArtworks === 0}
                    >
                      {totalArtworks === 0 ? 'No pages yet' : 'Open'}{' '}
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                ) : (
                  <div
                    className={`${styles.page} ${styles.artPage} ${
                      flipPhase === 'out-next'
                        ? styles.pageTurnOutNext
                        : flipPhase === 'out-prev'
                          ? styles.pageTurnOutPrev
                          : flipPhase === 'in-next'
                            ? styles.pageTurnInNext
                            : flipPhase === 'in-prev'
                              ? styles.pageTurnInPrev
                              : ''
                    }`}
                  >
                    <div className={styles.artContent}>
                      <div
                        className={`${styles.artFrame} ${
                          imageReady ? '' : styles.artFrameLoading
                        }`}
                      >
                        {!imageReady && !imageFailed && (
                          <div className={styles.imgLoader}>
                            <span className={styles.imgLoaderDot} />
                            Loading artwork...
                          </div>
                        )}
                        {imageFailed && (
                          <div className={styles.imgError}>couldn't find the image :(</div>
                        )}
                        {!imageFailed && (
                          <img
                            src={imageSrc}
                            alt={currentArt.title}
                            className={`${styles.artImg} ${
                              imageReady ? styles.artImgVisible : styles.artImgHidden
                            }`}
                            onLoad={() => {
                              markImageReady(currentArt.id);
                              setImageErrors((prev) => ({ ...prev, [currentArt.id]: false }));
                            }}
                            onError={() => {
                              setImageErrors((prev) => ({ ...prev, [currentArt.id]: true }));
                            }}
                          />
                        )}
                      </div>

                      <div className={styles.artCaption}>
                        <span className={styles.artTitle}>{currentArt.title}</span>
                        <a
                          href={currentArt.link}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.artDa}
                        >
                          <i className="fa-brands fa-deviantart"></i> View on DeviantArt
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.cornerTL} />
                <div className={styles.cornerBR} />
              </div>

              <div className={styles.bookNav}>
                <button
                  className={`${styles.navBtn} ${
                    pageIdx === 0 || isTurning ? styles.navBtnDisabled : ''
                  }`}
                  onClick={() => goTo(year, 'prev', totalArtworks)}
                  disabled={pageIdx === 0 || isTurning}
                  title="Previous"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>

                <span className={styles.pageCounter}>
                  {isCover ? 'Cover' : `${pageIdx} / ${totalArtworks}`}
                </span>

                <button
                  className={`${styles.navBtn} ${
                    pageIdx >= totalArtworks || isTurning ? styles.navBtnDisabled : ''
                  }`}
                  onClick={() => goTo(year, 'next', totalArtworks)}
                  disabled={pageIdx >= totalArtworks || isTurning}
                  title="Next"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
