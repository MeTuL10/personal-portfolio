import BlurText from "../reactbits/BlurText.jsx";
import FadeContent from "../reactbits/FadeContent.jsx";
import Magnet from "../reactbits/Magnet.jsx";
import styles from "../styles/ArtAbout.module.css";

const STUDIO_NOTES = [
  ["Animation", "bringing still drawings to life"],
  ["Environment art", "building places with a story"],
  ["Perspective & depth", "finding the space between lines"],
  ["Character design", "chasing personality in silhouettes"],
  ["Lighting & shading", "making a scene feel like a moment"],
];

export default function ArtAbout({ align = "left" }) {
  return (
    <section
      className={`${styles.about} ${align === "right" ? styles.aboutRight : ""}`}
      id="about"
    >
      <div className={styles.glowOrb} />
      <div className={styles.glowOrb2} />

      <div className={styles.intro}>
        <BlurText
          text="The sketchbook of"
          as="p"
          animateBy="words"
          delay={60}
          duration={0.55}
          className={styles.greeting}
        />

        <h1 className={styles.name}>Metul Prabhu</h1>

        <FadeContent blur delay={0.18} duration={0.65}>
          <h2 className={styles.role}>
            Digital artist &amp; <span>animator in training</span>
          </h2>
        </FadeContent>

        <FadeContent blur delay={0.3} duration={0.65}>
          <p className={styles.bio}>
            I'm a self-taught digital artist passionate about fan art, character
            illustration and storytelling through visuals. I'm currently
            learning animation, environment art and perspective techniques. Most
            of my work lives on DeviantArt, where I share my progress and
            finished pieces.
          </p>
        </FadeContent>

        <FadeContent delay={0.42} duration={0.6}>
          <div className={styles.socialRow}>
            <Magnet magnetStrength={0.42}>
              <a
                href="https://www.deviantart.com/metalex10"
                className={styles.daBtn}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-deviantart" /> Visit the studio
              </a>
            </Magnet>
          </div>
        </FadeContent>

        <FadeContent blur delay={0.12} duration={0.7}>
          <div className={styles.learningSection}>
            <h2 className={styles.sectionLabel}>On my worktable</h2>
            <p className={styles.notesIntro}>Things I&apos;m currently exploring, one sketch at a time.</p>
            <div className={styles.studioNotes}>
              {STUDIO_NOTES.map(([title, note], index) => (
                <article className={styles.studioNote} key={title}>
                  <span className={styles.noteTape} aria-hidden="true" />
                  <span className={styles.noteNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{note}</p>
                </article>
              ))}
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
