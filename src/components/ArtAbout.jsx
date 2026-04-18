import BlurText from "../reactbits/BlurText.jsx";
import GradientText from "../reactbits/GradientText.jsx";
import CurvedLoop from "../reactbits/CurvedLoop.jsx";
import FadeContent from "../reactbits/FadeContent.jsx";
import Magnet from "../reactbits/Magnet.jsx";
import styles from "../styles/ArtAbout.module.css";

const PILLS = [
  "Animation",
  "Environment Art",
  "Perspective & Depth",
  "Character Design",
  "Lighting & Shading",
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
          text="Hi, I'm also"
          as="p"
          animateBy="words"
          delay={60}
          duration={0.55}
          className={styles.greeting}
        />

        {/* ShinyText for name — preserves art-profile gradient */}
        <GradientText
          text="Metul Prabhu"
          as="h1"
          speed={7.5}
          colorA="#f5f8ff"
          colorB="var(--art-bright)"
          colorC="var(--art-color)"
          className={styles.name}
        />

        <FadeContent blur delay={0.18} duration={0.65}>
          <h2 className={styles.role}>
            Digital Artist &amp; <span>Animator in training</span>
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
                <i className="fa-brands fa-deviantart" /> Visit my DeviantArt
              </a>
            </Magnet>
          </div>
        </FadeContent>

        <FadeContent blur delay={0.12} duration={0.7}>
          <div className={styles.learningSection}>
            <h2 className={styles.sectionLabel}>Currently learning</h2>
            <div className={styles.learningLoopWrap}>
              <CurvedLoop items={PILLS} />
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
