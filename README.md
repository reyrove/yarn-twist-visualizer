# Yarn Twist Visualizer

A parameterized geometric model of yarn twist. TPI, yarn count (Ne),
and twist direction drive the rendered fiber structure in real time.
Twist angle and helix pitch are computed from the inputs. Two
rendering modes — zigzag approximation and true helix — can be
compared side by side, and either can be placed beside a photograph
of real yarn at the same parameters.

**Live:** https://reyrove.github.io/yarn-twist-visualizer

---

## What is modeled

Three textile parameters are encoded and rendered:

| Parameter | Range | Role |
|-----------|-------|------|
| **TPI** (twists per inch) | 1–30 | Number of visible turns along the rendered yarn length, capped at 20 for legibility |
| **Yarn count (Ne)** | 1–40 | Linear density; diameter scales approximately with its inverse square root |
| **Twist direction** | S / Z | Flips the handedness of the rendering (lateral offset in zigzag mode; helix handedness in helix mode) |

Two derived quantities are computed and displayed:

- **Twist angle** θ = atan(π · d · TPI), where d = 2 · radius
- **Helix pitch** = 400 / turns (model units per turn)

---

## Model & assumptions

The visualizer is a *parametric model*, not a physical simulator.
Its goal is to make the relationship between twist parameters and
visible yarn structure explorable, and to allow the model to be
compared directly against photographed yarn.

### Radius

The default radius uses the physically-motivated form:

```
radius = k / √count
```

where `k = 30` is a display constant chosen so the yarn is visible
at default parameters. Diameter of a yarn scales approximately with
the inverse square root of linear density, so this form matches
textile engineering intuition.

A checkbox switches to the simpler linear form `radius = k / count`.
The linear form is **not** physically motivated; it is kept only so
the two forms can be compared visually, and so that any visual
disagreement between them can be documented.

### Two rendering modes

**Zigzag approximation** — the original renderer. Alternate segments
are offset left and right, producing a zigzag. It reads as twist at
a glance but does not follow the computed twist angle.

**True helix** — a genuine helical path whose amplitude and pitch
are driven by the computed twist angle. This mode follows the
model's own mathematics; it is the mode to compare against
photographed yarn.

### Twist angle

For a helix:

```
tan θ = π · d · TPI
```

where `d` is yarn diameter. In model units we treat `d = 2 · radius`.
The computed angle is shown live in the derived quantities readout.

### Known limitations

- The constant `k` in the radius formula is a display constant, not
  a measured physical quantity.
- Fiber count is fixed at 5. Real yarns have far more fibers; the
  relationship between fiber count and visible texture is not modeled.
- The model renders a single yarn segment in isolation. It does not
  model fabric, crimp, or inter-yarn interaction.
- The zigzag mode, as noted above, does not follow the computed
  twist angle; it is an illustrative approximation.

---

## How to compare against reality

The reference photograph panel allows the model to be checked
against photographed yarn at the same parameters:

1. Photograph real yarn of known Ne and TPI against a neutral
   background, with a scale reference.
2. Set the model to the same Ne and TPI, and switch to **true
   helix** mode.
3. Upload the photograph using the reference panel.
4. Note where the model's silhouette diverges — twist angle, fiber
   count, packing density.

This comparison is the point at which the model becomes testable.
The divergence between the rendering and the photograph is the
first result of the artifact.

---

## Features

- Real-time parameter-driven rendering
- Two rendering modes: zigzag approximation and true helix
- Physically-grounded radius with optional linear-form comparison
- Computed twist angle and helix pitch, shown live
- **Reference photograph panel** for comparison against real yarn
- **Export parameters as JSON** — inputs, constants, derived values, rendering mode, notes
- **Export PNG** of the current visualization (filename carries TPI, Ne, and mode)
- Zoom (scroll, 0.5×–3×) and pan (drag)
- Model & Assumptions panel in the page, expandable
- Responsive layout

---

## Technologies

HTML5 · CSS3 · JavaScript · SVG

---

## File structure

```
yarn-twist-visualizer/
├── index.html
├── style.css
├── script.js
├── README.md
├── LICENSE
└── .gitignore
```

---

## Usage

1. Open `index.html` in any modern browser.
2. Adjust TPI and yarn count; switch S/Z twist; pick a color.
3. Choose rendering mode — **zigzag** or **true helix**.
4. Toggle the physically-grounded radius on/off to compare.
5. Read computed twist angle and helix pitch in the derived
   quantities panel.
6. Upload a reference photograph of real yarn at the same Ne and TPI
   to compare against.
7. **Export parameters (JSON)** for systematic comparison across
   parameter settings.
8. **Export PNG** to save the current visualization.
9. Scroll to zoom, drag to pan.
10. Open the **Model & Assumptions** panel for the full statement of
    what is and isn't modeled.

---

## JSON export format

```json
{
  "project": "Yarn Twist Visualizer",
  "author": "Reyhaneh Daneshdoost (Reyrove)",
  "generated_at": "2026-05-31T12:34:56.789Z",
  "inputs": {
    "tpi": 10,
    "yarn_count_ne": 20,
    "twist_direction": "S",
    "yarn_color": "#d4b483",
    "render_mode": "helix",
    "radius_model": "physical (k/sqrt(count))"
  },
  "constants": {
    "radius_k": 30,
    "max_turns": 20,
    "num_fibers": 5,
    "svg_size": 400,
    "fiber_offset": 2.0
  },
  "derived": {
    "turns_rendered": 10,
    "spacing_per_half_turn": 20.0,
    "radius": 6.708,
    "twist_angle_deg": 89.73,
    "helix_pitch": 40.0
  },
  "notes": {
    "zigzag": "zigzag approximation of a helix; does not follow the computed twist angle",
    "helix":  "true helical path; amplitude and pitch driven by the computed twist angle",
    "radius_formula_physical": "radius = k / sqrt(count)",
    "radius_formula_linear":   "radius = k / count (reference only)",
    "twist_angle_formula":     "theta = atan(pi * 2 * radius * tpi)"
  }
}
```

The JSON export records the rendering mode, so exports from zigzag
and helix runs are distinguishable — which is what makes them
usable as data rather than as images.

---

## Browser support

Chrome · Firefox · Safari · Edge

---

## License

MIT — see `LICENSE`.

---

## Author

Reyhaneh Daneshdoost (Reyrove)

*Part of the RESEARCH & SYSTEMS collection at
[reyrove.github.io](https://reyrove.github.io/).*