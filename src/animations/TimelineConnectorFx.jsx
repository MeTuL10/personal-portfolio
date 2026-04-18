import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function ConnectorPlane({ active }) {
  const materialRef = useRef(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStrength: { value: 0 },
      uColorA: { value: new THREE.Color("#e4d0ff") },
      uColorB: { value: new THREE.Color("#9d5cff") },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    uniforms.uTime.value += delta;
    uniforms.uStrength.value = THREE.MathUtils.damp(
      uniforms.uStrength.value,
      active ? 1 : 0.25,
      7,
      delta,
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
          uniform float uStrength;
          uniform vec3 uColorA;
          uniform vec3 uColorB;

          void main() {
            vec2 uv = vUv;
            float xDist = abs(uv.x - 0.5);
            float line = smoothstep(0.12, 0.01, xDist);

            float yFade = smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.22, uv.y);
            float pulse = 0.7 + 0.3 * sin((uv.y * 11.0) - uTime * 4.2);
            float connector = line * yFade * pulse;

            vec2 dotCenter = vec2(0.5, 0.93);
            float dot = exp(-length((uv - dotCenter) * vec2(1.5, 3.2)) * 18.0);

            float intensity = (connector * 0.58 + dot * 0.95) * uStrength;
            vec3 color = mix(uColorB, uColorA, clamp(dot + connector * 0.45, 0.0, 1.0));
            gl_FragColor = vec4(color, intensity * 0.78);
          }
        `}
      />
    </mesh>
  );
}

export default function TimelineConnectorFx({ active }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ConnectorPlane active={active} />
    </Canvas>
  );
}
