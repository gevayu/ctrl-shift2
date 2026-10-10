// 📖 Docs: obsidian/frontend/scene-3d.md

import { buildOrbBuffers } from "./orb-geometry";

/**
 * Builds the orb's 70 k / 160 k particle buffers off the main thread — the
 * loop of Math.random/log/cos was part of a ~420 ms long task at load on a
 * 4× CPU (Lighthouse mobile). The arrays are transferred back, not copied.
 */
self.onmessage = (event: MessageEvent<{ count: number }>) => {
  const buffers = buildOrbBuffers(event.data.count);
  (self as unknown as Worker).postMessage(buffers, [buffers.positions.buffer, buffers.scales.buffer, buffers.seeds.buffer]);
};
