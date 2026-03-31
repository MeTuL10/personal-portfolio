import { useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import DevAbout from './components/DevAbout.jsx';
import Projects from './components/Projects.jsx';
import ArtAbout from './components/ArtAbout.jsx';
import Artworks from './components/Artworks.jsx';
import styles from './styles/App.module.css';

const FLIP_DURATION_MS = 900;
const MAX_SCROLL_WAIT_MS = 900;

export default function App() {
  const [profile, setProfile] = useState('dev'); // 'dev' | 'artist'
  const [flipping, setFlipping] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [next, setNext] = useState(null);
  const bookRef = useRef(null);
  const flipTimerRef = useRef(null);
  const scrollRafRef = useRef(null);

  useEffect(() => {
    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  const waitForScrollTop = () =>
    new Promise((resolve) => {
      const startedAt = performance.now();
      const poll = () => {
        const reachedTop = window.scrollY <= 2;
        const timedOut = performance.now() - startedAt >= MAX_SCROLL_WAIT_MS;

        if (reachedTop || timedOut) {
          scrollRafRef.current = null;
          resolve();
          return;
        }

        scrollRafRef.current = requestAnimationFrame(poll);
      };

      poll();
    });

  const handleSwitch = async () => {
    if (flipping || switching) return;

    setSwitching(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await waitForScrollTop();

    const incoming = profile === 'dev' ? 'artist' : 'dev';
    setNext(incoming);
    setFlipping(true);

    // After flip animation completes, commit the new profile.
    flipTimerRef.current = setTimeout(() => {
      setProfile(incoming);
      setNext(null);
      setFlipping(false);
      setSwitching(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
      flipTimerRef.current = null;
    }, FLIP_DURATION_MS);
  };

  const isDev = profile === 'dev';

  return (
    <div className={`${styles.app} ${isDev ? styles.devTheme : styles.artistTheme}`}>
      <Header profile={profile} onSwitch={handleSwitch} isSwitching={switching || flipping} />

      <div className={styles.scene} ref={bookRef}>
        <div className={`${styles.page} ${styles.pageFront} ${flipping ? styles.flipOut : ''}`}>
          <div className={`${styles.pageContent} ${isDev ? styles.viewDev : styles.viewArtist}`}>
            {isDev ? (
              <>
                <DevAbout />
                <Projects />
              </>
            ) : (
              <>
                <ArtAbout align="right" />
                <Artworks align="right" />
              </>
            )}
          </div>
        </div>

        {flipping && next && (
          <div className={`${styles.page} ${styles.pageBack} ${styles.flipIn}`}>
            <div className={`${styles.pageContent} ${next === 'dev' ? styles.viewDev : styles.viewArtist}`}>
              {next === 'dev' ? (
                <>
                  <DevAbout />
                  <Projects />
                </>
              ) : (
                <>
                  <ArtAbout align="right" />
                  <Artworks align="right" />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
