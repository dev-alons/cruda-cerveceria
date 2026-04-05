/* ============================================================
   CRUDA — Cervecería Artesanal
   Scrollytelling Engine · Botella protagonista
   ============================================================ */

// ============================================================
// ESCENAS — Definición completa de cada estado de la botella
// ============================================================
const SCENES = [
  {
    id: 0,
    name: 'CRUDA · CERVECERÍA ARTESANAL',
    bgId: 'bg-0',
    // Botella
    bottleX: 0,          // desplazamiento horizontal px
    bottleY: 0,          // desplazamiento vertical px
    bottleScale: 0.85,   // escala
    bottleRotateZ: -5,   // rotación 2D (inclinación)
    bottleRotateY: 0,    // rotación 3D (flip)
    bottleFilter: 'brightness(0.6) saturate(0.5)',
    bottleImgScale: 1,
    labelOpacity: 0,
    shadowWidth: 120,
    // FX activos
    fx: [],
    // Texto
    num: '00',
    title: 'CRUDA',
    titleOutline: false,
    body: 'Fermentamos con obsesión.\nEmbotellamos con honestidad.\nBebemos sin disculpas.',
    extra: null,
    // Posición del texto
    textSide: 'left',
  },
  {
    id: 1,
    name: 'ORIGEN · COQUIMBO 2019',
    bgId: 'bg-1',
    bottleX: -180,
    bottleY: 30,
    bottleScale: 0.9,
    bottleRotateZ: -18,
    bottleRotateY: 0,
    bottleFilter: 'brightness(0.75) saturate(0.7) sepia(0.3)',
    bottleImgScale: 1.05,
    labelOpacity: 0.6,
    shadowWidth: 100,
    fx: ['grain'],
    num: '01',
    title: 'EL\nORIGEN.',
    titleOutline: false,
    body: 'Un garaje, 50 litros y una obsesión irracional por el sabor. Coquimbo, 2019.',
    extra: {
      type: 'tags',
      items: ['Malta local', 'Lúpulo Cascade', 'Fermentación natural']
    },
    textSide: 'right',
  },
  {
    id: 2,
    name: 'FERMENTACIÓN · 72 HORAS',
    bgId: 'bg-2',
    bottleX: 0,
    bottleY: -40,
    bottleScale: 1.1,
    bottleRotateZ: 0,
    bottleRotateY: 180,
    bottleFilter: 'brightness(1) saturate(1.1)',
    bottleImgScale: 1,
    labelOpacity: 0,
    shadowWidth: 160,
    fx: ['bubbles'],
    num: '02',
    title: 'LA\nESPERA.',
    titleOutline: true,
    body: '72 horas mínimas. Sin atajos. La levadura trabaja a su ritmo — el tiempo es el ingrediente secreto.',
    extra: {
      type: 'stats',
      items: [
        { num: '72h', label: 'Fermentación mínima' },
        { num: '18°C', label: 'Temp. controlada' }
      ]
    },
    textSide: 'left',
  },
  {
    id: 3,
    name: 'EL CARÁCTER · SIN DISCULPAS',
    bgId: 'bg-3',
    bottleX: 160,
    bottleY: 20,
    bottleScale: 1.0,
    bottleRotateZ: 38,
    bottleRotateY: 0,
    bottleFilter: 'brightness(1.1) saturate(1.3)',
    bottleImgScale: 1.08,
    labelOpacity: 1,
    shadowWidth: 80,
    fx: ['particles'],
    num: '03',
    title: 'EL\nCARÁCTER.',
    titleOutline: true,
    body: 'Amargo sin disculpas. Oscuro sin miedo. Cada lote tiene personalidad propia.',
    extra: {
      type: 'tags',
      items: ['Amargo', 'Aromático', 'Sin filtrar', 'Local']
    },
    textSide: 'left',
  },
  {
    id: 4,
    name: 'TU MOMENTO · SÍRVELA FRÍA',
    bgId: 'bg-4',
    bottleX: 0,
    bottleY: -20,
    bottleScale: 1.25,
    bottleRotateZ: 0,
    bottleRotateY: 360,
    bottleFilter: 'brightness(1.2) saturate(1.4)',
    bottleImgScale: 1.1,
    labelOpacity: 1,
    shadowWidth: 200,
    fx: ['foam', 'bubbles'],
    num: '04',
    title: 'TU\nMOMENTO.',
    titleOutline: false,
    body: 'Sírvela fría. Bébela lento. Compártela con alguien que lo merezca.',
    extra: { type: 'cta', label: 'Ver todas las cervezas', href: '#catalogo' },
    textSide: 'left',
  }
];

// ============================================================
// INTERPOLACIÓN entre dos estados de la botella
// ============================================================
function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

function interpolateScene(sceneA, sceneB, t) {
  const e = easeInOut(t);
  return {
    bottleX:       lerp(sceneA.bottleX,      sceneB.bottleX,      e),
    bottleY:       lerp(sceneA.bottleY,      sceneB.bottleY,      e),
    bottleScale:   lerp(sceneA.bottleScale,  sceneB.bottleScale,  e),
    bottleRotateZ: lerp(sceneA.bottleRotateZ, sceneB.bottleRotateZ, e),
    bottleRotateY: lerp(sceneA.bottleRotateY, sceneB.bottleRotateY, e),
    shadowWidth:   lerp(sceneA.shadowWidth,  sceneB.shadowWidth,  e),
    labelOpacity:  lerp(sceneA.labelOpacity, sceneB.labelOpacity,  e),
  };
}

// ============================================================
// DOM REFERENCES
// ============================================================
const journeySection    = document.getElementById('journey');
const bottleContainer   = document.getElementById('bottleContainer');
const bottle            = document.getElementById('bottle');
const bottleShape       = document.getElementById('bottleShape');
const bottleImg         = document.getElementById('bottleImg');
const bottleTint        = document.getElementById('bottleTint');
const bottleLabel       = document.getElementById('bottleLabel');
const labelName         = document.getElementById('labelName');
const labelAbv          = document.getElementById('labelAbv');
const bottleShadow      = document.getElementById('bottleShadow');
const sceneText         = document.getElementById('sceneText');
const sceneContent      = document.getElementById('sceneContent');
const sceneNum          = document.getElementById('sceneNum');
const sceneTitle        = document.getElementById('sceneTitle');
const sceneBody         = document.getElementById('sceneBody');
const sceneExtra        = document.getElementById('sceneExtra');
const sceneDots         = document.querySelectorAll('.scene-dot');
const sceneNameBar      = document.getElementById('sceneNameBar');
const scrollProgressFill = document.getElementById('scrollProgressFill');
const fxParticles       = document.getElementById('fxParticles');
const fxBubbles         = document.getElementById('fxBubbles');
const fxGrain           = document.getElementById('fxGrain');
const fxFoam            = document.getElementById('fxFoam');

let currentSceneIndex = -1;

// ============================================================
// APPLY BOTTLE STATE
// ============================================================
function applyBottleState(state) {
  bottle.style.transform = `
    translateX(${state.bottleX}px)
    translateY(${state.bottleY}px)
    scale(${state.bottleScale})
    rotateZ(${state.bottleRotateZ}deg)
    rotateY(${state.bottleRotateY}deg)
  `;
  bottleShadow.style.width = state.shadowWidth + 'px';
  bottleShadow.style.opacity = state.shadowWidth > 60 ? '1' : '0.4';
  bottleLabel.style.opacity = state.labelOpacity;
}

// ============================================================
// APPLY SCENE SWITCH (text, bg, fx)
// ============================================================
function applyScene(scene) {
  if (currentSceneIndex === scene.id) return;
  currentSceneIndex = scene.id;

  // Background
  document.querySelectorAll('.journey__bg').forEach(bg => bg.style.opacity = '0');
  const bg = document.getElementById(scene.bgId);
  if (bg) bg.style.opacity = '1';

  // FX
  fxParticles.classList.toggle('active', scene.fx.includes('particles'));
  fxBubbles.classList.toggle('active',   scene.fx.includes('bubbles'));
  fxGrain.classList.toggle('active',     scene.fx.includes('grain'));
  fxFoam.classList.toggle('active',      scene.fx.includes('foam'));

  // Bottle filter
  bottle.style.filter = scene.bottleFilter;
  bottleImg.style.transform = `scale(${scene.bottleImgScale})`;

  // Text side
  const isLeft = scene.textSide === 'left';
  sceneText.style.left  = isLeft ? '3rem' : 'auto';
  sceneText.style.right = isLeft ? 'auto' : '3rem';
  sceneText.style.textAlign = isLeft ? 'left' : 'left';

  // Animate text out
  sceneContent.classList.remove('visible');
  sceneContent.classList.add('entering');

  setTimeout(() => {
    // Update content
    sceneNum.textContent = scene.num;
    if (scene.titleOutline) {
      const lines = scene.title.split('\n');
      sceneTitle.innerHTML = lines.map((l, i) =>
        i === lines.length - 1
          ? `<span class="text-outline-sm">${l}</span>`
          : l
      ).join('<br/>');
    } else {
      sceneTitle.textContent = scene.title.replace('\n', ' ');
      sceneTitle.innerHTML = scene.title.split('\n').join('<br/>');
    }
    sceneBody.textContent = scene.body;

    // Extra content
    sceneExtra.innerHTML = '';
    if (scene.extra) {
      if (scene.extra.type === 'stats') {
        const row = document.createElement('div');
        row.className = 'scene-stats';
        scene.extra.items.forEach(s => {
          row.innerHTML += `
            <div class="scene-stat">
              <span class="scene-stat__num">${s.num}</span>
              <span class="scene-stat__label">${s.label}</span>
            </div>`;
        });
        sceneExtra.appendChild(row);
      } else if (scene.extra.type === 'tags') {
        const wrap = document.createElement('div');
        wrap.className = 'scene-tags';
        scene.extra.items.forEach(t => {
          wrap.innerHTML += `<span>${t}</span>`;
        });
        sceneExtra.appendChild(wrap);
      } else if (scene.extra.type === 'cta') {
        const wrap = document.createElement('div');
        wrap.className = 'scene-cta';
        wrap.innerHTML = `<a href="${scene.extra.href}">${scene.extra.label} →</a>`;
        sceneExtra.appendChild(wrap);
      }
    }

    // Animate text in
    sceneContent.classList.remove('entering');
    sceneContent.classList.add('visible');
  }, 200);

  // Dots
  sceneDots.forEach((dot, i) => dot.classList.toggle('active', i === scene.id));

  // Name bar
  sceneNameBar.textContent = scene.name;
}

// ============================================================
// SCROLL ENGINE
// ============================================================
function onScroll() {
  if (!journeySection) return;

  const rect       = journeySection.getBoundingClientRect();
  const totalScroll = journeySection.offsetHeight - window.innerHeight;
  const scrolled   = -rect.top;
  const progress   = Math.max(0, Math.min(1, scrolled / totalScroll));

  // Progress bar
  if (scrollProgressFill) scrollProgressFill.style.width = (progress * 100) + '%';

  // Scene calculation
  const numScenes   = SCENES.length;
  const sceneSize   = 1 / (numScenes - 1);   // fraction per transition
  const rawScene    = progress / sceneSize;
  const sceneIndex  = Math.min(Math.floor(rawScene), numScenes - 2);
  const sceneT      = rawScene - sceneIndex;  // 0..1 within this transition

  const sceneA = SCENES[sceneIndex];
  const sceneB = SCENES[sceneIndex + 1];

  // Determine dominant scene for text/bg switch (switch at 30% into transition)
  const dominantScene = sceneT > 0.35 ? sceneB : sceneA;
  applyScene(dominantScene);

  // Interpolate bottle
  const state = interpolateScene(sceneA, sceneB, sceneT);
  applyBottleState(state);
}

// ============================================================
// CUSTOM CURSOR
// ============================================================
const cursorDot = document.querySelector('.cursor');
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
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

// Init first scene on load
document.addEventListener('DOMContentLoaded', () => {
  onScroll();
  // Initial text animation
  setTimeout(() => {
    sceneContent.classList.remove('entering');
    sceneContent.classList.add('visible');
  }, 300);
});

// ============================================================
// TICKER
// ============================================================
const ticker = document.querySelector('.ticker__inner');
if (ticker) ticker.innerHTML += ticker.innerHTML;

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
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; form.reset(); }, 3500);
  });
}
