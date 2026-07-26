import * as THREE from "three";

/* Anatomical point-cloud states:
   0 — fibre fan (soft-tissue fan, kept light; not used on the homepage)
   1 — spine + orbit rings (behind the positioning section)
   2 — muscle-fibre bundle (behind the qualifications section)
   The forms echo the animated line-trace SVGs (orbit rings, spine, fascia). */

const SPINE_GROUP_OFFSET = new THREE.Vector3(1.7, -0.15, -1);
const FIBRE_GROUP_OFFSET = new THREE.Vector3(1.3, 0.2, -3);

const lineVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMousePower;

  attribute float aSeed;
  attribute float aFlex;
  attribute float aAlpha;

  varying float vAlpha;
  varying float vShimmer;

  void main() {
    vec3 animatedPosition = position;
    float idle = sin(uTime * 0.62 + aSeed * 18.0) * 0.008 * aFlex;
    animatedPosition.x += idle;
    animatedPosition.y += cos(uTime * 0.47 + aSeed * 13.0) * 0.005 * aFlex;

    vec4 viewPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    vec4 clipPosition = projectionMatrix * viewPosition;
    vec2 ndc = clipPosition.xy / max(clipPosition.w, 0.0001);
    vec2 delta = ndc - uMouse;
    float distanceToMouse = length(delta);
    float influence = pow(1.0 - smoothstep(0.0, 0.78, distanceToMouse), 2.0);
    vec2 direction = delta / max(distanceToMouse, 0.025);
    clipPosition.xy += direction * influence * uMousePower * (0.018 + aFlex * 0.052) * clipPosition.w;

    gl_Position = clipPosition;
    vAlpha = aAlpha;
    vShimmer = 0.72 + 0.28 * sin(uTime * 2.0 + aSeed * 9.0);
  }
`;

const lineFragmentShader = `
  uniform vec3 uColorTop;
  uniform vec3 uColorBottom;
  uniform vec2 uGradientStop;
  uniform vec2 uResolution;
  uniform float uOpacity;

  varying float vAlpha;
  varying float vShimmer;

  void main() {
    float screenY = gl_FragCoord.y / max(uResolution.y, 1.0);
    vec3 color = mix(
      uColorBottom,
      uColorTop,
      smoothstep(uGradientStop.x, uGradientStop.y, screenY)
    );
    gl_FragColor = vec4(color, vAlpha * vShimmer * uOpacity);
  }
`;

const pointVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMousePower;
  uniform float uPointSize;

  attribute float aSeed;
  attribute float aAlpha;

  varying float vAlpha;

  void main() {
    vec3 animatedPosition = position;
    animatedPosition.x += sin(uTime * 0.62 + aSeed * 18.0) * 0.008;
    animatedPosition.y += cos(uTime * 0.47 + aSeed * 13.0) * 0.005;

    vec4 viewPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    vec4 clipPosition = projectionMatrix * viewPosition;
    vec2 ndc = clipPosition.xy / max(clipPosition.w, 0.0001);
    vec2 delta = ndc - uMouse;
    float distanceToMouse = length(delta);
    float influence = pow(1.0 - smoothstep(0.0, 0.78, distanceToMouse), 2.0);
    vec2 direction = delta / max(distanceToMouse, 0.025);
    clipPosition.xy += direction * influence * uMousePower * 0.07 * clipPosition.w;

    gl_Position = clipPosition;
    gl_PointSize = uPointSize * clamp(5.5 / max(-viewPosition.z, 1.0), 0.65, 1.8);
    vAlpha = aAlpha * (0.82 + 0.18 * sin(uTime * 2.0 + aSeed * 11.0));
  }
`;

const pointFragmentShader = `
  uniform vec3 uColorTop;
  uniform vec3 uColorBottom;
  uniform vec2 uGradientStop;
  uniform vec2 uResolution;
  uniform float uOpacity;

  varying float vAlpha;

  void main() {
    float radius = length(gl_PointCoord - vec2(0.5));
    float circle = 1.0 - smoothstep(0.18, 0.5, radius);
    float screenY = gl_FragCoord.y / max(uResolution.y, 1.0);
    vec3 color = mix(
      uColorBottom,
      uColorTop,
      smoothstep(uGradientStop.x, uGradientStop.y, screenY)
    );
    gl_FragColor = vec4(color, circle * vAlpha * uOpacity);
  }
`;

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBetween(random, min, max) {
  return min + (max - min) * random();
}

function createStateData() {
  return {
    linePositions: [],
    lineAlpha: [],
    lineFlex: [],
    lineSeed: [],
    dotPositions: [],
    dotAlpha: [],
    dotSeed: [],
  };
}

function addPolyline(data, points, alpha, seed, flexible = true) {
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const startProgress = index / Math.max(1, points.length - 1);
    const endProgress = (index + 1) / Math.max(1, points.length - 1);

    data.linePositions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    data.lineAlpha.push(alpha, alpha);
    data.lineSeed.push(seed, seed);
    data.lineFlex.push(
      flexible ? startProgress : 0.35,
      flexible ? endProgress : 0.35,
    );
  }
}

function addDot(data, point, alpha, seed) {
  data.dotPositions.push(point.x, point.y, point.z);
  data.dotAlpha.push(alpha);
  data.dotSeed.push(seed);
}

function buildFibreFan() {
  const data = createStateData();
  const random = seededRandom(84017);
  const totalFibres = 140;

  for (let index = 0; index < totalFibres; index += 1) {
    const angle = THREE.MathUtils.lerp(
      Math.PI * 0.12,
      Math.PI * 0.88,
      index / (totalFibres - 1),
    );
    const inner = randomBetween(random, 1.1, 1.5);
    const outer = inner + randomBetween(random, 1.2, 2.3);
    const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
    const start = direction
      .clone()
      .multiplyScalar(inner)
      .add(new THREE.Vector3(0, -2.3, -0.6));
    const end = direction
      .clone()
      .multiplyScalar(outer)
      .add(new THREE.Vector3(0, -2.3, -0.6));
    const alpha = randomBetween(random, 0.12, 0.45);

    addPolyline(data, [start, end], alpha, random(), true);
    addDot(data, end, Math.min(0.9, alpha * 1.6), random());
  }

  return data;
}

function spinePoint(t) {
  /* Gentle S-curve echoing lumbar/thoracic curvature. t in [0, 1]. */
  return new THREE.Vector3(
    0.34 * Math.sin(t * Math.PI * 1.15 + 0.3) - 0.12,
    THREE.MathUtils.lerp(-2.3, 2.3, t),
    0.22 * Math.cos(t * Math.PI * 0.9),
  );
}

function buildSpineOrbit() {
  const data = createStateData();
  const random = seededRandom(95284772);

  /* Vertebral column: transverse bars wider in the lumbar region. */
  const vertebrae = 24;
  const spineCurve = [];
  for (let index = 0; index < vertebrae; index += 1) {
    const t = index / (vertebrae - 1);
    const center = spinePoint(t);
    spineCurve.push(center);

    const width = THREE.MathUtils.lerp(0.52, 0.26, t);
    const left = center.clone().add(new THREE.Vector3(-width, 0, 0));
    const right = center.clone().add(new THREE.Vector3(width, 0, 0));
    const alpha = randomBetween(random, 0.4, 0.58);

    addPolyline(data, [left, right], alpha, random(), true);
    addDot(data, left, alpha * 1.35, random());
    addDot(data, right, alpha * 1.35, random());
    addDot(data, center, Math.min(0.95, alpha * 1.7), random());
  }
  addPolyline(data, spineCurve, 0.34, random(), true);

  /* Orbit rings around the column — the animated-SVG motif in 3D. */
  const rings = [
    { radius: 2.05, tilt: 1.18, spin: 0, alpha: 0.17 },
    { radius: 2.65, tilt: 1.26, spin: 0.55, alpha: 0.13 },
    { radius: 3.3, tilt: 1.1, spin: 1.15, alpha: 0.1 },
  ];
  rings.forEach((ring) => {
    const points = [];
    for (let step = 0; step <= 72; step += 1) {
      const theta = (step / 72) * Math.PI * 2;
      const point = new THREE.Vector3(
        ring.radius * Math.cos(theta),
        0,
        ring.radius * Math.sin(theta),
      );
      point.applyEuler(new THREE.Euler(ring.tilt, ring.spin, 0.16));
      points.push(point);
    }
    addPolyline(data, points, ring.alpha, random(), false);
    for (let markers = 0; markers < 4; markers += 1) {
      addDot(
        data,
        points[Math.floor((markers / 4) * 72)],
        randomBetween(random, 0.4, 0.62),
        random(),
      );
    }
  });

  /* Faint depth scatter. */
  for (let index = 0; index < 70; index += 1) {
    const point = new THREE.Vector3(
      randomBetween(random, -3.4, 3.4),
      randomBetween(random, -3, 3),
      randomBetween(random, -2.6, 0.6),
    );
    if (point.length() < 1.4) continue;
    addDot(data, point, randomBetween(random, 0.07, 0.2), random());
  }

  return data;
}

function buildFibreBundle() {
  const data = createStateData();
  const random = seededRandom(331942);

  /* Muscle-fibre fascicle: long fibres bowing outward around a belly,
     receding into depth — soft tissue rendered in the site's line language. */
  const fibres = 44;
  const angle = THREE.MathUtils.degToRad(62);
  const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
  const perpendicular = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0);
  const length = 7.4;

  for (let index = 0; index < fibres; index += 1) {
    const spread =
      THREE.MathUtils.lerp(-3.4, 3.4, index / (fibres - 1)) +
      randomBetween(random, -0.07, 0.07);
    const depth = -1 - Math.abs(spread) * 0.55 - randomBetween(random, 0, 1.1);
    const belly = 0.34 * Math.max(0, 1 - Math.abs(spread) / 4.1);
    const bow = Math.sign(spread || 1) * belly;

    const points = [];
    const steps = 26;
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps - 0.5;
      const point = direction
        .clone()
        .multiplyScalar(length * t)
        .add(
          perpendicular
            .clone()
            .multiplyScalar(spread + bow * Math.cos(t * Math.PI)),
        );
      point.z = depth;
      points.push(point);
    }

    const depthFade = THREE.MathUtils.clamp(1 + (depth + 1) * 0.28, 0.35, 1);
    const alpha =
      (0.14 + 0.34 * Math.max(0, 1 - Math.abs(spread) / 4.4)) *
      depthFade *
      randomBetween(random, 0.7, 1);

    addPolyline(data, points, alpha, random(), true);
    addDot(data, points[0], Math.min(0.85, alpha * 1.55), random());
    addDot(data, points.at(-1), Math.min(0.85, alpha * 1.55), random());
    if (index % 4 === 0) {
      addDot(
        data,
        points[Math.floor(steps / 2)],
        Math.min(0.6, alpha * 1.2),
        random(),
      );
    }
  }

  return data;
}

const stateBuilders = [buildFibreFan, buildSpineOrbit, buildFibreBundle];

function createLineMaterial(palette, resolution) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMousePower: { value: 0 },
      uColorTop: { value: new THREE.Color(palette.top) },
      uColorBottom: { value: new THREE.Color(palette.bottom) },
      uGradientStop: { value: new THREE.Vector2(0, palette.stop) },
      uResolution: { value: resolution },
      uOpacity: { value: 1 },
    },
    vertexShader: lineVertexShader,
    fragmentShader: lineFragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function createPointMaterial(palette, resolution, pixelRatio) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uMousePower: { value: 0 },
      uPointSize: { value: 4.8 * pixelRatio },
      uColorTop: { value: new THREE.Color(palette.top) },
      uColorBottom: { value: new THREE.Color(palette.bottom) },
      uGradientStop: { value: new THREE.Vector2(0, palette.stop) },
      uResolution: { value: resolution },
      uOpacity: { value: 1 },
    },
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export class DataViz {
  constructor(canvas, palette, initialState = 0) {
    this.canvas = canvas;
    this.palette = palette;
    this.targetPalette = palette;
    this.targetColorTop = new THREE.Color(palette.top);
    this.targetColorBottom = new THREE.Color(palette.bottom);
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.activeIndex = initialState;
    this.transition = null;
    this.mouseTarget = new THREE.Vector2(999, 999);
    this.mouseCurrent = new THREE.Vector2(999, 999);
    this.mousePower = 0;
    this.mouseInside = false;
    this.clock = new THREE.Clock();
    this.resolution = new THREE.Vector2(1, 1);
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(this.pixelRatio);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
    this.states = stateBuilders.map((builder, index) =>
      this.createRenderableState(builder(), index),
    );
    this.states[1].group.position.copy(SPINE_GROUP_OFFSET);
    this.states[2].group.position.copy(FIBRE_GROUP_OFFSET);
    this.currentState = this.states[initialState];
    if (initialState === 0) this.currentState.group.scale.setScalar(0.7);
    this.scene.add(this.currentState.group);

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);

    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerleave", this.onPointerLeave);
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(canvas);
    this.resize();
    this.frame = requestAnimationFrame(this.render);
  }

  createRenderableState(data, index) {
    const group = new THREE.Group();
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(data.linePositions, 3),
    );
    lineGeometry.setAttribute(
      "aAlpha",
      new THREE.Float32BufferAttribute(data.lineAlpha, 1),
    );
    lineGeometry.setAttribute(
      "aFlex",
      new THREE.Float32BufferAttribute(data.lineFlex, 1),
    );
    lineGeometry.setAttribute(
      "aSeed",
      new THREE.Float32BufferAttribute(data.lineSeed, 1),
    );

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(data.dotPositions, 3),
    );
    pointGeometry.setAttribute(
      "aAlpha",
      new THREE.Float32BufferAttribute(data.dotAlpha, 1),
    );
    pointGeometry.setAttribute(
      "aSeed",
      new THREE.Float32BufferAttribute(data.dotSeed, 1),
    );

    const lineMaterial = createLineMaterial(this.palette, this.resolution);
    const pointMaterial = createPointMaterial(
      this.palette,
      this.resolution,
      this.pixelRatio,
    );
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    const points = new THREE.Points(pointGeometry, pointMaterial);
    lines.frustumCulled = false;
    points.frustumCulled = false;
    group.add(lines, points);

    return {
      index,
      group,
      lines,
      points,
      lineMaterial,
      pointMaterial,
      targetDots: new Float32Array(data.dotPositions),
      transitionStartDots: null,
      transitionMidDots: null,
    };
  }

  onPointerMove(event) {
    if (this.reducedMotion.matches) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouseTarget.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.mouseInside = true;
  }

  onPointerLeave() {
    this.mouseInside = false;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    this.renderer.setSize(rect.width, rect.height, false);
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.resolution.set(
      rect.width * this.pixelRatio,
      rect.height * this.pixelRatio,
    );

    for (const state of this.states) {
      state.lineMaterial.uniforms.uResolution.value = this.resolution;
      state.pointMaterial.uniforms.uResolution.value = this.resolution;
    }
  }

  setPalette(palette) {
    this.targetPalette = palette;
    this.targetColorTop.set(palette.top);
    this.targetColorBottom.set(palette.bottom);
  }

  setState(index) {
    if (index === this.activeIndex) return true;
    if (this.transition) {
      const { previous, next } = this.transition;
      this.scene.remove(previous.group);
      next.lineMaterial.uniforms.uOpacity.value = 1;
      next.pointMaterial.uniforms.uOpacity.value = 1;
      this.currentState = next;
      this.transition = null;
    }

    const previous = this.currentState;
    const next = this.states[index];
    if (this.reducedMotion.matches) {
      this.scene.remove(previous.group);
      this.scene.add(next.group);
      next.lineMaterial.uniforms.uOpacity.value = 1;
      next.pointMaterial.uniforms.uOpacity.value = 1;
      this.currentState = next;
      this.activeIndex = index;
      return true;
    }

    const previousDots = previous.points.geometry.getAttribute("position");
    const nextDots = next.points.geometry.getAttribute("position");
    const random = seededRandom(9100 + index);
    const start = new Float32Array(nextDots.count * 3);
    const mid = new Float32Array(nextDots.count * 3);

    for (let pointIndex = 0; pointIndex < nextDots.count; pointIndex += 1) {
      const sourceIndex = pointIndex % Math.max(1, previousDots.count);
      const sx = previousDots.getX(sourceIndex);
      const sy = previousDots.getY(sourceIndex);
      const sz = previousDots.getZ(sourceIndex);
      const tx = next.targetDots[pointIndex * 3];
      const ty = next.targetDots[pointIndex * 3 + 1];
      const tz = next.targetDots[pointIndex * 3 + 2];

      start.set([sx, sy, sz], pointIndex * 3);
      mid.set(
        [
          (sx + tx) * 0.5 + randomBetween(random, -0.85, 0.85),
          (sy + ty) * 0.5 + randomBetween(random, -0.65, 0.65),
          (sz + tz) * 0.5 - randomBetween(random, 0.3, 1.4),
        ],
        pointIndex * 3,
      );
    }

    next.transitionStartDots = start;
    next.transitionMidDots = mid;
    next.lineMaterial.uniforms.uOpacity.value = 0;
    next.pointMaterial.uniforms.uOpacity.value = 0;
    this.scene.add(next.group);
    this.transition = {
      previous,
      next,
      startTime: performance.now(),
      duration: 1250,
    };
    this.activeIndex = index;
    return true;
  }

  updateTransition(now) {
    if (!this.transition) return;
    const { previous, next, startTime, duration } = this.transition;
    const progress = Math.min(1, (now - startTime) / duration);
    const revealStarts = [0.54, 0.6, 0.3, 0.54];
    const removalEnds = [0.2, 0.15, 0.2, 0.2];
    const outgoing =
      1 - THREE.MathUtils.smoothstep(progress, 0, removalEnds[previous.index]);
    const incomingLines = THREE.MathUtils.smoothstep(
      progress,
      revealStarts[next.index],
      1,
    );
    const incomingDots = THREE.MathUtils.smoothstep(progress, 0, 0.5);

    previous.lineMaterial.uniforms.uOpacity.value = outgoing;
    previous.pointMaterial.uniforms.uOpacity.value = 1 - incomingDots;
    next.lineMaterial.uniforms.uOpacity.value = incomingLines;
    next.pointMaterial.uniforms.uOpacity.value = incomingDots;

    const positions = next.points.geometry.getAttribute("position");
    const eased = 0.5 - Math.cos(Math.PI * progress) * 0.5;
    for (let index = 0; index < positions.count; index += 1) {
      const offset = index * 3;
      const start = new THREE.Vector3(
        next.transitionStartDots[offset],
        next.transitionStartDots[offset + 1],
        next.transitionStartDots[offset + 2],
      );
      const mid = new THREE.Vector3(
        next.transitionMidDots[offset],
        next.transitionMidDots[offset + 1],
        next.transitionMidDots[offset + 2],
      );
      const target = new THREE.Vector3(
        next.targetDots[offset],
        next.targetDots[offset + 1],
        next.targetDots[offset + 2],
      );
      const inverse = 1 - eased;
      const point = start
        .multiplyScalar(inverse * inverse)
        .add(mid.multiplyScalar(2 * inverse * eased))
        .add(target.multiplyScalar(eased * eased));
      positions.setXYZ(index, point.x, point.y, point.z);
    }
    positions.needsUpdate = true;

    if (progress >= 1) {
      this.scene.remove(previous.group);
      previous.lineMaterial.uniforms.uOpacity.value = 1;
      previous.pointMaterial.uniforms.uOpacity.value = 1;
      this.currentState = next;
      this.transition = null;
    }
  }

  updateUniforms(elapsed, delta) {
    const mouseEase = 1 - 0.9 ** (delta / 0.01667);
    if (this.mouseInside && !this.reducedMotion.matches) {
      if (this.mouseCurrent.x > 100) this.mouseCurrent.copy(this.mouseTarget);
      this.mouseCurrent.lerp(this.mouseTarget, mouseEase);
      this.mousePower = THREE.MathUtils.lerp(
        this.mousePower,
        1,
        mouseEase * 0.42,
      );
    } else {
      this.mousePower = THREE.MathUtils.lerp(
        this.mousePower,
        0,
        mouseEase * 0.28,
      );
    }

    for (const state of this.states) {
      for (const material of [state.lineMaterial, state.pointMaterial]) {
        material.uniforms.uTime.value = this.reducedMotion.matches
          ? 0
          : elapsed;
        material.uniforms.uMouse.value.copy(this.mouseCurrent);
        material.uniforms.uMousePower.value = this.mousePower;
        material.uniforms.uColorTop.value.lerp(
          this.targetColorTop,
          1 - 0.92 ** (delta * 60),
        );
        material.uniforms.uColorBottom.value.lerp(
          this.targetColorBottom,
          1 - 0.92 ** (delta * 60),
        );
        material.uniforms.uGradientStop.value.y = THREE.MathUtils.lerp(
          material.uniforms.uGradientStop.value.y,
          this.targetPalette.stop,
          1 - 0.92 ** (delta * 60),
        );
      }
    }
  }

  render(now) {
    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;
    this.updateUniforms(elapsed, delta);
    this.updateTransition(now);

    if (
      this.activeIndex === 0 &&
      !this.transition &&
      this.currentState.group.scale.x < 0.999
    ) {
      const scale = THREE.MathUtils.lerp(
        this.currentState.group.scale.x,
        1,
        1 - 0.94 ** (delta * 60),
      );
      this.currentState.group.scale.setScalar(scale);
    }
    if (this.currentState.index === 1) {
      this.currentState.group.rotation.y += delta * 0.0105;
    }

    this.renderer.render(this.scene, this.camera);
    this.frame = requestAnimationFrame(this.render);
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerleave", this.onPointerLeave);
    for (const state of this.states) {
      state.lines.geometry.dispose();
      state.points.geometry.dispose();
      state.lineMaterial.dispose();
      state.pointMaterial.dispose();
    }
    this.renderer.dispose();
  }
}
