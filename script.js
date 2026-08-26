/* ═══════════════════════════════════════════════════════════════
   BIRTHDAY WEBSITE — COMPLETE INTERACTIVE EXPERIENCE
   All animations, interactions, and features
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── CONFIGURATION ──────────────────────────────────────────── */
const CONFIG = {
  PIN: '100323',
  NAME: 'Ciwa',
  DATE: 'June 10',

  TYPEWRITER_TEXTS: [
    'The most beautiful day of the entire year…',
    'Every year with you is a blessing.',
    'You are the warmest light in my life.',
    'Every one of your wishes will come true. 🌸',
  ],

  BOUQUET_FLOWERS: [
    { emoji: '🌸', msg: 'You are as beautiful as cherry blossoms — lovely and bringing joy wherever you go.', x: 47, y: 4, delay: 0 },
    { emoji: '🌺', msg: 'Like a hibiscus in full bloom, you are always vibrant and radiant.', x: 25, y: 18, delay: 0.3 },
    { emoji: '🌷', msg: 'You are as sincere as a tulip — pure, elegant, and always captivating.', x: 67, y: 16, delay: 0.6 },
    { emoji: '🌼', msg: 'Your cheerfulness is like a daisy — simple yet brightening every single day.', x: 15, y: 40, delay: 0.9 },
    { emoji: '🌹', msg: 'You are the finest rose that ever bloomed — full of love and unmatched beauty.', x: 80, y: 38, delay: 1.2 },
    { emoji: '🌻', msg: 'Like a sunflower, you always turn toward the light and share your warmth with everyone around you.', x: 35, y: 52, delay: 1.5 },
    { emoji: '💐', msg: 'This entire garden is for you — because you deserve all the beauty in the world.', x: 60, y: 55, delay: 1.8 },
  ],

  POLAROIDS: [
    { caption: 'Our very first sunset together', rotate: -6, url: 'https://smail.my.id/cloud/kcnMExE41' },
    { caption: 'Our favourite café in the corner of the city', rotate: 4, url: 'https://smail.my.id/cloud/KLZ3cJrp1' },
    { caption: 'First time at the beach, just the two of us', rotate: -3, url: 'https://smail.my.id/cloud/kgS63QYF1' }
  ],

  TIMELINE: [
    { date: 'The Very Beginning', title: 'First Time We Met', desc: 'The day the world seemed to spin a little faster and everything felt different from before.', emoji: '✨' },
    { date: 'A Magical Moment', title: 'Our First Conversation', desc: 'The first words spoken, the first laughter shared — the beginning of thousands of stories we would write together.', emoji: '💬' },
    { date: 'A Beautiful Memory', title: 'Our First Outing', desc: 'A small adventure that felt like a trip to the best place on earth, simply because you were there.', emoji: '🌿' },
    { date: 'A Precious Moment', title: 'Laughter That Never Ended', desc: 'The moment we laughed until it hurt and I realised this is a feeling I want to hold on to forever.', emoji: '😄' },
    { date: 'A Sweet Memory', title: 'Beautiful Silence Together', desc: 'The comfortable quiet beside you feels warmer than a thousand words ever could.', emoji: '🌙' },
    { date: 'Today', title: 'Your Very Special Birthday', desc: 'Celebrating you, your journey, and all the wonder you have brought into my life.', emoji: '🎂' },
  ],

  PLAYLIST: [
    { name: 'Shape Of My Heart', artist: 'Backstreet Boys', emoji: '🎵', duration: '1:00', url: 'https://smail.my.id/cloud/tvBJ12wx1' },
    { name: 'Angel Baby', artist: 'Troye Sivan', emoji: '🎵', duration: '1:00', url: 'https://smail.my.id/cloud/kf52BoRo1' },
    { name: 'My Love', artist: 'Westlife', emoji: '🎵', duration: '1:00', url: 'https://smail.my.id/cloud/E6qLnqZi1' }
  ],

  REASONS: [
    'Your laughter can make even the worst day feel so much lighter.',
    'The way you care for the people around you is something rare and truly precious.',
    'Your spirit in the face of challenges inspires me every single day.',
    'You make the simplest things feel incredibly special and meaningful.',
    'Your honesty, even when it is difficult, shows just how strong your character is.',
    'Your creativity never fails to captivate me and make me want to keep learning.',
    'You are always there when you are needed most, without ever being asked.',
    'Your kindness to strangers reveals just how beautiful your heart is.',
    'Your unique way of seeing the world makes me notice beauty I never would have found on my own.',
    'You accept me exactly as I am, with all my flaws and everything in between.',
    'Your passion for the things you love is one of the most beautiful things I have ever witnessed.',
    'Your presence alone is enough to make any room feel warmer.',
  ],
};

/* ─── STATE ──────────────────────────────────────────────────── */
const STATE = {
  pinValue: '',
  isMainVisible: false,
  currentTrack: 0,
  isPlaying: false,
  trackProgress: 0,
  progressInterval: null,
  openedReasons: new Set(),
  ambientPetalInterval: null,
  revealObserver: null,
  audio: null,
  polaroidInitDone: false,
  // FIX: track whether a user gesture has occurred for iOS autoplay
  userHasInteracted: false,
  pendingAutoplay: false,
};

/* ─── UTILITIES ──────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function clamp(v, mn, mx) { return Math.min(mx, Math.max(mn, v)); }

/* ─── iOS DETECTION ──────────────────────────────────────────── */
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

/* ════════════════════════════════════════════════════════════════
   LOADING SCREEN
════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  const lp = $('loading-petals');
  if (lp) {
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.textContent = ['🌸', '🌺', '🌷', '🌼', '✿'][randInt(0, 4)];
      p.style.cssText = `
        left: ${rand(0, 100)}%;
        animation-duration: ${rand(4, 8)}s;
        animation-delay: ${rand(0, 4)}s;
        font-size: ${rand(12, 24)}px;
        opacity: 0;
        position: absolute;
        pointer-events: none;
      `;
      lp.appendChild(p);
    }
  }

  setTimeout(() => {
    const ls = $('loading-screen');
    if (ls) {
      ls.style.transition = 'opacity 0.8s ease';
      ls.style.opacity = '0';
      setTimeout(() => {
        ls.style.display = 'none';
        showPinScreen();
      }, 800);
    }
  }, 2200);
});

/* ════════════════════════════════════════════════════════════════
   PIN SCREEN
════════════════════════════════════════════════════════════════ */
function showPinScreen() {
  const screen = $('pin-screen');
  if (screen) screen.classList.remove('hidden');
  initPinCanvas();
  createPinPetals();
  bindPinEvents();
}

function initPinCanvas() {
  const canvas = $('pin-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(1, 3),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      a: rand(0.1, 0.5),
    });
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,150,180,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function createPinPetals() {
  const container = $('pin-petals');
  if (!container) return;
  const emojis = ['🌸', '🌺', '🌷', '✿'];
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = emojis[i % emojis.length];
    p.style.cssText = `
      left: ${rand(0, 100)}%;
      animation-duration: ${rand(6, 12)}s;
      animation-delay: ${rand(0, 6)}s;
      font-size: ${rand(14, 26)}px;
      position: absolute;
      pointer-events: none;
    `;
    container.appendChild(p);
  }
}

function bindPinEvents() {
  qsa('.pin-btn[data-digit]').forEach(btn => {
    btn.removeEventListener('click', addPinDigitHandler);
    btn.addEventListener('click', addPinDigitHandler);
  });

  function addPinDigitHandler(e) {
    // FIX: PIN button taps count as user gesture for iOS autoplay
    markUserInteraction();
    addPinDigit(e.currentTarget.dataset.digit);
  }

  const clearBtn = $('pin-clear-btn');
  if (clearBtn) {
    clearBtn.removeEventListener('click', clearPin);
    clearBtn.addEventListener('click', clearPin);
  }

  const submitBtn = $('pin-submit-btn');
  if (submitBtn) {
    submitBtn.removeEventListener('click', submitPin);
    submitBtn.addEventListener('click', submitPin);
  }

  document.removeEventListener('keydown', pinKeyHandler);
  document.addEventListener('keydown', pinKeyHandler);
}

/* FIX: Record first user gesture so iOS will allow audio playback later */
function markUserInteraction() {
  if (STATE.userHasInteracted) return;
  STATE.userHasInteracted = true;

  // Warm up the audio element with a silent play so iOS unlocks it
  if (!STATE.audio) {
    STATE.audio = new Audio();
    STATE.audio.volume = 0;
  }
  const warmup = STATE.audio.play();
  if (warmup) warmup.catch(() => {});
  STATE.audio.pause();
  STATE.audio.volume = 0.7;
}

function pinKeyHandler(e) {
  const pinScreen = $('pin-screen');
  if (!pinScreen || pinScreen.classList.contains('hidden')) return;
  if (e.key >= '0' && e.key <= '9') addPinDigit(e.key);
  if (e.key === 'Backspace') clearPin();
  if (e.key === 'Enter') submitPin();
}

function addPinDigit(digit) {
  if (STATE.pinValue.length >= 6) return;
  STATE.pinValue += digit;
  updatePinDots();
  if (STATE.pinValue.length === 6) {
    setTimeout(submitPin, 200);
  }
}

function clearPin() {
  if (!STATE.pinValue.length) return;
  STATE.pinValue = STATE.pinValue.slice(0, -1);
  updatePinDots();
}

function updatePinDots() {
  for (let i = 0; i < 6; i++) {
    const dot = $(`dot-${i}`);
    if (dot) dot.classList.toggle('filled', i < STATE.pinValue.length);
  }
}

function submitPin() {
  if (STATE.pinValue === CONFIG.PIN) {
    pinSuccess();
  } else {
    pinError();
  }
}

function pinError() {
  for (let i = 0; i < 6; i++) {
    const dot = $(`dot-${i}`);
    if (dot && i < STATE.pinValue.length) dot.classList.add('error');
  }
  const errEl = $('pin-error');
  if (errEl) errEl.classList.remove('hidden');
  STATE.pinValue = '';
  setTimeout(() => {
    updatePinDots();
    if (errEl) errEl.classList.add('hidden');
    qsa('.pin-dot').forEach(d => d.classList.remove('error'));
  }, 1400);
}

function pinSuccess() {
  const overlay = $('pin-success');
  if (overlay) overlay.classList.remove('hidden');
  setTimeout(() => {
    const pinScreen = $('pin-screen');
    if (pinScreen) pinScreen.classList.add('hidden');
    showGiftBox();
  }, 800);
}

/* ════════════════════════════════════════════════════════════════
   GIFT BOX SCREEN
════════════════════════════════════════════════════════════════ */
function showGiftBox() {
  const screen = $('giftbox-screen');
  if (screen) screen.classList.remove('hidden');
  createGiftParticles();

  const wrapper = $('giftbox-wrapper');
  if (wrapper) {
    wrapper.removeEventListener('click', openGiftBox);
    wrapper.removeEventListener('touchend', openGiftBox);
    wrapper.addEventListener('click', openGiftBox, { once: true });
    wrapper.addEventListener('touchend', openGiftBox, { once: true });
  }
}

function createGiftParticles() {
  const container = $('gift-particles');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${rand(2, 5)}px; height: ${rand(2, 5)}px;
      border-radius: 50%;
      background: rgba(255,150,180,${rand(0.2, 0.5)});
      left: ${rand(20, 80)}%;
      top: ${rand(30, 70)}%;
      animation: giftParticle ${rand(3, 6)}s ease-in-out infinite;
      animation-delay: ${rand(0, 3)}s;
    `;
    container.appendChild(p);
  }
}

function openGiftBox() {
  // FIX: gift box tap is also a valid user gesture for iOS
  markUserInteraction();

  const instr = $('gift-instruction-text');
  if (instr) instr.textContent = '✨ Opening your gift… ✨';
  const wrapper = $('giftbox-wrapper');
  if (wrapper) wrapper.style.animation = 'none';
  const lid = $('giftbox-lid');
  if (lid) lid.classList.add('open');

  setTimeout(() => {
    const glow = $('gift-inner-glow');
    if (glow) glow.classList.add('active');
  }, 400);

  setTimeout(() => {
    createLightRays();
  }, 600);

  setTimeout(() => {
    createGiftBurst();
  }, 800);

  setTimeout(() => {
    const screen = $('giftbox-screen');
    if (screen) {
      screen.style.transition = 'opacity 1s ease';
      screen.style.opacity = '0';
      setTimeout(() => {
        screen.classList.add('hidden');
        showMainContent();
      }, 1000);
    }
  }, 2800);
}

function createLightRays() {
  const raysContainer = $('gift-rays');
  if (!raysContainer) return;
  raysContainer.classList.add('active');
  raysContainer.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const ray = document.createElement('div');
    ray.className = 'ray';
    const angle = (i / 12) * 360;
    ray.style.cssText = `
      transform: rotate(${angle}deg);
      animation-delay: ${i * 0.05}s;
      width: ${rand(150, 280)}px;
      position: absolute;
      height: 4px;
      background: linear-gradient(90deg, transparent, rgba(255,230,180,0.8), transparent);
      top: 50%;
      left: 50%;
      transform-origin: 0% 50%;
    `;
    raysContainer.appendChild(ray);
  }
}

function createGiftBurst() {
  const container = $('gift-bloom-container');
  if (!container) return;
  const emojis = ['🌸', '🌺', '🌷', '🌼', '✨', '💕', '🌸', '🌺'];
  emojis.forEach((emoji, i) => {
    const el = document.createElement('div');
    const angle = (i / emojis.length) * 360;
    const dist = rand(80, 180);
    const radians = (angle * Math.PI) / 180;
    el.textContent = emoji;
    el.style.cssText = `
      position: absolute;
      font-size: ${rand(20, 36)}px;
      left: 50%; top: 50%;
      animation: burstFly 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      animation-delay: ${i * 0.08}s;
      --tx: ${Math.cos(radians) * dist}px;
      --ty: ${Math.sin(radians) * dist}px;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  });
}

/* ════════════════════════════════════════════════════════════════
   MAIN CONTENT
════════════════════════════════════════════════════════════════ */
function showMainContent() {
  const main = $('main-content');
  if (main) main.classList.remove('hidden');
  STATE.isMainVisible = true;

  initAmbientPetals();
  initScrollProgress();
  initHeroCanvas();
  initHeroTypewriter();
  initRevealObserver();
  initBouquet();
  initPolaroids();
  initTimeline();
  initMusicPlayer();
  initReasonsJar();
  initFinalSection();
  initMusicFloatBtn();

  window.scrollTo(0, 0);
  setTimeout(() => {
    qsa('.hero-content .reveal-fade, .hero-content .reveal-up').forEach(el => {
      el.classList.add('revealed');
    });
  }, 300);
}

/* ─── AMBIENT PETALS ─────────────────────────────────────────── */
function initAmbientPetals() {
  const container = $('ambient-petals');
  if (!container) return;
  const emojis = ['🌸', '🌺', '🌷', '🌼', '✿', '❀'];
  function spawnPetal() {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = emojis[randInt(0, emojis.length - 1)];
    const size = rand(12, 24);
    const duration = rand(8, 16);
    p.style.cssText = `
      left: ${rand(-5, 105)}%;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: 0s;
      opacity: 0;
      position: absolute;
      pointer-events: none;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), duration * 1000 + 500);
  }
  for (let i = 0; i < 8; i++) setTimeout(spawnPetal, i * 600);
  if (STATE.ambientPetalInterval) clearInterval(STATE.ambientPetalInterval);
  STATE.ambientPetalInterval = setInterval(spawnPetal, 1800);
}

/* ─── SCROLL PROGRESS ────────────────────────────────────────── */
function initScrollProgress() {
  const bar = $('scroll-progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* ─── HERO CANVAS ────────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = $('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  const orbs = [];
  for (let i = 0; i < 5; i++) {
    orbs.push({
      x: rand(0.1, 0.9),
      y: rand(0.1, 0.9),
      r: rand(150, 300),
      speed: rand(0.0003, 0.0008),
      phase: rand(0, Math.PI * 2),
      color: `rgba(${randInt(180, 255)}, ${randInt(80, 130)}, ${randInt(120, 180)}, 0.04)`,
    });
  }
  let t = 0;
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.01;
    orbs.forEach(o => {
      const x = canvas.width * (o.x + Math.sin(t * o.speed * 1000 + o.phase) * 0.15);
      const y = canvas.height * (o.y + Math.cos(t * o.speed * 1000 + o.phase * 1.3) * 0.15);
      const grd = ctx.createRadialGradient(x, y, 0, x, y, o.r);
      grd.addColorStop(0, o.color);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, o.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── TYPEWRITER ─────────────────────────────────────────────── */
function initHeroTypewriter() {
  const el = $('hero-typewriter');
  if (!el) return;
  let textIdx = 0, charIdx = 0, deleting = false;
  function type() {
    const text = CONFIG.TYPEWRITER_TEXTS[textIdx];
    if (!deleting) {
      el.textContent = text.slice(0, charIdx);
      charIdx++;
      if (charIdx > text.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 70);
    } else {
      el.textContent = text.slice(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        charIdx = 0;
        textIdx = (textIdx + 1) % CONFIG.TYPEWRITER_TEXTS.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }
  setTimeout(type, 1200);
}

/* ─── REVEAL OBSERVER ────────────────────────────────────────── */
function initRevealObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.15 });
  qsa('.reveal-fade, .reveal-up, .reveal-scale').forEach(el => observer.observe(el));
  STATE.revealObserver = observer;
}

/* ════════════════════════════════════════════════════════════════
   BOUQUET
════════════════════════════════════════════════════════════════ */
function initBouquet() {
  const container = $('bouquet-flowers');
  if (!container) return;
  container.innerHTML = '';
  const msgEl = $('bouquet-message')?.querySelector('p');

  CONFIG.BOUQUET_FLOWERS.forEach((flower, i) => {
    const el = document.createElement('div');
    el.className = 'b-flower';
    el.style.cssText = `
      left: ${flower.x}%; top: ${flower.y}%;
      animation-duration: ${rand(3, 5)}s;
      animation-delay: ${flower.delay}s;
      transform: translateX(-50%);
      z-index: ${10 - i};
      position: absolute;
      cursor: pointer;
    `;
    el.innerHTML = `<span class="b-flower-emoji" style="font-size:32px;">${flower.emoji}</span>`;
    const handleTouch = (e) => {
      e.preventDefault();
      if (msgEl) activateFlower(el, flower.msg, msgEl);
    };
    el.addEventListener('mouseenter', () => { if (msgEl) activateFlower(el, flower.msg, msgEl); });
    el.addEventListener('touchstart', handleTouch, { passive: false });
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) scale(0)';
    setTimeout(() => {
      el.style.transition = `opacity 0.6s ease ${flower.delay}s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${flower.delay}s`;
      el.style.opacity = '1';
      el.style.transform = 'translateX(-50%) scale(1)';
    }, 200);
    container.appendChild(el);
  });
}

function activateFlower(el, msg, msgEl) {
  qsa('.b-flower').forEach(f => f.classList.remove('tapped'));
  el.classList.add('tapped');
  msgEl.style.opacity = '0';
  msgEl.style.transform = 'translateY(8px)';
  setTimeout(() => {
    msgEl.textContent = msg;
    msgEl.style.transition = 'all 0.4s ease';
    msgEl.style.opacity = '1';
    msgEl.style.transform = 'translateY(0)';
  }, 150);
  const bouquetRect = $('bouquet-container')?.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  if (bouquetRect) spawnHearts(elRect.left - bouquetRect.left, elRect.top - bouquetRect.top);
}

function spawnHearts(x, y) {
  const container = $('bouquet-particles');
  if (!container) return;
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('div');
    h.textContent = ['💕', '🌸', '✨'][randInt(0, 2)];
    h.style.cssText = `
      position: absolute;
      left: ${x}px; top: ${y}px;
      font-size: ${rand(12, 20)}px;
      pointer-events: none;
      animation: heartRise ${rand(1, 2)}s ease forwards;
      animation-delay: ${i * 0.1}s;
      --dx: ${rand(-30, 30)}px;
    `;
    container.appendChild(h);
    setTimeout(() => h.remove(), 2200);
  }
}

/* ════════════════════════════════════════════════════════════════
   POLAROID MEMORIES
   FIX: iOS squashes photos because the photo wrapper has height:160px
   set via inline style but iOS Safari doesn't always honour it when
   the element is off-screen or just mounted.  We use a fixed
   aspect-ratio trick (padding-bottom) instead so height is derived
   from the rendered width — no explicit pixel height needed.
════════════════════════════════════════════════════════════════ */
function initPolaroids() {
  if (STATE.polaroidInitDone) return;
  STATE.polaroidInitDone = true;

  const grid = $('polaroid-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CONFIG.POLAROIDS.forEach((photo, i) => {
    const el = document.createElement('div');
    el.className = 'polaroid';
    const rot = photo.rotate || 0;
    el.dataset.rotate = rot;

    el.style.cssText = `
      transform: rotate(${rot}deg) translateY(20px);
      transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.12}s;
      opacity: 0;
    `;

    /* FIX: use a padding-bottom aspect-ratio wrapper instead of a
       fixed pixel height so iOS Safari renders the photo correctly. */
    let photoContent = '';
    if (photo.url && photo.url.trim() !== '') {
      photoContent = `<img src="${photo.url}" alt="${photo.caption}" loading="lazy"
        style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;border-radius:12px 12px 4px 4px;">`;
    } else {
      photoContent = `<div style="position:absolute;top:0;left:0;width:100%;height:100%;
        background:linear-gradient(135deg,#ffc0d0,#ff96b4);
        display:flex;align-items:center;justify-content:center;
        font-size:48px;border-radius:12px 12px 4px 4px;">${photo.emoji || '📷'}</div>`;
    }

    el.innerHTML = `
      <div class="polaroid-tape" style="position:absolute;top:-8px;left:20%;width:60px;height:24px;background:rgba(255,245,200,0.8);opacity:0.7;border-radius:2px;transform:rotate(-5deg);"></div>
      <div class="polaroid-photo" style="position:relative;width:100%;padding-bottom:75%;overflow:hidden;border-radius:12px 12px 4px 4px;">
        ${photoContent}
      </div>
      <div class="polaroid-caption" style="padding:12px;font-size:14px;text-align:center;font-weight:500;">${photo.caption}</div>
    `;

    el.addEventListener('click', () => openPhotoModal(photo));
    el.addEventListener('touchend', (e) => { e.preventDefault(); openPhotoModal(photo); });
    grid.appendChild(el);
  });

  /* FIX: on iOS the grid may not have final dimensions yet when the
     observer fires immediately.  Add a small rAF delay after the
     reveal so the browser has committed layout before we change
     transform/opacity. */
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          qsa('.polaroid').forEach(p => {
            const rot = p.dataset.rotate || 0;
            p.style.opacity = '1';
            p.style.transform = `rotate(${rot}deg) translateY(0)`;
          });
        }, 50);
      });
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  observer.observe(grid);
}

/* ─── PHOTO MODAL ────────────────────────────────────────────── */
function openPhotoModal(photo) {
  const modal = $('photo-modal');
  if (!modal) return;
  const modalPhoto = $('modal-photo');
  const modalCaption = $('modal-caption');

  if (modalPhoto) {
    if (photo.url && photo.url.trim() !== '') {
      modalPhoto.innerHTML = `<img src="${photo.url}" alt="${photo.caption}"
        style="width:100%;height:100%;object-fit:cover;display:block;border-radius:8px;">`;
    } else {
      modalPhoto.innerHTML = '';
      modalPhoto.textContent = photo.emoji || '📷';
    }
  }

  if (modalCaption) modalCaption.textContent = photo.caption;
  modal.classList.remove('hidden');

  const backdrop = $('modal-backdrop');
  const closeBtn = $('modal-close');
  const closeHandler = () => closePhotoModal();
  if (backdrop) backdrop.addEventListener('click', closeHandler, { once: true });
  if (closeBtn) closeBtn.addEventListener('click', closeHandler, { once: true });
}

function closePhotoModal() {
  const modal = $('photo-modal');
  if (!modal) return;
  const content = modal.querySelector('.modal-content');
  if (content) content.style.animation = 'modalOut 0.3s ease forwards';
  setTimeout(() => {
    modal.classList.add('hidden');
    if (content) content.style.animation = '';
  }, 300);
}

/* ════════════════════════════════════════════════════════════════
   TIMELINE
════════════════════════════════════════════════════════════════ */
function initTimeline() {
  const container = $('timeline-items');
  if (!container) return;
  container.innerHTML = '';
  CONFIG.TIMELINE.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <span class="timeline-emoji">${item.emoji}</span>
        <div class="timeline-date">${item.date}</div>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-desc">${item.desc}</p>
      </div>
    `;
    container.appendChild(el);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('revealed'); });
  }, { threshold: 0.2 });
  qsa('.timeline-item').forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════════════════════════
   MUSIC PLAYER
   FIX: iOS requires a user gesture before any audio can play.
   The PIN digit taps and gift box tap already call markUserInteraction()
   which warms up the Audio element.  Here we attempt autoplay and,
   if it's rejected (iOS before gesture), we set pendingAutoplay=true
   and show a soft "tap to play" nudge instead of silently failing.
════════════════════════════════════════════════════════════════ */
function initMusicPlayer() {
  const list = $('playlist-list');
  if (!list) return;
  list.innerHTML = '';
  CONFIG.PLAYLIST.forEach((track, i) => {
    const el = document.createElement('div');
    el.className = 'playlist-item';
    el.dataset.index = i;
    el.innerHTML = `<span class="pl-num">${i + 1}</span><div class="pl-info"><div class="pl-name">${track.name}</div><div class="pl-artist">${track.artist}</div></div><span class="pl-emoji">${track.emoji}</span>`;
    el.addEventListener('click', () => selectTrack(i));
    list.appendChild(el);
  });

  // Reuse the audio element created during markUserInteraction if available
  if (!STATE.audio) STATE.audio = new Audio();
  STATE.audio.volume = 0.7;
  STATE.audio.addEventListener('ended', () => nextTrack());
  STATE.audio.addEventListener('timeupdate', updateProgress);

  const playBtn = $('ctrl-play');
  const prevBtn = $('ctrl-prev');
  const nextBtn = $('ctrl-next');
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);

  const progBg = qs('.player-progress-bg');
  if (progBg) progBg.addEventListener('click', (e) => {
    if (STATE.audio.duration) STATE.audio.currentTime = (e.offsetX / progBg.clientWidth) * STATE.audio.duration;
  });

  selectTrack(0);

  // FIX: attempt autoplay after a short delay; handle iOS rejection gracefully
  setTimeout(() => {
    if (!STATE.isPlaying) attemptAutoplay();
  }, 1200);
}

function attemptAutoplay() {
  if (!STATE.audio || !STATE.audio.src) return;
  STATE.isPlaying = true;
  if ($('ctrl-play')) $('ctrl-play').textContent = '⏸';

  const promise = STATE.audio.play();
  if (promise !== undefined) {
    promise.catch(() => {
      // iOS blocked autoplay — reset state and show nudge
      STATE.isPlaying = false;
      if ($('ctrl-play')) $('ctrl-play').textContent = '▶';
      showAutoplayNudge();
    });
  }
}

function showAutoplayNudge() {
  // Show a gentle "tap ▶ to play music" hint near the player
  const player = qs('.music-player') || qs('#music-section');
  if (!player) return;
  const existing = player.querySelector('.autoplay-nudge');
  if (existing) return; // already shown
  const nudge = document.createElement('div');
  nudge.className = 'autoplay-nudge';
  nudge.textContent = '🎵 Tap ▶ to play music';
  nudge.style.cssText = `
    text-align:center;
    font-size:13px;
    color:rgba(180,80,120,0.8);
    margin-top:8px;
    animation:fadeInUp 0.4s ease;
    pointer-events:none;
  `;
  player.appendChild(nudge);
  // Remove nudge once the user manually starts playback
  STATE.audio.addEventListener('play', () => nudge.remove(), { once: true });
}

function updateProgress() {
  if (STATE.audio?.duration) {
    const pct = (STATE.audio.currentTime / STATE.audio.duration) * 100;
    if ($('player-progress-fill')) $('player-progress-fill').style.width = pct + '%';
  }
}

function selectTrack(i) {
  STATE.currentTrack = i;
  const t = CONFIG.PLAYLIST[i];
  if ($('player-track-name')) $('player-track-name').textContent = t.name;
  if ($('player-artist')) $('player-artist').textContent = t.artist;
  if (t.url && STATE.audio) {
    STATE.audio.src = t.url;
    STATE.audio.load();
    if (STATE.isPlaying) STATE.audio.play().catch(() => {});
  }
  qsa('.playlist-item').forEach((el, idx) => el.classList.toggle('active', idx === i));
}

function togglePlay() {
  STATE.isPlaying = !STATE.isPlaying;
  if ($('ctrl-play')) $('ctrl-play').textContent = STATE.isPlaying ? '⏸' : '▶';
  if (STATE.isPlaying && STATE.audio?.src) STATE.audio.play().catch(() => {});
  else if (STATE.audio) STATE.audio.pause();
}

function prevTrack() { selectTrack((STATE.currentTrack - 1 + CONFIG.PLAYLIST.length) % CONFIG.PLAYLIST.length); }
function nextTrack() { selectTrack((STATE.currentTrack + 1) % CONFIG.PLAYLIST.length); }
function initMusicFloatBtn() { const btn = $('music-float-btn'); if (btn) btn.classList.remove('hidden'); }

/* ════════════════════════════════════════════════════════════════
   REASONS JAR
════════════════════════════════════════════════════════════════ */
function initReasonsJar() {
  const shakeBtn = $('jar-shake-btn');
  if (shakeBtn) shakeBtn.addEventListener('click', shakeAndReveal);
  function shakeAndReveal() {
    const jar = $('reasons-jar'); if (jar) jar.classList.add('shaking');
    setTimeout(() => { if (jar) jar.classList.remove('shaking'); }, 600);
    const allIdx = CONFIG.REASONS.map((_, i) => i).filter(i => !STATE.openedReasons.has(i));
    if (allIdx.length === 0) STATE.openedReasons.clear();
    const available = CONFIG.REASONS.map((_, i) => i).filter(i => !STATE.openedReasons.has(i));
    const idx = available[randInt(0, available.length - 1)];
    STATE.openedReasons.add(idx);
    const count = STATE.openedReasons.size;
    setTimeout(() => { revealReason(idx, count); }, 400);
  }
  function revealReason(idx, count) {
    const note = $('reason-note'); if (!note) return;
    if ($('note-text')) $('note-text').textContent = CONFIG.REASONS[idx];
    if ($('note-number')) $('note-number').textContent = `#${count}`;
    note.classList.remove('hidden');
    if (count % 5 === 0 || count === 1) launchMiniConfetti();
  }
}

function launchMiniConfetti() {
  for (let i = 0; i < 30; i++) {
    const c = document.createElement('div');
    c.style.cssText = `position:fixed;left:${rand(30, 70)}%;top:${rand(40, 60)}%;width:${rand(6, 12)}px;height:${rand(6, 12)}px;background:#FF96B4;border-radius:50%;z-index:9999;pointer-events:none;animation:miniConfetti ${rand(0.8, 1.5)}s ease forwards;`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2000);
  }
}

/* ════════════════════════════════════════════════════════════════
   FINAL SECTION & FIREWORKS
════════════════════════════════════════════════════════════════ */
function initFinalSection() {
  const btn = $('final-celebrate-btn');
  if (btn) btn.addEventListener('click', launchCelebration);
  const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) setTimeout(launchCelebration, 1200); }, { threshold: 0.7 });
  const wish = $('final-wish');
  if (wish) observer.observe(wish);
}

let celebrationLaunched = false;
function launchCelebration() {
  if (celebrationLaunched) return;
  celebrationLaunched = true;
  const overlay = $('fireworks-overlay');
  if (overlay) overlay.classList.remove('hidden');
  createConfettiRain();
  const closeBtn = $('celeb-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => { if (overlay) overlay.classList.add('hidden'); celebrationLaunched = false; });
}

function createConfettiRain() {
  const container = $('celebration-rain');
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;left:${rand(0, 100)}%;top:-30px;font-size:${rand(16, 30)}px;animation:confettiFall ${rand(2, 5)}s linear forwards;`;
    el.textContent = ['🌸', '🌺', '✨', '💕'][randInt(0, 3)];
    container.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

/* ─── DYNAMIC KEYFRAMES ──────────────────────────────────────── */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes heartRise { 0%{transform:translate(0,0) scale(0);opacity:1;}100%{transform:translate(var(--dx),-60px) scale(1);opacity:0;} }
  @keyframes miniConfetti { 0%{opacity:1;transform:translate(0,0) scale(1);}100%{opacity:0;transform:translate(${rand(-150, 150)}px,-100px) rotate(360deg) scale(0.5);} }
  @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(360deg);opacity:0;} }
  @keyframes modalOut { from{opacity:1;transform:scale(1);}to{opacity:0;transform:scale(0.8);} }
  @keyframes burstFly { 0%{transform:translate(-50%,-50%) scale(0);opacity:1;}100%{transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(1);opacity:0;} }
  @keyframes giftParticle { 0%,100%{transform:translate(0,0) scale(1);opacity:0.3;}50%{transform:translate(${rand(-20, 20)}px,-20px) scale(1.5);opacity:0.7;} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);} }
  .reveal-fade, .reveal-up, .reveal-scale { opacity:0; transition: all 0.7s ease; }
  .revealed { opacity:1 !important; transform:translateY(0) scale(1) !important; }
  .reveal-up { transform:translateY(30px); }
  .b-flower.tapped { transform: translateX(-50%) scale(1.2) !important; transition:0.2s; }
  .shaking { animation: shake 0.5s ease-in-out; }
  @keyframes shake { 0%,100%{transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);} }
`;
document.head.appendChild(styleSheet);
