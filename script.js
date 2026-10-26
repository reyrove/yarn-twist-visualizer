/* =========================================================
   Yarn Twist Visualizer — script.js
   A parameterized geometric model of yarn twist.

   MODEL
   -----
   Inputs:
     tpi     — twists per inch        (1–30)
     count   — yarn count, Ne         (1–40)
     twist   — direction, S or Z
     color   — display color
     mode    — 'zigzag' | 'helix'
     physical — true → radius = k / √count
                false → radius = k / count

   Derived:
     turns   = min(20, floor(tpi))
     spacing = 400 / (turns * 2)      vertical step per half-turn
     radius  = physical ? k / √count : k / count
     θ       = atan(π · 2 · radius · tpi) · 180/π
     pitch   = 400 / turns

   Rendering:
     zigzag  — alternate half-turns offset left/right (approximation)
     helix   — true helical path, amplitude and pitch driven by θ

   See the Model & Assumptions panel in index.html.
   ========================================================= */

'use strict';

/* ---------- Elements ---------- */
const tpiInput       = document.getElementById('tpi');
const yarnCountInput = document.getElementById('yarnCount');
const twistTypeInput = document.getElementById('twistType');
const yarnColorInput = document.getElementById('yarnColor');
const renderModeInput = document.getElementById('renderMode');
const physicalToggle = document.getElementById('physicalRadius');

const svg        = document.getElementById('yarnSVG');
const tpiVal     = document.getElementById('tpiVal');
const countVal   = document.getElementById('countVal');
const twistInfo  = document.getElementById('twistInfo');
const modeLabel  = document.getElementById('modeLabel');
const divergenceNote = document.getElementById('divergenceNote');

const dRadius = document.getElementById('dRadius');
const dAngle  = document.getElementById('dAngle');
const dPitch  = document.getElementById('dPitch');
const dTurns  = document.getElementById('dTurns');

const exportPngBtn  = document.getElementById('exportPng');
const exportJsonBtn = document.getElementById('exportJson');

const photoInput       = document.getElementById('photoInput');
const refPhoto         = document.getElementById('refPhoto');
const photoPlaceholder = document.getElementById('photoPlaceholder');

/* ---------- Model constants ---------- */
const RADIUS_K     = 30;
const MAX_TURNS    = 20;
const NUM_FIBERS   = 5;
const SVG_SIZE     = 400;
const FIBER_OFFSET = 2.0;

/* ---------- Derivation ---------- */
function deriveModel(tpi, count, physical) {
  const turns   = Math.min(MAX_TURNS, Math.floor(tpi));
  const spacing = SVG_SIZE / (turns * 2);

  const radius = physical
    ? RADIUS_K / Math.sqrt(count)
    : RADIUS_K / count;

  const diameter = 2 * radius;
  const thetaRad = Math.atan(Math.PI * diameter * tpi);
  const thetaDeg = thetaRad * 180 / Math.PI;

  const pitch = SVG_SIZE / turns;

  return { turns, spacing, radius, thetaDeg, pitch };
}

/* ---------- Builders ---------- */
function buildZigzagPath(tpi, count, twist, radius, spacing, turns, offset) {
  const cx = SVG_SIZE / 2;
  let d = `M ${cx} 0 `;

  for (let i = 0; i < turns * 2; i++) {
    const isCurveRight = twist === 'S' ? i % 2 === 0 : i % 2 !== 0;
    const dx = isCurveRight ? radius : -radius;
    const x  = cx + dx + offset;
    const y  = spacing * (i + 1);
    const cy = y - spacing / 2;
    d += `Q ${cx} ${cy}, ${x} ${y} `;
  }
  return d;
}

function buildHelixPath(radius, spacing, turns, twist, offset) {
  // Helix in 2D projection: x = cx + A·sin(phase), y = step.
  // Amplitude A = radius; phase advances by π per half-turn.
  // Handedness flips for S vs Z.
  const cx = SVG_SIZE / 2;
  const A  = radius;
  const sign = twist === 'S' ? 1 : -1;
  const steps = turns * 2;          // half-turns
  const samples = steps * 12;       // fine sampling for smoothness

  let d = '';
  for (let s = 0; s <= samples; s++) {
    const t     = s / samples;                 // 0..1
    const phase = sign * t * Math.PI * steps;  // advances π per half-turn
    const x     = cx + A * Math.sin(phase) + offset;
    const y     = t * SVG_SIZE;
    d += (s === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)} ` : `L ${x.toFixed(2)} ${y.toFixed(2)} `);
  }
  return d;
}

/* ---------- Rendering ---------- */
function updateYarn() {
  const tpi      = parseFloat(tpiInput.value);
  const count    = parseFloat(yarnCountInput.value);
  const twist    = twistTypeInput.value;
  const color    = yarnColorInput.value;
  const mode     = renderModeInput.value;
  const physical = physicalToggle.checked;

  tpiVal.textContent   = tpi;
  countVal.textContent = count;
  modeLabel.textContent = mode === 'helix' ? 'true helix' : 'zigzag';

  const model = deriveModel(tpi, count, physical);

  svg.innerHTML = '';

  for (let f = 0; f < NUM_FIBERS; f++) {
    const fiberOffset = (f - NUM_FIBERS / 2) * FIBER_OFFSET;

    const d = mode === 'helix'
      ? buildHelixPath(model.radius, model.spacing, model.turns, twist, fiberOffset)
      : buildZigzagPath(tpi, count, twist, model.radius, model.spacing, model.turns, fiberOffset);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.3');
    path.setAttribute('stroke-opacity', '0.78');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
  }

  twistInfo.textContent =
    `${twist}-Twist · TPI ${tpi} · Ne ${count} · ` +
    `${physical ? 'physical' : 'linear'} radius · ${mode}`;

  dRadius.textContent = model.radius.toFixed(2);
  dAngle.textContent  = model.thetaDeg.toFixed(1) + '°';
  dPitch.textContent  = model.pitch.toFixed(1);
  dTurns.textContent  = model.turns;

  divergenceNote.textContent = mode === 'helix'
    ? 'True helix: the rendered path follows the computed twist angle. Compare against a photograph at the same Ne and TPI to check amplitude and packing density.'
    : 'Zigzag approximation: reads as twist at a glance, but does not follow the computed twist angle. Switch to true helix for comparison against photographed yarn.';
}

/* ---------- Export: PNG ---------- */
function exportPNG() {
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas  = document.createElement('canvas');
  canvas.width  = SVG_SIZE;
  canvas.height = SVG_SIZE;
  const ctx     = canvas.getContext('2d');

  const img = new Image();
  img.onload = function () {
    ctx.fillStyle = '#14120f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const link = document.createElement('a');
    const tpi   = tpiInput.value;
    const count = yarnCountInput.value;
    const mode  = renderModeInput.value;
    link.download = `yarn-twist_TPI${tpi}_Ne${count}_${mode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  img.src = 'data:image/svg+xml;base64,' +
            btoa(unescape(encodeURIComponent(svgData)));
}

/* ---------- Export: JSON ---------- */
function exportJSON() {
  const tpi      = parseFloat(tpiInput.value);
  const count    = parseFloat(yarnCountInput.value);
  const twist    = twistTypeInput.value;
  const color    = yarnColorInput.value;
  const mode     = renderModeInput.value;
  const physical = physicalToggle.checked;

  const model = deriveModel(tpi, count, physical);

  const record = {
    project: 'Yarn Twist Visualizer',
    author: 'Reyhaneh Daneshdoost (Reyrove)',
    generated_at: new Date().toISOString(),
    inputs: {
      tpi,
      yarn_count_ne: count,
      twist_direction: twist,
      yarn_color: color,
      render_mode: mode,
      radius_model: physical ? 'physical (k/sqrt(count))' : 'linear (k/count)'
    },
    constants: {
      radius_k: RADIUS_K,
      max_turns: MAX_TURNS,
      num_fibers: NUM_FIBERS,
      svg_size: SVG_SIZE,
      fiber_offset: FIBER_OFFSET
    },
    derived: {
      turns_rendered: model.turns,
      spacing_per_half_turn: parseFloat(model.spacing.toFixed(3)),
      radius: parseFloat(model.radius.toFixed(3)),
      twist_angle_deg: parseFloat(model.thetaDeg.toFixed(2)),
      helix_pitch: parseFloat(model.pitch.toFixed(3))
    },
    notes: {
      zigzag: 'zigzag approximation of a helix; does not follow the computed twist angle',
      helix:  'true helical path; amplitude and pitch driven by the computed twist angle',
      radius_formula_physical: 'radius = k / sqrt(count)',
      radius_formula_linear:   'radius = k / count (reference only)',
      twist_angle_formula:     'theta = atan(pi * 2 * radius * tpi)'
    }
  };

  const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `yarn-twist_TPI${tpi}_Ne${count}_${twist}_${mode}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/* ---------- Photo reference ---------- */
photoInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    refPhoto.src = ev.target.result;
    refPhoto.hidden = false;
    refPhoto.alt = 'Reference photograph of real yarn';
    photoPlaceholder.hidden = true;
  };
  reader.readAsDataURL(file);
});

/* ---------- Wire up ---------- */
[tpiInput, yarnCountInput, twistTypeInput, yarnColorInput, renderModeInput, physicalToggle]
  .forEach(el => el.addEventListener('input', updateYarn));

exportPngBtn.addEventListener('click', exportPNG);
exportJsonBtn.addEventListener('click', exportJSON);

updateYarn();

/* ---------- Zoom & pan ---------- */
let scale = 1, translateX = 0, translateY = 0;
let isDragging = false, startX, startY;

const wrapper = document.getElementById('svgWrapper');

wrapper.addEventListener('wheel', (e) => {
  e.preventDefault();
  scale += e.deltaY * -0.001;
  scale = Math.min(Math.max(0.5, scale), 3);
  updateTransform();
});

wrapper.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});

wrapper.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  updateTransform();
});

wrapper.addEventListener('mouseup', () => isDragging = false);
wrapper.addEventListener('mouseleave', () => isDragging = false);

function updateTransform() {
  svg.style.transform =
    `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
}