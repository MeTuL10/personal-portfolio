/**
 * ProjectHoverFx — @react-three/fiber + @react-three/drei shader overlay.
 * Radial glow spotlight + animated sweep + edge pulse on project card hover.
 * Uses drei's ScreenQuad for a clean full-card fill without vertex math.
 */
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function HoverPlane({ active, pointer }) {
  const matRef = useRef(null);
  const smoothPointer = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uStrength:{ value: 0 },
    uColorA:  { value: new THREE.Color('#6c2dd8') },
    uColorB:  { value: new THREE.Color('#d0b0ff') },
  }), []);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;

    // Smooth pointer
    smoothPointer.current.lerp(
      new THREE.Vector2(pointer.x, pointer.y),
      1 - Math.exp(-delta * 14)
    );
    u.uPointer.value.copy(smoothPointer.current);
    u.uTime.value += delta;
    u.uStrength.value = THREE.MathUtils.damp(u.uStrength.value, active ? 1 : 0, 8, delta);
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
            p.x    *= 1.22;
            p.y    *= 0.88;

            /* Radial spotlight */
            float spot = exp(-length(p) * 10.5);

            /* Diagonal sweep */
            float sweepLine = abs((uv.x + uv.y * 0.45) - fract(uTime * 0.09 + uPointer.x * 0.12));
            float sweep = smoothstep(0.22, 0.0, sweepLine);
            float edgeMask = smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.55, uv.y);

            /* Edge border pulse */
            float border = max(
              smoothstep(0.02, 0.0, uv.x) + smoothstep(0.98, 1.0, uv.x),
              smoothstep(0.02, 0.0, uv.y) + smoothstep(0.98, 1.0, uv.y)
            );
            float borderPulse = border * (0.4 + 0.3 * sin(uTime * 3.5));

            float intensity = (spot * 0.88 + sweep * 0.24 * edgeMask + borderPulse * 0.18) * uStrength;
            vec3 color = mix(uColorA, uColorB, clamp(spot * 1.3 + sweep * 0.4, 0.0, 1.0));

            gl_FragColor = vec4(color, intensity * 0.48);
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
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
    >
      <HoverPlane active={active} pointer={pointer} />
    </Canvas>
  );
}
