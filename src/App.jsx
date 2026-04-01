import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header.jsx';
import DevAbout from './components/DevAbout.jsx';
import Projects from './components/Projects.jsx';
import ArtAbout from './components/ArtAbout.jsx';
import Artworks from './components/Artworks.jsx';
import styles from './styles/App.module.css';

const BLACKOUT_MS = 240;
const REVEAL_MS = 1150;
const OVERLAY_RELEASE_MS = 120;
const ICON_TRANSITION_MS = BLACKOUT_MS + REVEAL_MS;

export default function App() {
  const [profile, setProfile] = useState('dev'); // 'dev' | 'artist'
  const [switching, setSwitching] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionData, setTransitionData] = useState(null);

  const transitionTimerRef = useRef(null);
  const releaseTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!transitioning) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [transitioning]);

  const renderProfile = (mode) => {
    if (mode === 'dev') {
      return (
        <>
          <DevAbout />
          <Projects />
        </>
      );
    }

    return (
      <>
        <ArtAbout />
        <Artworks />
      </>
    );
  };

  const handleSwitch = () => {
    if (switching || transitioning) return;

    setSwitching(true);

    const incoming = profile === 'dev' ? 'artist' : 'dev';
    setTransitionData({
      next: incoming,
      scrollY: window.scrollY,
    });
    setTransitioning(true);

    transitionTimerRef.current = setTimeout(() => {
      setProfile(incoming);
      transitionTimerRef.current = null;

      releaseTimerRef.current = setTimeout(() => {
        setTransitioning(false);
        setTransitionData(null);
        setSwitching(false);
        releaseTimerRef.current = null;
      }, OVERLAY_RELEASE_MS);
    }, ICON_TRANSITION_MS);
  };

  const isDev = profile === 'dev';

  return (
    <div className={`${styles.app} ${isDev ? styles.devTheme : styles.artistTheme}`}>
      <Header profile={profile} onSwitch={handleSwitch} isSwitching={switching || transitioning} />

      <div className={`${styles.scene} ${transitioning ? styles.sceneLocked : ''}`}>
        <div className={`${styles.page} ${styles.pageCurrent}`}>
          <div className={`${styles.pageContent} ${isDev ? styles.viewDev : styles.viewArtist}`}>
            {renderProfile(profile)}
          </div>
        </div>

        {transitioning && transitionData && (
          <div className={styles.viewportTransitionLayer}>
            <motion.div
              className={styles.blackCurtain}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: BLACKOUT_MS / 1000, ease: [0.33, 1, 0.68, 1] }}
            />
            <motion.div
              className={styles.transitionIncomingPage}
              style={{ transform: `translateY(-${transitionData.scrollY}px)` }}
              initial={{
                clipPath: 'circle(0% at 50% 50%)',
                opacity: 0,
              }}
              animate={{
                clipPath: 'circle(155% at 50% 50%)',
                opacity: 1,
              }}
              transition={{
                delay: BLACKOUT_MS / 1000,
                duration: REVEAL_MS / 1000,
                ease: [0.2, 0.68, 0.2, 1],
              }}
            >
              <div
                className={`${styles.pageContent} ${
                  transitionData.next === 'dev' ? styles.viewDev : styles.viewArtist
                }`}
              >
                {renderProfile(transitionData.next)}
              </div>
            </motion.div>

            <div className={styles.iconTransitionOverlay}>
              <motion.i
                className={`${
                  transitionData.next === 'dev'
                    ? 'fa-solid fa-laptop'
                    : 'fa-solid fa-palette'
                } ${styles.iconTransitionGlyph} ${
                  transitionData.next === 'dev' ? styles.iconDev : styles.iconArtist
                }`}
                initial={{ scale: 1, opacity: 0.96 }}
                animate={{ scale: 30, opacity: 0 }}
                transition={{
                  delay: BLACKOUT_MS / 1000,
                  duration: REVEAL_MS / 1000,
                  ease: [0.18, 0.84, 0.44, 1],
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
