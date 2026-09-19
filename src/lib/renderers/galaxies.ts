// Procedural Particle Galaxy Renderers (Andromeda M31, Whirlpool M51 & NGC 5195)
import { galaxyTiltX, galaxyTiltY } from "../../data/mysteryTargets";

export type Project3DFn = (
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number
) => { sx: number; sy: number; scale: number; depth: number } | null;

export function renderAndromeda(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  particles: any[],
  mouseX: number,
  mouseY: number,
  isHighZoom: boolean,
  project3D: Project3DFn
) {
  if (particles.length === 0) return;
  const baseX = particles[0].baseX ?? -620;
  const baseY = particles[0].baseY ?? -80;
  const baseZ = particles[0].baseZ ?? 950;

  const m31Center = project3D(baseX, baseY, baseZ, cx, cy);
  if (!m31Center) return;

  const mDist = Math.hypot(mouseX - m31Center.sx, mouseY - m31Center.sy);
  const mouseGravFactor = Math.max(0, 1 - mDist / 400);
  const reactiveSpeedBoost = 1 + mouseGravFactor * 3.5;

  const coreRadius = (isHighZoom ? 110 : 70) * m31Center.scale;
  const coreGrad = ctx.createRadialGradient(
    m31Center.sx,
    m31Center.sy,
    0,
    m31Center.sx,
    m31Center.sy,
    coreRadius
  );
  coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
  coreGrad.addColorStop(0.2, "rgba(235, 245, 255, 0.55)");
  coreGrad.addColorStop(0.6, "rgba(180, 210, 255, 0.15)");
  coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.beginPath();
  ctx.arc(m31Center.sx, m31Center.sy, coreRadius, 0, Math.PI * 2);
  ctx.fillStyle = coreGrad;
  ctx.fill();

  const cosTX = Math.cos(galaxyTiltX);
  const sinTX = Math.sin(galaxyTiltX);
  const cosTY = Math.cos(galaxyTiltY);
  const sinTY = Math.sin(galaxyTiltY);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.angle += p.angularSpeed * reactiveSpeedBoost;

    let gx = Math.cos(p.angle) * p.radius * 1.9;
    let gy = Math.sin(p.angle) * p.radius * 0.65;
    let gz = p.thickness;

    if (mouseGravFactor > 0.05) {
      gx += (mouseX - m31Center.sx) * 0.08 * mouseGravFactor;
      gy += (mouseY - m31Center.sy) * 0.08 * mouseGravFactor;
    }

    const pBaseX = p.baseX ?? baseX;
    const pBaseY = p.baseY ?? baseY;
    const pBaseZ = p.baseZ ?? baseZ;

    const x3d = pBaseX + (gx * cosTY + gz * sinTY);
    const y3d = pBaseY + (gy * cosTX - (gx * sinTY - gz * cosTY) * sinTX);
    const z3d = pBaseZ + (gy * sinTX + (gx * sinTY - gz * cosTY) * cosTX);

    const proj = project3D(x3d, y3d, z3d, cx, cy);
    if (!proj) continue;

    ctx.beginPath();
    ctx.arc(proj.sx, proj.sy, Math.max(0.7, p.size * proj.scale), 0, Math.PI * 2);
    ctx.fillStyle = p.isCore ? "rgba(255, 255, 255, 0.9)" : `rgba(215, 232, 255, ${p.alpha})`;
    ctx.fill();
  }

  ctx.font = '10px "Space Mono", monospace';
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText(
    "M31 • Andromeda Galaxy",
    m31Center.sx + 45 * m31Center.scale,
    m31Center.sy - 25 * m31Center.scale
  );
}

export function renderWhirlpool(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  particles: any[],
  mouseX: number,
  mouseY: number,
  isHighZoom: boolean,
  project3D: Project3DFn,
  baseX: number,
  baseY: number,
  baseZ: number
) {
  const m51Center = project3D(baseX, baseY, baseZ, cx, cy);
  if (!m51Center) return;

  const mDist51 = Math.hypot(mouseX - m51Center.sx, mouseY - m51Center.sy);
  const mouseFactor51 = Math.max(0, 1 - mDist51 / 400);
  const speedBoost51 = 1 + mouseFactor51 * 3.0;

  // 1. Luminous Main Core (M51 / NGC 5194)
  const coreR51 = (isHighZoom ? 95 : 55) * m51Center.scale;
  const coreGrad51 = ctx.createRadialGradient(
    m51Center.sx,
    m51Center.sy,
    0,
    m51Center.sx,
    m51Center.sy,
    coreR51
  );
  coreGrad51.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  coreGrad51.addColorStop(0.22, "rgba(210, 235, 255, 0.65)");
  coreGrad51.addColorStop(0.6, "rgba(130, 175, 245, 0.2)");
  coreGrad51.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.beginPath();
  ctx.arc(m51Center.sx, m51Center.sy, coreR51, 0, Math.PI * 2);
  ctx.fillStyle = coreGrad51;
  ctx.fill();

  // 2. Companion Galaxy NGC 5195 Core
  const compProj = project3D(baseX + 68, baseY - 44, baseZ, cx, cy);
  if (compProj) {
    const compR = (isHighZoom ? 45 : 26) * compProj.scale;
    const compGrad = ctx.createRadialGradient(
      compProj.sx,
      compProj.sy,
      0,
      compProj.sx,
      compProj.sy,
      compR
    );
    compGrad.addColorStop(0, "rgba(255, 245, 215, 0.9)");
    compGrad.addColorStop(0.35, "rgba(255, 210, 140, 0.45)");
    compGrad.addColorStop(0.7, "rgba(210, 160, 90, 0.12)");
    compGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(compProj.sx, compProj.sy, compR, 0, Math.PI * 2);
    ctx.fillStyle = compGrad;
    ctx.fill();
  }

  // 3. Render Whirlpool Particles (Spiral arms, starburst knots, and tidal bridge)
  const tiltX = 18 * (Math.PI / 180);
  const tiltY = 12 * (Math.PI / 180);
  const cosTX = Math.cos(tiltX);
  const sinTX = Math.sin(tiltX);
  const cosTY = Math.cos(tiltY);
  const sinTY = Math.sin(tiltY);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.angle += p.angularSpeed * speedBoost51;

    let gx = p.isCompanion
      ? p.offsetX + Math.cos(p.angle) * p.radius
      : Math.cos(p.angle) * p.radius + p.offsetX;
    let gy = p.isCompanion
      ? p.offsetY + Math.sin(p.angle) * p.radius * 0.8
      : Math.sin(p.angle) * p.radius + p.offsetY;
    let gz = Math.sin(p.angle * 2) * 8;

    if (mouseFactor51 > 0.05) {
      gx += (mouseX - m51Center.sx) * 0.06 * mouseFactor51;
      gy += (mouseY - m51Center.sy) * 0.06 * mouseFactor51;
    }

    const pBaseX = p.baseX ?? baseX;
    const pBaseY = p.baseY ?? baseY;
    const pBaseZ = p.baseZ ?? baseZ;

    const x3d = pBaseX + (gx * cosTY + gz * sinTY);
    const y3d = pBaseY + (gy * cosTX - (gx * sinTY - gz * cosTY) * sinTX);
    const z3d = pBaseZ + (gy * sinTX + (gx * sinTY - gz * cosTY) * cosTX);

    const proj = project3D(x3d, y3d, z3d, cx, cy);
    if (!proj) continue;

    ctx.beginPath();
    ctx.arc(proj.sx, proj.sy, Math.max(0.65, p.size * proj.scale), 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  if (!isHighZoom) {
    ctx.font = '10px "Space Mono", monospace';
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText(
      "M51 • Whirlpool Galaxy & NGC 5195",
      m51Center.sx + 40 * m51Center.scale,
      m51Center.sy - 30 * m51Center.scale
    );
  }
}
