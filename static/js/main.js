import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// ── Theme toggle ─────────────────────────────────────────
const root  = document.documentElement;
const btn   = document.getElementById('theme-btn');
const saved = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', saved);
btn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateSphereColor();
});

// ── Nav ───────────────────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}, { passive: true });

// ── Scroll reveal (3D pour les sections) ─────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el   = entry.target;
    const sibs = [...el.parentElement.children].filter(c =>
      c.classList.contains('reveal') || c.classList.contains('reveal-3d'));
    const idx = sibs.indexOf(el);
    setTimeout(() => el.classList.add('visible'), idx * 90);
    revealObs.unobserve(el);
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal, .reveal-3d').forEach(el => revealObs.observe(el));

// ── Language bars ─────────────────────────────────────────
const langObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    setTimeout(() => { e.target.style.width = e.target.dataset.pct + '%'; }, 250);
    langObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.lang-fill').forEach(el => langObs.observe(el));

// ── Counters ─────────────────────────────────────────────
function countUp(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let start, dur = 1200;
  const step = ts => {
    if (!start) start = ts;
    const p    = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); cntObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => cntObs.observe(el));

// ── Hero parallax ─────────────────────────────────────────
const heroName = document.querySelector('.hero-name');
const heroSub  = document.querySelector('.hero-sub');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroName) heroName.style.transform = `translateY(${y * .1}px)`;
  if (heroSub)  heroSub.style.transform  = `translateY(${y * .06}px)`;
}, { passive: true });

// ── Card tilt ─────────────────────────────────────────────
document.querySelectorAll('.proj').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - .5;
    const y  = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.01)`;
    card.style.transition = 'transform .05s linear';
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1), background .25s';
  });
});

// ══════════════════════════════════════════════════════════
//  THREE.JS — WIREFRAME SPHERE (hero)
// ══════════════════════════════════════════════════════════
const heroCanvas = document.getElementById('hero-canvas');
const renderer   = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 4);

// Wireframe sphere
const geo  = new THREE.IcosahedronGeometry(1.5, 5);
let meshColor = new THREE.Color(0x2997ff);

const mat  = new THREE.MeshBasicMaterial({
  color: meshColor,
  wireframe: true,
  transparent: true,
  opacity: .18,
});
const sphere = new THREE.Mesh(geo, mat);
scene.add(sphere);

// Second sphere (outer, slower)
const mat2  = new THREE.MeshBasicMaterial({
  color: 0x2997ff,
  wireframe: true,
  transparent: true,
  opacity: .07,
});
const sphere2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.85, 2), mat2);
scene.add(sphere2);

function updateSphereColor() {
  const isDark = root.getAttribute('data-theme') !== 'light';
  mat.color.set(isDark ? 0x2997ff : 0x0071e3);
  mat.opacity  = isDark ? .18 : .14;
  mat2.color.set(isDark ? 0x2997ff : 0x0071e3);
  mat2.opacity = isDark ? .07 : .05;
}

// Mouse influence
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth  - .5) * 2;
  mouseY = (e.clientY / window.innerHeight - .5) * 2;
});

function resizeRenderer() {
  const hero = document.getElementById('hero');
  const w    = hero.clientWidth;
  const h    = hero.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resizeRenderer();
window.addEventListener('resize', resizeRenderer);

// Scroll — sphere sinks as user scrolls
let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

const clock = new THREE.Clock();
(function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Base rotation
  sphere.rotation.x  = t * .09 + mouseY * .15;
  sphere.rotation.y  = t * .13 + mouseX * .15;
  sphere2.rotation.x = -t * .04;
  sphere2.rotation.y = t  * .07 + mouseX * .08;

  // Subtle breath
  const scale = 1 + Math.sin(t * .8) * .018;
  sphere.scale.setScalar(scale);

  // Scroll fade out
  const heroH  = document.getElementById('hero').clientHeight;
  const fade   = Math.max(0, 1 - scrollY / (heroH * .6));
  mat.opacity  = (root.getAttribute('data-theme') === 'light' ? .14 : .18) * fade;
  mat2.opacity = (root.getAttribute('data-theme') === 'light' ? .05 : .07) * fade;

  renderer.render(scene, camera);
})();
