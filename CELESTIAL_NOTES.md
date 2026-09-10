# Celestial System Ledger & Roadmap (Ponytail Style)

> Minimal, verifiable log of working features, rejected complexity, and queued celestial additions.

---

## 1. What Works (Verified & Lean)

- **Pure Canvas 2D Engine**: Zero WebGL/Three.js dependencies. Fast perspective projection math (`project3D`) rendering 1,100 background stars, constellations, and deep-space objects at 60-120 FPS.
- **Dual-Mode Architecture** ([`src/components/TelescopeCockpit.astro`](src/components/TelescopeCockpit.astro)):
  - Homepage: Passive ambient background during reading mode (`mode="background"`). Press `[TAB]` or click "Stargaze Mode" to enter interactive cockpit without page reload.
  - Dedicated Lab: Direct full-screen interactive stargazing at `/telescope-lab`.
- **Keyboard & Touch Controls**:
  - `[1]`: 20x Wide-field Finder Mode (tactile animated keycap + LED).
  - `[2]`: 150x High Zoom Mode (resolves planetary discs, Cassini rings, and nebular spires).
  - `[R]`: Spawn new random celestial anomaly with keycap bounce.
  - `[H]`: Cycle 4 Finder Mission HUD layouts (Pill, Optical Reticle, Edge Ticker, Classic Card).
  - `[WASD] / Arrow Keys`: Telescope directional slewing.
  - `Mouse Drag / Touch`: Window-level panning with active pointer capture.
  - `Scroll Wheel`: Smooth field-of-view zooming (gated strictly to Stargaze Mode).
- **Procedural Deep-Sky Objects**:
  - **M51 Whirlpool Galaxy**: 1,200 particle dual-core grand-design spiral with tidal bridge to NGC 5195.
  - **M16 Pillars of Creation**: 3 gas dust columns with hydrogen-alpha and O-III gradient ionization glow.
  - **M42 Orion Nebula**: Trapezium cluster with cyan/magenta gaseous emission envelope.
  - **Planets**: Jupiter with Great Red Spot and 4 Galilean moons, Saturn with Cassini division rings, Mars with polar ice cap.
  - **Constellations**: Ursa Major (Big Dipper + Polaris line), Cassiopeia, Orion, Cygnus with telescopic binary splitting (Mizar/Alcor, Albireo A/B).
- **Hardened Dev & QA Pipeline**:
  - `astro.config.mjs` ignores `dist/`, `.astro/`, and test files in Vite's watcher, stopping multi-tab reload storms.
  - `package.json` dev script uses `--force` to prevent unhandled lockfile collisions on Astro line 157.
  - `npm test` (`test.mjs`): 9-point deep check (live dev server HTTP 200, lockfile validation, esbuild TS client syntax compilation, static routes, clean bloat audit).

---

## 2. What Didn't (The Complexity Cemetery)

- **Three.js & `@types/three`**: 1.2MB bundle weight, redundant WebGL context overhead, and fighting with Astro's DOM. *Replaced by native 2D Canvas math.*
- **Duplicate mini-canvas in News Highlights**: Rendered a second hidden starfield loop in the DOM. *Deleted.*
- **Unsolicited Audio & Custom Cursor (`AudioSynthesizer.astro`, `BlackHoleCursor.astro`)**: Created audio context policy warnings and cursor latency. *Deleted until dedicated sound design session.*
- **Floating Button Collisions**: Floating mode switcher button sat directly on top of cockpit header and anomaly spawner. *Docked into header and hidden during Stargaze Mode.*
- **Unignored Vite Watcher**: Default watcher tracked `dist/` and `.astro/`. Whenever tests ran or files built, Vite broadcast `{ type: "full-reload" }` over WebSocket to every connected browser tab simultaneously. *Fixed with `server.watch.ignored`.*
- **Toothless QA**: Previous tests only grepped static string output from `dist/`, missing runtime syntax crashes (`ReferenceError: isStargazeActive`) and dev server duplicate instance crashes (`cli/dev/index.js:157:13`). *Replaced with real compilation, lockfile, and HTTP probe tests.*

---

## 3. Queued Additions (Deploy once website baseline is smooth)

Add only when core site performance and navigation feel effortless:

### A. Galaxies
1. **M33 Triangulum Galaxy**:
   - Spiral arms with dense star-forming H II regions (NGC 604).
   - Low surface brightness contrast test for 20x finder.
2. **M104 Sombrero Galaxy**:
   - Pronounced dark absorption dust lane slicing across an elliptical bulbous core.

### B. Nebulae & Deep Space
1. **M57 Ring Nebula (Lyra)**:
   - Planetary nebula barrel/smoke ring with glowing central white dwarf.
2. **Carina Nebula (NGC 3372)**:
   - Cosmic cliffs, Keyhole nebula, and luminous blue variable Homunculus nebula around Eta Carinae.
3. **M1 Crab Nebula (Taurus)**:
   - Intricate pulsar shockwave filaments from historical 1054 CE supernova.

### C. Constellations & Asterisms
1. **Scorpius & Antares**:
   - Distinct fish-hook tail and pulsating red supergiant marker.
2. **Pleiades Cluster (M45 / Seven Sisters)**:
   - Clustered blue reflection nebulosity around Maia, Alcyone, and Electra.
