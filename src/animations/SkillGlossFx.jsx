/**
 * SkillGlossFx — R3F shader gloss effect for skill cards.
 * Radial highlight + animated sheen sweep + top edge sheen.
 * Color adapts to dev theme (purple).
 */
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GlossPlane({ active, pointer }) {
  const matRef = useRef(null);
  const smoothP = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uStrength:{ value: 0 },
    uColorA:  { value: new THREE.Color('#c4a0ff') },
    uColorB:  { value: new THREE.Color('#ead8ff') },
  }), []);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    smoothP.current.lerp(new THREE.Vector2(pointer.x, pointer.y), 1 - Math.exp(-delta * 13));
    u.uPointer.value.copy(smoothP.current);
    u.uTime.value += delta;
    u.uStrength.value = THREE.MathUtils.damp(u.uStrength.value, active ? 1 : 0, 7, delta);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2  uPointer;
          uniform float uStrength;
          uniform vec3  uColorA;
          uniform vec3  uColorB;

          void main() {
            vec2 uv = vUv;
            vec2 p  = uv - uPointer;
            p.x    *= 1.15;
            p.y    *= 0.85;

            /* Radial glow */
            float radial = exp(-length(p) * 9.8);

            /* Sweeping sheen */
            float sweepLine = abs((uv.x * 0.92 + uv.y * 0.38) - fract(uTime * 0.09 + uPointer.x * 0.18));
            float sweep = smoothstep(0.18, 0.0, sweepLine);

            /* Top-edge sheen */
            float topSheen = smoothstep(0.96, 0.5, uv.y) * 0.26;

            /* Diagonal glint */
            float glint = smoothstep(0.008, 0.0, abs(uv.x * 0.7 + uv.y * 0.3 - fract(uTime * 0.06)));

            float intensity = (radial * 0.65 + sweep * 0.32 + topSheen + glint * 0.18) * uStrength;
            vec3 col = mix(uColorA, uColorB, radial * 0.8 + glint);
            gl_FragColor = vec4(col, intensity * 0.5);
          }
        `}
      />
    </mesh>
  );
}

export default function SkillGlossFx({ active, pointer }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
    >
      <GlossPlane active={active} pointer={pointer} />
    </Canvas>
  );
}
