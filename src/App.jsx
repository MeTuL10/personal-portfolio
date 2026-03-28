import Header from './components/Header.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Artworks from './components/Artworks.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main>
        <About />
        <Projects />
        <Artworks />
      </main>
    </div>
  );
}
