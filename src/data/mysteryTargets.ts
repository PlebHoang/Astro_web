export interface MysteryTarget {
  id: string;
  name: string;
  bayer: string;
  dist: string;
  spec: string;
  mag: string;
  role: string;
  desc: string;
  x: number;
  y: number;
  z: number;
  type: 'pillars_m16' | 'planet_jupiter' | 'planet_saturn' | 'planet_mars' | 'nebula_m42' | 'galaxy_m51';
  discovered: boolean;
  beaconColor: string;
  mission?: string;
}

export const initialMysteryTargets: MysteryTarget[] = [
  {
    id: 'target-pillars',
    name: "Pillars of Creation (M16)",
    bayer: "NGC 6611 • Eagle Nebula",
    dist: "6,500 ly",
    spec: "4-5 ly Spire Height",
    mag: "+6.00",
    role: "Elephant Trunk Nursery",
    desc: "Majestic spires of cold molecular hydrogen and dust bathed in ultraviolet radiation. In 150x zoom, you can see newborn protostars vaporizing the dark elephant trunks into deep space.",
    x: 360,
    y: -240,
    z: 960,
    type: 'pillars_m16',
    discovered: false,
    beaconColor: "#e6ad6a",
    mission: "JWST NIRCam • Infrared"
  },
  {
    id: 'target-jupiter',
    name: "Jupiter & 4 Galilean Moons",
    bayer: "Sol V • Gas Giant",
    dist: "628M km",
    spec: "142,984 km Dia.",
    mag: "-2.70",
    role: "King of the Planets",
    desc: "King of Planets! High zoom reveals swirling atmospheric belts, the Great Red Spot, and 4 orbiting moons: Io, Europa, Ganymede, and Callisto.",
    x: 420,
    y: 80,
    z: 910,
    type: 'planet_jupiter',
    discovered: false,
    beaconColor: "#f3ebdd",
    mission: "Cassini-Huygens • True Color"
  },
  {
    id: 'target-saturn',
    name: "Saturn & Majestic Ring System",
    bayer: "Sol VI • Ringed Gas Giant",
    dist: "1.4B km",
    spec: "120,536 km Dia.",
    mag: "+0.55",
    role: "Jewel of the Solar System",
    desc: "The Lord of the Rings! High zoom reveals the Cassini division gap, tilted golden rings, and major moon Titan.",
    x: -440,
    y: 180,
    z: 880,
    type: 'planet_saturn',
    discovered: false,
    beaconColor: "#faeec8",
    mission: "Cassini Orbiter • Equinox"
  },
  {
    id: 'target-mars',
    name: "Mars (The Red Planet)",
    bayer: "Sol IV • Terrestrial World",
    dist: "225M km",
    spec: "6,779 km Dia.",
    mag: "-1.50",
    role: "Target for Exploration",
    desc: "The Red Planet! High zoom reveals basaltic dark plains (Syrtis Major) and the brilliant white carbon-dioxide/water North Polar ice cap.",
    x: -210,
    y: 260,
    z: 930,
    type: 'planet_mars',
    discovered: false,
    beaconColor: "#ff734d",
    mission: "Hubble ACS • Opposition"
  },
  {
    id: 'target-m42',
    name: "Orion Nebula (Messier 42)",
    bayer: "NGC 1976 • Stellar Nursery",
    dist: "1,344 ly",
    spec: "24 ly across",
    mag: "+4.00",
    role: "Active Star Factory",
    desc: "Nearest massive star factory to Earth! High zoom reveals the glowing turquoise gas curtain illuminated by the brilliant Trapezium 4-star cluster.",
    x: 550,
    y: 535,
    z: 900,
    type: 'nebula_m42',
    discovered: false,
    beaconColor: "#7fe7ff",
    mission: "Hubble ACS • 2006 Mosaic"
  },
  {
    id: 'target-m51',
    name: "Whirlpool Galaxy (Messier 51)",
    bayer: "NGC 5194 • Interacting Spiral",
    dist: "23.5 Mly",
    spec: "76,000 ly across",
    mag: "+8.40",
    role: "Grand Design Spiral Pair",
    desc: "Majestic face-on grand-design spiral galaxy interacting with companion NGC 5195! Visible near the handle of the Big Dipper.",
    x: -380,
    y: 280,
    z: 920,
    type: 'galaxy_m51',
    discovered: false,
    beaconColor: "#a3c8ff",
    mission: "Hubble Space Telescope • Grand Design"
  }
];

export const galaxyTiltX = 35 * (Math.PI / 180);
export const galaxyTiltY = -25 * (Math.PI / 180);

export function createAndromedaParticles(count = 1500) {
  const particles: any[] = [];
  for (let i = 0; i < count; i++) {
    const armOffset = i % 2 === 0 ? 0 : Math.PI;
    const radius = Math.pow(Math.random(), 2.0) * 270 + 4;
    const baseAngle = radius * 0.038 + armOffset + (Math.random() - 0.5) * 0.4;
    const isCore = radius < 38;
    particles.push({
      radius,
      angle: baseAngle,
      angularSpeed: (0.8 / Math.sqrt(radius + 10)) * 0.012,
      thickness: (Math.random() - 0.5) * Math.max(4, 28 - radius * 0.08),
      isCore,
      size: isCore ? Math.random() * 2.2 + 1.2 : Math.random() * 1.5 + 0.6,
      alpha: isCore ? Math.random() * 0.75 + 0.25 : Math.random() * 0.45 + 0.15,
      baseX: -620,
      baseY: -80,
      baseZ: 950
    });
  }
  return particles;
}

export const m51BaseX = -380;
export const m51BaseY = 280;
export const m51BaseZ = 920;

export function createWhirlpoolParticles(count = 1200) {
  const particles: any[] = [];
  for (let i = 0; i < count; i++) {
    const isCompanion = i > 980;
    if (isCompanion) {
      const rComp = Math.pow(Math.random(), 1.5) * 55 + 2;
      const angComp = Math.random() * Math.PI * 2;
      particles.push({
        isCompanion: true,
        radius: rComp,
        angle: angComp,
        angularSpeed: 0.0035,
        isCore: rComp < 14,
        size: rComp < 14 ? Math.random() * 2.2 + 1.1 : Math.random() * 1.5 + 0.6,
        alpha: rComp < 14 ? Math.random() * 0.85 + 0.25 : Math.random() * 0.5 + 0.15,
        color: rComp < 14 ? "#fff5e0" : "#ffd493",
        offsetX: 68,
        offsetY: -44,
        baseX: m51BaseX,
        baseY: m51BaseY,
        baseZ: m51BaseZ
      });
    } else {
      const armOffset = i % 2 === 0 ? 0 : Math.PI;
      const radius = Math.pow(Math.random(), 1.7) * 210 + 3;
      const baseAngle = radius * 0.052 + armOffset + (Math.random() - 0.5) * 0.35;
      const isCore = radius < 28;
      const reachesCompanion = (i % 2 === 0) && radius > 140;
      particles.push({
        isCompanion: false,
        radius,
        angle: baseAngle,
        angularSpeed: (0.75 / Math.sqrt(radius + 8)) * 0.015,
        isCore,
        size: isCore ? Math.random() * 2.5 + 1.4 : Math.random() * 1.8 + 0.7,
        alpha: isCore ? Math.random() * 0.9 + 0.3 : Math.random() * 0.65 + 0.2,
        color: isCore ? "#ffffff" : reachesCompanion ? "#ffdca8" : (i % 5 === 0 ? "#7be5ff" : (i % 9 === 0 ? "#ff9ee2" : "#e4f2ff")),
        offsetX: reachesCompanion ? (radius - 140) * 0.45 : 0,
        offsetY: reachesCompanion ? -(radius - 140) * 0.32 : 0,
        baseX: m51BaseX,
        baseY: m51BaseY,
        baseZ: m51BaseZ
      });
    }
  }
  return particles;
}
