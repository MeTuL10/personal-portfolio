/**
 * SketchbookPageFx (R3F edition)
 * Imperative ref API: call ref.burst('next' | 'prev') to fire
 * an instanced particle burst using @react-three/fiber.
 *
 * Falls back to nothing on prefers-reduced-motion.
 */
import {
  useRef, useMemo, useState,
  forwardRef, useImperativeHandle,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLORS = {
  artist: new THREE.Color('#60aaec'),
  dev:    new THREE.Color('#9b3fff'),
};

function ParticleBurst({ theme, burstSignal }) {
  const pointsRef = useRef(null);
  const matRef    = useRef(null);
  const stateRef  = useRef({ active: false, t: 0, dir: 'next', positions: null });

  const COUNT = 36;

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  // Watch for burst signal changes
  const prevSignal = useRef(null);

  useFrame((_, delta) => {
    const s = stateRef.current;

    // New burst triggered
    if (burstSignal && burstSignal !== prevSignal.current) {
      prevSignal.current = burstSignal;
      s.active = true;
      s.t = 0;
      s.dir = burstSignal.dir;

      // Randomise starting velocities
      s.positions = Array.from({ length: COUNT }, () => ({
        x: burstSignal.dir === 'next' ? 0.85 : -0.85,
        y: 0,
        vx: (Math.random() - (burstSignal.dir === 'next' ? 0.7 : 0.3)) * 1.8,
        vy: (Math.random() - 0.5) * 2.2,
        life: Math.random() * 0.3,
      }));
    }

    if (!s.active || !pointsRef.current) return;
    s.t += delta;

    const posAttr = geo.attributes.position;
    for (let i = 0; i < COUNT; i++) {
      const p = s.positions[i];
      p.life += delta;
      const progress = Math.min(p.life / 0.7, 1);
      p.x += p.vx * delta * (1 - progress * 0.6);
      p.y += p.vy * delta - 1.2 * delta * progress;
      posAttr.setXYZ(i, p.x, p.y, 0);
    }
    posAttr.needsUpdate = true;

    if (matRef.current) {
      matRef.current.uniforms.uAlpha.value = Math.max(0, 1 - s.t / 0.65);
    }

    if (s.t > 0.75) s.active = false;
  });

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: COLORS[theme] ?? COLORS.dev },
      uAlpha: { value: 0 },
    },
    vertexShader: `
      void main() {
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_Position  = projectionMatrix * mvPos;
        gl_PointSize = 4.0 * (200.0 / -mvPos.z);
      }
    `,
    fragmentShader: `
      uniform vec3  uColor;
      uniform float uAlpha;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float a = smoothstep(0.5, 0.0, length(uv));
        gl_FragColor = vec4(uColor, a * uAlpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [theme]);

  matRef.current = mat;

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

const SketchbookPageFx = forwardRef(function SketchbookPageFx({ theme = 'artist' }, ref) {
  const [burstSignal, setBurstSignal] = useState(null);

  useImperativeHandle(ref, () => ({
    burst(direction) {
      if (REDUCED) return;
      setBurstSignal({ dir: direction, id: Date.now() });
    },
  }));

  if (REDUCED) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 4,
        borderRadius: 'inherit',
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 2], zoom: 90 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ParticleBurst theme={theme} burstSignal={burstSignal} />
      </Canvas>
    </div>
  );
});

export default SketchbookPageFx;
