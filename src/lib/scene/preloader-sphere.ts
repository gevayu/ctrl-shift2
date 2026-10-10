// 📖 Docs: obsidian/frontend/scene-3d.md

/* ============================================================
   PRELOADER SPHERE — the shipped preloader's 2D-canvas particle sphere
   (vexon-old/src/components/Preloader.tsx, the "Particle Sphere Animation"
   effect), ported line for line: 600 Fibonacci-sphere points, rotated,
   depth-sorted and perspective-projected, growing with the counter and then
   10 % a second once it reaches 100.

   initPreloaderSphere(canvas, getProgress) starts the loop and returns a
   cleanup function. `getProgress` returns the counter, 0–100.
============================================================ */

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  color: string;
  rx?: number;
  rz?: number;
}

export function initPreloaderSphere(canvas: HTMLCanvasElement, getProgress: () => number): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let animationFrameId = 0;
  let finishTime: number | null = null;

  // Function to set canvas size based on parent container
  const resizeCanvas = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    return { width, height };
  };

  const dims = resizeCanvas() || { width: window.innerWidth, height: window.innerHeight };
  let w = dims.width;
  let h = dims.height;

  const particles: Particle[] = [];
  const particleCount = 600;

  // Initialize particles on sphere surface using Fibonacci sphere algorithm
  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;

    particles.push({
      x: Math.cos(theta) * Math.sin(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(phi),
      size: Math.random() * 1.5 + 0.3, // Smaller points
      alpha: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.4 ? "#FFFFFF" : "#444444",
    });
  }

  let rotation = 0;

  const render = () => {
    // Re-get dimensions in case of layout shifts
    const parent = canvas.parentElement;
    if (parent) {
      w = parent.clientWidth;
      h = parent.clientHeight;
    }

    // Clear entire canvas before any transformations
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Re-apply scale for the render
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const currentProgress = getProgress() / 100;
    let animProgress = currentProgress;

    // If at 100%, continue moving at a steady pace
    if (currentProgress >= 1) {
      if (!finishTime) finishTime = Date.now();
      const elapsed = (Date.now() - finishTime) / 1000;
      animProgress = 1 + elapsed * 0.1; // Grow 10% per second consistently
    }

    // Continuous rotation - more consistent speed without drastic slowdown
    const rotationSpeed = 0.006 * (1 + (1 - Math.min(1, animProgress)) * 0.5);
    rotation += Math.max(0.001, rotationSpeed);

    const baseRadius = Math.min(w, h) * 0.35;

    // Linear progression to avoid the "stuck" feeling of ease-out
    const radius = baseRadius * (0.2 + animProgress * 0.8);

    ctx.save();
    ctx.translate(w / 2, h / 2);

    // Sort particles by rotated Z for depth consistency
    const sortedParticles = particles
      .map((p) => {
        const rx = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
        const rz = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
        return { ...p, rx, rz };
      })
      .sort((a, b) => a.rz - b.rz);

    sortedParticles.forEach((p) => {
      // Perspective projection with rotated coordinates
      const perspective = 1000 / (1000 + p.rz * radius);
      const px = p.rx * radius * perspective;
      const py = p.y * radius * perspective;
      const size = p.size * perspective;

      // Opacity mapping (stays at max once reached)
      const alpha = p.alpha * Math.min(1, currentProgress) * perspective;

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fill();
    });

    ctx.restore();
    animationFrameId = requestAnimationFrame(render);
  };

  render();

  const handleResize = () => {
    const size = resizeCanvas();
    if (size) {
      w = size.width;
      h = size.height;
    }
  };
  window.addEventListener("resize", handleResize);

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener("resize", handleResize);
  };
}
