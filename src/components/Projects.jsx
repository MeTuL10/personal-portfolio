import { Suspense, lazy, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../data.js';
import FadeContent from '../reactbits/FadeContent.jsx';
import BlurText from '../reactbits/BlurText.jsx';
import styles from '../styles/Projects.module.css';

const ProjectHoverFx = lazy(() => import('../animations/ProjectHoverFx.jsx'));

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [pointer, setPointer]     = useState({ x: 0.5, y: 0.5 });

  const tiltStyle = useMemo(() => {
    if (!isHovered) return { '--tilt-rotate-x': '0deg', '--tilt-rotate-y': '0deg' };
    return {
      '--tilt-rotate-x': `${((0.5 - pointer.y) * 8.5).toFixed(2)}deg`,
      '--tilt-rotate-y': `${((pointer.x - 0.5) * 11).toFixed(2)}deg`,
    };
  }, [isHovered, pointer.x, pointer.y]);

  return (
    <motion.article
      className={`${styles.card} ${isHovered ? styles.cardTiltActive : ''}`}
      style={tiltStyle}
      variants={CARD_VARIANTS}
      custom={index}
      onPointerEnter={() => setIsHovered(true)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPointer({
          x: Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1),
          y: Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1),
        });
      }}
      onPointerLeave={() => { setIsHovered(false); setPointer({ x: 0.5, y: 0.5 }); }}
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
              <motion.span
                key={tag} className={styles.tag}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >{tag}</motion.span>
            ))}
          </div>
        </div>
        <p className={styles.cardDesc}>{project.description}</p>
        <div className={styles.cardFooter}>
          <motion.a
            href={project.github} target="_blank" rel="noreferrer"
            className={styles.githubLink}
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <i className="fa-brands fa-github" /><span>GitHub</span>
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section className={styles.projects} id="projects">
      <FadeContent blur delay={0} duration={0.6}>
        <div className={styles.projectsHeader}>
          <span className={styles.projectsEyebrow}>- what I've built</span>
          <BlurText
            text="My Projects"
            as="h2"
            animateBy="words"
            delay={80}
            duration={0.65}
            className={styles.projectsTitle}
          />
        </div>
      </FadeContent>

      <motion.div
        className={styles.grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
