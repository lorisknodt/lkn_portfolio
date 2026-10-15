// ═══════════════════════════════════════════════════════════
//  Portfolio interactions — no dependencies.
// ═══════════════════════════════════════════════════════════

const root    = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp   = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const isLight = () => root.getAttribute('data-theme') === 'light';

// ── Theme toggle ─────────────────────────────────────────
const shader = initHeroShader();

document.getElementById('theme-btn').addEventListener('click', () => {
  const next = isLight() ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
  shader?.setTheme(next === 'light');
});

// ── Scroll lock (dialogs + mobile menu) ──────────────────
// overflow:hidden on <html> keeps the page still behind an overlay. Some
// engines move the page when it closes (toggling the lock, restoring focus),
// so remember where the reader was and put them back exactly there.
// While locked, scroll-behavior is 'auto' (see CSS): any such jump is then
// instant and visible to the check below, never a slow glide to the top.
let lockedY = 0;
let locks = 0; // menu and dialog can overlap (keyboard users), so count them

function lockScroll() {
  if (locks++ > 0) return;
  lockedY = scrollY;
  root.classList.add('scroll-locked');
  root.dispatchEvent(new Event('scrolllock')); // overlays opened: demos pause
}

function unlockScroll({ settle = true } = {}) {
  if (locks === 0 || --locks > 0) return;
  const restore = () => {
    if (Math.abs(scrollY - lockedY) >= 1) scrollTo({ top: lockedY, behavior: 'instant' });
  };
  root.style.scrollBehavior = 'auto';
  root.classList.remove('scroll-locked');
  root.dispatchEvent(new Event('scrolllock'));
  restore();
  if (!settle) { root.style.scrollBehavior = ''; return; } // let an anchor link glide
  // Catch engines that only move the page a frame or two later.
  requestAnimationFrame(() => {
    restore();
    requestAnimationFrame(() => { restore(); root.style.scrollBehavior = ''; });
  });
}

// ── Nav: glass on scroll, active section, mobile menu ────
const nav    = document.getElementById('nav');
const burger = document.getElementById('burger');

function setMenu(open, { navigating = false } = {}) {
  if (open === nav.classList.contains('open')) return;
  nav.classList.toggle('open', open);
  if (open) lockScroll();
  else unlockScroll({ settle: !navigating }); // let an anchor link scroll freely
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => setMenu(false, { navigating: true })));
addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false); });
matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

const navLinks = [...document.querySelectorAll('.nav-links a')];
const activeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => activeObs.observe(s));

// ── Scroll reveal (staggered per group) ──────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const group = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--d', `${Math.max(0, group.indexOf(el)) * 70}ms`);
    el.classList.add('in');
    revealObs.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Counters + language bars ─────────────────────────────
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  if (reduced) { el.textContent = target; return; }
  const dur = 1400;
  let start;
  const step = ts => {
    start ??= ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * target);
    if (p < 1) requestAnimationFrame(step);
  };
  el.textContent = '0';
  requestAnimationFrame(step);
}
const onceObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.count) countUp(el);
    if (el.dataset.pct)   setTimeout(() => { el.style.width = el.dataset.pct + '%'; }, 200);
    onceObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count], [data-pct]').forEach(el => onceObs.observe(el));

// ── Cursor spotlight on cards ────────────────────────────
if (matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.spot').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// ── Scroll-driven effects (one rAF per frame) ────────────
const hero        = document.getElementById('hero');
const heroContent = document.getElementById('hero-content');
const statement   = document.getElementById('statement');
const words       = [...statement.querySelectorAll('.w')];
const timelines   = [...document.querySelectorAll('.timeline')];

function onScroll() {
  const y  = scrollY;
  const vh = innerHeight;

  nav.classList.toggle('scrolled', y > 8);

  if (reduced) return;

  // Hero: content drifts back and fades, glow dims.
  const hh = hero.offsetHeight;
  if (y < hh * 1.1) {
    const p = clamp(y / (hh * 0.75));
    heroContent.style.transform = `translate3d(0, ${p * 90}px, 0) scale(${1 - p * 0.08})`;
    heroContent.style.opacity   = String(clamp(1 - p * 1.15));
    shader?.setFade(1 - p);
  }

  // Statement: words light up as the section scrolls through.
  const sr = statement.getBoundingClientRect();
  if (sr.top < vh && sr.bottom > 0) {
    const start = vh * 0.45;
    const span  = start + (sr.height - vh) * 0.8;
    const p     = clamp((start - sr.top) / span);
    const n     = words.length;
    words.forEach((w, i) => {
      w.style.opacity = (0.15 + 0.85 * clamp(p * n - i)).toFixed(3);
    });
  }

  // Timelines: line fills, dots light up.
  timelines.forEach(tl => {
    const r = tl.getBoundingClientRect();
    if (r.top > vh || r.bottom < 0) return;
    const p = clamp((vh * 0.62 - r.top) / r.height);
    tl.style.setProperty('--p', p.toFixed(4));
    tl.querySelectorAll('.tl-item').forEach(item => {
      item.classList.toggle('lit', item.offsetTop + 10 <= p * r.height);
    });
  });
}

let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { onScroll(); ticking = false; });
}, { passive: true });
addEventListener('resize', onScroll, { passive: true });
onScroll();

if (reduced) {
  root.classList.add('reduced');
  timelines.forEach(tl => {
    tl.style.setProperty('--p', '1');
    tl.querySelectorAll('.tl-item').forEach(i => i.classList.add('lit'));
  });
}

// ── Project tours: real screen recordings, Apple-style chapters ─────
// Clips load lazily and play muted, advancing on their own. Only the most
// visible tour plays (or the one the visitor last touched), and only while
// its device is on screen, no overlay is open and the visitor hasn't paused.
const tours = [];
let preferredTour = null;

function playingTour() {
  if (preferredTour && preferredTour.ratio >= 0.35) return preferredTour;
  const best = tours.reduce((a, t) => (t.ratio > a.ratio ? t : a), { ratio: 0 });
  return best.ratio >= 0.35 ? best : null;
}
const syncTours = () => tours.forEach(t => t.sync());

document.querySelectorAll('[data-tour]').forEach(card => {
  const list    = card.querySelector('.tour-list');
  const items   = [...card.querySelectorAll('.tour-item')];
  const videos  = [...card.querySelectorAll('.tour-video')];
  const caption = card.querySelector('.tour-caption');
  const toggle  = card.querySelector('.tour-toggle');
  const device  = card.querySelector('.phone');
  const what    = toggle.getAttribute('aria-label').replace(/^Pause /, '');
  // H.264 where supported (Safari, Chrome, Edge, Firefox), VP9 elsewhere (e.g. plain Chromium).
  const ext = videos[0].canPlayType('video/mp4; codecs="avc1.640028"') ? 'mp4' : 'webm';
  const me = { ratio: 0, sync };
  tours.push(me);

  let index      = 0;
  let paused     = reduced; // reduced motion: nothing plays until asked
  let userPaused = false;   // an explicit Pause sticks until Play
  let raf        = 0;
  let dwell      = 0;

  // poster: only where it will actually show; warm: buffer the whole clip.
  const load = (v, { warm = false, poster = true } = {}) => {
    if (warm) v.preload = 'auto';
    if (poster && !v.getAttribute('poster')) v.poster = v.dataset.poster;
    if (!v.getAttribute('src')) v.src = `${v.dataset.src}.${ext}`;
  };
  const current = () => videos[index];
  const canPlay = () => !paused && playingTour() === me && !document.hidden && !root.classList.contains('scroll-locked');

  function sync() {
    const v = current();
    if (!canPlay()) return v.pause();
    load(v, { warm: true });
    v.play().catch(e => { if (e.name === 'NotAllowedError') setPaused(true); }); // e.g. iOS Low Power Mode
  }

  function setPaused(p, { apply = true } = {}) {
    paused = p;
    card.classList.toggle('is-paused', p);
    toggle.setAttribute('aria-label', `${p ? 'Play' : 'Pause'} ${what}`);
    if (apply) sync();
  }

  function show(i) {
    const prev = current();
    index = (i + videos.length) % videos.length;
    items.forEach((it, k) => {
      const on = k === index;
      it.classList.toggle('is-active', on);
      if (on) { it.setAttribute('aria-current', 'true'); it.style.setProperty('--progress', '0'); }
      else it.removeAttribute('aria-current');
    });
    videos.forEach((v, k) => v.classList.toggle('is-active', k === index));
    caption?.querySelectorAll('span').forEach((s, k) => s.classList.toggle('is-active', k === index));
    if (prev !== current()) prev.pause();
    load(current()); // sync() warms it if it is going to play
    if (current().readyState > 0) current().currentTime = 0;
    sync();
    // Keep the active pill visible when the chapters scroll sideways (narrow screens).
    if (list.scrollWidth > list.clientWidth) {
      const li = items[index].parentElement;
      list.scrollTo({ left: li.offsetLeft - (list.clientWidth - li.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  // The active chapter's bar follows its clip; the next clip is fetched once
  // this one has held the visitor for a few seconds.
  const tick = () => {
    const v = current();
    if (v.duration) items[index].style.setProperty('--progress', (v.currentTime / v.duration).toFixed(4));
    if (v.currentTime > 3) load(videos[(index + 1) % videos.length], { warm: true, poster: false });
    raf = v.paused || v.readyState < 3 ? 0 : requestAnimationFrame(tick); // stalled: 'playing' restarts it
  };

  videos.forEach((v, k) => {
    v.addEventListener('playing', () => { if (k === index && !raf) raf = requestAnimationFrame(tick); });
    v.addEventListener('ended', () => {
      if (k !== index) return;
      items[index].style.setProperty('--progress', '1');
      if (paused) return;
      // Don't move the chapters under keyboard focus: replay this one instead.
      if (list.querySelector(':focus-visible')) { v.currentTime = 0; sync(); }
      else show(index + 1);
    });
    // A clip that fails to load is reset (so it can retry later) and skipped.
    v.addEventListener('error', () => {
      v.removeAttribute('src');
      v.load();
      if (k === index) setTimeout(() => { if (k === index && canPlay()) show(index + 1); }, 2500);
    });
  });

  items.forEach((it, k) => it.addEventListener('click', () => {
    preferredTour = me;
    if (!reduced && !userPaused) setPaused(false, { apply: false }); // picking a chapter means "show me"
    show(k);
    syncTours(); // another tour may have to give way
  }));
  toggle.addEventListener('click', () => {
    userPaused = !paused;
    if (!userPaused) preferredTour = me;
    setPaused(!paused);
    syncTours();
  });

  // Posters load a little before the device scrolls in; playback needs it on
  // screen for a moment (a quick fling past the card downloads nothing).
  const near = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { load(current()); near.disconnect(); }
  }, { rootMargin: '400px 0px' });
  near.observe(device);
  new IntersectionObserver(entries => {
    const e = entries[entries.length - 1];
    me.ratio = e.isIntersecting ? e.intersectionRatio : 0;
    if (preferredTour === me && me.ratio < 0.35) preferredTour = null;
    clearTimeout(dwell);
    if (me.ratio >= 0.35) dwell = setTimeout(syncTours, 350);
    else syncTours();
  }, { threshold: [0, 0.35, 0.5, 0.75, 1] }).observe(device);
  document.addEventListener('visibilitychange', sync);
  root.addEventListener('scrolllock', sync);

  setPaused(paused, { apply: false });
});

// ── Screen galleries in project dialogs ──────────────────
// aria-disabled (not disabled) at the ends, so a focused arrow keeps focus.
document.querySelectorAll('.modal-screens').forEach(box => {
  const strip = box.querySelector('.screens');
  const [prev, next] = box.querySelectorAll('[data-screens]');
  const update = () => {
    prev.setAttribute('aria-disabled', String(strip.scrollLeft < 4));
    next.setAttribute('aria-disabled', String(strip.scrollLeft + strip.clientWidth > strip.scrollWidth - 4));
  };
  [prev, next].forEach(b => b.addEventListener('click', () => {
    strip.scrollBy({ left: Number(b.dataset.screens) * strip.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' });
  }));
  strip.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(strip); // also runs when the dialog opens
});

// ── Project dialogs ──────────────────────────────────────
let lastTrigger = null;

function closeDialog(dlg) {
  if (!dlg.open || dlg.classList.contains('closing')) return;
  if (reduced) return dlg.close();
  dlg.classList.add('closing');
  const onEnd = e => { if (e.target === dlg) done(); }; // ignore animations inside the visual
  const timer = setTimeout(() => done(), 450);          // safety net
  const done = () => {
    clearTimeout(timer);
    dlg.removeEventListener('animationend', onEnd);
    if (dlg.open && dlg.classList.contains('closing')) dlg.close(); // not if reopened meanwhile
  };
  dlg.addEventListener('animationend', onEnd);
}

document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.open);
    if (!dlg || dlg.open) return;
    lastTrigger = btn;
    lockScroll();
    dlg.showModal();
    dlg.scrollTop = 0;
  });
});

document.querySelectorAll('dialog.modal').forEach(dlg => {
  // However the dialog ends up closed (animation, Esc, back gesture), clean up here.
  dlg.addEventListener('close', () => {
    dlg.classList.remove('closing');
    lastTrigger?.focus({ preventScroll: true });
    unlockScroll();
  });
  dlg.addEventListener('cancel', e => { e.preventDefault(); closeDialog(dlg); });
  // Backdrop closes only if the press started there too — selecting text and
  // releasing outside the panel must not close it.
  let pressedBackdrop = false;
  dlg.addEventListener('pointerdown', e => { pressedBackdrop = e.target === dlg; });
  dlg.addEventListener('click', e => {
    if ((e.target === dlg && pressedBackdrop) || e.target.closest('[data-close]')) closeDialog(dlg);
  });
});

// ── Copy email ───────────────────────────────────────────
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}
document.getElementById('copy-email').addEventListener('click', async e => {
  const email = e.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard');
  } catch {
    location.href = `mailto:${email}`;
  }
});

// ═══════════════════════════════════════════════════════════
//  HERO — WebGL light field (raw WebGL, no library)
// ═══════════════════════════════════════════════════════════
function initHeroShader() {
  const canvas = document.getElementById('hero-canvas');
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) { root.classList.add('no-webgl'); return null; }

  const vert = `
    attribute vec2 a;
    void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

  const frag = `
    precision highp float;
    uniform vec2  uRes;
    uniform float uTime;
    uniform vec2  uMouse;
    uniform float uLight;
    uniform float uFade;
    uniform float uPointer;

    // Simplex noise — Ashima Arts / Stefan Gustavson (MIT)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g  = step(x0.yzx, x0.xyz);
      vec3 l  = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x  = x_ * ns.x + ns.yyyy;
      vec4 y  = y_ * ns.x + ns.yyyy;
      vec4 h  = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    void main() {
      vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;   // centred, aspect-correct, y up
      float t = uTime * 0.05;

      // Organic drift: warp the plane with slow noise.
      vec2 w = vec2(snoise(vec3(p * 0.9, t)), snoise(vec3(p * 0.9 + 5.2, t + 1.7)));
      vec2 q = p + w * 0.22 + uMouse * vec2(0.05, -0.03);

      // A light horizon arching up from the bottom edge.
      float horizon = -0.66 + 0.11 * cos(q.x * 1.7);
      float dy = q.y - horizon;
      float m  = exp(-dy * dy * 8.5) * exp(-q.x * q.x * 0.5);
      m *= 0.5 + 0.6 * (0.5 + 0.5 * snoise(vec3(q * 1.5, t * 1.6 + 3.0)));

      // Faint light following the cursor (only once the pointer has moved).
      vec2 mp = vec2(uMouse.x * 0.8, -uMouse.y * 0.5);
      m += 0.1 * uPointer * exp(-dot(p - mp, p - mp) * 9.0);

      // Colour across the arc: cyan → blue → indigo → violet.
      float h = q.x * 0.85 + snoise(vec3(q * 1.1 + 9.0, t * 1.3)) * 0.55;
      vec3 cyan   = vec3(0.39, 0.82, 1.00);
      vec3 blue   = vec3(0.04, 0.48, 1.00);
      vec3 indigo = vec3(0.37, 0.36, 0.95);
      vec3 violet = vec3(0.75, 0.35, 0.95);
      vec3 col = mix(cyan, blue, smoothstep(-1.0, -0.25, h));
      col = mix(col, indigo, smoothstep(-0.25, 0.35, h));
      col = mix(col, violet, smoothstep(0.35, 1.0, h));

      m *= uFade;
      vec3 dark  = 1.0 - exp(-(col * m * 1.45 + vec3(pow(m, 3.0) * 0.3)) * 1.25);
      vec3 light = mix(vec3(1.0), mix(col, vec3(1.0), 0.15), clamp(m * 0.62, 0.0, 1.0));
      vec3 c = mix(dark, light, uLight);

      c += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * (3.0 / 255.0); // dither, no banding
      gl_FragColor = vec4(c, 1.0);
    }`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }
  const vs = compile(gl.VERTEX_SHADER, vert);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  const prog = gl.createProgram();
  if (!vs || !fs) { root.classList.add('no-webgl'); return null; }
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { root.classList.add('no-webgl'); return null; }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = name => gl.getUniformLocation(prog, name);
  const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse'), uLight = u('uLight'), uFade = u('uFade');
  const uPointer = u('uPointer');

  // State (eased towards targets every frame).
  let light = isLight() ? 1 : 0, lightTarget = light;
  let fade = 1;
  let pointer = 0, pointerTarget = 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let visible = true;
  let raf = 0;
  const t0 = performance.now();

  function resize() {
    // The field is soft, so half resolution is plenty — cheap on any GPU.
    const scale = Math.min(devicePixelRatio || 1, 2) * 0.5;
    const w = Math.max(1, Math.round(canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  }

  function draw(now) {
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    light   += (lightTarget - light) * 0.12;
    pointer += (pointerTarget - pointer) * 0.03;
    gl.uniform1f(uTime, reduced ? 24.0 : (now - t0) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uLight, light);
    gl.uniform1f(uFade, fade);
    gl.uniform1f(uPointer, pointer);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function loop(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    draw(now);
    if (!reduced) raf = requestAnimationFrame(loop);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  // Static frame for reduced motion; re-render on changes only.
  const redraw = () => { if (reduced) { light = lightTarget; draw(performance.now()); } else kick(); };

  resize();
  draw(t0);
  canvas.classList.add('ready');
  kick();

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }).observe(canvas);
  document.addEventListener('visibilitychange', kick);
  addEventListener('resize', () => { resize(); redraw(); }, { passive: true });
  if (!reduced && matchMedia('(hover: hover)').matches) {
    addEventListener('pointermove', e => {
      mouse.tx = (e.clientX / innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / innerHeight) * 2 - 1;
      pointerTarget = 1;
    }, { passive: true });
  }
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); root.classList.add('no-webgl'); });

  return {
    setTheme(isLightTheme) { lightTarget = isLightTheme ? 1 : 0; redraw(); },
    setFade(v) { fade = clamp(v); },
  };
}
