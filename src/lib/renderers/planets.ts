// High-Zoom Renderers for Solar System Planets (Jupiter, Saturn, Mars)
// Integrates authentic transparent NASA Cassini & Hubble photographic cutouts with procedural fallback

let jupiterImg: HTMLImageElement | null = null;
let saturnImg: HTMLImageElement | null = null;
let marsImg: HTMLImageElement | null = null;


const base = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : "/").replace(/\/$/, "");

function getJupiterImg(): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  if (!jupiterImg) {
    jupiterImg = new Image();
    jupiterImg.src = `${base}/images/celestial/jupiter_alpha.webp`;
  }
  return jupiterImg.complete && jupiterImg.naturalWidth > 0 ? jupiterImg : null;
}

function getSaturnImg(): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  if (!saturnImg) {
    saturnImg = new Image();
    saturnImg.src = `${base}/images/celestial/saturn_cassini_alpha.webp`;
  }
  return saturnImg.complete && saturnImg.naturalWidth > 0 ? saturnImg : null;
}

function getMarsImg(): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  if (!marsImg) {
    marsImg = new Image();
    marsImg.src = `${base}/images/celestial/mars_hubble_alpha.webp`;
  }
  return marsImg.complete && marsImg.naturalWidth > 0 ? marsImg : null;
}

export function renderJupiter(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  // Upscaled planetary radius
  const r = Math.max(40, 68 * scale);
  const img = getJupiterImg();

  if (img) {
    // Render authentic Cassini true-color planetary disk
    const size = r * 2.8;
    const h = (img.naturalHeight / img.naturalWidth) * size;
    ctx.drawImage(img, cx - size / 2, cy - h / 2, size, h);
  } else {
    // Mathematical procedural fallback
    const grad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.1, cx, cy, r);
    grad.addColorStop(0, "#f3ebdd");
    grad.addColorStop(0.5, "#d7be99");
    grad.addColorStop(0.85, "#a27a52");
    grad.addColorStop(1, "#180e06");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.clip();

    const bands = [
      { y: -0.7, h: 0.18, c: "rgba(164, 118, 82, 0.45)" },
      { y: -0.42, h: 0.22, c: "rgba(132, 85, 52, 0.6)" },
      { y: -0.1, h: 0.14, c: "rgba(230, 215, 190, 0.3)" },
      { y: 0.15, h: 0.25, c: "rgba(150, 95, 60, 0.65)" },
      { y: 0.55, h: 0.2, c: "rgba(160, 115, 80, 0.4)" }
    ];
    bands.forEach(b => {
      ctx.fillStyle = b.c;
      ctx.fillRect(cx - r, cy + b.y * r, r * 2, b.h * r);
    });

    const grsX = cx + r * 0.32;
    const grsY = cy + r * 0.26;
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, r * 0.24, r * 0.14, 0.08, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(195, 82, 54, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(140, 48, 30, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  // 4 Galilean Moons (Io, Europa, Ganymede, Callisto)
  const moons = [
    { name: "Io", dist: -r * 1.8, size: 2.6, color: "#fff0a0" },
    { name: "Europa", dist: -r * 1.3, size: 2.2, color: "#ffffff" },
    { name: "Ganymede", dist: r * 1.5, size: 3.2, color: "#d8dce2" },
    { name: "Callisto", dist: r * 2.3, size: 2.8, color: "#9ca5b2" }
  ];

  moons.forEach(m => {
    const mx = cx + m.dist;
    const my = cy + m.dist * 0.08;
    ctx.beginPath();
    ctx.arc(mx, my, m.size, 0, Math.PI * 2);
    ctx.fillStyle = m.color;
    ctx.fill();

    ctx.font = '8px "Space Mono", monospace';
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.fillText(m.name, mx - 8, my + 11);
  });
}

export function renderSaturn(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  // Upscaled planetary radius
  const r = Math.max(32, 54 * scale);
  const img = getSaturnImg();

  if (img) {
    // Render authentic Cassini natural color ringed globe
    const size = r * 6.5;
    const h = (img.naturalHeight / img.naturalWidth) * size;
    ctx.drawImage(img, cx - size / 2, cy - h / 2, size, h);
  } else {
    // Procedural fallback
    const ringTilt = 0.28;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 2.6, r * 0.8, ringTilt, Math.PI, Math.PI * 2);
    ctx.strokeStyle = "rgba(215, 195, 150, 0.55)";
    ctx.lineWidth = r * 0.55;
    ctx.stroke();
    ctx.restore();

    const grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r);
    grad.addColorStop(0, "#faeec8");
    grad.addColorStop(0.6, "#e4ce98");
    grad.addColorStop(0.9, "#ab925c");
    grad.addColorStop(1, "#181206");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 2.6, r * 0.8, ringTilt, 0, Math.PI);
    ctx.strokeStyle = "rgba(230, 210, 165, 0.85)";
    ctx.lineWidth = r * 0.55;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 2.6, r * 0.8, ringTilt, 0, Math.PI);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  // Titan Moon
  const titanX = cx + r * 3.8;
  const titanY = cy - r * 0.9;
  ctx.beginPath();
  ctx.arc(titanX, titanY, 3.0, 0, Math.PI * 2);
  ctx.fillStyle = "#ffcc66";
  ctx.fill();
  ctx.font = '8px "Space Mono", monospace';
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.fillText("Titan", titanX + 6, titanY + 3);
}

export function renderMars(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  // Upscaled planetary radius
  const r = Math.max(26, 46 * scale);
  const img = getMarsImg();

  if (img) {
    // Render authentic Hubble true-color Martian globe
    const size = r * 2.6;
    const h = (img.naturalHeight / img.naturalWidth) * size;
    ctx.drawImage(img, cx - size / 2, cy - h / 2, size, h);
  } else {
    // Procedural fallback
    const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    grad.addColorStop(0, "#f08558");
    grad.addColorStop(0.6, "#d15632");
    grad.addColorStop(0.85, "#8a2b16");
    grad.addColorStop(1, "#150604");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.clip();

    ctx.beginPath();
    ctx.ellipse(cx + r * 0.15, cy + r * 0.1, r * 0.45, r * 0.32, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(65, 30, 20, 0.55)";
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx - r * 0.05, cy - r * 0.78, r * 0.35, r * 0.14, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
  }
}
