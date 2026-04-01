import { projects } from '../data.js';
import styles from '../styles/Projects.module.css';

export default function Projects() {
  return (
    <section className={styles.projects} id="projects">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>- what I've built</span>
        <h2 className={styles.sectionTitle}>My Projects</h2>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <article key={project.id} className={styles.card}>
            <div className={styles.mediaBackdrop} aria-hidden="true">
              <img src={project.image} alt="" className={styles.img} />
              <div className={styles.mediaGrid} />
              <div className={styles.mediaFade} />
            </div>
            <div className={styles.cardTab}>
              <span className={styles.cardTabId}>ID-{String(project.id).padStart(2, '0')}</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardTop}>
                <span className={styles.passLabel}>PROJECT ACCESS</span>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className={styles.cardDesc}>{project.description}</p>

              <div className={styles.cardFooter}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.githubLink}
                  title="View on GitHub"
                >
                  <i className="fa-brands fa-github"></i>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
