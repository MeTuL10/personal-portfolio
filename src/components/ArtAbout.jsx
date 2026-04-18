import { motion } from "framer-motion";
import BlurText from "../reactbits/BlurText.jsx";
import ShinyText from "../reactbits/ShinyText.jsx";
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
        <ShinyText
          text="Metul Prabhu"
          as="h1"
          speed={3.5}
          colorA="#ffffff"
          colorB="var(--art-bright)"
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
            <div className={styles.pillArea}>
              <motion.div
                className={styles.pillRow}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
                  },
                }}
              >
                {PILLS.map((item) => (
                  <motion.span
                    key={item}
                    className={styles.pill}
                    variants={{
                      hidden: { opacity: 0, y: 14, scale: 0.9 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    whileHover={{ scale: 1.07, transition: { duration: 0.18 } }}
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
