import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function GlossPlane({ active, pointer }) {
  const materialRef = useRef(null);
  const pointerRef = useRef(new THREE.Vector2(0.5, 0.5));
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uStrength: { value: 0 },
      uColor: { value: new THREE.Color('#ead8ff') },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    pointerRef.current.lerp(new THREE.Vector2(pointer.x, pointer.y), 1 - Math.exp(-delta * 15));
    uniforms.uPointer.value.copy(pointerRef.current);
    uniforms.uTime.value += delta;
    uniforms.uStrength.value = THREE.MathUtils.damp(
      uniforms.uStrength.value,
      active ? 1 : 0,
      7,
      delta
    );
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uPointer;
          uniform float uStrength;
          uniform vec3 uColor;

          void main() {
            vec2 uv = vUv;
            vec2 p = uv - uPointer;
            p.x *= 1.15;
            p.y *= 0.85;

            float radial = exp(-length(p) * 10.5);
            float sweepLine = abs((uv.x * 0.92 + uv.y * 0.38) - fract(uTime * 0.085 + uPointer.x * 0.18));
            float sweep = smoothstep(0.18, 0.0, sweepLine);
            float topSheen = smoothstep(0.96, 0.5, uv.y) * 0.28;

            float intensity = (radial * 0.68 + sweep * 0.34 + topSheen) * uStrength;
            gl_FragColor = vec4(uColor, intensity * 0.52);
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
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <GlossPlane active={active} pointer={pointer} />
    </Canvas>
  );
}
