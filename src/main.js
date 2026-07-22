import './style.css';

const field = document.querySelector('.fibre-field');
const canvas = document.querySelector('.fibre-field__canvas');
const toggle = document.querySelector('.palette-toggle');
const context = canvas.getContext('2d', { alpha: true });

const palettes = [
  {
    name: 'Blue',
    core: [20, 113, 213],
    bright: [49, 145, 242],
    glow: [64, 163, 246],
  },
  {
    name: 'Violet',
    core: [101, 76, 220],
    bright: [143, 102, 246],
    glow: [159, 119, 255],
  },
  {
    name: 'Warm',
    core: [226, 112, 52],
    bright: [247, 151, 66],
    glow: [255, 174, 87],
  },
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointer = { x: 0, y: 0, active: false };
const size = { width: 0, height: 0, dpr: 1 };

let fibres = [];
let paletteIndex = 0;
let currentCore = [...palettes[0].core];
let currentBright = [...palettes[0].bright];
let animationFrame = 0;
let previousTime = 0;

function mulberry32(seed) {
  return function random() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function mix(from, to, amount) {
  return from + (to - from) * amount;
}

function rgba(rgb, alpha) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function buildFibres() {
  const random = mulberry32(84017);
  const density = Math.min(440, Math.max(250, Math.round(size.width * 0.43)));
  const originX = size.width * 0.5;
  const originY = size.height * 1.055;
  const baseLength = Math.min(size.width * 0.76, size.height * 0.84);

  fibres = Array.from({ length: density }, (_, index) => {
    const distribution = index / Math.max(1, density - 1);
    const spread = mix(-1, 1, distribution) + (random() - 0.5) * 0.035;
    const angle = spread * 1.28;
    const centreBias = 1 - Math.abs(spread);
    const length = baseLength * (0.5 + random() * 0.43) * (0.86 + centreBias * 0.21);
    const dx = Math.sin(angle) * length;
    const dy = -Math.cos(angle) * length;

    return {
      originX: originX + (random() - 0.5) * size.width * 0.025,
      originY: originY + random() * size.height * 0.025,
      endX: originX + dx,
      endY: originY + dy,
      opacity: 0.1 + random() * 0.37,
      width: 0.24 + random() * 0.48,
      nodeSize: 0.45 + random() * 1.05,
      phase: random() * Math.PI * 2,
      frequency: 0.25 + random() * 0.5,
      sway: 0.6 + random() * 2.2,
      bendX: 0,
      bendY: 0,
      velocityX: 0,
      velocityY: 0,
      polarity: random() > 0.42 ? 1 : -0.42,
    };
  });
}

function resize() {
  const bounds = field.getBoundingClientRect();
  size.width = Math.max(1, bounds.width);
  size.height = Math.max(1, bounds.height);
  size.dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(size.width * size.dpr);
  canvas.height = Math.round(size.height * size.dpr);
  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;
  context.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
  buildFibres();

  if (reducedMotion.matches) {
    draw(performance.now(), 1);
  }
}

function pointerInfluence(fibre) {
  if (!pointer.active || reducedMotion.matches) {
    return { x: 0, y: 0 };
  }

  const segmentX = fibre.endX - fibre.originX;
  const segmentY = fibre.endY - fibre.originY;
  const lengthSquared = segmentX * segmentX + segmentY * segmentY;
  const projection = Math.max(
    0.18,
    Math.min(
      1,
      ((pointer.x - fibre.originX) * segmentX + (pointer.y - fibre.originY) * segmentY) /
        lengthSquared,
    ),
  );
  const nearestX = fibre.originX + segmentX * projection;
  const nearestY = fibre.originY + segmentY * projection;
  const deltaX = nearestX - pointer.x;
  const deltaY = nearestY - pointer.y;
  const distance = Math.hypot(deltaX, deltaY);
  const radius = Math.min(220, Math.max(115, size.width * 0.16));

  if (distance >= radius) {
    return { x: 0, y: 0 };
  }

  const strength = (1 - distance / radius) ** 2 * 23 * fibre.polarity;
  const safeDistance = Math.max(distance, 12);

  return {
    x: (deltaX / safeDistance) * strength * projection,
    y: (deltaY / safeDistance) * strength * projection,
  };
}

function updateFibre(fibre, elapsed, delta) {
  const influence = pointerInfluence(fibre);
  const spring = 0.085 * delta;
  const damping = 0.78 ** delta;

  fibre.velocityX += (influence.x - fibre.bendX) * spring;
  fibre.velocityY += (influence.y - fibre.bendY) * spring;
  fibre.velocityX *= damping;
  fibre.velocityY *= damping;
  fibre.bendX += fibre.velocityX * delta;
  fibre.bendY += fibre.velocityY * delta;

  const drift = Math.sin(elapsed * 0.00055 * fibre.frequency + fibre.phase) * fibre.sway;

  return {
    x: fibre.bendX + drift,
    y: fibre.bendY + Math.cos(elapsed * 0.00038 + fibre.phase) * fibre.sway * 0.3,
  };
}

function draw(time, delta = 1) {
  const target = palettes[paletteIndex];
  const colourEase = 1 - 0.91 ** delta;

  currentCore = currentCore.map((value, index) => mix(value, target.core[index], colourEase));
  currentBright = currentBright.map((value, index) => mix(value, target.bright[index], colourEase));

  context.clearRect(0, 0, size.width, size.height);
  context.lineCap = 'round';
  context.globalCompositeOperation = 'source-over';

  for (const fibre of fibres) {
    const bend = updateFibre(fibre, time, delta);
    const endX = fibre.endX + bend.x * 0.55;
    const endY = fibre.endY + bend.y * 0.55;
    const controlX = mix(fibre.originX, fibre.endX, 0.54) + bend.x + Math.sin(fibre.phase) * 1.5;
    const controlY = mix(fibre.originY, fibre.endY, 0.54) + bend.y;

    context.beginPath();
    context.moveTo(fibre.originX, fibre.originY);
    context.quadraticCurveTo(controlX, controlY, endX, endY);
    context.strokeStyle = rgba(currentBright, fibre.opacity * 0.09);
    context.lineWidth = fibre.width + 1.25;
    context.stroke();

    context.beginPath();
    context.moveTo(fibre.originX, fibre.originY);
    context.quadraticCurveTo(controlX, controlY, endX, endY);
    context.strokeStyle = rgba(currentCore, fibre.opacity);
    context.lineWidth = fibre.width;
    context.stroke();

    context.beginPath();
    context.arc(endX, endY, fibre.nodeSize, 0, Math.PI * 2);
    context.fillStyle = rgba(currentBright, Math.min(0.82, fibre.opacity * 1.7));
    context.fill();
  }

  const sourceGlow = context.createRadialGradient(
    size.width * 0.5,
    size.height * 1.02,
    0,
    size.width * 0.5,
    size.height * 1.02,
    Math.min(size.width * 0.38, size.height * 0.58),
  );
  sourceGlow.addColorStop(0, rgba(currentBright, 0.22));
  sourceGlow.addColorStop(0.48, rgba(currentBright, 0.055));
  sourceGlow.addColorStop(1, rgba(currentBright, 0));
  context.globalCompositeOperation = 'lighter';
  context.fillStyle = sourceGlow;
  context.fillRect(0, size.height * 0.46, size.width, size.height * 0.54);
  context.globalCompositeOperation = 'source-over';
}

function animate(time) {
  const delta = Math.min(2.5, Math.max(0.25, (time - previousTime) / 16.67 || 1));
  previousTime = time;
  draw(time, delta);
  animationFrame = requestAnimationFrame(animate);
}

function updateToggleLabel() {
  const current = palettes[paletteIndex].name;
  const next = palettes[(paletteIndex + 1) % palettes.length].name;
  toggle.setAttribute('aria-label', `Change colour palette. Current: ${current}. Next: ${next}.`);
}

function startAnimation() {
  cancelAnimationFrame(animationFrame);
  previousTime = performance.now();

  if (reducedMotion.matches || document.hidden) {
    draw(previousTime, 1);
    return;
  }

  animationFrame = requestAnimationFrame(animate);
}

field.addEventListener('pointermove', (event) => {
  const bounds = field.getBoundingClientRect();
  pointer.x = event.clientX - bounds.left;
  pointer.y = event.clientY - bounds.top;
  pointer.active = true;
});

field.addEventListener('pointerleave', () => {
  pointer.active = false;
});

toggle.addEventListener('click', () => {
  paletteIndex = (paletteIndex + 1) % palettes.length;
  field.style.setProperty('--glow-rgb', palettes[paletteIndex].glow.join(', '));
  updateToggleLabel();

  if (reducedMotion.matches) {
    currentCore = [...palettes[paletteIndex].core];
    currentBright = [...palettes[paletteIndex].bright];
    draw(performance.now(), 1);
  }
});

window.addEventListener('resize', resize, { passive: true });
document.addEventListener('visibilitychange', startAnimation);
reducedMotion.addEventListener('change', startAnimation);

updateToggleLabel();
resize();
startAnimation();
