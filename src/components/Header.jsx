import { motion, AnimatePresence } from "framer-motion";
import Magnet from "../reactbits/Magnet.jsx";
import styles from "../styles/Header.module.css";

export default function Header({ profile, onSwitch, isSwitching = false }) {
  const isDev = profile === "dev";

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <motion.header
      className={`${styles.header} ${isDev ? styles.dev : styles.artist}`}
      style={{ backdropFilter: `blur(${14}px)` }}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.nav className={styles.navbar} initial="hidden" animate="visible">
        <motion.div variants={linkVariants} custom={0}>
          <Magnet magnetStrength={0.3}>
            <a href="#about" className={styles.navLink} title="Profile">
              <i className="fa-solid fa-user"></i>
              <span className={styles.navLabel}>Profile</span>
            </a>
          </Magnet>
        </motion.div>

        <motion.div variants={linkVariants} custom={1}>
          <Magnet magnetStrength={0.3}>
            <a
              href="#projects"
              className={styles.navLink}
              title={isDev ? "Projects" : "Artworks"}
            >
              <i
                className={isDev ? "fa-solid fa-laptop" : "fa-solid fa-palette"}
              ></i>
              <span className={styles.navLabel}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={profile}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "inline-block" }}
                  >
                    {isDev ? "Projects" : "Artworks"}
                  </motion.span>
                </AnimatePresence>
              </span>
            </a>
          </Magnet>
        </motion.div>

        <motion.div variants={linkVariants} custom={2}>
          <Magnet magnetStrength={0.28}>
            <motion.button
              className={`${styles.flipBtn} ${isSwitching ? styles.flipBtnBusy : ""}`}
              onClick={onSwitch}
              disabled={isSwitching}
              aria-busy={isSwitching}
              whileHover={isSwitching ? {} : { scale: 1.06 }}
              whileTap={isSwitching ? {} : { scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
            >
              <motion.i
                className="fa-solid fa-repeat"
                animate={isSwitching ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isSwitching
                    ? { duration: 0.9, repeat: Infinity, ease: "linear" }
                    : { duration: 0.5 }
                }
              />
              <span className={styles.navLabel}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={profile}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "inline-block" }}
                  >
                    {isDev ? "Artist view" : "Dev view"}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.button>
          </Magnet>
        </motion.div>
      </motion.nav>
    </motion.header>
  );
}
