/**
 * FloatingParticleField
 * Three.js instanced particle network using @react-three/fiber + @react-three/drei.
 * Renders a dense constellation of drifting particles with mouse-reactive repulsion.
 * Used behind the hero section of both profiles.
 *
 * Props:
 *   theme   'dev' | 'artist'
 *   count   number of particles (default 280, reduced on mobile)
 */
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

function Particles({ theme, count }) {
  const meshRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouseRef = useRef(new THREE.Vector2(0, 0));
  const { gl, size } = useThree();

  const color = theme === 'artist'
    ? new THREE.Color('#60aaec')
    : new THREE.Color('#9b3fff');

  // Build geometry with random positions and drift offsets
  const { positions, offsets, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3]     = (Math.random() - 0.5) * 14;
      pos[i3 + 1] = (Math.random() - 0.5) * 10;
      pos[i3 + 2] = (Math.random() - 0.5) * 4;
      off[i3]     = Math.random() * Math.PI * 2;
      off[i3 + 1] = Math.random() * Math.PI * 2;
      off[i3 + 2] = Math.random() * Math.PI * 2;
      spd[i]      = 0.18 + Math.random() * 0.28;
    }
    return { positions: pos, offsets: off, speeds: spd };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, [positions, offsets, speeds]);

  // Mouse tracking
  useMemo(() => {
    const onMove = (e) => {
      targetMouseRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime:     { value: 0 },
      uMouse:    { value: new THREE.Vector2(0, 0) },
      uColor:    { value: color },
      uSize:     { value: MOBILE ? 1.8 : 2.6 },
      uPixelRatio:{ value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: `
      attribute vec3  aOffset;
      attribute float aSpeed;
      uniform float   uTime;
      uniform vec2    uMouse;
      uniform float   uSize;
      uniform float   uPixelRatio;

      void main() {
        vec3 p = position;

        /* Organic drift */
        p.x += sin(uTime * aSpeed * 0.7 + aOffset.x) * 0.22;
        p.y += cos(uTime * aSpeed * 0.5 + aOffset.y) * 0.18;
        p.z += sin(uTime * aSpeed * 0.4 + aOffset.z) * 0.12;

        /* Mouse repulsion in clip space */
        vec4 clip = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        vec2 ndc  = clip.xy / clip.w;
        float dist = distance(ndc, uMouse);
        float push = exp(-dist * 3.2) * 0.28;
        vec2  dir  = normalize(ndc - uMouse + vec2(0.0001));
        p.xy += dir * push;

        vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
        gl_Position  = projectionMatrix * mvPos;

        float depth    = smoothstep(-4.0, 4.0, p.z);
        float basePx   = uSize * uPixelRatio;
        float mousePx  = exp(-dist * 2.6) * 6.0;
        gl_PointSize   = (basePx * (0.6 + depth * 0.8) + mousePx) * (300.0 / -mvPos.z);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;

      void main() {
        vec2  uv   = gl_PointCoord - 0.5;
        float dist = length(uv);
        float a    = smoothstep(0.5, 0.0, dist);
        vec3  col  = mix(uColor * 0.55, uColor * 1.2, 1.0 - dist * 2.0);
        gl_FragColor = vec4(col, a * 0.72);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [color]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const m = material.uniforms;
    m.uTime.value = clock.getElapsedTime();
    mouseRef.current.lerp(targetMouseRef.current, 0.06);
    m.uMouse.value.copy(mouseRef.current);
  });

  return (
    <points ref={meshRef} geometry={geometry} material={material} />
  );
}

export default function FloatingParticleField({ theme = 'dev', count = MOBILE ? 140 : 280 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 65 }}
        dpr={[1, MOBILE ? 1.5 : 2]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Particles theme={theme} count={count} />
      </Canvas>
    </div>
  );
}
