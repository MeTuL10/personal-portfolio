/**
 * Threads — ReactBits.dev Backgrounds component
 * https://reactbits.dev/backgrounds/threads
 *
 * Animated flowing thread lines via WebGL (Three.js).
 * Replaces AmbientFieldLayer — lighter, no particle overhead.
 * Theme-aware: purple for dev, blue for artist.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const THREAD_COLORS = {
  dev:    new THREE.Color('#5503a0'),
  artist: new THREE.Color('#134d87'),
};

const THREAD_COUNT   = 12;
const POINTS_PER_LINE = 80;

function buildThreadGeometry(index, total) {
  const points = [];
  const yBase = ((index / (total - 1)) * 2 - 1) * 0.85;
  for (let i = 0; i < POINTS_PER_LINE; i++) {
    const t = (i / (POINTS_PER_LINE - 1)) * 2 - 1;
    points.push(new THREE.Vector3(t * 1.8, yBase, 0));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(POINTS_PER_LINE * 4));
  return geo;
}

export default function Threads({ theme = 'dev', opacity = 0.55 }) {
  const mountRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const baseColor = THREAD_COLORS[theme] ?? THREAD_COLORS.dev;

    // Build thread lines
    const lines = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
      const geo = buildThreadGeometry(i, THREAD_COUNT);
      const mat = new THREE.LineBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: (0.12 + (i / THREAD_COUNT) * 0.18) * opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      lines.push({ line, offset: i * 0.37, speed: 0.18 + i * 0.025 });
    }

    const posAttr = (line) => line.geometry.attributes.position;

    const resize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
    };

    const animate = (t) => {
      const now = t / 1000;
      for (const { line, offset, speed } of lines) {
        const pos = posAttr(line);
        const count = pos.count;
        for (let i = 0; i < count; i++) {
          const x = pos.getX(i);
          const y0 = pos.getY(i);
          const wave = Math.sin(x * 3.2 + now * speed + offset) * 0.045
                     + Math.sin(x * 6.5 - now * speed * 0.6 + offset * 2) * 0.018;
          pos.setY(i, y0 + (wave - pos.getY(i)) * 0.08);
        }
        pos.needsUpdate = true;
      }
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) frameRef.current = requestAnimationFrame(animate);
    else renderer.render(scene, camera);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
      lines.forEach(({ line }) => {
        line.geometry.dispose();
        line.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [theme, opacity]);

  return (
    <div
      aria-hidden="true"
      ref={mountRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 1,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: 0.85,
      }}
    />
  );
}
