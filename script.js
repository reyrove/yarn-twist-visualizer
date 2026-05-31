const tpiInput = document.getElementById("tpi");
const yarnCountInput = document.getElementById("yarnCount");
const twistTypeInput = document.getElementById("twistType");
const yarnColorInput = document.getElementById("yarnColor");
const svg = document.getElementById("yarnSVG");
const twistInfo = document.getElementById("twistInfo");
const tpiVal = document.getElementById("tpiVal");
const countVal = document.getElementById("countVal");

function updateYarn() {
  const tpi = parseFloat(tpiInput.value);
  const count = parseFloat(yarnCountInput.value);
  const twist = twistTypeInput.value;
  const color = yarnColorInput.value;

  tpiVal.textContent = tpi;
  countVal.textContent = count;

  const turns = Math.min(20, Math.floor(tpi));
  const radius = 30 / count;
  const spacing = 300 / (turns * 2);

  svg.innerHTML = '';

  const numFibers = 5;
  for (let f = 0; f < numFibers; f++) {
    let d = `M 150 0 `;
    const fiberOffset = (f - numFibers / 2) * 1.5;

    for (let i = 0; i < turns * 2; i++) {
      const isCurveRight = twist === "S" ? i % 2 === 0 : i % 2 !== 0;
      const dx = isCurveRight ? radius : -radius;
      const x = 150 + dx + fiberOffset;
      const y = spacing * (i + 1);
      d += `Q 150 ${y - spacing / 2}, ${x} ${y} `;
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "1.2");
    path.setAttribute("stroke-opacity", "0.7");
    svg.appendChild(path);
  }

  twistInfo.textContent = `Visualizing ${twist}-Twist | TPI: ${tpi} | Count: Ne ${count}`;
}

function exportPNG() {
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  canvas.width = svg.width.baseVal.value;
  canvas.height = svg.height.baseVal.value;
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    const link = document.createElement("a");
    link.download = "yarn-visualizer.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
}

[tpiInput, yarnCountInput, twistTypeInput, yarnColorInput].forEach(input =>
  input.addEventListener("input", updateYarn)
);

updateYarn();

let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX, startY;

const wrapper = document.getElementById("svgWrapper");

wrapper.addEventListener("wheel", (e) => {
  e.preventDefault();
  scale += e.deltaY * -0.001;
  scale = Math.min(Math.max(0.5, scale), 3);
  updateTransform();
});

wrapper.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});

wrapper.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  updateTransform();
});

wrapper.addEventListener("mouseup", () => isDragging = false);
wrapper.addEventListener("mouseleave", () => isDragging = false);

function updateTransform() {
  svg.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
}