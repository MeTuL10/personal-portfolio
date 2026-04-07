import { Suspense, lazy, useMemo, useState } from 'react';
import { projects } from '../data.js';
import styles from '../styles/Projects.module.css';

const ProjectHoverFx = lazy(() => import('../animations/ProjectHoverFx.jsx'));

function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  const cardStyle = useMemo(() => {
    if (!isHovered) {
      return {
        '--tilt-rotate-x': '0deg',
        '--tilt-rotate-y': '0deg',
      };
    }

    const rotateX = (0.5 - pointer.y) * 8.5;
    const rotateY = (pointer.x - 0.5) * 11;
    return {
      '--tilt-rotate-x': `${rotateX.toFixed(2)}deg`,
      '--tilt-rotate-y': `${rotateY.toFixed(2)}deg`,
    };
  }, [isHovered, pointer.x, pointer.y]);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setPointer({
      x: Math.min(Math.max(x, 0), 1),
      y: Math.min(Math.max(y, 0), 1),
    });
  };

  const resetHover = () => {
    setIsHovered(false);
    setPointer({ x: 0.5, y: 0.5 });
  };

  return (
    <article
      key={project.id}
      className={`${styles.card} ${isHovered ? styles.cardTiltActive : ''}`}
      style={cardStyle}
      onPointerEnter={() => setIsHovered(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetHover}
    >
      {isHovered && (
        <div className={styles.cardFx} aria-hidden="true">
          <Suspense fallback={null}>
            <ProjectHoverFx active={isHovered} pointer={pointer} />
          </Suspense>
        </div>
      )}

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
  );
}

export default function Projects() {
  return (
    <section className={styles.projects} id="projects">
      <div className={styles.projectsHeader}>
        <span className={styles.projectsEyebrow}>- what I've built</span>
        <h2 className={styles.projectsTitle}>My Projects</h2>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

