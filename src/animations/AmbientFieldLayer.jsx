/**
 * AmbientFieldLayer — upgraded Three.js ambient particle field.
 * Performance-adaptive: fewer particles on mobile, lower DPR.
 * Mouse-reactive repulsion + sinusoidal drift + field glow mesh.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from '../styles/App.module.css';

const MOBILE   = typeof window !== 'undefined' && window.innerWidth < 768;
const POINT_COUNT = MOBILE ? 280 : 560;
const MAX_DPR  = MOBILE ? 1.2 : 1.6;

const getFieldColor = (theme) =>
  theme === 'artist' ? new THREE.Color('#68b8ff') : new THREE.Color('#bb86ff');

export default function AmbientFieldLayer({ theme = 'dev' }) {
  const mountRef    = useRef(null);
  const uniformsRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef    = useRef(null);
  const cameraRef   = useRef(null);
  const rafRef      = useRef(0);
  const mouseRef    = useRef(new THREE.Vector2(0, 0));
  const targetRef   = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const node = mountRef.current;
    if (!node) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
    node.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 3);
    camera.position.z = 1;
    sceneRef.current  = scene;
    cameraRef.current = camera;

    /* Particle positions */
    const positions = new Float32Array(POINT_COUNT * 3);
    for (let i = 0; i < POINT_COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() * 2 - 1) * 1.45;
      positions[i3 + 1] = (Math.random() * 2 - 1) * 1.45;
      positions[i3 + 2] = (Math.random() * 2 - 1) * 0.25;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const uniforms = {
      uTime:       { value: 0 },
      uMouse:      { value: new THREE.Vector2(0, 0) },
      uColor:      { value: getFieldColor(theme) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, MAX_DPR) },
    };
    uniformsRef.current = uniforms;

    const pointMat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        uniform float uTime;
        uniform vec2  uMouse;
        uniform float uPixelRatio;

        void main() {
          vec3 p = position;
          float dist = distance(p.xy, uMouse);
          float inf   = exp(-dist * 3.8);
          vec2  push  = normalize(p.xy - uMouse + vec2(0.0001));
          p.xy += push * inf * 0.045;
          p.y  += sin(uTime * 0.42 + p.x * 8.0 + p.y * 6.0) * 0.015;
          p.x  += cos(uTime * 0.34 + p.y * 7.0) * 0.01;

          vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
          gl_Position  = projectionMatrix * mvPos;
          gl_PointSize = (1.9 + inf * 4.8) * uPixelRatio;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
          gl_FragColor = vec4(mix(uColor * 0.7, uColor, a), a * 0.58);
        }
      `,
    });

    const fieldMat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2  uMouse;
        uniform vec3  uColor;
        varying vec2  vUv;

        void main() {
          vec2 uv    = vUv * 2.0 - 1.0;
          vec2 mouse = uMouse * 0.72;
          float field = sin((uv.x + uTime * 0.06) * 14.0) * sin((uv.y - uTime * 0.04) * 12.0);
          field = field * 0.5 + 0.5;
          float glow    = exp(-length(uv - mouse) * 2.6);
          float vignette = smoothstep(1.35, 0.2, length(uv));
          float alpha   = (0.04 + field * 0.06 + glow * 0.16) * vignette;
          gl_FragColor  = vec4(mix(uColor * 0.45, uColor, field * 0.8 + glow * 0.7), alpha);
        }
      `,
    });

    const points    = new THREE.Points(geo, pointMat);
    const fieldMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fieldMat);
    fieldMesh.position.z = -0.2;
    scene.add(fieldMesh, points);

    const resize = () => {
      const w = node.clientWidth  || window.innerWidth;
      const h = node.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    };
    const onMove = (e) => {
      targetRef.current.set(
        (e.clientX / window.innerWidth)  * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };

    let lastTime = 0;
    const animate = (now) => {
      // Throttle to ~60fps
      if (now - lastTime < 14) { rafRef.current = requestAnimationFrame(animate); return; }
      lastTime = now;

      mouseRef.current.lerp(targetRef.current, 0.045);
      uniforms.uMouse.value.copy(mouseRef.current);
      uniforms.uTime.value = now / 1000;
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      geo.dispose(); pointMat.dispose();
      fieldMesh.geometry.dispose(); fieldMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === node) node.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uColor.value.copy(getFieldColor(theme));
    }
  }, [theme]);

  return (
    <div className={styles.ambientFieldLayer} aria-hidden="true">
      <div ref={mountRef} className={styles.ambientFieldCanvas} />
    </div>
  );
}
