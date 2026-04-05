/* ============================================================
   CRUDA — Cervecería Artesanal · main.js
   Scrollytelling + Animaciones
   ============================================================ */

// --- Custom Cursor -------------------------------------------
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && follower) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .beer-card, .step__tags span').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hovering');
      follower.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hovering');
      follower.classList.remove('is-hovering');
    });
  });
}

// --- Ticker duplicate ----------------------------------------
const ticker = document.querySelector('.ticker__inner');
if (ticker) ticker.innerHTML += ticker.innerHTML;

// --- Nav scroll ----------------------------------------------
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.padding = window.scrollY > 60 ? '0.75rem 3rem' : '1.2rem 3rem';
}, { passive: true });

// --- Scroll progress bar in intro ----------------------------
const scrollBarFill = document.querySelector('.scroll-bar__fill');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct   = (window.scrollY / total) * 100;
  if (scrollBarFill) scrollBarFill.style.width = pct + '%';
}, { passive: true });

// --- Scrollytelling — Bottle stage ---------------------------
const stage     = document.querySelector('.scrolly__bottle-stage');
const steps     = document.querySelectorAll('.step');
const counter   = document.querySelector('.scene-counter__current');

if (stage && steps.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const scene = entry.target.dataset.scene;
        const color = entry.target.dataset.color || '#0F0E0A';

        // Remove all scene classes
        stage.className = 'scrolly__bottle-stage';
        stage.classList.add('scene-' + scene);
        stage.style.background = color;

        // Update counter
        if (counter) counter.textContent = '0' + scene;

        // Activate step
        steps.forEach(s => s.classList.remove('is-active'));
        entry.target.classList.add('is-active');
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(step => observer.observe(step));
}

// --- Counting numbers ----------------------------------------
const statNums = document.querySelectorAll('.stat-item__num[data-target]');

function countUp(el, target, duration = 1500) {
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  };
  tick();
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      countUp(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

// --- Beer card bar animation ---------------------------------
const beerCards = document.querySelectorAll('.beer-card');
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('bar-animated');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
beerCards.forEach(card => cardObserver.observe(card));

// --- Intro title lines — stagger in --------------------------
const introLines = document.querySelectorAll('.intro__title-line');
introLines.forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateY(60px)';
  line.style.transition = `opacity 0.7s ${i * 0.1}s cubic-bezier(0.16,1,0.3,1), transform 0.7s ${i * 0.1}s cubic-bezier(0.16,1,0.3,1)`;
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'translateY(0)';
  }, 200 + i * 100);
});

// --- Mobile nav ----------------------------------------------
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? 'none' : 'flex';
    if (!open) {
      Object.assign(navLinks.style, {
        position: 'fixed', top: '65px', left: '0', right: '0',
        background: 'rgba(15,14,10,0.98)', flexDirection: 'column', gap: '0',
        borderBottom: '2px solid rgba(242,236,217,0.15)',
        backdropFilter: 'blur(20px)'
      });
      [...navLinks.querySelectorAll('a')].forEach(a => {
        Object.assign(a.style, { padding: '1rem 2rem', display: 'block', cursor: 'pointer' });
      });
    }
  });
}

// --- Form submit ---------------------------------------------
const form = document.querySelector('.contacto__form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Enviado. Nos ponemos en contacto ✓';
    btn.style.background = '#F2ECD9';
    btn.style.color = '#0F0E0A';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3500);
  });
}
