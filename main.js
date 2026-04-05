/* ============================================================
   CRUDA — Cervecería Artesanal · main.js
   ============================================================ */

// --- Reveal on scroll ----------------------------------------
const revealEls = document.querySelectorAll(
  '.hero__block--title > *, .hero__block--desc > *, .hero__block--stat > *,' +
  '.manifiesto__title, .manifiesto__body, .manifiesto__img-wrap,' +
  '.cerveza,' +
  '.proceso-step,' +
  '.contacto__title, .contacto__sub, .contacto__data, .contacto__form'
);
revealEls.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

// --- Ticker duplicate ----------------------------------------
const ticker = document.querySelector('.ticker__inner');
if (ticker) ticker.innerHTML += ticker.innerHTML;

// --- Nav scroll ----------------------------------------------
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 60
    ? 'rgba(15,14,10,0.97)'
    : 'var(--c-bg)';
}, { passive: true });

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
        background: '#1E1C16', flexDirection: 'column', gap: '0',
        borderBottom: '2px solid #F2ECD9'
      });
      [...navLinks.querySelectorAll('a')].forEach(a => {
        Object.assign(a.style, { padding: '1rem 2rem', display: 'block', borderBottom: '1px solid rgba(242,236,217,0.08)' });
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
    btn.textContent = 'Enviado. Te contactamos pronto ✓';
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
