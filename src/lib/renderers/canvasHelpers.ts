// Canvas geometric utility helpers for celestial renderers

export function draw5PointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  fill: string
) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a1 = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x1 = cx + Math.cos(a1) * rOut;
    const y1 = cy + Math.sin(a1) * rOut;
    if (i === 0) ctx.moveTo(x1, y1);
    else ctx.lineTo(x1, y1);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}
