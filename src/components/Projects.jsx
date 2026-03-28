import { useState } from 'react';
import { projects } from '../data.js';
import styles from './Projects.module.css';

export default function Projects() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className={styles.projects} id="projects">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>— what I've built</span>
        <h2 className={styles.sectionTitle}>My Projects</h2>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <div
            key={project.id}
            className={styles.card}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className={styles.imgWrapper}>
              <img
                src={project.image}
                alt={project.title}
                className={styles.img}
                style={{ transform: hoveredId === project.id ? 'scale(1.08)' : 'scale(1)' }}
              />
              <div className={styles.overlay} />
            </div>

            <div className={styles.cardBody}>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDesc}>{project.description}</p>
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className={styles.githubLink}
                title="View on GitHub"
              >
                <i className="fa-brands fa-github"></i>
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
