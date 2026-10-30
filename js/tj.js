// Tjenester: inn-animasjoner, videoer som spiller når de synes, rammer som åpner seg med skrollingen, snarvei nederst
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// Inn-animasjoner
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Videoer: lastes først når de nærmer seg, spiller bare når de synes, og starter fra begynnelsen
const big = !document.documentElement.classList.contains('lite') && !navigator.connection?.saveData
  && matchMedia('(min-width: 800px)').matches && (devicePixelRatio || 1) * innerWidth > 1100;
const vio = new IntersectionObserver((es) => es.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting) {
    if (!v.src) { v.src = `${v.dataset.src}-${big ? 1080 : 720}.mp4`; v.preload = 'auto'; }
    if (!reduced) { v.currentTime = 0; v.play().catch(() => {}); }
  } else {
    v.pause();
    // mobil: frigjør videominnet når den er ute av syne (lastes inn igjen når man kommer tilbake)
    if (document.documentElement.classList.contains('lite') && v.src) { v.removeAttribute('src'); v.load(); }
  }
}), { rootMargin: '0px 0px -15% 0px', threshold: 0.2 });
document.querySelectorAll('video[data-src]').forEach((v) => vio.observe(v));

// Rammene åpner seg mot full bredde mens de skroller inn mot midten
const exp = [...document.querySelectorAll('.tj-expand')];
const dock = document.querySelector('.tj-dock');
const dockLinks = [...dock.querySelectorAll('a')];
const secs = dockLinks.map((a) => document.getElementById(a.dataset.sec));
const hero = document.querySelector('.tj-hero');
let queued = false;
const update = () => {
  queued = false;
  const H = innerHeight;
  if (!reduced) exp.forEach((f) => {
    const r = f.getBoundingClientRect();
    const e = clamp01((H * 0.95 - r.top) / (H * 0.6));
    f.style.setProperty('--e', (e * e * (3 - 2 * e)).toFixed(4));
  });
  // snarveien vises etter introen og før bunnteksten
  const footTop = document.querySelector('.site-footer').getBoundingClientRect().top;
  dock.classList.toggle('show', hero.getBoundingClientRect().bottom < H * 0.4 && footTop > H * 0.85);
  let cur = 0;
  secs.forEach((s, i) => { if (s.getBoundingClientRect().top < H * 0.5) cur = i; });
  dockLinks.forEach((a, i) => a.classList.toggle('on', i === cur));
};
const req = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
addEventListener('scroll', req, { passive: true });
addEventListener('resize', req);
update();

// Meny (samme som de andre sidene)
{
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.topbar .nav');
  const setOpen = (open) => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); if (!open) setTimeout(() => nav.classList.remove('sub-open'), 350); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!nav.classList.contains('open')); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target) && !btn.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  const small = matchMedia('(max-width: 833px)');
  document.querySelector('.mm-more')?.addEventListener('click', (e) => { if (!small.matches) return; e.preventDefault(); e.stopPropagation(); nav.classList.add('sub-open'); });
  document.querySelector('.mm-back')?.addEventListener('click', (e) => { e.stopPropagation(); nav.classList.remove('sub-open'); });
}
