import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/Header.module.css";

export default function Header({ profile, onSwitch, isSwitching = false }) {
  const isDev = profile === "dev";
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const updateActiveSection = () => {
      const projects = document.getElementById("projects");
      const isViewingProjects =
        projects && projects.getBoundingClientRect().top <= window.innerHeight * 0.38;
      setActiveSection(isViewingProjects ? "projects" : "about");
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, [profile]);

  const sectionLink = (section, label, icon) => (
    <motion.a
      href={`#${section}`}
      className={styles.navLink}
      aria-current={activeSection === section ? "page" : undefined}
      onClick={() => setActiveSection(section)}
      whileTap={{ scale: 0.97 }}
    >
      {activeSection === section && <motion.span layoutId="nav-active-pill" className={styles.navActive} />}
      <i className={icon} aria-hidden="true" />
      <span className={styles.navLinkText}>{label}</span>
    </motion.a>
  );

  return (
    <motion.header
      className={`${styles.header} ${isDev ? styles.dev : styles.artist}`}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className={styles.navbar} aria-label="Primary navigation">
        <div className={styles.primaryNav}>
          {sectionLink("about", "Profile", "fa-solid fa-user")}
          {sectionLink(
            "projects",
            isDev ? "Projects" : "Artworks",
            isDev ? "fa-solid fa-laptop" : "fa-solid fa-palette",
          )}
        </div>

        <motion.button
          type="button"
          className={`${styles.modeToggle} ${isSwitching ? styles.modeToggleBusy : ""}`}
          onClick={onSwitch}
          disabled={isSwitching}
          aria-busy={isSwitching}
          aria-label={`Switch to ${isDev ? "artist" : "developer"} view`}
          whileTap={isSwitching ? {} : { scale: 0.97 }}
        >
          <span className={`${styles.modeOption} ${isDev ? styles.modeOptionActive : ""}`}>Developer</span>
          <i className="fa-solid fa-arrow-right-arrow-left" aria-hidden="true" />
          <span className={`${styles.modeOption} ${!isDev ? styles.modeOptionActive : ""}`}>Artist</span>
        </motion.button>
      </nav>
    </motion.header>
  );
}
