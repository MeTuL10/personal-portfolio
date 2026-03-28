import { artworks } from '../data.js';
import styles from './Artworks.module.css';

export default function Artworks() {
  return (
    <section className={styles.artworks} id="artworks">
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>— creative side</span>
        <h2 className={styles.sectionTitle}>My Artwork</h2>
      </div>

      <div className={styles.grid}>
        {artworks.map((art) => (
          <a
            key={art.id}
            href={art.link}
            target="_blank"
            rel="noreferrer"
            className={styles.artCard}
            title={art.title}
          >
            <img src={art.image} alt={art.title} className={styles.artImg} />
            <div className={styles.artOverlay}>
              <h3 className={styles.artTitle}>{art.title}</h3>
              <span className={styles.artCta}>
                <i className="fa-brands fa-deviantart"></i> View on DeviantArt
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
