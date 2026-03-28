import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['about', 'projects', 'artworks'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive(id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { id: 'about', icon: 'fa-solid fa-user', label: 'About' },
    { id: 'projects', icon: 'fa-solid fa-laptop', label: 'Projects' },
    { id: 'artworks', icon: 'fa-solid fa-palette', label: 'Artworks' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.navbar}>
        {links.map(({ id, icon, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`${styles.navLink} ${active === id ? styles.active : ''}`}
            title={label}
          >
            <i className={icon}></i>
            <span className={styles.navLabel}>{label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
