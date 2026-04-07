import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from '../styles/App.module.css';

const POINT_COUNT = 560;
const MAX_DPR = 1.6;

const getFieldColor = (theme) =>
  theme === 'artist' ? new THREE.Color('#68b8ff') : new THREE.Color('#bb86ff');

export default function AmbientFieldLayer({ theme = 'dev' }) {
  const mountRef = useRef(null);
  const uniformsRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rafRef = useRef(0);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouseRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return undefined;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mountNode.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 3);
    camera.position.z = 1;
    sceneRef.current = scene;
    cameraRef.current = camera;

    const positions = new Float32Array(POINT_COUNT * 3);
    for (let i = 0; i < POINT_COUNT; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() * 2 - 1) * 1.45;
      positions[i3 + 1] = (Math.random() * 2 - 1) * 1.45;
      positions[i3 + 2] = (Math.random() * 2 - 1) * 0.25;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: getFieldColor(theme) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, MAX_DPR) },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPixelRatio;

        void main() {
          vec3 p = position;
          float dist = distance(p.xy, uMouse);
          float influence = exp(-dist * 3.8);
          vec2 pushDir = normalize(p.xy - uMouse + vec2(0.0001));

          p.xy += pushDir * influence * 0.045;
          p.y += sin(uTime * 0.42 + p.x * 8.0 + p.y * 6.0) * 0.015;
          p.x += cos(uTime * 0.34 + p.y * 7.0) * 0.01;

          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float pointSize = 1.9 + influence * 4.8;
          gl_PointSize = pointSize * uPixelRatio;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float dist = length(uv);
          float alpha = smoothstep(0.5, 0.0, dist);
          vec3 color = mix(uColor * 0.7, uColor, alpha);
          gl_FragColor = vec4(color, alpha * 0.58);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const fieldMaterial = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          vec2 mouse = uMouse * 0.72;

          float field = sin((uv.x + uTime * 0.06) * 14.0) * sin((uv.y - uTime * 0.04) * 12.0);
          field = field * 0.5 + 0.5;

          float mouseGlow = exp(-length(uv - mouse) * 2.6);
          float vignette = smoothstep(1.35, 0.2, length(uv));

          float alpha = (0.04 + field * 0.06 + mouseGlow * 0.16) * vignette;
          vec3 color = mix(uColor * 0.45, uColor, field * 0.8 + mouseGlow * 0.7);

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const fieldMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fieldMaterial);
    fieldMesh.position.z = -0.2;
    scene.add(fieldMesh);

    const resize = () => {
      const width = mountNode.clientWidth || window.innerWidth;
      const height = mountNode.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    };

    const onPointerMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -((event.clientY / window.innerHeight) * 2 - 1);
      targetMouseRef.current.set(x * 1.05, y * 1.05);
    };

    const animate = (now) => {
      const mouse = mouseRef.current;
      const target = targetMouseRef.current;
      mouse.lerp(target, 0.045);

      uniforms.uMouse.value.copy(mouse);
      uniforms.uTime.value = now / 1000;
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      geometry.dispose();
      material.dispose();
      fieldMesh.geometry.dispose();
      fieldMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!uniformsRef.current) return;
    uniformsRef.current.uColor.value.copy(getFieldColor(theme));
  }, [theme]);

  return (
    <div className={styles.ambientFieldLayer} aria-hidden="true">
      <div ref={mountRef} className={styles.ambientFieldCanvas} />
    </div>
  );
}
