import DevTimeline from "./DevTimeline";
import SkillsCarousel from "./SkillsCarousel";
import BlurText from "../reactbits/BlurText.jsx";
import ShinyText from "../reactbits/ShinyText.jsx";
import FadeContent from "../reactbits/FadeContent.jsx";
import Magnet from "../reactbits/Magnet.jsx";
import SectionDivider from "../animations/SectionDivider.jsx";
import styles from "../styles/DevAbout.module.css";

export default function DevAbout() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.glowOrb} />

      <div className={styles.intro}>
        {/* Greeting */}
        <BlurText
          text="Hi, I am"
          as="p"
          animateBy="words"
          delay={60}
          duration={0.55}
          className={styles.greeting}
        />

        {/* Name — ShinyText preserves the gradient colour + Syne font via className */}
        <ShinyText
          text="Metul Prabhu"
          as="h1"
          speed={3.5}
          colorA="#ffffff"
          colorB="var(--dev-bright)"
          className={styles.name}
        />

        {/* Role */}
        <FadeContent blur delay={0.18} duration={0.65}>
          <h2 className={styles.role}>
            Software Developer focused on <span>AI/ML</span>
          </h2>
        </FadeContent>

        {/* Bio */}
        <FadeContent blur delay={0.3} duration={0.65}>
          <p className={styles.bio}>
            I'm a Software Developer, contributing to the development of
            large-scale, data-driven AI/ML applications. Experienced in building
            projects across ML, DL and RL during my undergraduate studies. I'm
            also experienced in DevOps technologies and have used them in the
            development and deployment of applications.
          </p>
        </FadeContent>

        {/* Social */}
        <FadeContent delay={0.42} duration={0.6}>
          <div className={styles.socialRow}>
            <Magnet magnetStrength={0.42}>
              <a
                href="https://www.linkedin.com/in/metul-prabhu-215187202/"
                className={styles.socialIcon}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
              >
                <i className="fa-brands fa-linkedin" />
              </a>
            </Magnet>
            <Magnet magnetStrength={0.42}>
              <a
                href="https://github.com/MeTuL10"
                className={styles.socialIcon}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
              >
                <i className="fa-brands fa-github" />
              </a>
            </Magnet>
          </div>
        </FadeContent>
      </div>

      <SectionDivider theme="dev" />
      <FadeContent blur delay={0} duration={0.7}>
        <DevTimeline />
      </FadeContent>
      <SectionDivider theme="dev" />
      <FadeContent blur delay={0.06} duration={0.7}>
        <SkillsCarousel />
      </FadeContent>
    </section>
  );
}
