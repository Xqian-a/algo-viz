import { easeInOutCubic } from '../utils/easing.js';

export function animate(duration, onProgress, onComplete, easingFn = easeInOutCubic) {
  const start = performance.now();
  let raf;

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = easingFn(t);
    onProgress(eased, t);
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      if (onComplete) onComplete();
    }
  }

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function lerp(a, b, t) { return a + (b - a) * t; }
