import { useState, useRef } from 'react';
import Header from './components/Header.jsx';
import DevAbout from './components/DevAbout.jsx';
import Projects from './components/Projects.jsx';
import ArtAbout from './components/ArtAbout.jsx';
import Artworks from './components/Artworks.jsx';
import styles from './styles/App.module.css';

export default function App() {
  const [profile, setProfile] = useState('dev'); // 'dev' | 'artist'
  const [flipping, setFlipping] = useState(false);
  const [next, setNext] = useState(null);
  const bookRef = useRef(null);

  const handleSwitch = () => {
    if (flipping) return;
    const incoming = profile === 'dev' ? 'artist' : 'dev';
    setNext(incoming);
    setFlipping(true);

    // After flip animation completes, swap profile
    setTimeout(() => {
      setProfile(incoming);
      setNext(null);
      setFlipping(false);
      window.scrollTo({ top: 0 });
    }, 700);
  };

  const isDev = profile === 'dev';

  return (
    <div className={`${styles.app} ${isDev ? styles.devTheme : styles.artistTheme}`}>
      <Header profile={profile} onSwitch={handleSwitch} />

      {/* Page flip scene */}
      <div className={styles.scene} ref={bookRef}>
        {/* Current page */}
        <div className={`${styles.page} ${styles.pageFront} ${flipping ? styles.flipOut : ''}`}>
          {isDev ? (
            <>
              <DevAbout />
              <Projects />
            </>
          ) : (
            <>
              <ArtAbout />
              <Artworks />
            </>
          )}
        </div>

        {/* Incoming page (revealed during flip) */}
        {flipping && next && (
          <div className={`${styles.page} ${styles.pageBack} ${styles.flipIn}`}>
            {next === 'dev' ? (
              <>
                <DevAbout />
                <Projects />
              </>
            ) : (
              <>
                <ArtAbout />
                <Artworks />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
