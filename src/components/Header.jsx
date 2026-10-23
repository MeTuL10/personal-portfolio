import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/Header.module.css";

export default function Header({
  profile,
  onSwitch,
  onNavigateSection,
  onBackToChooser,
  isSwitching = false,
}) {
  const isDev = profile === "dev";
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    const updateActiveSection = () => {
      const projects = document.getElementById("projects");
      const isViewingProjects =
        projects && projects.getBoundingClientRect().top <= window.innerHeight * 0.38;
      setActiveSection(isViewingProjects ? "content" : "profile");
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, [profile]);

  const sectionLink = (section, label, icon) => {
    const routeSection = section === "content" ? (isDev ? "projects" : "artworks") : "profile";
    const href = isDev
      ? `/personal-portfolio/dev/${routeSection}`
      : `/personal-portfolio/art/${routeSection}`;

    return (
    <motion.a
      href={href}
      className={styles.navLink}
      aria-current={activeSection === section ? "page" : undefined}
      onClick={(event) => {
        event.preventDefault();
        setActiveSection(section);
        onNavigateSection(routeSection);
      }}
      whileTap={{ scale: 0.97 }}
    >
      {activeSection === section && <motion.span layoutId="nav-active-pill" className={styles.navActive} />}
      <i className={icon} aria-hidden="true" />
      <span className={styles.navLinkText}>{label}</span>
    </motion.a>
    );
  };

  return (
    <motion.header
      className={`${styles.header} ${isDev ? styles.dev : styles.artist}`}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className={styles.navbar} aria-label="Primary navigation">
        <motion.button
          type="button"
          className={styles.backButton}
          onClick={onBackToChooser}
          disabled={isSwitching}
          aria-label="Return to profile chooser"
          whileTap={isSwitching ? {} : { scale: 0.95 }}
        >
          <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          <span>Back to start</span>
        </motion.button>
        <div className={styles.primaryNav}>
          {sectionLink("profile", "Profile", "fa-solid fa-user")}
          {sectionLink(
            "content",
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
