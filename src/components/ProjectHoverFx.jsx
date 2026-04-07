import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function HoverPlane({ active, pointer }) {
  const materialRef = useRef(null);
  const pointerRef = useRef(new THREE.Vector2(0.5, 0.5));
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uStrength: { value: 0 },
      uColorA: { value: new THREE.Color('#6c2dd8') },
      uColorB: { value: new THREE.Color('#d0b0ff') },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    pointerRef.current.lerp(new THREE.Vector2(pointer.x, pointer.y), 1 - Math.exp(-delta * 16));
    uniforms.uPointer.value.copy(pointerRef.current);
    uniforms.uTime.value += delta;
    uniforms.uStrength.value = THREE.MathUtils.damp(
      uniforms.uStrength.value,
      active ? 1 : 0,
      7.5,
      delta
    );
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
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
          uniform vec3 uColorA;
          uniform vec3 uColorB;

          void main() {
            vec2 uv = vUv;
            vec2 p = uv - uPointer;
            p.x *= 1.2;
            p.y *= 0.9;

            float dist = length(p);
            float spot = exp(-dist * 11.0);

            float sweepLine = abs((uv.x + uv.y * 0.45) - fract(uTime * 0.08 + uPointer.x * 0.12));
            float sweep = smoothstep(0.2, 0.0, sweepLine);
            float edgeMask = smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.55, uv.y);

            float intensity = (spot * 0.92 + sweep * 0.25 * edgeMask) * uStrength;
            vec3 color = mix(uColorA, uColorB, clamp(spot * 1.2 + sweep * 0.35, 0.0, 1.0));

            gl_FragColor = vec4(color, intensity * 0.46);
          }
        `}
      />
    </mesh>
  );
}

export default function ProjectHoverFx({ active, pointer }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
    >
      <HoverPlane active={active} pointer={pointer} />
    </Canvas>
  );
}
