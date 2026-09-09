# Telescope Finder & Optical Alignment — Technical Reference

---

## 1. Real-World Telescope Finder Optics

When observing through an astronomical telescope (like the club's 8" Dobsonian), celestial targets cannot be found directly through the high-magnification eyepiece because the field of view (FOV) is too tiny (often less than $0.5^\circ$, smaller than the full moon). Astronomers use a two-stage or three-stage optical setup:

| Optical Stage | Typical Spec | Field of View (FOV) | Purpose |
| :--- | :--- | :--- | :--- |
| **1. Naked Eye / Red Dot (Telrad)** | $1\times$ (no magnification) | $180^\circ$ | Broad orientation; aligns the telescope in the general constellation direction using illuminated concentric rings ($0.5^\circ, 2^\circ, 4^\circ$). |
| **2. Finderscope** | $6\times30$ to $9\times50$ (or $\sim 20\times$ low-power widefield) | $5^\circ - 7^\circ$ (Wide) | Features illuminated crosshairs. Reveals stars down to magnitude 9 (invisible to naked eye) for precise "star hopping". |
| **3. Main Eyepiece** | $40\times - 200\times$ (e.g., 25mm to 6mm plössl) | $0.3^\circ - 0.8^\circ$ (Narrow) | Deep detail inspection: spiral arms of Andromeda (M31), lunar craters, Saturn's rings, and double stars (Mizar/Alcor). |

---

## 2. Target 1: The Big Dipper (Ursa Major) — Pointer to Polaris

```
                     (Alkaid)
                      *
                       \
                        * (Mizar & Alcor)
                         \
                          * (Alioth)
                           \
                (Megrez) *---* (Dubhe) ---------> [ Polaris / North Star ]
                         |   |                      (Pointer stars: Merak -> Dubhe)
                (Phecda) *---* (Merak)
```

- **Coordinates**: RA $11\text{h} \, 00\text{m}$, Dec $+55^\circ$
- **Star Hopping Rule**: The two outer bowl stars (**Merak** and **Dubhe**) are the "Pointer Stars". Drawing an imaginary line from Merak through Dubhe and extending it $5\times$ leads straight to **Polaris** (the North Star).
- **Match to Reference**: Identical to the geometry in `reference.jpg`.

---

## 3. Target 2: Andromeda Galaxy (Messier 31 / NGC 224)

- **Distance**: $2.537\text{ million light-years}$
- **Type**: SA(s)b barred spiral galaxy, tilted at $\sim 77^\circ$ inclination to our line of sight (producing the classic elongated cosmic ellipse).
- **Visual Appearance**:
  - **In 20x Finder**: A misty oval cloud with an intense, bright core.
  - **In High Power Main Scope**: Oval disc stretching $3^\circ$ across the sky, prominent bright galactic bulge, dark dust lanes, and companion dwarf galaxies **M32** and **M110**.
- **Star Hopping from the Dipper**:
  Follow the arc of the Dipper's handle to Arcturus, locate the Great Square of Pegasus, jump to $\beta$ Andromedae (Mirach), take two steps northward past $\mu$ Andromedae to find M31.

---

## 4. Telescope Finder Game Mechanics (Concept)

```mermaid
graph LR
    A[Step 1: 1x Sky View] -->|Locate Constellation Guide Stars| B[Step 2: 20x Finder Crosshairs]
    B -->|Center Target with Directional Adjustment| C[Step 3: Toggle High-Power Eyepiece]
    C -->|Focus Ring & Magnification| D[Target Unlocked: Andromeda Core / Mizar Double Star]
```

1. **Phase 1 (Wide Sky Search)**: Player maneuvers the telescope crosshairs across the starry sphere looking for anchor constellations.
2. **Phase 2 (20x Finder Alignment)**: Switching to the 20x finder reveals fainter guide stars and the crosshair reticle. Player centers the fuzzy DSO (Deep Sky Object) nebula/galaxy.
3. **Phase 3 (High-Power Eyepiece)**: Player snaps into the main telescope lens, sharpens the focus dial, and reveals high-resolution spiral arms and dust lanes.
