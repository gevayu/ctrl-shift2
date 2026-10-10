// 📖 Docs: obsidian/frontend/scene-3d.md

export interface OrbBuffers {
  positions: Float32Array;
  scales: Float32Array;
  seeds: Float32Array;
}

/** The orb's particle buffers — pure maths, so it runs in a Worker (orb-geometry.worker.ts). */
export function buildOrbBuffers(count: number): OrbBuffers {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const seeds = new Float32Array(count);

  const innerR = 0.95; // radius of the dark void
  const bandWidth = 0.9; // thickness of the glowing ring

  // Box-Muller gaussian helper for a soft-edged radial band.
  const gaussian = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;

    // Radius: a fuzzy band starting at the void edge and spraying outward,
    // with a long tail outward so the outer edge fades softly.
    const r = innerR + Math.abs(gaussian()) * bandWidth * 0.55 + Math.random() * 0.15;

    // Flatten toward camera (XY plane) with a little depth so it has volume.
    const z = gaussian() * 0.18;

    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.sin(theta) * r;
    positions[i * 3 + 2] = z;

    scales[i] = 0.5 + Math.random() * 1.6;
    seeds[i] = Math.random();
  }

  return { positions, scales, seeds };
}
