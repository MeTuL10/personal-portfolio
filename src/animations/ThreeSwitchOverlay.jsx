import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "../styles/App.module.css";

const EXTRA_TAIL_MS = 220;
const MAX_DPR = 1.8;

const getThemePalette = (theme) => {
  if (theme === "artist") {
    return {
      base: "#2f77cf",
      accent: "#87d4ff",
    };
  }

  return {
    base: "#702be2",
    accent: "#d3b2ff",
  };
};

export default function ThreeSwitchOverlay({
  theme,
  delayMs,
  durationMs,
  transitionKey,
}) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const uniformsRef = useRef(null);

  const rafRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const startedAtRef = useRef(0);
  const progressRef = useRef(1);
  const delayRef = useRef(delayMs);
  const durationRef = useRef(durationMs);

  const drawFrameRef = useRef(null);
  const startAnimationRef = useRef(() => {});

  useEffect(() => {
    delayRef.current = delayMs;
    durationRef.current = durationMs;
  }, [delayMs, durationMs]);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return undefined;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mountNode.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    sceneRef.current = scene;
    cameraRef.current = camera;

    const { base, accent } = getThemePalette("dev");
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 1 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uBase: { value: new THREE.Color(base) },
      uAccent: { value: new THREE.Color(accent) },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms,
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        varying vec2 vUv;
        uniform float uTime;
        uniform float uProgress;
        uniform vec2 uResolution;
        uniform vec3 uBase;
        uniform vec3 uAccent;

        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        void main() {
          vec2 centeredUv = vUv - 0.5;
          centeredUv.x *= uResolution.x / max(uResolution.y, 1.0);

          float t = uTime * 0.95;
          float radius = length(centeredUv);
          float angle = atan(centeredUv.y, centeredUv.x);
          vec2 dir = normalize(centeredUv + vec2(0.0001));

          float swirl = sin(angle * 5.0 + radius * 26.0 - t * 7.5) * 0.02;
          float fluidRadius = radius + swirl;

          float wavePos = mix(0.06, 1.34, uProgress);

          float ringR = exp(-pow((length(centeredUv + dir * 0.016) + swirl - wavePos) * 8.4, 2.0));
          float ringG = exp(-pow((fluidRadius - wavePos) * 8.8, 2.0));
          float ringB = exp(-pow((length(centeredUv - dir * 0.016) + swirl - wavePos) * 9.2, 2.0));
          vec3 ring = vec3(ringR, ringG, ringB);

          float core = (1.0 - smoothstep(0.02, 0.22 + uProgress * 0.75, fluidRadius)) * (1.0 - uProgress * 0.62);
          float haze = (1.0 - smoothstep(0.08, 1.35, fluidRadius)) * (0.44 - uProgress * 0.25);

          float ripple = sin(fluidRadius * 88.0 - t * 14.0) * 0.5 + 0.5;
          float pulse = 0.6 + 0.4 * sin(t * 5.0);
          float alpha = clamp(core * 0.9 + ringG * (0.72 + 0.28 * ripple) + haze * pulse, 0.0, 1.0);
          alpha *= (1.0 - smoothstep(0.84, 1.0, uProgress));

          float ringEnergy = clamp((ringR + ringG + ringB) / 3.0, 0.0, 1.0);
          vec3 color = mix(uBase, uAccent, clamp(core * 0.68 + ringEnergy * 0.9, 0.0, 1.0));
          color += ring * 0.16;

          float scanline = 0.986 + 0.014 * sin((vUv.y + uTime * 0.3) * 950.0);
          color *= scanline;

          float grain = hash21(gl_FragCoord.xy + vec2(uTime * 120.0, uTime * 80.0)) - 0.5;
          color += grain * (0.03 + 0.02 * (1.0 - uProgress));

          vec2 vignetteUv = vUv * 2.0 - 1.0;
          float vignette = clamp(1.0 - dot(vignetteUv, vignetteUv) * 0.26, 0.0, 1.0);
          color *= mix(0.86, 1.0, vignette);
          alpha *= vignette;

          gl_FragColor = vec4(color, alpha * 0.9);
        }
      `,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    meshRef.current = mesh;
    scene.add(mesh);

    const renderScene = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current)
        return;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    const resize = () => {
      const width = mountNode.clientWidth || window.innerWidth;
      const height = mountNode.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
      renderScene();
    };

    const drawFrame = (now) => {
      const active = isAnimatingRef.current;
      const elapsed = now - startedAtRef.current;
      const localDelay = delayRef.current;
      const localDuration = durationRef.current;

      if (active) {
        const progress = Math.min(
          Math.max((elapsed - localDelay) / localDuration, 0),
          1,
        );
        progressRef.current = progress;

        if (elapsed > localDelay + localDuration + EXTRA_TAIL_MS) {
          progressRef.current = 1;
          isAnimatingRef.current = false;
        }
      }

      uniforms.uTime.value = now / 1000;
      uniforms.uProgress.value = progressRef.current;
      renderScene();

      if (isAnimatingRef.current) {
        rafRef.current = requestAnimationFrame(drawFrame);
      } else {
        rafRef.current = 0;
      }
    };

    drawFrameRef.current = drawFrame;
    startAnimationRef.current = () => {
      startedAtRef.current = performance.now();
      progressRef.current = 0;
      isAnimatingRef.current = true;

      if (!rafRef.current && drawFrameRef.current) {
        rafRef.current = requestAnimationFrame(drawFrameRef.current);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        scene.remove(meshRef.current);
      }
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    const { base, accent } = getThemePalette(theme);
    uniforms.uBase.value.set(base);
    uniforms.uAccent.value.set(accent);

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (renderer && scene && camera) renderer.render(scene, camera);
  }, [theme]);

  useEffect(() => {
    if (transitionKey == null) return;
    startAnimationRef.current();
  }, [transitionKey]);

  return (
    <div className={styles.threeTransitionLayerWrap} aria-hidden="true">
      <div ref={mountRef} className={styles.threeTransitionLayer} />
    </div>
  );
}
