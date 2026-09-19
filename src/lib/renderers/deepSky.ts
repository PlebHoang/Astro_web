// High-Zoom Renderers for Deep Sky Objects (Pillars of Creation, Orion Nebula)
// Integrates authentic JWST NIRCam & Hubble high-res imagery with smooth alpha feathering into obsidian black
import { draw5PointStar } from "./canvasHelpers";

let pillarsImg: HTMLImageElement | null = null;
let orionImg: HTMLImageElement | null = null;


const base = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : "/").replace(/\/$/, "");

function getPillarsImg(): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  if (!pillarsImg) {
    pillarsImg = new Image();
    pillarsImg.src = `${base}/images/celestial/pillars_jwst_feathered.webp`;
  }
  return pillarsImg.complete && pillarsImg.naturalWidth > 0 ? pillarsImg : null;
}

function getOrionImg(): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  if (!orionImg) {
    orionImg = new Image();
    orionImg.src = `${base}/images/celestial/orion_feathered.webp`;
  }
  return orionImg.complete && orionImg.naturalWidth > 0 ? orionImg : null;
}

export function renderPillarsOfCreation(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  const img = getPillarsImg();

  if (img) {
    const vpMin = Math.min(ctx.canvas.width, ctx.canvas.height);
    const isMobile = ctx.canvas.width < 640;

    // Eyepiece reticle aperture diameter (~84% of viewport minimum)
    const eyepieceDiameter = vpMin * 0.84;
    const aspect = img.naturalHeight / img.naturalWidth; // 1108 / 640 ≈ 1.73

    // Height calibrated to almost fill the eyepiece circle vertically (~94% on mobile, ~92% on desktop)
    const maxTargetHeight = isMobile
      ? eyepieceDiameter * 0.94
      : Math.min(eyepieceDiameter * 0.92, 820);

    const h = maxTargetHeight * Math.min(1.12, Math.max(0.85, (isMobile ? 1.0 : scale * 0.45)));
    const size = h / aspect;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, cx - size / 2, cy - h / 2, size, h);
    ctx.restore();
    return;
  }

  const s = Math.min(2.0, Math.max(0.6, scale * 0.6));

  // Procedural mathematical fallback
  ctx.save();
  const glowGrad = ctx.createRadialGradient(cx, cy, 10 * s, cx, cy, 120 * s);
  glowGrad.addColorStop(0, "rgba(230, 160, 100, 0.45)");
  glowGrad.addColorStop(0.35, "rgba(180, 100, 70, 0.28)");
  glowGrad.addColorStop(0.7, "rgba(80, 140, 160, 0.15)");
  glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.beginPath();
  ctx.arc(cx, cy, 120 * s, 0, Math.PI * 2);
  ctx.fillStyle = glowGrad;
  ctx.fill();

  // Left Pillar
  ctx.beginPath();
  ctx.moveTo(cx - 38 * s, cy + 90 * s);
  ctx.quadraticCurveTo(cx - 42 * s, cy + 20 * s, cx - 32 * s, cy - 30 * s);
  ctx.bezierCurveTo(cx - 30 * s, cy - 65 * s, cx - 18 * s, cy - 75 * s, cx - 10 * s, cy - 65 * s);
  ctx.quadraticCurveTo(cx - 8 * s, cy - 40 * s, cx - 14 * s, cy + 10 * s);
  ctx.quadraticCurveTo(cx - 16 * s, cy + 60 * s, cx - 12 * s, cy + 90 * s);
  ctx.closePath();
  ctx.fillStyle = "#1e130b";
  ctx.fill();
  ctx.strokeStyle = "rgba(240, 185, 125, 0.75)";
  ctx.lineWidth = 1.8 * s;
  ctx.stroke();

  // Center Pillar
  ctx.beginPath();
  ctx.moveTo(cx - 6 * s, cy + 90 * s);
  ctx.quadraticCurveTo(cx - 4 * s, cy + 40 * s, cx + 5 * s, cy - 10 * s);
  ctx.bezierCurveTo(cx + 8 * s, cy - 35 * s, cx + 18 * s, cy - 38 * s, cx + 22 * s, cy - 25 * s);
  ctx.quadraticCurveTo(cx + 20 * s, cy + 10 * s, cx + 18 * s, cy + 90 * s);
  ctx.closePath();
  ctx.fillStyle = "#180f08";
  ctx.fill();
  ctx.strokeStyle = "rgba(240, 185, 125, 0.65)";
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();

  // Right Pillar
  ctx.beginPath();
  ctx.moveTo(cx + 26 * s, cy + 90 * s);
  ctx.quadraticCurveTo(cx + 28 * s, cy + 50 * s, cx + 38 * s, cy + 15 * s);
  ctx.bezierCurveTo(cx + 42 * s, cy - 2 * s, cx + 52 * s, cy - 5 * s, cx + 52 * s, cy + 12 * s);
  ctx.quadraticCurveTo(cx + 46 * s, cy + 45 * s, cx + 44 * s, cy + 90 * s);
  ctx.closePath();
  ctx.fillStyle = "#150d07";
  ctx.fill();
  ctx.strokeStyle = "rgba(240, 185, 125, 0.6)";
  ctx.lineWidth = 1.4 * s;
  ctx.stroke();

  // Cluster stars
  const clusterStars = [
    { x: -18, y: -80, r: 2.2, c: "#ffffff" },
    { x: 15, y: -45, r: 1.8, c: "#d8eeff" },
    { x: 45, y: -15, r: 1.6, c: "#fff2db" },
    { x: -35, y: -10, r: 1.4, c: "#ffffff" },
    { x: 5, y: -85, r: 2.5, c: "#badeff" }
  ];
  clusterStars.forEach(cs => {
    draw5PointStar(ctx, cx + cs.x * s, cy + cs.y * s, cs.r * 2.2 * s, cs.r * 0.9 * s, cs.c);
  });
  ctx.restore();
}

export function renderM42Nebula(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number
) {
  const r = 85 * scale;
  const img = getOrionImg();

  if (img) {
    const vpMin = Math.min(ctx.canvas.width, ctx.canvas.height);
    const eyepieceDiameter = vpMin * 0.84;

    // Orion is a vast diffuse emission cloud that comfortably expands past the scope circle (~135% of aperture)
    const size = Math.max(eyepieceDiameter * 1.35, 520 * scale);
    const h = (img.naturalHeight / img.naturalWidth) * size;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, cx - size / 2, cy - h / 2, size, h);
    ctx.restore();
    return;
  }

  // Procedural fallback
  const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  cloudGrad.addColorStop(0, "rgba(180, 240, 255, 0.85)");
  cloudGrad.addColorStop(0.25, "rgba(120, 210, 230, 0.45)");
  cloudGrad.addColorStop(0.55, "rgba(215, 120, 180, 0.2)");
  cloudGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = cloudGrad;
  ctx.fill();

  const trap = [
    { x: -5, y: -4 },
    { x: 4, y: -6 },
    { x: 5, y: 5 },
    { x: -4, y: 4 }
  ];
  trap.forEach(t => {
    draw5PointStar(ctx, cx + t.x * scale, cy + t.y * scale, 3.5 * scale, 1.5 * scale, "#ffffff");
  });
  ctx.font = '8px "Space Mono", monospace';
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText("Trapezium Cluster", cx + 12 * scale, cy - 8 * scale);
}
