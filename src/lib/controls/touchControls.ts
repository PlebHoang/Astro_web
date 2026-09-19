export interface TouchControlOptions {
  isStargazeActive: () => boolean;
  isBackgroundMode: () => boolean;
  isHighZoom: () => boolean;
  onPan: (deltaYaw: number, deltaPitch: number) => void;
  onToggleZoom: (highZoom: boolean) => void;
}

/**
 * Initializes mobile touch gestures for the virtual telescope:
 * 1. Single-finger drag with 150x micro-stepping sensitivity.
 * 2. Two-finger pinch-to-zoom (pinch-in for 20x, pinch-out for 150x).
 * 3. Double-tap on canvas to toggle between 20x finder and 150x zoom.
 */
export function initTouchControls(canvas: HTMLCanvasElement, options: TouchControlOptions): () => void {
  let isDragging = false;
  let prevTouchX = 0;
  let prevTouchY = 0;
  let initialPinchDist = 0;
  let lastTapTime = 0;

  function isInteractiveElement(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    return !!target.closest("button, a, input, select, textarea, kbd, #star-info-card, [role='button'], header, footer");
  }

  function handleTouchStart(e: TouchEvent) {
    if (isInteractiveElement(e.target)) return;
    if (options.isBackgroundMode() && !options.isStargazeActive()) return;

    if (e.touches.length === 1) {
      isDragging = true;
      prevTouchX = e.touches[0].clientX;
      prevTouchY = e.touches[0].clientY;

      // Double-tap to toggle zoom
      const now = Date.now();
      if (now - lastTapTime < 300) {
        options.onToggleZoom(!options.isHighZoom());
        lastTapTime = 0;
      } else {
        lastTapTime = now;
      }
    } else if (e.touches.length === 2) {
      isDragging = false;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (options.isBackgroundMode() && !options.isStargazeActive()) return;

    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - prevTouchX;
      const dy = e.touches[0].clientY - prevTouchY;
      const panSensitivity = options.isHighZoom() ? 0.0008 : 0.0035;

      options.onPan(-dx * panSensitivity, -dy * panSensitivity);

      prevTouchX = e.touches[0].clientX;
      prevTouchY = e.touches[0].clientY;
    } else if (e.touches.length === 2 && initialPinchDist > 0) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const delta = currentDist - initialPinchDist;

      if (delta > 40 && !options.isHighZoom()) {
        options.onToggleZoom(true);
        initialPinchDist = currentDist;
      } else if (delta < -40 && options.isHighZoom()) {
        options.onToggleZoom(false);
        initialPinchDist = currentDist;
      }
    }
  }

  function handleTouchEnd() {
    isDragging = false;
    initialPinchDist = 0;
  }

  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
  window.addEventListener("touchend", handleTouchEnd);

  return () => {
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };
}
