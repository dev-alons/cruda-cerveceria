/* ============================================================
   CRUDA — Cervecería Artesanal
   Scrollytelling Engine + Three.js Bottle 3D
   ============================================================ */

// ============================================================
// ESCENAS
// ============================================================
const SCENES = [
  {
    id: 0, name: 'CRUDA · CERVECERÍA ARTESANAL', bgId: 'bg-0',
    bottleX: 0, bottleY: 0, bottleScale: 0.85,
    bottleRotateZ: -5, bottleRotateY: 0,
    lightScale: 0.55,
    labelOpacity: 0, shadowWidth: 120, fx: [],
    num: '00', title: 'CRUDA', titleOutline: false,
    body: 'Fermentamos con obsesión.\nEmbotellamos con honestidad.\nBebemos sin disculpas.',
    extra: null, textSide: 'left',
  },
  {
    id: 1, name: 'ORIGEN · COQUIMBO 2019', bgId: 'bg-1',
    bottleX: -180, bottleY: 30, bottleScale: 0.9,
    bottleRotateZ: -18, bottleRotateY: 0,
    lightScale: 0.70,
    labelOpacity: 0.6, shadowWidth: 100, fx: ['grain'],
    num: '01', title: 'EL\nORIGEN.', titleOutline: false,
    body: 'Un garaje, 50 litros y una obsesión irracional por el sabor. Coquimbo, 2019.',
    extra: { type: 'tags', items: ['Malta local', 'Lúpulo Cascade', 'Fermentación natural'] },
    textSide: 'right',
  },
  {
    id: 2, name: 'FERMENTACIÓN · 72 HORAS', bgId: 'bg-2',
    bottleX: 0, bottleY: -40, bottleScale: 1.1,
    bottleRotateZ: 0, bottleRotateY: 180,
    lightScale: 1.00,
    labelOpacity: 0, shadowWidth: 160, fx: ['bubbles'],
    num: '02', title: 'LA\nESPERA.', titleOutline: true,
    body: '72 horas mínimas. Sin atajos. La levadura trabaja a su ritmo — el tiempo es el ingrediente secreto.',
    extra: { type: 'stats', items: [{ num: '72h', label: 'Fermentación mínima' }, { num: '18°C', label: 'Temp. controlada' }] },
    textSide: 'left',
  },
  {
    id: 3, name: 'EL CARÁCTER · SIN DISCULPAS', bgId: 'bg-3',
    bottleX: 160, bottleY: 20, bottleScale: 1.0,
    bottleRotateZ: 38, bottleRotateY: 0,
    lightScale: 1.15,
    labelOpacity: 1, shadowWidth: 80, fx: ['particles'],
    num: '03', title: 'EL\nCARÁCTER.', titleOutline: true,
    body: 'Amargo sin disculpas. Oscuro sin miedo. Cada lote tiene personalidad propia.',
    extra: { type: 'tags', items: ['Amargo', 'Aromático', 'Sin filtrar', 'Local'] },
    textSide: 'left',
  },
  {
    id: 4, name: 'TU MOMENTO · SÍRVELA FRÍA', bgId: 'bg-4',
    bottleX: 0, bottleY: -20, bottleScale: 1.25,
    bottleRotateZ: 0, bottleRotateY: 360,
    lightScale: 1.30,
    labelOpacity: 1, shadowWidth: 200, fx: ['foam', 'bubbles'],
    num: '04', title: 'TU\nMOMENTO.', titleOutline: false,
    body: 'Sírvela fría. Bébela lento. Compártela con alguien que lo merezca.',
    extra: { type: 'cta', label: 'Ver todas las cervezas', href: '#catalogo' },
    textSide: 'left',
  }
];

// ============================================================
// INTERPOLACIÓN
// ============================================================
function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function interpolateScene(A, B, t) {
  const e = easeInOut(t);
  return {
    bottleX:       lerp(A.bottleX,       B.bottleX,       e),
    bottleY:       lerp(A.bottleY,       B.bottleY,       e),
    bottleScale:   lerp(A.bottleScale,   B.bottleScale,   e),
    bottleRotateZ: lerp(A.bottleRotateZ, B.bottleRotateZ, e),
    bottleRotateY: lerp(A.bottleRotateY, B.bottleRotateY, e),
    shadowWidth:   lerp(A.shadowWidth,   B.shadowWidth,   e),
    labelOpacity:  lerp(A.labelOpacity,  B.labelOpacity,  e),
    lightScale:    lerp(A.lightScale,    B.lightScale,    e),
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
const FOV = 30;
const camera3 = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
camera3.position.set(0, 0, 7);

// Altura del mundo visible con cámara a z=7 y FOV 30°
const CAM_WORLD_H = 2 * Math.tan((FOV / 2) * Math.PI / 180) * 7;

// Escala base de la botella (para que se vea prominente con las nuevas proporciones)
const BASE_BOTTLE_SCALE = 1.2;

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
const ambientLight = new THREE.AmbientLight(0xF2ECD9, 0.4);
scene3.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xFFE8C0, 1.2);
mainLight.position.set(-1.5, 2.5, 4);
scene3.add(mainLight);

const rimLight = new THREE.DirectionalLight(0xE8A020, 0.5);
rimLight.position.set(2.5, 0.5, 2);
scene3.add(rimLight);

const backLight = new THREE.DirectionalLight(0x331800, 0.4);
backLight.position.set(0, -1, -4);
scene3.add(backLight);

// ============================================================
// GRUPO BOTELLA + CARGA DEL MODELO GLB
// ============================================================
const bottleGroup = new THREE.Group();
scene3.add(bottleGroup);

let labelMesh3D = null; // referencia a Mesh001 para animar opacidad del label

const texLoader  = new THREE.TextureLoader();
const gltfLoader = new THREE.GLTFLoader();

// Pre-carga la textura del label
const labelTex = texLoader.load('./assets/label.png');
labelTex.flipY = false; // necesario para modelos GLB/GLTF

console.log('[CRUDA] Cargando Bottle.glb...');

gltfLoader.load('./assets/Bottle.glb',
  (gltf) => {
    console.log('[CRUDA] Bottle.glb cargado ✓');
    const model = gltf.scene;

    // --- Normalizar escala: hacer la botella ~1.9 unidades de alto ---
    const box    = new THREE.Box3().setFromObject(model);
    const size   = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scaleN = 1.9 / size.y;
    model.scale.setScalar(scaleN);

    // Centrar en el origen (para que el grupo la mueva limpio)
    model.position.set(
      -center.x * scaleN,
      -center.y * scaleN,
      -center.z * scaleN
    );

    // --- Aplicar materiales según malla ---
    model.traverse((child) => {
      if (!child.isMesh) return;

      if (child.name === 'Mesh001') {
        // Etiqueta frontal → aplicar label.png
        labelMesh3D = child;
        child.material = new THREE.MeshStandardMaterial({
          map: labelTex,
          transparent: true,
          opacity: 0,       // empieza invisible, el scroll lo anima
          roughness: 0.75,
          metalness: 0.0,
          side: THREE.FrontSide,
        });

      } else if (child.name === 'Mesh001_1') {
        // Etiqueta trasera → ocultar
        child.visible = false;

      } else {
        // Tapa u otras mallas → color dorado
        child.material = new THREE.MeshPhongMaterial({
          color:    0xC8960C,
          specular: 0xFFCC44,
          shininess: 200,
        });
      }
    });

    bottleGroup.add(model);
  },
  (xhr) => console.log(`[CRUDA] GLB: ${Math.round(xhr.loaded / xhr.total * 100)}%`),
  (err) => console.error('[CRUDA] Error cargando Bottle.glb:', err)
);

// ============================================================
// ESTADO SUAVIZADO (lerp en el loop de animación)
// ============================================================
let t3 = { rotY: 0, rotZ: 0, posX: 0, posY: 0, scale: 0.85, labelOp: 0, lightScale: 0.55 };
let target3 = { ...t3 };

// ============================================================
// LOOP DE ANIMACIÓN
// ============================================================
function animate() {
  requestAnimationFrame(animate);

  const lf = 0.075;
  t3.rotY       = lerp(t3.rotY,       target3.rotY,       lf);
  t3.rotZ       = lerp(t3.rotZ,       target3.rotZ,       lf);
  t3.posX       = lerp(t3.posX,       target3.posX,       lf);
  t3.posY       = lerp(t3.posY,       target3.posY,       lf);
  t3.scale      = lerp(t3.scale,      target3.scale,      0.055);
  t3.labelOp    = lerp(t3.labelOp,    target3.labelOp,    lf);
  t3.lightScale = lerp(t3.lightScale, target3.lightScale, 0.04);

  bottleGroup.rotation.y = t3.rotY;
  bottleGroup.rotation.z = t3.rotZ;
  bottleGroup.position.x = t3.posX;
  bottleGroup.position.y = t3.posY;
  bottleGroup.scale.setScalar(t3.scale * BASE_BOTTLE_SCALE);

  if (labelMesh3D) labelMesh3D.material.opacity = t3.labelOp;

  // Iluminación dinámica por escena
  ambientLight.intensity = 0.4  * t3.lightScale;
  mainLight.intensity    = 1.2  * t3.lightScale;
  rimLight.intensity     = 0.5  * t3.lightScale;

  renderer.render(scene3, camera3);
}

// ============================================================
// DOM REFERENCES
// ============================================================
const journeySection     = document.getElementById('journey');
const sceneText          = document.getElementById('sceneText');
const sceneContent       = document.getElementById('sceneContent');
const sceneNum           = document.getElementById('sceneNum');
const sceneTitle         = document.getElementById('sceneTitle');
const sceneBody          = document.getElementById('sceneBody');
const sceneExtra         = document.getElementById('sceneExtra');
const sceneDots          = document.querySelectorAll('.scene-dot');
const sceneNameBar       = document.getElementById('sceneNameBar');
const scrollProgressFill = document.getElementById('scrollProgressFill');
const fxParticles        = document.getElementById('fxParticles');
const fxBubbles          = document.getElementById('fxBubbles');
const fxGrain            = document.getElementById('fxGrain');
const fxFoam             = document.getElementById('fxFoam');
const bottleShadowEl     = document.getElementById('bottleShadow');

let currentSceneIndex = -1;

// ============================================================
// APPLY BOTTLE STATE → actualiza targets Three.js
// ============================================================
function applyBottleState(state) {
  const pxH       = threeCanvas.clientHeight || window.innerHeight;
  const pxToWorld = CAM_WORLD_H / pxH;

  target3.posX       =  state.bottleX * pxToWorld;
  target3.posY       = -state.bottleY * pxToWorld; // CSS Y hacia abajo, Three.js Y hacia arriba
  target3.scale      =  state.bottleScale;
  target3.rotZ       = -state.bottleRotateZ * Math.PI / 180;
  target3.rotY       =  state.bottleRotateY * Math.PI / 180; // ← rotación Y real en 3D!
  target3.labelOp    =  state.labelOpacity;
  target3.lightScale =  state.lightScale;

  if (bottleShadowEl) {
    bottleShadowEl.style.width   = state.shadowWidth + 'px';
    bottleShadowEl.style.opacity = state.shadowWidth > 60 ? '1' : '0.3';
  }
}

// ============================================================
// APPLY SCENE (texto, fondos, efectos)
// ============================================================
function applyScene(scene) {
  if (currentSceneIndex === scene.id) return;
  currentSceneIndex = scene.id;

  document.querySelectorAll('.journey__bg').forEach(bg => bg.style.opacity = '0');
  const bg = document.getElementById(scene.bgId);
  if (bg) bg.style.opacity = '1';

  fxParticles.classList.toggle('active', scene.fx.includes('particles'));
  fxBubbles.classList.toggle('active',   scene.fx.includes('bubbles'));
  fxGrain.classList.toggle('active',     scene.fx.includes('grain'));
  fxFoam.classList.toggle('active',      scene.fx.includes('foam'));

  const isLeft = scene.textSide === 'left';
  sceneText.style.left  = isLeft ? '3rem' : 'auto';
  sceneText.style.right = isLeft ? 'auto' : '3rem';

  sceneContent.classList.remove('visible');
  sceneContent.classList.add('entering');

  setTimeout(() => {
    sceneNum.textContent = scene.num;
    if (scene.titleOutline) {
      const lines = scene.title.split('\n');
      sceneTitle.innerHTML = lines.map((l, i) =>
        i === lines.length - 1 ? `<span class="text-outline-sm">${l}</span>` : l
      ).join('<br/>');
    } else {
      sceneTitle.innerHTML = scene.title.split('\n').join('<br/>');
    }
    sceneBody.textContent = scene.body;

    sceneExtra.innerHTML = '';
    if (scene.extra) {
      if (scene.extra.type === 'stats') {
        const row = document.createElement('div');
        row.className = 'scene-stats';
        scene.extra.items.forEach(s => {
          row.innerHTML += `<div class="scene-stat"><span class="scene-stat__num">${s.num}</span><span class="scene-stat__label">${s.label}</span></div>`;
        });
        sceneExtra.appendChild(row);
      } else if (scene.extra.type === 'tags') {
        const wrap = document.createElement('div');
        wrap.className = 'scene-tags';
        scene.extra.items.forEach(t => { wrap.innerHTML += `<span>${t}</span>`; });
        sceneExtra.appendChild(wrap);
      } else if (scene.extra.type === 'cta') {
        const wrap = document.createElement('div');
        wrap.className = 'scene-cta';
        wrap.innerHTML = `<a href="${scene.extra.href}">${scene.extra.label} →</a>`;
        sceneExtra.appendChild(wrap);
      }
    }

    sceneContent.classList.remove('entering');
    sceneContent.classList.add('visible');
  }, 200);

  sceneDots.forEach((dot, i) => dot.classList.toggle('active', i === scene.id));
  sceneNameBar.textContent = scene.name;
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
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });
  (function followCursor() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(followCursor);
  })();
  document.querySelectorAll('a, button, .beer-card, .scene-tags span, .scene-dot').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.classList.add('big'); cursorRing.classList.add('big'); });
    el.addEventListener('mouseleave', () => { cursorDot.classList.remove('big'); cursorRing.classList.remove('big'); });
  });
}

// ============================================================
// INIT
// ============================================================
function init() {
  resizeRenderer();
  animate();
  onScroll();
  setTimeout(() => {
    sceneContent.classList.remove('entering');
    sceneContent.classList.add('visible');
  }, 300);
}

window.addEventListener('scroll', onScroll, { passive: true });
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
    const e = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(e * target);
    if (t < 1) requestAnimationFrame(tick);
  };
  tick();
}
const statNums = document.querySelectorAll('.stat-item__num[data-target]');
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target, parseInt(entry.target.dataset.target));
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObs.observe(el));

// ============================================================
// BEER CARD BAR ANIMATION
// ============================================================
const beerCards = document.querySelectorAll('.beer-card');
const cardObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      cardObs.unobserve(entry.target);
    }
  });
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
        background: 'rgba(15,14,10,0.98)', flexDirection: 'column',
        gap: '0', borderBottom: '2px solid rgba(242,236,217,0.12)',
        backdropFilter: 'blur(20px)'
      });
      [...navLinks.querySelectorAll('a')].forEach(a => {
        Object.assign(a.style, { padding: '1rem 2rem', display: 'block', cursor: 'pointer' });
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
    btn.style.background = '#F2ECD9';
    btn.style.color = '#0F0E0A';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3500);
  });
}
