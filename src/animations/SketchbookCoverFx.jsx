/**
 * SketchbookCoverFx — @react-three/fiber GPU shader for sketchbook cover.
 * Animated ruled lines + drifting spotlight + margin accent via GLSL.
 */
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLORS = { artist: '#185fa5', dev: '#6804ba' };

function CoverPlane({ theme }) {
  const matRef = useRef(null);
  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uColor:      { value: new THREE.Color(COLORS[theme] ?? COLORS.dev) },
    uResolution: { value: new THREE.Vector2(1, 1) },
  }), [theme]);

  useFrame(({ clock, size }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
        `}
        fragmentShader={`
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3  uColor;
          uniform vec2  uResolution;

          void main() {
            vec2 uv = vUv;
            float aspect = uResolution.x / max(uResolution.y, 1.0);

            /* Ruled lines scrolling upward */
            float ls   = 0.048;
            float lineY = fract((uv.y + uTime * 0.032) / ls);
            float line  = smoothstep(0.96, 1.0, lineY) + smoothstep(0.04, 0.0, lineY);
            float lineA = line * (0.04 + 0.012 * sin(uTime * 1.1 + uv.x * 18.0));

            /* Drifting spotlight */
            vec2 su = uv - 0.5;
            su.x *= aspect;
            float sd = length(su - vec2(0.22 * sin(uTime * 0.38), 0.14 * cos(uTime * 0.29)));
            float spot = exp(-sd * sd * 4.8) * 0.13;

            /* Left margin accent */
            float margin = smoothstep(0.003, 0.0, abs(uv.x - 0.076));
            float marginA = margin * (0.14 + 0.04 * sin(uTime * 0.85));

            /* Vignette */
            float vig = 1.0 - smoothstep(0.5, 1.2, length(uv - 0.5) * 1.6);

            float alpha = (lineA + spot + marginA) * vig;
            gl_FragColor = vec4(uColor, alpha * 0.92);
          }
        `}
      />
    </mesh>
  );
}

export default function SketchbookCoverFx({ theme = 'artist', visible = true }) {
  if (REDUCED || !visible) return null;
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      zIndex: 0, borderRadius: 'inherit',
      opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
    }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <CoverPlane theme={theme} />
      </Canvas>
    </div>
  );
}
