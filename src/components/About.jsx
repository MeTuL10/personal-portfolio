import { useEffect, useRef } from 'react';
import { skills } from '../data.js';
import styles from './About.module.css';

export default function About() {
  const nameRef = useRef(null);

  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300);
  }, []);

  return (
    <section className={styles.about} id="about">
      <div className={styles.glowOrb} />

      <div className={styles.intro}>
        <p className={styles.greeting}>Hi, I am</p>
        <h1 className={styles.name} ref={nameRef}>Metul Prabhu</h1>
        <h2 className={styles.role}>Software Developer focused on <span>AI/ML</span></h2>

        <p className={styles.bio}>
          I have a strong interest in the fields of Artificial Intelligence, Data Analytics and
          DevOps. Seeking opportunities to apply my knowledge and skills in a professional setting
          and contribute to the growth of the organization. I have worked on multiple projects on AI
          and data analytics using machine learning, deep learning and reinforcement learning. I am
          also experienced in DevOps technologies and have used them in the development and
          deployment of applications.
        </p>

        <div className={styles.socialRow}>
          <a
            href="https://www.linkedin.com/in/metul-prabhu-215187202/"
            className={styles.socialIcon}
            target="_blank"
            rel="noreferrer"
            title="LinkedIn"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a
            href="https://github.com/MeTuL10"
            className={styles.socialIcon}
            target="_blank"
            rel="noreferrer"
            title="GitHub"
          >
            <i className="fa-brands fa-github"></i>
          </a>
          <a
            href="https://www.deviantart.com/metalex10"
            className={styles.socialIcon}
            target="_blank"
            rel="noreferrer"
            title="DeviantArt"
          >
            <i className="fa-brands fa-deviantart"></i>
          </a>
          <a
            href="https://drive.google.com/file/d/1nHz0HTdBZUi6g8yrbY6nPtVBtkZQDTvE/view?usp=sharing"
            className={styles.resumeBtn}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-solid fa-file-arrow-down"></i> View Resume
          </a>
        </div>
      </div>

      <div className={styles.skillsSection}>
        <h2 className={styles.sectionLabel}>Skill Set</h2>
        <div className={styles.skillsGrid}>
          {Object.values(skills).map((group) => (
            <div className={styles.skillCard} key={group.label}>
              <h3 className={styles.skillTitle}>
                <i className={group.icon}></i> {group.label}
              </h3>
              <ul className={styles.skillList}>
                {group.items.map((item) => (
                  <li key={item} className={styles.skillTag}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
