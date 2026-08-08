/* ============================================================
   BASSAM JAMEEL — SHARED SCRIPT (loaded on every page)
   ============================================================ */

/* --- current year in footer --- */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();

/* --- sticky header turns solid on scroll --- */
const header = document.getElementById('header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --- mobile menu --- */
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  }));
}

/* --- reveal on scroll --- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ============================================================
   HERO WAVEFORM — only runs on the home page (needs <canvas id="wave">).
   Tweak COLOR / AMP / SPEED to restyle.
   ============================================================ */
(function () {
  const canvas = document.getElementById('wave');
  if (!canvas) return;                       // skip on pages without the hero canvas
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, t = 0;

  const COLOR = '#1CC4D6';   // trace colour (matches --cyan)
  const AMP   = 0.16;        // wave height as fraction of canvas height
  const SPEED = 0.03;        // animation speed

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width  = w = r.width  * devicePixelRatio;
    canvas.height = h = r.height * devicePixelRatio;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const mid = h * 0.55;
    for (let layer = 0; layer < 2; layer++) {
      ctx.beginPath();
      const amp = h * AMP * (layer ? .5 : 1);
      const freq = (layer ? 5.5 : 4) * Math.PI / w;
      for (let x = 0; x <= w; x += 4) {
        const env = Math.exp(-Math.pow((x - w * 0.5) / (w * 0.42), 2)); // pulse envelope
        const y = mid + Math.sin(x * freq - t * (layer ? 1.3 : 1)) * amp * env;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = COLOR;
      ctx.globalAlpha = layer ? .28 : .9;
      ctx.lineWidth = (layer ? 1 : 2) * devicePixelRatio;
      ctx.shadowColor = COLOR;
      ctx.shadowBlur = (layer ? 6 : 14) * devicePixelRatio;
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }

  function loop() { t += SPEED; draw(); requestAnimationFrame(loop); }

  resize();
  window.addEventListener('resize', resize);
  reduce ? draw() : loop();
})();
