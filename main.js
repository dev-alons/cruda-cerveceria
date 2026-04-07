/* ============================================================
   CRUDA — Cervecería Artesanal
   Scrollytelling Cinematográfico · 4 actos
   ============================================================ */

// ============================================================
// ESCENAS — 4 actos narrativos
// bottleX/Y en unidades Three.js (no pixels)
// cameraX/Y/Z: posición de cámara
// targetX/Y/Z: punto al que mira la cámara
// fov: campo visual (zoom óptico)
// ============================================================
const SCENES = [
  {
    id: 0,
    name: '01 · ORIGEN',
    bgId: 'bg-0',
    darkTheme: true,
    // Botella de espaldas, silueteada — no se revela nada aún
    bottleX: 0.0, bottleY: 0.0, bottleScale: 1.0,
    bottleRotateZ: -3, bottleRotateY: -40,
    labelOpacity: 0, shadowWidth: 20,
    cameraX: 0.0, cameraY: 0.1, cameraZ: 7.0,
    targetX: 0.0, targetY: 0.0, targetZ: 0.0,
    fov: 26,
    ambientInt: 0.10, mainInt: 0.15,
    rimInt: 2.5,
    glowOp: 0.08,
    fogDensity: 0.0,
    cinemaText: 'Nació en la oscuridad.',
    showCTA: false,
  },
  {
    id: 1,
    name: '02 · IDENTIDAD',
    bgId: 'bg-1',
    darkTheme: true,
    // Dolly in extremo — la etiqueta se revela de frente
    bottleX: 0.0, bottleY: 0.0, bottleScale: 1.0,
    bottleRotateZ: 0, bottleRotateY: 0,
    labelOpacity: 1.0, shadowWidth: 100,
    cameraX: 0.0, cameraY: 0.05, cameraZ: 2.2,
    targetX: 0.0, targetY: 0.0, targetZ: 0.0,
    fov: 20,
    ambientInt: 0.75, mainInt: 1.2,
    rimInt: 0.3,
    glowOp: 0.60,
    fogDensity: 0.0,
    cinemaText: 'Es carácter en estado líquido.',
    showCTA: false,
  },
  {
    id: 2,
    name: '03 · FRÍO',
    bgId: 'bg-2',
    darkTheme: true,
    // Cámara baja dramática — niebla fría sube desde el suelo
    bottleX: 0.0, bottleY: 0.0, bottleScale: 1.0,
    bottleRotateZ: 0, bottleRotateY: 20,
    labelOpacity: 0.9, shadowWidth: 200,
    cameraX: 0.15, cameraY: -0.6, cameraZ: 4.2,
    targetX: 0.0, targetY: 0.3, targetZ: 0.0,
    fov: 30,
    ambientInt: 0.45, mainInt: 0.85,
    rimInt: 2.5,
    glowOp: 0.90,
    fogDensity: 0.07,
    cinemaText: 'Fría. Intensa. Lista.',
    showCTA: false,
  },
  {
    id: 3,
    name: '04 · VERTIDO',
    bgId: 'bg-3',
    darkTheme: true,
    // Cámara lateral — botella inclinada como si fuera a servirse
    bottleX: 0.0, bottleY: 0.0, bottleScale: 1.0,
    bottleRotateZ: -22, bottleRotateY: 40,
    labelOpacity: 1.0, shadowWidth: 70,
    cameraX: 1.4, cameraY: 0.3, cameraZ: 4.8,
    targetX: 0.0, targetY: 0.1, targetZ: 0.0,
    fov: 27,
    ambientInt: 0.55, mainInt: 0.95,
    rimInt: 1.0,
    glowOp: 0.40,
    fogDensity: 0.0,
    cinemaText: 'El momento de abrirla.',
    showCTA: false,
  },
  {
    id: 4,
    name: '05 · ESPUMA',
    bgId: 'bg-4',
    darkTheme: false,
    // Fondo claro dorado — botella en plena luz, celebratoria
    bottleX: 0.0, bottleY: 0.0, bottleScale: 1.0,
    bottleRotateZ: 0, bottleRotateY: -15,
    labelOpacity: 1.0, shadowWidth: 170,
    cameraX: -0.3, cameraY: 0.1, cameraZ: 5.2,
    targetX: 0.0, targetY: 0.15, targetZ: 0.0,
    fov: 25,
    ambientInt: 1.2, mainInt: 1.9,
    rimInt: 0.35,
    glowOp: 0.18,
    fogDensity: 0.0,
    cinemaText: 'Espuma, aroma, ritual.',
    showCTA: false,
  },
  {
    id: 5,
    name: '06 · BRINDIS',
    bgId: 'bg-5',
    darkTheme: false,
    // Parchment pleno — encuadre hero premium, CTA
    bottleX: 0.0, bottleY: 0.0, bottleScale: 1.0,
    bottleRotateZ: 0, bottleRotateY: 18,
    labelOpacity: 1.0, shadowWidth: 155,
    cameraX: 0.4, cameraY: 0.15, cameraZ: 5.0,
    targetX: 0.0, targetY: 0.0, targetZ: 0.0,
    fov: 24,
    ambientInt: 1.5, mainInt: 2.2,
    rimInt: 0.25,
    glowOp: 0.12,
    fogDensity: 0.0,
    cinemaText: 'Descubre la experiencia.',
    showCTA: true,
  },
];

// ============================================================
// INTERPOLACIÓN
// ============================================================
function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function interpolateScene(A, B, t) {
  const e = easeInOut(t);
  return {
    bottleX:       lerp(A.bottleX,      B.bottleX,      e),
    bottleY:       lerp(A.bottleY,      B.bottleY,      e),
    bottleScale:   lerp(A.bottleScale,  B.bottleScale,  e),
    bottleRotateZ: lerp(A.bottleRotateZ, B.bottleRotateZ, e),
    bottleRotateY: lerp(A.bottleRotateY, B.bottleRotateY, e),
    labelOpacity:  lerp(A.labelOpacity, B.labelOpacity, e),
    shadowWidth:   lerp(A.shadowWidth,  B.shadowWidth,  e),
    cameraX:       lerp(A.cameraX,      B.cameraX,      e),
    cameraY:       lerp(A.cameraY,      B.cameraY,      e),
    cameraZ:       lerp(A.cameraZ,      B.cameraZ,      e),
    targetX:       lerp(A.targetX,      B.targetX,      e),
    targetY:       lerp(A.targetY,      B.targetY,      e),
    targetZ:       lerp(A.targetZ,      B.targetZ,      e),
    fov:           lerp(A.fov,          B.fov,          e),
    ambientInt:    lerp(A.ambientInt,   B.ambientInt,   e),
    mainInt:       lerp(A.mainInt,      B.mainInt,      e),
    rimInt:        lerp(A.rimInt,       B.rimInt,       e),
    glowOp:        lerp(A.glowOp,       B.glowOp,       e),
    fogDensity:    lerp(A.fogDensity,   B.fogDensity,   e),
  };
}

// ============================================================
// THREE.JS — SETUP
// ============================================================
const threeCanvas = document.getElementById('bottleCanvas');
const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(22, 1, 0.1, 100);
camera3.position.set(0.08, 0.52, 1.6);

// Niebla (densidad 0 = invisible al inicio)
const sceneFog = new THREE.FogExp2(0x04060C, 0);
scene3.fog = sceneFog;

function resizeRenderer() {
  const sticky = document.querySelector('.journey__sticky');
  if (!sticky) return;
  const w = sticky.clientWidth;
  const h = sticky.clientHeight;
  renderer.setSize(w, h, false);
  camera3.aspect = w / h;
  camera3.updateProjectionMatrix();
}

// ============================================================
// ILUMINACIÓN
// ============================================================
const ambientLight = new THREE.AmbientLight(0xFFF5E0, 0.25);
scene3.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xFFEAB0, 0.5);
mainLight.position.set(-2, 3, 5);
scene3.add(mainLight);

// Rim light trasero (define contorno en escena de misterio)
const rimLight = new THREE.DirectionalLight(0xFFCC80, 2.8);
rimLight.position.set(0.5, 0.5, -3.5);
scene3.add(rimLight);

// Luz lateral cálida
const sideLight = new THREE.DirectionalLight(0xC8780A, 0.4);
sideLight.position.set(3, 0, 2);
scene3.add(sideLight);

// ============================================================
// GLOW — Sprite ámbar detrás de la botella
// ============================================================
const glowCanvas = document.createElement('canvas');
glowCanvas.width = 256; glowCanvas.height = 256;
const glowCtx = glowCanvas.getContext('2d');
const glowGrad = glowCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
glowGrad.addColorStop(0,   'rgba(200, 120, 10, 0.8)');
glowGrad.addColorStop(0.35, 'rgba(200, 100, 5, 0.25)');
glowGrad.addColorStop(1,   'rgba(200, 80, 0, 0)');
glowCtx.fillStyle = glowGrad;
glowCtx.fillRect(0, 0, 256, 256);
const glowTex = new THREE.CanvasTexture(glowCanvas);
const glowMat = new THREE.SpriteMaterial({
  map: glowTex,
  transparent: true,
  opacity: 0.25,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const glowSprite = new THREE.Sprite(glowMat);
glowSprite.scale.set(2.8, 3.5, 1);
glowSprite.position.set(0, 0, -0.4);

// ============================================================
// PARTÍCULAS 3D
// ============================================================
const PARTICLE_COUNT = 180;
const pPositions = new Float32Array(PARTICLE_COUNT * 3);
const pVelocities = new Float32Array(PARTICLE_COUNT);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  pPositions[i * 3 + 0] = (Math.random() - 0.5) * 5;
  pPositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
  pPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
  pVelocities[i] = 0.003 + Math.random() * 0.006;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0xC8780A,
  size: 0.025,
  transparent: true,
  opacity: 0,
  depthWrite: false,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene3.add(particles);

// ============================================================
// GRUPO BOTELLA + CARGA DEL MODELO GLB
// ============================================================
const bottleGroup = new THREE.Group();
bottleGroup.add(glowSprite);
scene3.add(bottleGroup);

let labelMesh3D = null;

const texLoader  = new THREE.TextureLoader();
const gltfLoader = new THREE.GLTFLoader();

const labelTex = texLoader.load('./assets/label.png');
labelTex.flipY = false;

console.log('[CRUDA] Cargando Bottle.glb...');

gltfLoader.load('./assets/Bottle.glb',
  (gltf) => {
    console.log('[CRUDA] Bottle.glb cargado ✓');
    const model = gltf.scene;

    // Normalizar escala y centrar
    const box    = new THREE.Box3().setFromObject(model);
    const size   = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scaleN = 1.9 / size.y;
    model.scale.setScalar(scaleN);
    model.position.set(-center.x * scaleN, -center.y * scaleN, -center.z * scaleN);

    // Materiales por malla
    model.traverse((child) => {
      if (!child.isMesh) return;
      switch (child.name) {
        case 'Mesh001':
          labelMesh3D = child;
          child.material = new THREE.MeshStandardMaterial({
            map: labelTex, transparent: true, opacity: 0,
            roughness: 0.75, metalness: 0.0, side: THREE.FrontSide,
          });
          break;
        case 'Mesh001_1':
        case 'Mesh001_2':
          child.visible = false;
          break;
        case 'Cap':
          child.material = new THREE.MeshPhongMaterial({
            color: 0xC8960C, specular: 0xFFDD55, shininess: 220,
          });
          break;
        case 'Bottle':
        default:
          break;
      }
    });

    bottleGroup.add(model);
  },
  null,
  (err) => console.error('[CRUDA] Error cargando Bottle.glb:', err)
);

// ============================================================
// ESTADO SUAVIZADO
// ============================================================
const S0 = SCENES[0];
let t3 = {
  rotY: S0.bottleRotateY * Math.PI / 180,
  rotZ: S0.bottleRotateZ * Math.PI / 180,
  posX: S0.bottleX, posY: -S0.bottleY,
  scale: S0.bottleScale,
  labelOp: S0.labelOpacity,
  camX: S0.cameraX, camY: S0.cameraY, camZ: S0.cameraZ,
  tgtX: S0.targetX, tgtY: S0.targetY, tgtZ: S0.targetZ,
  fov:  S0.fov,
  ambientInt: S0.ambientInt,
  mainInt:    S0.mainInt,
  rimInt:     S0.rimInt,
  glowOp:     S0.glowOp,
  fogDensity: S0.fogDensity,
};
let target3 = { ...t3 };

// ============================================================
// LOOP DE ANIMACIÓN
// ============================================================
let lastTime = 0;
function animate(time) {
  requestAnimationFrame(animate);
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  const lf = 0.07;

  t3.rotY       = lerp(t3.rotY,       target3.rotY,       lf);
  t3.rotZ       = lerp(t3.rotZ,       target3.rotZ,       lf);
  t3.posX       = lerp(t3.posX,       target3.posX,       lf);
  t3.posY       = lerp(t3.posY,       target3.posY,       lf);
  t3.scale      = lerp(t3.scale,      target3.scale,      0.05);
  t3.labelOp    = lerp(t3.labelOp,    target3.labelOp,    lf);
  t3.camX       = lerp(t3.camX,       target3.camX,       0.04);
  t3.camY       = lerp(t3.camY,       target3.camY,       0.04);
  t3.camZ       = lerp(t3.camZ,       target3.camZ,       0.04);
  t3.tgtX       = lerp(t3.tgtX,       target3.tgtX,       0.04);
  t3.tgtY       = lerp(t3.tgtY,       target3.tgtY,       0.04);
  t3.tgtZ       = lerp(t3.tgtZ,       target3.tgtZ,       0.04);
  t3.fov        = lerp(t3.fov,        target3.fov,        0.04);
  t3.ambientInt = lerp(t3.ambientInt, target3.ambientInt, 0.05);
  t3.mainInt    = lerp(t3.mainInt,    target3.mainInt,    0.05);
  t3.rimInt     = lerp(t3.rimInt,     target3.rimInt,     0.05);
  t3.glowOp     = lerp(t3.glowOp,    target3.glowOp,     0.05);
  t3.fogDensity = lerp(t3.fogDensity, target3.fogDensity, 0.03);

  // Botella
  bottleGroup.rotation.y = t3.rotY;
  bottleGroup.rotation.z = t3.rotZ;
  bottleGroup.position.x = t3.posX;
  bottleGroup.position.y = t3.posY;
  bottleGroup.scale.setScalar(t3.scale * BASE_SCALE);

  // Label
  if (labelMesh3D) labelMesh3D.material.opacity = t3.labelOp;

  // Cámara — movimiento cinemático con lookAt
  camera3.position.set(t3.camX, t3.camY, t3.camZ);
  camera3.lookAt(t3.tgtX, t3.tgtY, t3.tgtZ);
  if (Math.abs(camera3.fov - t3.fov) > 0.01) {
    camera3.fov = t3.fov;
    camera3.updateProjectionMatrix();
  }

  // Luces
  ambientLight.intensity = t3.ambientInt;
  mainLight.intensity    = t3.mainInt;
  rimLight.intensity     = t3.rimInt;

  // Glow
  glowMat.opacity = t3.glowOp;

  // Niebla
  sceneFog.density = t3.fogDensity;

  // Partículas — flotan hacia arriba lentamente
  const pos = particleGeo.attributes.position;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos.array[i * 3 + 1] += pVelocities[i];
    if (pos.array[i * 3 + 1] > 2.5) {
      pos.array[i * 3 + 1] = -2.5;
    }
  }
  pos.needsUpdate = true;
  particleMat.opacity = t3.fogDensity > 0.01
    ? Math.min(t3.fogDensity * 6, 0.55)
    : 0;

  renderer.render(scene3, camera3);
}

const BASE_SCALE = 1.15;

// ============================================================
// DOM REFERENCES
// ============================================================
const journeySection     = document.getElementById('journey');
const journeySticky      = document.getElementById('journeySticky');
const cinemaOverlay      = document.getElementById('cinemaOverlay');
const cinemaNumEl        = document.getElementById('cinemaNum');
const cinemaTextEl       = document.getElementById('cinemaText');
const cinemaCTAEl        = document.getElementById('cinemaCTA');
const sceneDots          = document.querySelectorAll('.scene-dot');
const sceneNameBar       = document.getElementById('sceneNameBar');
const scrollProgressFill = document.getElementById('scrollProgressFill');
const bottleShadowEl     = document.getElementById('bottleShadow');

let currentSceneIndex = -1;
let textSwitchTimer   = null;

// ============================================================
// APPLY BOTTLE STATE → actualiza targets Three.js
// ============================================================
function applyBottleState(state) {
  target3.posX      =  state.bottleX;
  target3.posY      = -state.bottleY;
  target3.scale     =  state.bottleScale;
  target3.rotZ      =  state.bottleRotateZ * Math.PI / 180;
  target3.rotY      =  state.bottleRotateY * Math.PI / 180;
  target3.labelOp   =  state.labelOpacity;

  target3.camX = state.cameraX;
  target3.camY = state.cameraY;
  target3.camZ = state.cameraZ;
  target3.tgtX = state.targetX;
  target3.tgtY = state.targetY;
  target3.tgtZ = state.targetZ;
  target3.fov  = state.fov;

  target3.ambientInt = state.ambientInt;
  target3.mainInt    = state.mainInt;
  target3.rimInt     = state.rimInt;
  target3.glowOp     = state.glowOp;
  target3.fogDensity = state.fogDensity;

  if (bottleShadowEl) {
    bottleShadowEl.style.width   = state.shadowWidth + 'px';
    bottleShadowEl.style.opacity = state.shadowWidth > 60 ? '0.8' : '0.2';
  }
}

// ============================================================
// APPLY SCENE — textos cinematográficos y fondos
// ============================================================
function applyScene(scene) {
  if (currentSceneIndex === scene.id) return;
  currentSceneIndex = scene.id;

  // Fondos
  document.querySelectorAll('.journey__bg').forEach(bg => bg.style.opacity = '0');
  const bg = document.getElementById(scene.bgId);
  if (bg) bg.style.opacity = '1';

  // Tema claro / oscuro
  if (journeySticky) {
    journeySticky.setAttribute('data-theme', scene.darkTheme ? 'dark' : 'light');
  }

  // Dots y nombre
  sceneDots.forEach((dot, i) => dot.classList.toggle('active', i === scene.id));
  sceneNameBar.textContent = scene.name;

  // Texto cinematográfico — transición out → in
  if (textSwitchTimer) clearTimeout(textSwitchTimer);

  cinemaTextEl.classList.remove('visible');
  cinemaTextEl.classList.add('exiting');
  cinemaCTAEl.classList.remove('visible');
  cinemaNumEl.textContent = scene.name.split('·')[0].trim();

  textSwitchTimer = setTimeout(() => {
    cinemaTextEl.textContent = scene.cinemaText;
    cinemaTextEl.classList.remove('exiting');
    cinemaTextEl.classList.add('visible');
    if (scene.showCTA) cinemaCTAEl.classList.add('visible');
  }, 350);
}

// ============================================================
// SCROLL ENGINE
// ============================================================
function onScroll() {
  if (!journeySection) return;

  const rect        = journeySection.getBoundingClientRect();
  const totalScroll = journeySection.offsetHeight - window.innerHeight;
  const scrolled    = -rect.top;
  const progress    = Math.max(0, Math.min(1, scrolled / totalScroll));

  if (scrollProgressFill) scrollProgressFill.style.width = (progress * 100) + '%';

  const numScenes  = SCENES.length;
  const sceneSize  = 1 / (numScenes - 1);
  const rawScene   = progress / sceneSize;
  const sceneIndex = Math.min(Math.floor(rawScene), numScenes - 2);
  const sceneT     = rawScene - sceneIndex;

  const sceneA = SCENES[sceneIndex];
  const sceneB = SCENES[sceneIndex + 1];

  // Cambio de escena dominante al 35% de la transición
  const dominantScene = sceneT > 0.35 ? sceneB : sceneA;
  applyScene(dominantScene);

  const state = interpolateScene(sceneA, sceneB, sceneT);
  applyBottleState(state);
}

// ============================================================
// CUSTOM CURSOR
// ============================================================
const cursorDot  = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-follower');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px';
  });
  (function followCursor() {
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
    requestAnimationFrame(followCursor);
  })();
  document.querySelectorAll('a, button, .beer-card, .scene-dot').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.classList.add('big'); cursorRing.classList.add('big'); });
    el.addEventListener('mouseleave', () => { cursorDot.classList.remove('big'); cursorRing.classList.remove('big'); });
  });
}

// ============================================================
// INIT
// ============================================================
function init() {
  resizeRenderer();
  requestAnimationFrame(animate);
  onScroll();
  // Mostrar texto y tema inicial
  if (journeySticky) journeySticky.setAttribute('data-theme', 'dark');
  setTimeout(() => {
    cinemaTextEl.textContent = SCENES[0].cinemaText;
    cinemaTextEl.classList.add('visible');
    cinemaNumEl.textContent = SCENES[0].name.split('·')[0].trim();
  }, 400);
}

// ============================================================
// SCROLL SNAP — ajusta al keyframe más cercano al soltar el scroll
// ============================================================
let snapTimer  = null;
let isSnapping = false;

function getSceneBoundaries() {
  if (!journeySection) return [];
  const top         = journeySection.offsetTop;
  const totalScroll = journeySection.offsetHeight - window.innerHeight;
  return SCENES.map((_, i) => top + totalScroll * (i / (SCENES.length - 1)));
}

function snapToNearest() {
  if (isSnapping) return;
  const boundaries = getSceneBoundaries();
  const y          = window.scrollY;
  const first      = boundaries[0];
  const last       = boundaries[boundaries.length - 1];

  // Solo actuar dentro del journey
  if (y < first - 60 || y > last + 60) return;

  let target = boundaries[0];
  let minDist = Infinity;
  for (const b of boundaries) {
    const d = Math.abs(y - b);
    if (d < minDist) { minDist = d; target = b; }
  }

  if (Math.abs(y - target) < 8) return; // ya estamos en el punto

  isSnapping = true;
  window.scrollTo({ top: target, behavior: 'smooth' });
  setTimeout(() => { isSnapping = false; }, 900);
}

window.addEventListener('scroll', () => {
  onScroll();
  if (!isSnapping) {
    if (snapTimer) clearTimeout(snapTimer);
    snapTimer = setTimeout(snapToNearest, 180);
  }
}, { passive: true });

window.addEventListener('resize', () => { resizeRenderer(); onScroll(); });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================================
// NAV scroll
// ============================================================
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.padding = window.scrollY > 80 ? '0.75rem 3rem' : '1.2rem 3rem';
}, { passive: true });

// ============================================================
// COUNTING NUMBERS
// ============================================================
function countUp(el, target, duration = 1500) {
  const start = Date.now();
  const tick = () => {
    const t = Math.min((Date.now() - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
    if (t < 1) requestAnimationFrame(tick);
  };
  tick();
}
const statNums = document.querySelectorAll('.stat-item__num[data-target]');
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { countUp(e.target, parseInt(e.target.dataset.target)); statsObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObs.observe(el));

// ============================================================
// BEER CARD ANIMATION
// ============================================================
const beerCards = document.querySelectorAll('.beer-card');
const cardObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); cardObs.unobserve(e.target); } });
}, { threshold: 0.3 });
beerCards.forEach(card => cardObs.observe(card));

// ============================================================
// MOBILE NAV
// ============================================================
const burger   = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? 'none' : 'flex';
    if (!open) {
      Object.assign(navLinks.style, {
        position: 'fixed', top: '65px', left: '0', right: '0',
        background: 'rgba(8,6,4,0.98)', flexDirection: 'column',
        gap: '0', borderBottom: '1px solid rgba(245,238,216,0.08)',
        backdropFilter: 'blur(20px)'
      });
      [...navLinks.querySelectorAll('a')].forEach(a => {
        Object.assign(a.style, { padding: '1rem 2rem', display: 'block', color: '#F5EED8' });
      });
    }
  });
}

// ============================================================
// FORM
// ============================================================
const form = document.querySelector('.contacto__form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Enviado. Nos ponemos en contacto ✓';
    btn.style.background = '#F5EED8'; btn.style.color = '#0A0806';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; form.reset(); }, 3500);
  });
}
