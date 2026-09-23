// Pure math and rendering pipeline for Cosmic Star Alignment into WhatsApp QR Code
// Separation of concerns: Zero DOM manipulation, purely operates on CanvasRenderingContext2D

import { WHATSAPP_QR_SIZE, WHATSAPP_QR_POINTS } from "../../data/whatsappQR";

export interface StarParticle {
  x: number;
  y: number;
  z: number;
  speedMul: number;
  baseSize?: number;
  size?: number;
  alpha: number;
  color: string;
}

export interface QRStarAssignment {
  starIndex: number;
  qrRow: number;
  qrCol: number;
  delay: number;
}

// Generate static assignments from stars to QR modules
export function createQRAssignments(starCount: number): QRStarAssignment[] {
  const assignments: QRStarAssignment[] = [];
  const totalModules = WHATSAPP_QR_POINTS.length;

  for (let i = 0; i < totalModules && i < starCount; i++) {
    assignments.push({
      starIndex: i,
      qrRow: WHATSAPP_QR_POINTS[i][0],
      qrCol: WHATSAPP_QR_POINTS[i][1],
      delay: (i / totalModules) * 0.22,
    });
  }
  return assignments;
}

function easeOutCubic(t: number): number {
  return --t * t * t + 1;
}

export interface RenderAlignmentOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  alignmentProgress: number; // 0.0 -> 1.0
  stars: StarParticle[];
  assignments: QRStarAssignment[];
  fov: number;
  useStarlightPlate?: boolean;
  time?: number;
}

export function renderStarAlignment(options: RenderAlignmentOptions) {
  const { ctx, width, height, alignmentProgress, stars, assignments, fov, useStarlightPlate = false, time = 0 } = options;
  if (alignmentProgress <= 0.001) return;

  const cx = width * 0.5;
  const cy = height * 0.5;

  // Dynamically compute optimal QR grid bounds (constrained to viewport)
  const maxGridDim = Math.min(width * 0.82, height * 0.48, 300);
  const moduleSize = Math.floor(maxGridDim / WHATSAPP_QR_SIZE);
  const gridTotalWidth = WHATSAPP_QR_SIZE * moduleSize;
  const qrLeft = Math.floor(cx - gridTotalWidth / 2);
  const qrTop = Math.floor(cy - gridTotalWidth / 2);

  // 1. Rotating Grand Galactic Accretion Disk Nebula (Active in Celestial Stars Mode)
  if (alignmentProgress > 0.25 && !useStarlightPlate) {
    const nebAlpha = Math.min(0.85, (alignmentProgress - 0.25) / 0.75);
    ctx.save();
    ctx.globalAlpha = nebAlpha;
    ctx.translate(cx, cy);
    ctx.rotate(time * 0.08);

    const nebGrad1 = ctx.createRadialGradient(0, 0, 10, 0, 0, gridTotalWidth * 0.95);
    nebGrad1.addColorStop(0, "rgba(37, 211, 102, 0.12)");
    nebGrad1.addColorStop(0.35, "rgba(6, 182, 212, 0.08)");
    nebGrad1.addColorStop(0.7, "rgba(56, 189, 248, 0.03)");
    nebGrad1.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.ellipse(0, 0, gridTotalWidth * 1.0, gridTotalWidth * 0.58, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = nebGrad1;
    ctx.fill();

    ctx.rotate(Math.PI * 0.5);
    const nebGrad2 = ctx.createRadialGradient(0, 0, 20, 0, 0, gridTotalWidth * 0.75);
    nebGrad2.addColorStop(0, "rgba(251, 191, 36, 0.09)");
    nebGrad2.addColorStop(0.4, "rgba(56, 189, 248, 0.05)");
    nebGrad2.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.ellipse(0, 0, gridTotalWidth * 0.8, gridTotalWidth * 0.48, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = nebGrad2;
    ctx.fill();
    ctx.restore();
  }

  // 2. Subtle Constellation Framing Grid (Active in Celestial Stars Mode)
  if (alignmentProgress > 0.4 && !useStarlightPlate) {
    const frameAlpha = Math.min(0.32, (alignmentProgress - 0.4) * 0.6);
    ctx.save();
    ctx.globalAlpha = frameAlpha;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(qrLeft - 8, qrTop - 8, gridTotalWidth + 16, gridTotalWidth + 16);

    const eyeSize = 7 * moduleSize;
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(37, 211, 102, 0.5)";
    ctx.strokeRect(qrLeft - 2, qrTop - 2, eyeSize + 4, eyeSize + 4);
    ctx.strokeRect(qrLeft + (WHATSAPP_QR_SIZE - 7) * moduleSize - 2, qrTop - 2, eyeSize + 4, eyeSize + 4);
    ctx.strokeRect(qrLeft - 2, qrTop + (WHATSAPP_QR_SIZE - 7) * moduleSize - 2, eyeSize + 4, eyeSize + 4);
    ctx.restore();
  }

  // 3. High-Contrast Starlight Backing Plate (ONLY when enabled)
  if (alignmentProgress > 0.15 && useStarlightPlate) {
    const platePadding = moduleSize * 4; // ISO/IEC Quiet Zone
    const plateAlpha = Math.min(1, Math.max(0, (alignmentProgress - 0.2) / 0.8));

    ctx.save();
    ctx.globalAlpha = plateAlpha;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    const px = qrLeft - platePadding;
    const py = qrTop - platePadding;
    const pw = gridTotalWidth + platePadding * 2;
    const ph = gridTotalWidth + platePadding * 2;
    ctx.roundRect(px, py, pw, ph, 14);
    ctx.fill();
    ctx.restore();
  }

  // 2. Animate and Render Assigned QR Stars
  for (let i = 0; i < assignments.length; i++) {
    const assign = assignments[i];
    const s = stars[assign.starIndex];
    if (!s) continue;

    const driftSx = cx + (s.x / s.z) * fov;
    const driftSy = cy + (s.y / s.z) * fov;
    const driftScale = fov / s.z;

    const localProgress = Math.max(0, Math.min(1, (alignmentProgress - assign.delay) / (1 - assign.delay)));
    const ease = easeOutCubic(localProgress);

    // Identify finder patterns: 7x7 corners must stay anchored
    const isFinder = (
      (assign.qrRow <= 7 && assign.qrCol <= 7) ||
      (assign.qrRow <= 7 && assign.qrCol >= 25) ||
      (assign.qrRow >= 25 && assign.qrCol <= 7)
    );

    let ox = 0;
    let oy = 0;
    let lumPulse = 1.0;

    if (!isFinder && ease > 0.6) {
      const swirlStrength = (ease - 0.6) / 0.4;
      const orbitR = Math.min(1.65, moduleSize * 0.22) * swirlStrength;
      const dRow = assign.qrRow - 16;
      const dCol = assign.qrCol - 16;
      const distFromCenter = Math.hypot(dCol, dRow);
      const angleFromCenter = Math.atan2(dRow, dCol);
      const spiralPhase = 3.0 * angleFromCenter - 0.42 * distFromCenter;
      const orbitAngle = time * 3.2 + spiralPhase;
      ox = Math.cos(orbitAngle) * orbitR;
      oy = Math.sin(orbitAngle) * orbitR;
      lumPulse = 0.76 + 0.24 * Math.sin(time * 3.6 - distFromCenter * 0.42 + 3 * angleFromCenter);
    } else if (isFinder && ease > 0.6) {
      lumPulse = 0.90 + 0.10 * Math.sin(time * 4.2 + (assign.qrRow + assign.qrCol) * 0.4);
    }

    const baseTargetX = qrLeft + (assign.qrCol + 0.5) * moduleSize;
    const baseTargetY = qrTop + (assign.qrRow + 0.5) * moduleSize;
    const targetX = baseTargetX + ox;
    const targetY = baseTargetY + oy;

    const curX = driftSx + (targetX - driftSx) * ease;
    const curY = driftSy + (targetY - driftSy) * ease;

    if (ease > 0.88 && useStarlightPlate) {
      // High-Contrast Mode: Solid black module
      const pixelSize = moduleSize + 0.6;
      ctx.fillStyle = "#000000";
      ctx.fillRect(
        Math.floor(curX - moduleSize / 2),
        Math.floor(curY - moduleSize / 2),
        Math.ceil(pixelSize),
        Math.ceil(pixelSize)
      );
    } else {
      const initialRadius = (s.baseSize ?? s.size ?? 1.2) * driftScale;
      const starRadius = Math.max(1.2, (moduleSize * 0.44) * ease + initialRadius * (1 - ease));
      ctx.beginPath();
      ctx.arc(curX, curY, starRadius, 0, Math.PI * 2);
      ctx.fillStyle = s.color || "#ffffff";
      ctx.globalAlpha = lumPulse;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Soft corona without shadowBlur
      if (ease > 0.8) {
        ctx.beginPath();
        ctx.arc(curX, curY, starRadius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color === "#fbbf24" ? "rgba(251, 191, 36, 0.22)" : "rgba(56, 189, 248, 0.25)";
        ctx.fill();
      }

      // Micro-spin tail inside QR constellation
      if (ease > 0.85 && !isFinder) {
        const dRow = assign.qrRow - 16;
        const dCol = assign.qrCol - 16;
        const distFromCenter = Math.hypot(dCol, dRow);
        const angleFromCenter = Math.atan2(dRow, dCol);
        const spiralPhase = 3.0 * angleFromCenter - 0.42 * distFromCenter;
        const microTailAngle = (time * 3.2 + spiralPhase) - 0.45;
        const tx = curX - Math.cos(microTailAngle) * (Math.min(1.65, moduleSize * 0.22) * 0.9);
        const ty = curY - Math.sin(microTailAngle) * (Math.min(1.65, moduleSize * 0.22) * 0.9);
        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = s.color === "#fbbf24" ? "rgba(251, 191, 36, 0.35)" : "rgba(56, 189, 248, 0.38)";
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // Flight trail
      if (ease > 0.05 && ease < 0.85) {
        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(curX - (targetX - driftSx) * 0.035, curY - (targetY - driftSy) * 0.035);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
    }
  }

  // 3. Central WhatsApp Emblem Badge
  if (alignmentProgress > 0.5) {
    const logoAlpha = Math.min(1, Math.max(0, (alignmentProgress - 0.5) / 0.5));
    const badgeRadius = moduleSize * 2.8;

    ctx.save();
    ctx.globalAlpha = logoAlpha;
    ctx.translate(cx, cy);

    // Soft accretion aura
    const auraRadius = badgeRadius * (1.25 + 0.15 * Math.sin(time * 3.5));
    const auraGrad = ctx.createRadialGradient(0, 0, badgeRadius * 0.8, 0, 0, auraRadius);
    auraGrad.addColorStop(0, "rgba(37, 211, 102, 0.45)");
    auraGrad.addColorStop(0.6, "rgba(56, 189, 248, 0.2)");
    auraGrad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
    ctx.fillStyle = auraGrad;
    ctx.fill();

    // Rim backing
    ctx.beginPath();
    ctx.arc(0, 0, badgeRadius, 0, Math.PI * 2);
    ctx.fillStyle = useStarlightPlate ? "#ffffff" : "#030712";
    ctx.fill();

    // WhatsApp Emerald Green Disk
    ctx.beginPath();
    ctx.arc(0, 0, badgeRadius - 2, 0, Math.PI * 2);
    ctx.fillStyle = "#25d366";
    ctx.fill();

    // White Handset Symbol
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.round(badgeRadius * 0.85)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✆", 0, 1);

    ctx.restore();
  }
}
