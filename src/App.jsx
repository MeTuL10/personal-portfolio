import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header.jsx';
import DevAbout from './components/DevAbout.jsx';
import Projects from './components/Projects.jsx';
import ArtAbout from './components/ArtAbout.jsx';
import Artworks from './components/Artworks.jsx';
import styles from './styles/App.module.css';

const BLACKOUT_MS = 240;
const REVEAL_MS = 1150;
const OVERLAY_RELEASE_MS = 260;
const ICON_TRANSITION_MS = BLACKOUT_MS + REVEAL_MS;
const ThreeSwitchOverlay = lazy(() => import('./components/ThreeSwitchOverlay.jsx'));

export default function App() {
  const [profile, setProfile] = useState('dev'); // 'dev' | 'artist'
  const [switching, setSwitching] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionData, setTransitionData] = useState(null);
  const [transitionPhase, setTransitionPhase] = useState('idle'); // idle | running | releasing
  const [suppressIntroFor, setSuppressIntroFor] = useState(null);
  const [transitionRunId, setTransitionRunId] = useState(null);

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

  const renderProfile = (mode, { forTransition = false } = {}) => {
    const animateIntro = !(forTransition || suppressIntroFor === mode);

    if (mode === 'dev') {
      return (
        <>
          <DevAbout animateIntro={animateIntro} />
          <Projects />
        </>
      );
    }

    return (
      <>
        <ArtAbout animateIntro={animateIntro} />
        <Artworks />
      </>
    );
  };

  const handleSwitch = () => {
    if (switching || transitioning) return;

    setSwitching(true);

    const incoming = profile === 'dev' ? 'artist' : 'dev';
    setSuppressIntroFor(incoming);
    setTransitionData({
      next: incoming,
      scrollY: window.scrollY,
    });
    setTransitionRunId((current) => (current == null ? 1 : current + 1));
    setTransitionPhase('running');
    setTransitioning(true);

    transitionTimerRef.current = setTimeout(() => {
      setProfile(incoming);
      setTransitionPhase('releasing');
      transitionTimerRef.current = null;

      releaseTimerRef.current = setTimeout(() => {
        setTransitioning(false);
        setTransitionPhase('idle');
        setTransitionData(null);
        setSuppressIntroFor(null);
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
        <div
          className={`${styles.shaderViewportLayer} ${
            transitioning ? styles.shaderViewportLayerActive : ''
          } ${transitionPhase === 'releasing' ? styles.shaderViewportLayerReleasing : ''}`}
        >
          <Suspense fallback={null}>
            <ThreeSwitchOverlay
              theme={transitionData?.next || profile}
              delayMs={BLACKOUT_MS}
              durationMs={REVEAL_MS}
              transitionKey={transitionRunId}
            />
          </Suspense>
        </div>

        <div className={`${styles.page} ${styles.pageCurrent}`}>
          <div className={`${styles.pageContent} ${isDev ? styles.viewDev : styles.viewArtist}`}>
            {renderProfile(profile)}
          </div>
        </div>

        {transitioning && transitionData && (
          <motion.div
            className={styles.viewportTransitionLayer}
            initial={{ opacity: 1 }}
            animate={{ opacity: transitionPhase === 'releasing' ? 0 : 1 }}
            transition={{ duration: OVERLAY_RELEASE_MS / 1000, ease: [0.25, 1, 0.5, 1] }}
          >
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
                {renderProfile(transitionData.next, { forTransition: true })}
              </div>
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
