import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Header from "./components/Header.jsx";
import DevAbout from "./components/DevAbout.jsx";
import Projects from "./components/Projects.jsx";
import ArtAbout from "./components/ArtAbout.jsx";
import Artworks from "./components/Artworks.jsx";
import DarkVeil from "./reactbits/DarkVeil.jsx";
import styles from "./styles/App.module.css";

const COVER_MS = 410;
const OVERLAY_RELEASE_MS = 560;

function createRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

const pixelRandom = createRandom(27041998);
const pixelParticles = Array.from({ length: 360 }, (_, index) => ({
  id: index,
  x: pixelRandom() * 100,
  y: pixelRandom() * 100,
  size: 4 + pixelRandom() * 13,
  delay: pixelRandom() * 0.19,
  enterX: -90 - pixelRandom() * 160,
  enterY: (pixelRandom() - 0.5) * 130,
  exitX: 85 + pixelRandom() * 210,
  exitY: (pixelRandom() - 0.5) * 110,
  tone: index % 5,
}));

export default function App() {
  const [profile, setProfile] = useState("dev");
  const [switching, setSwitching] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionData, setTransitionData] = useState(null);
  const [transitionPhase, setTransitionPhase] = useState("idle");
  const [suppressIntroFor, setSuppressIntroFor] = useState(null);
  const [transitionRunId, setTransitionRunId] = useState(null);

  const transitionTimerRef = useRef(null);
  const releaseTimerRef = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(transitionTimerRef.current);
      clearTimeout(releaseTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!transitioning) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [transitioning]);

  const renderProfile = (mode) => {
    const animateIntro = suppressIntroFor !== mode;
    return mode === "dev" ? (
      <>
        <DevAbout animateIntro={animateIntro} />
        <Projects />
      </>
    ) : (
      <>
        <ArtAbout animateIntro={animateIntro} />
        <Artworks />
      </>
    );
  };

  const handleSwitch = () => {
    if (switching || transitioning) return;
    setSwitching(true);
    const incoming = profile === "dev" ? "artist" : "dev";
    setSuppressIntroFor(incoming);
    setTransitionData({ from: profile, next: incoming });
    setTransitionRunId((c) => (c == null ? 1 : c + 1));
    setTransitionPhase("running");
    setTransitioning(true);

    transitionTimerRef.current = setTimeout(() => {
      window.scrollTo(0, 0);
      setProfile(incoming);
      setTransitionPhase("releasing");
      releaseTimerRef.current = setTimeout(() => {
        setTransitioning(false);
        setTransitionPhase("idle");
        setTransitionData(null);
        setSuppressIntroFor(null);
        setSwitching(false);
      }, OVERLAY_RELEASE_MS);
    }, COVER_MS);
  };

  const isDev = profile === "dev";

  return (
    <div className={styles.app}>
      <div className={styles.darkVeilFixed} aria-hidden="true">
        <DarkVeil hueShift={isDev ? 340 : 30} />
      </div>

      <div className={styles.appForeground}>
        <Header
          profile={profile}
          onSwitch={handleSwitch}
          isSwitching={switching || transitioning}
        />

        <div
          className={`${styles.scene} ${transitioning ? styles.sceneLocked : ""}`}
        >
          <div className={`${styles.page} ${styles.pageCurrent}`}>
            <div
              className={`${styles.pageContent} ${isDev ? styles.viewDev : styles.viewArtist}`}
            >
              {renderProfile(profile)}
            </div>
          </div>
        </div>
      </div>

      {transitioning &&
        transitionData &&
        createPortal(
          <motion.div
            className={styles.transitionLayer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className={styles.transitionShade}
              initial={{ opacity: 0 }}
              animate={{ opacity: transitionPhase === "running" ? 0.9 : 0 }}
              transition={{
                duration: transitionPhase === "running" ? 0.2 : 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            {transitionData.next === "dev" ? (
              <div className={styles.pixelTransition} aria-hidden="true">
                <motion.div
                  className={styles.pixelLattice}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={
                    transitionPhase === "running"
                      ? { opacity: 0.42, scale: 1 }
                      : { opacity: 0, scale: 0.96 }
                  }
                  transition={{ duration: transitionPhase === "running" ? 0.24 : 0.3 }}
                />
                {pixelParticles.map((pixel) => (
                  <motion.span
                    key={`${transitionRunId}-${pixel.id}`}
                    className={`${styles.pixelParticle} ${styles[`pixelTone${pixel.tone}`]}`}
                    style={{ left: `${pixel.x}%`, top: `${pixel.y}%`, width: pixel.size, height: pixel.size }}
                    initial={{ opacity: 0, scale: 0, x: pixel.enterX, y: pixel.enterY }}
                    animate={
                      transitionPhase === "running"
                        ? { opacity: 1, scale: 1, x: 0, y: 0 }
                        : { opacity: 0, scale: 0.2, x: pixel.exitX, y: pixel.exitY }
                    }
                    transition={{
                      duration: transitionPhase === "running" ? 0.22 : 0.3,
                      delay:
                        transitionPhase === "running"
                          ? pixel.delay
                          : (1 - pixel.delay / 0.19) * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                ))}
                <motion.p
                  className={styles.transitionCaption}
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    transitionPhase === "running"
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: -10 }
                  }
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  Rendering developer view
                </motion.p>
              </div>
            ) : (
              <motion.div
                key={transitionRunId}
                className={styles.paperTransition}
                initial={{
                  clipPath:
                    "polygon(0 0, 0 0, 0 18%, 0 36%, 0 55%, 0 74%, 0 100%, 0 100%)",
                  x: "0vw",
                }}
                animate={
                  transitionPhase === "running"
                    ? {
                        clipPath:
                          "polygon(0 0, 96% 0, 100% 18%, 96.5% 36%, 100% 55%, 96% 74%, 100% 100%, 0 100%)",
                        x: "0vw",
                      }
                    : {
                        clipPath:
                          "polygon(0 0, 96% 0, 100% 18%, 96.5% 36%, 100% 55%, 96% 74%, 100% 100%, 0 100%)",
                        x: "112vw",
                      }
                }
                transition={{
                  duration: transitionPhase === "running" ? 0.38 : 0.52,
                  ease:
                    transitionPhase === "running"
                      ? [0.76, 0, 0.24, 1]
                      : [0.16, 1, 0.3, 1],
                }}
              >
                <div className={styles.paperGrain} />
                <motion.p
                  className={styles.paperCaption}
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    transitionPhase === "running"
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: -12 }
                  }
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  Turning the page
                </motion.p>
              </motion.div>
            )}
          </motion.div>,
          document.body,
        )}
    </div>
  );
}
