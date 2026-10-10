// 📖 Docs: obsidian/frontend/scene-3d.md

/* ============================================================
   PARTICLE ORB — the shipped hero background (vexon-old/src/components/
   ParticleOrb.tsx), ported to a mountable module line for line: same
   shaders, geometry, counts (160k desktop / 70k mobile), camera, pointer
   parallax and 3.2 s staggered entrance. three is pinned to the version the
   old site resolved (0.169.0). One deliberate difference: the module is
   loaded lazily by `OrbBackground`, so three is never in the first load.

   initParticleOrb(mount, control) appends the renderer's canvas to `mount`
   and returns a cleanup function. The entrance begins the first frame
   `control.started` is true (the preloader finished).
============================================================ */
// Named imports so the bundler can drop the parts of three the orb never
// touches (`import * as` kept all of it in the chunk evaluated at load).
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Group,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

import { buildOrbBuffers, type OrbBuffers } from "./orb-geometry";

/**
 * A Three.js recreation of the hero background video: a dense, granular halo
 * of particles forming a fuzzy donut with a dark void at its center, lit cool
 * blue/white from the top and gently shimmering. Replaces the looped <video>.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uProgress;

  attribute float aScale;
  attribute float aSeed;

  varying float vIntensity;
  varying vec3 vColor;

  // Ashima simplex noise (3D)
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;

    // --- Immersive entrance: a staggered fly-through that coalesces ---
    // Each particle resolves at its own moment for a sweeping, layered reveal.
    float stagger = aSeed * 0.45;
    float lp = clamp((uProgress - stagger) / 0.55, 0.0, 1.0);
    float entrance = 1.0 - pow(1.0 - lp, 4.0); // strong ease-out

    // Start scattered + blown outward, then converge inward.
    float expand = mix(2.4, 1.0, entrance);
    pos.xy *= expand;

    // Rush past the camera: particles begin large/close, then settle back.
    pos.z += (1.0 - entrance) * 3.4;

    // Spiral the whole field as it assembles.
    float swirl = (1.0 - entrance) * 4.5;
    float scs = cos(swirl);
    float ssn = sin(swirl);
    pos.xy = mat2(scs, -ssn, ssn, scs) * pos.xy;

    // Slow rotation of the whole halo around the view axis for life.
    float ang = uTime * 0.05;
    float cs = cos(ang);
    float sn = sin(ang);
    pos.xy = mat2(cs, -sn, sn, cs) * pos.xy;

    // Time-animated turbulence — heavier while entering, settling to a shimmer.
    float t = uTime * 0.18;
    vec3 noiseInput = pos * 1.2 + aSeed * 10.0;
    float nx = snoise(noiseInput + vec3(t, 0.0, 0.0));
    float ny = snoise(noiseInput + vec3(0.0, t, 5.0));
    float nz = snoise(noiseInput + vec3(0.0, 0.0, t + 9.0));
    vec3 turb = vec3(nx, ny, nz);
    pos += turb * 0.22 * mix(3.0, 1.0, entrance);

    // Subtle breathing pulse.
    pos *= 1.0 + 0.015 * sin(uTime * 0.6 + aSeed * 6.28);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Lighting: brighter toward the top (+y), with a hot top-center plume.
    float vertical = clamp(pos.y * 0.5 + 0.5, 0.0, 1.0);
    float topGlow = smoothstep(0.55, 1.0, vertical);

    vec3 deepBlue = vec3(0.05, 0.18, 0.55);
    vec3 midBlue  = vec3(0.20, 0.45, 0.95);
    vec3 hotWhite = vec3(0.80, 0.92, 1.00);
    vec3 col = mix(deepBlue, midBlue, smoothstep(0.0, 0.7, vertical));
    col = mix(col, hotWhite, topGlow * 0.9);

    // Per-particle brightness jitter for the noisy, grainy texture.
    float spark = 0.6 + 0.5 * snoise(pos * 4.0 + aSeed * 3.0);
    vIntensity = (0.35 + 0.65 * vertical) * spark * entrance;
    vColor = col;

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying float vIntensity;
  varying vec3 vColor;

  void main() {
    // Soft round sprite with a bright core.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= alpha;
    float core = smoothstep(0.18, 0.0, d) * 0.6;

    vec3 color = vColor * (vIntensity + core);
    gl_FragColor = vec4(color, (alpha + core) * vIntensity);
  }
`;

function toGeometry({ positions, scales, seeds }: OrbBuffers): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new BufferAttribute(scales, 1));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
  return geometry;
}

/** The buffers from a module Worker; inline where Workers are unavailable. */
function requestBuffers(count: number, onReady: (b: OrbBuffers) => void): () => void {
  if (typeof Worker === "undefined") {
    onReady(buildOrbBuffers(count));
    return () => {};
  }
  const worker = new Worker(new URL("./orb-geometry.worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (event: MessageEvent<OrbBuffers>) => {
    onReady(event.data);
    worker.terminate();
  };
  worker.postMessage({ count });
  return () => worker.terminate();
}

export function initParticleOrb(mount: HTMLElement, control: { started: boolean }): () => void {
  const scene = new Scene();

  const camera = new PerspectiveCamera(
    45,
    mount.clientWidth / mount.clientHeight,
    0.1,
    100
  );
  camera.position.z = 4.2;

  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const isMobile = mount.clientWidth < 768;
  const count = isMobile ? 70000 : 160000;

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 14.0 },
      uPixelRatio: { value: pixelRatio },
      uProgress: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
  });

  // The points join the scene when the Worker hands the buffers back — well
  // before the entrance, which waits for the preloader. Never frustum-culled:
  // the orb is always in view, and culling ran computeBoundingSphere over
  // every particle on the first frame.
  // The pointer parallax rotates this group; the points join it on arrival.
  const orb = new Group();
  scene.add(orb);
  let geometry: BufferGeometry | null = null;
  let disposed = false;
  const cancelBuffers = requestBuffers(count, (buffers) => {
    if (disposed) return;
    geometry = toGeometry(buffers);
    const points = new Points(geometry, material);
    points.frustumCulled = false;
    // Compile the shader before the first frame that draws it — off the main
    // thread where KHR_parallel_shader_compile exists — instead of inside that
    // frame's render (a ~430 ms task at load on Lighthouse mobile).
    void renderer.compileAsync(points, camera).then(() => {
      if (!disposed) orb.add(points);
    });
  });

  // Soft parallax that follows the pointer.
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 0.3;
    target.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
  };
  window.addEventListener("pointermove", onPointerMove);

  const clock = new Clock();
  const ENTRANCE_DURATION = 3.2; // seconds
  let entranceStart: number | null = null;
  let raf = 0;
  let running = true;

  const animate = () => {
    if (!running) return;
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;

    // Begin the entrance the first frame `start` is true (preloader done).
    if (entranceStart === null && control.started) entranceStart = t;
    const progress =
      entranceStart === null
        ? 0
        : Math.min((t - entranceStart) / ENTRANCE_DURATION, 1);
    material.uniforms.uProgress.value = progress;

    pointer.x += (target.x - pointer.x) * 0.04;
    pointer.y += (target.y - pointer.y) * 0.04;
    orb.rotation.y = pointer.x;
    orb.rotation.x = pointer.y;

    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    if (!mount) return;
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize);

  // Pause when offscreen / tab hidden to save the GPU.
  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      clock.getDelta(); // discard the gap so the shimmer doesn't jump
      animate();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    disposed = true;
    cancelBuffers();
    geometry?.dispose();
    material.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === mount) {
      mount.removeChild(renderer.domElement);
    }
  };
}
