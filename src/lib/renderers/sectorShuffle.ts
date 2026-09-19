// Sector Position Randomizer for Celestial Targets across Observation Cones
import type { MysteryTarget } from "../../data/mysteryTargets";

// Observation cone bounds matching ±67.5° (135° total field of view)
// X bounds: -520 to +520
// Y bounds: -320 to +480
// Z depth:  870 to 980

const SECTORS = [
  { minX: -520, maxX: -240, minY: -300, maxY: -80 },   // Top-Left Sector
  { minX: 180,  maxX: 480,  minY: -320, maxY: -90 },   // Top-Right Sector
  { minX: -500, maxX: -200, minY: 120,  maxY: 420 },   // Bottom-Left Sector
  { minX: 200,  maxX: 520,  minY: 100,  maxY: 440 },   // Bottom-Right Sector
  { minX: -140, maxX: 140,  minY: -280, maxY: -60 },   // Upper-Central Sector
  { minX: -160, maxX: 160,  minY: 140,  maxY: 420 },   // Lower-Central Sector
  { minX: 280,  maxX: 520,  minY: -80,  maxY: 120 },   // Mid-Right Sector
  { minX: -520, maxX: -280, minY: -80,  maxY: 120 }    // Mid-Left Sector
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function randomizeSectorPositions(
  targets: MysteryTarget[],
  whirlpoolParticles?: any[],
  andromedaParticles?: any[]
) {
  const shuffledSectors = shuffleArray(SECTORS);

  targets.forEach((target, index) => {
    const sector = shuffledSectors[index % shuffledSectors.length];
    // Pick random spot inside the assigned sector
    target.x = Math.round(sector.minX + Math.random() * (sector.maxX - sector.minX));
    target.y = Math.round(sector.minY + Math.random() * (sector.maxY - sector.minY));
    target.z = Math.round(870 + Math.random() * 110);

    // If this is M51 Whirlpool, reposition its particle system to match
    if (target.type === "galaxy_m51" && whirlpoolParticles) {
      for (let i = 0; i < whirlpoolParticles.length; i++) {
        whirlpoolParticles[i].baseX = target.x;
        whirlpoolParticles[i].baseY = target.y;
        whirlpoolParticles[i].baseZ = target.z;
      }
    }
  });

  // Also randomize Andromeda M31 into an unused sector if available
  if (andromedaParticles && andromedaParticles.length > 0) {
    const andromedaSector = shuffledSectors[(targets.length) % shuffledSectors.length];
    const m31X = Math.round(andromedaSector.minX + Math.random() * (andromedaSector.maxX - andromedaSector.minX));
    const m31Y = Math.round(andromedaSector.minY + Math.random() * (andromedaSector.maxY - andromedaSector.minY));
    const m31Z = Math.round(880 + Math.random() * 100);

    for (let i = 0; i < andromedaParticles.length; i++) {
      andromedaParticles[i].baseX = m31X;
      andromedaParticles[i].baseY = m31Y;
      andromedaParticles[i].baseZ = m31Z;
    }
  }
}
