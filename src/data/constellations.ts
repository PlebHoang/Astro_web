export interface StarNode {
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
  size: number;
  color?: string;
  isBinary?: boolean;
  isPointer?: boolean;
  isPolaris?: boolean;
}

export interface Constellation {
  name: string;
  stars: StarNode[];
  lines: [number, number][];
  yaw: number;
  pitch: number;
}

export const ursaMajor: Constellation = {
  name: "Ursa Major (The Big Dipper)",
  yaw: 0,
  pitch: 0,
  stars: [
    { id: 'alkaid', name: "Alkaid", bayer: "η Ursae Majoris", dist: "103 ly", spec: "B3 V Blue Dwarf", mag: "+1.86", role: "Tip of Handle", desc: "Hot blue-white hydrogen-fusing star (17,000 K).", x: 190, y: -160, z: 920, size: 4.2 },
    { id: 'mizar', name: "Mizar & Alcor", bayer: "ζ Ursae Majoris", dist: "83 ly", spec: "A2 V + A1 V Binary", mag: "+2.23", role: "Ancient Vision Test Binary", desc: "Telescopic double! In 150x zoom, Mizar splits into Mizar A/B with Alcor beside it.", x: 110, y: -110, z: 860, size: 4.4, isBinary: true },
    { id: 'alioth', name: "Alioth", bayer: "ε Ursae Majoris", dist: "82.6 ly", spec: "A1p Magnetic Peculiar", mag: "+1.77", role: "Luminosity Leader", desc: "Brightest star in Ursa Major with an intense fluctuating magnetic field.", x: 60, y: -45, z: 850, size: 4.3 },
    { id: 'megrez', name: "Megrez", bayer: "δ Ursae Majoris", dist: "80.5 ly", spec: "A3 V Main Sequence", mag: "+3.31", role: "Bowl-Handle Junction", desc: "The junction star joining the handle to the quadrangle bowl.", x: 10, y: 35, z: 840, size: 3.5 },
    { id: 'dubhe', name: "Dubhe", bayer: "α Ursae Majoris", dist: "123 ly", spec: "K0 III Orange Giant", mag: "+1.79", role: "Polaris Pointer Star", desc: "30x larger than our Sun. Merak & Dubhe line points straight to Polaris.", x: -70, y: 25, z: 980, size: 4.6, isPointer: true },
    { id: 'merak', name: "Merak", bayer: "β Ursae Majoris", dist: "79.7 ly", spec: "A1 V White Star", mag: "+2.37", role: "Polaris Pointer Star", desc: "Surrounded by a circumstellar debris disc. Guides celestial navigation to the North Pole.", x: -80, y: 125, z: 830, size: 4.1, isPointer: true },
    { id: 'phecda', name: "Phecda", bayer: "γ Ursae Majoris", dist: "83.2 ly", spec: "A0 V Fast Rotator", mag: "+2.44", role: "Bottom Bowl Anchor", desc: "Rapidly rotating at 178 km/s with an equatorial gas envelope.", x: 0, y: 135, z: 850, size: 3.9 },
    { id: 'polaris', name: "Polaris", bayer: "α Ursae Minoris", dist: "433 ly", spec: "F7 Ib Supergiant", mag: "+1.98", role: "North Celestial Pole", desc: "Current North Star. Celestial pivot around which all northern constellations rotate.", x: -70, y: -290, z: 1200, size: 5.0, isPolaris: true }
  ],
  lines: [
    [0, 1], [1, 2], [2, 3],
    [3, 4], [4, 5], [5, 6], [6, 3],
    [5, 4], [4, 7]
  ]
};

export const cassiopeia: Constellation = {
  name: "Cassiopeia",
  yaw: -0.55,
  pitch: 0.38,
  stars: [
    { id: 'schedar', name: "Schedar", bayer: "α Cassiopeiae", dist: "228 ly", spec: "K0 IIIa Orange Giant", mag: "+2.24", role: "Bottom vertex of W", desc: "Luminous red-orange giant star 42x the Sun's radius.", x: -280, y: -580, z: 960, size: 4.4, color: "#ffc89b" },
    { id: 'caph', name: "Caph", bayer: "β Cassiopeiae", dist: "54.7 ly", spec: "F2 III Delta Scuti", mag: "+2.28", role: "Western tip of W", desc: "Yellow-white giant pulsating every 2.5 hours. Used as an astronomical right ascension clock.", x: -370, y: -520, z: 940, size: 4.2 },
    { id: 'navi', name: "Navi (Tsih)", bayer: "γ Cassiopeiae", dist: "550 ly", spec: "B0.5 IVe Variable", mag: "+2.15", role: "Center peak of W", desc: "Violent variable star spinning at 400 km/s. Nicknamed Navi by Apollo 1 astronaut Gus Grissom.", x: -260, y: -460, z: 990, size: 4.6, color: "#d8e8ff" },
    { id: 'ruchbah', name: "Ruchbah", bayer: "δ Cassiopeiae", dist: "99.4 ly", spec: "A5 V Eclipsing Binary", mag: "+2.68", role: "Eastern vertex of W", desc: "Algol-type eclipsing binary system with periodic dimming.", x: -170, y: -480, z: 950, size: 3.9 },
    { id: 'segin', name: "Segin", bayer: "ε Cassiopeiae", dist: "460 ly", spec: "B3 V Blue Giant", mag: "+3.35", role: "Eastern tip of W", desc: "Hot blue giant nearing the end of its core hydrogen-fusion stage.", x: -95, y: -510, z: 970, size: 3.6 }
  ],
  lines: [
    [1, 0], [0, 2], [2, 3], [3, 4]
  ]
};

export const orion: Constellation = {
  name: "Orion",
  yaw: 0.95,
  pitch: -0.45,
  stars: [
    { id: 'betelgeuse', name: "Betelgeuse", bayer: "α Orionis", dist: "642 ly", spec: "M1-M2 Ia-ab Red Supergiant", mag: "+0.50", role: "Eastern Shoulder", desc: "Gigantic pulsating red supergiant. If placed at our Sun, its surface would extend past Mars!", x: 670, y: 390, z: 890, size: 5.6, color: "#ff8c5a" },
    { id: 'bellatrix', name: "Bellatrix", bayer: "γ Orionis", dist: "250 ly", spec: "B2 III Blue Giant", mag: "+1.64", role: "Western Shoulder", desc: "Known as the Amazon Star. Luminous blue giant 6x Sun's mass.", x: 505, y: 350, z: 870, size: 4.4, color: "#d8ebff" },
    { id: 'alnitak', name: "Alnitak", bayer: "ζ Orionis", dist: "1,260 ly", spec: "O9.7 Ib Supergiant", mag: "+1.77", role: "Eastern Belt Star", desc: "Eastern star of Orion's Belt. Ionizes the famous Flame and Horsehead Nebulae.", x: 610, y: 485, z: 890, size: 4.2 },
    { id: 'alnilam', name: "Alnilam", bayer: "ε Orionis", dist: "2,000 ly", spec: "B0 Ia Blue Supergiant", mag: "+1.69", role: "Center Belt Star", desc: "Central belt jewel. 537,000x more luminous than our Sun!", x: 575, y: 475, z: 895, size: 4.3 },
    { id: 'mintaka', name: "Mintaka", bayer: "δ Orionis", dist: "1,200 ly", spec: "O9.5 II Multiple System", mag: "+2.23", role: "Western Belt Star", desc: "Western belt star located almost precisely on the celestial equator.", x: 540, y: 465, z: 900, size: 4.0 },
    { id: 'saiph', name: "Saiph", bayer: "κ Orionis", dist: "650 ly", spec: "B0.5 Ia Supergiant", mag: "+2.07", role: "Eastern Foot", desc: "Massive supergiant destined to explode as a core-collapse supernova.", x: 640, y: 620, z: 920, size: 4.1 },
    { id: 'rigel', name: "Rigel", bayer: "β Orionis", dist: "860 ly", spec: "B8 Ia Blue Supergiant", mag: "+0.13", role: "Western Foot", desc: "Brightest star in Orion. Shines with the brilliance of 120,000 Suns!", x: 460, y: 600, z: 940, size: 5.4, color: "#b8dcff" },
    { id: 'meissa', name: "Meissa", bayer: "λ Orionis", dist: "1,100 ly", spec: "O8 III Giant", mag: "+3.39", role: "Head of Orion", desc: "Hot O-type star at the center of the Lambda Orionis molecular ring.", x: 590, y: 295, z: 880, size: 3.5 }
  ],
  lines: [
    [7, 0], [7, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6], [0, 1]
  ]
};

export const cygnus: Constellation = {
  name: "Cygnus (The Northern Cross)",
  yaw: -0.92,
  pitch: -0.15,
  stars: [
    { id: 'deneb', name: "Deneb", bayer: "α Cygni", dist: "2,615 ly", spec: "A2 Ia White Supergiant", mag: "+1.25", role: "Head of Cross (Swan Tail)", desc: "Hyperluminous supergiant and anchor of the Summer Triangle. Over 196,000x solar luminosity.", x: -710, y: -340, z: 910, size: 4.9 },
    { id: 'sadr', name: "Sadr", bayer: "γ Cygni", dist: "1,800 ly", spec: "F8 Ib Supergiant", mag: "+2.23", role: "Intersection of Cross", desc: "Located at the chest of the Swan, enveloped in rich Milky Way star fields.", x: -620, y: -240, z: 890, size: 4.2 },
    { id: 'albireo', name: "Albireo", bayer: "β Cygni", dist: "430 ly", spec: "K3 II + B9.5 V Binary", mag: "+3.05", role: "Base of Cross (Swan Head)", desc: "Most famous color contrast double star in astronomy: golden topaz and sapphire blue!", x: -500, y: -110, z: 870, size: 4.0, isBinary: true, color: "#ffd28a" },
    { id: 'gienah', name: "Gienah", bayer: "ε Cygni", dist: "73 ly", spec: "K0 III Orange Giant", mag: "+2.48", role: "Eastern Wing", desc: "Cool giant with 11x solar radius. Name translates from Arabic as 'the Wing'.", x: -530, y: -310, z: 900, size: 3.9, color: "#ffc98a" },
    { id: 'deltacyg', name: "Delta Cygni", bayer: "δ Cygni", dist: "165 ly", spec: "B9.5 IV Triple System", mag: "+2.87", role: "Western Wing", desc: "Future North Star around the year 11,250 AD due to axial precession.", x: -720, y: -190, z: 880, size: 3.8 }
  ],
  lines: [
    [0, 1], [1, 2], [4, 1], [1, 3]
  ]
};

export const allConstellations: Constellation[] = [ursaMajor, cassiopeia, orion, cygnus];
