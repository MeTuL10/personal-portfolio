import styles from '../styles/Header.module.css';

export default function Header({ profile, onSwitch }) {
  const isDev = profile === 'dev';

  return (
    <header className={`${styles.header} ${isDev ? styles.dev : styles.artist}`}>
      <nav className={styles.navbar}>
        <a href="#about" className={styles.navLink} title="Profile">
          <i className="fa-solid fa-user"></i>
          <span className={styles.navLabel}>Profile</span>
        </a>

        <a href="#projects" className={styles.navLink} title={isDev ? 'Projects' : 'Artworks'}>
          <i className={isDev ? 'fa-solid fa-laptop' : 'fa-solid fa-palette'}></i>
          <span className={styles.navLabel}>{isDev ? 'Projects' : 'Artworks'}</span>
        </a>

        <button className={styles.flipBtn} onClick={onSwitch} title="Switch profile">
          <i className="fa-solid fa-repeat"></i>
          <span className={styles.navLabel}>{isDev ? 'Artist view' : 'Dev view'}</span>
        </button>
      </nav>
    </header>
  );
}
