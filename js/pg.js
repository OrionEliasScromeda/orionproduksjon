// Priser og prisgrunnlag – alle Orion-priser hentes fra js/pricing.js (samme kilde som kalkulatoren)
import { SERVICES, SERVICE_ORDER, COMING_SOON, ADDONS, DRONE_ADDON, HOURLY, MVA, TRAVEL, displayPrice, mvaLabel, fmt, changePrice, travelPrice } from './pricing.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const kp = (n) => `${fmt(displayPrice(n))} kr`;

const SVC_ICON = {
  design: '<path d="M12 3l2.6 5.6L20.5 9.5l-4.3 4.1 1.1 6-5.3-3-5.3 3 1.1-6L3.5 9.5l5.9-.9z"/>',
  video: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/>',
  edit: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7.5L20 17M8 16.5L20 7"/>',
  drone: '<circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"/><rect x="9.5" y="9.5" width="5" height="5" rx="1.2"/>',
  foto: '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.5-2h6l1.5 2h2A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.8"/>',
  motion: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
};
const ico = (id) => `<svg viewBox="0 0 24 24" aria-hidden="true">${SVC_ICON[id]}</svg>`;
const SHORT = { design: 'Design', video: 'Film', edit: 'Redigering', drone: 'Drone', foto: 'Foto', motion: 'Animasjon' };

// Faner + pakker
const tabs = document.querySelector('[data-tabs]');
const tiers = document.querySelector('[data-tiers]');
let cur = 'video';
try { const st = JSON.parse(sessionStorage.getItem('orion-estimate-session')); if (st && SERVICES[st.service]) cur = st.service; } catch {}
tabs.innerHTML = SERVICE_ORDER.map((id) => `<button type="button" role="tab" data-svc="${id}" aria-selected="${id === cur}">${ico(id)}<span>${SHORT[id]}</span></button>`).join('')
  + COMING_SOON.map((c) => `<span class="pg-tab-soon" aria-disabled="true">${ico(c.id)}<span>${c.name}</span><small>Kommer snart</small></span>`).join('');

function countUp(el, to) {
  if (reduced) { el.textContent = fmt(to); return; }
  const t0 = performance.now(), d = 900;
  const step = (now) => { const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 4); el.textContent = fmt(Math.round(to * e)); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function renderTiers(animate) {
  const s = SERVICES[cur];
  const lv = Object.entries(s.levels);
  tiers.className = `pg-tiers n${lv.length}`;
  tiers.innerHTML = lv.map(([k, l], i) => `
    <article class="pg-tier${k === 'standard' ? ' pop' : ''}" style="--i:${i}">
      ${k === 'standard' ? '<span class="pg-badge">Mest valgt</span>' : ''}
      <h3>${lv.length > 1 ? l.name : s.name}</h3>
      <p class="pg-fits">${l.summary}</p>
      <p class="pg-amt"><small>fra</small> <span data-amt="${displayPrice(l.price)}">${fmt(displayPrice(l.price))}</span> <small>kr</small></p>
      <ul class="pg-get">${l.get.map((g) => `<li>${g}</li>`).join('')}<li>${l.rounds} korrekturrunde${l.rounds > 1 ? 'r' : ''}</li></ul>
      <details class="pg-pkg"><summary>Se pakkeinnhold</summary>
        <p><b>Du leverer:</b> ${l.bring}</p>
        <p><b>Krever eget tilbud:</b> ${l.quote}</p>
        <p>Endelig omfang, lengde og leveringstid avtales før oppstart.</p>
        ${s.note ? `<p>${s.note}</p>` : ''}
      </details>
      <a class="pg-tier-cta" href="index.html?pris" data-pick="${cur}:${k}">Beregn pris ›</a>
    </article>`).join('');
  if (animate) { tiers.classList.remove('swap'); void tiers.offsetWidth; tiers.classList.add('swap'); tiers.querySelectorAll('[data-amt]').forEach((el) => countUp(el, +el.dataset.amt)); }
}
renderTiers(false);
tabs.addEventListener('click', (e) => {
  const b = e.target.closest('[data-svc]'); if (!b || b.dataset.svc === cur) return;
  cur = b.dataset.svc;
  tabs.querySelectorAll('[data-svc]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  renderTiers(true);
});
tabs.addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const all = [...tabs.querySelectorAll('[data-svc]')]; const i = all.findIndex((x) => x.dataset.svc === cur);
  const n = all[(i + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length]; n.focus(); n.click();
});
// «Beregn pris» åpner kalkulatoren med valgt pakke
tiers.addEventListener('click', (e) => {
  const a = e.target.closest('[data-pick]'); if (!a) return;
  const [service, level] = a.dataset.pick.split(':');
  try { const st = JSON.parse(sessionStorage.getItem('orion-estimate-session')) || {}; sessionStorage.setItem('orion-estimate-session', JSON.stringify(st.service === service ? { ...st, level } : { service, level })); } catch {}
});
// Første gang prisene kommer til syne: tell opp
const tio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { tiers.querySelectorAll('[data-amt]').forEach((el) => countUp(el, +el.dataset.amt)); tio.disconnect(); } }), { threshold: 0.3 });
tio.observe(tiers);

// Tillegg
const A = [
  ['Film', [['Avansert redigering', ADDONS.advEdit.price], ['Utvidet fargearbeid', ADDONS.color.price], ['Særskilt musikk', ADDONS.music.price], ['Grafikk fra mal', ADDONS.motion.enkel.price], ['Undertekster', ADDONS.subs.price], ['Ekstra format', ADDONS.format.enkel.price], ['Ekstra versjon', ADDONS.version.price]]],
  ['Drone ved filmopptak', [['Enkel', DRONE_ADDON.enkel], ['Standard', DRONE_ADDON.standard], ['Avansert', DRONE_ADDON.avansert]]],
  ['Foto', [['25 bilder totalt', ADDONS.images[25]], ['50 bilder totalt', ADDONS.images[50]], ['Utvidet retusj', ADDONS.retouch.price]]],
  ['Design og endringer', [['Ekstra variant', ADDONS.variant.price], ['Ekstra endringer, per time', HOURLY], ['Prioritert levering', null]]],
];
document.querySelector('[data-addons]').innerHTML = A.map(([h, rows]) => `<div class="pg-addgrp"><h3>${h}</h3><ul>${rows.map(([l, p]) => `<li><span>${l}</span><b>${p === null ? '+25 %' : (h.startsWith('Drone') && l === 'Enkel' ? '' : 'fra ') + kp(p)}</b></li>`).join('')}</ul></div>`).join('')
  + '<p class="pg-addnote">På avansert film er enkel drone inkludert. Prioritert levering gjelder produksjonsarbeidet, ikke reise.</p>';

const t = travelPrice(74, 2.5);
const ts = document.querySelector('[data-travel-sum]'); if (ts) ts.textContent = `${fmt(t.kmPrice + t.timePrice)} kr`;
const vatTxt = {
  registrert: 'Prisene for privatkunder vises inkludert 25 % mva. Bedrifter kan se priser ekskl. mva. i kalkulatoren.',
  'ikke-registrert': 'Prisene er sluttpriser. Orion Produksjon er ikke mva-registrert, så det kommer ingen mva. i tillegg.',
  ukjent: 'Prisene er oppgitt før eventuell mva.',
}[MVA.status];
document.querySelectorAll('[data-vat-label]').forEach((el) => { el.textContent = vatTxt; });

// Prisgrunnlaget / vilkår (sammenleggbar)
const lgBtn = document.querySelector('.lg-toggle');
const lgBody = document.getElementById('vilkar-tekst');
const openLegal = (open = true) => { lgBody.hidden = !open; lgBtn.setAttribute('aria-expanded', String(open)); };
lgBtn.addEventListener('click', () => openLegal(lgBody.hidden));
document.querySelectorAll('[data-open-legal]').forEach((a) => a.addEventListener('click', () => openLegal(true)));
const hashOpen = () => { if (/^#(vilkar|programvare|kilde-\d+|kilder)$/.test(location.hash)) { openLegal(true); document.querySelector(location.hash)?.scrollIntoView(); } };
addEventListener('hashchange', hashOpen); hashOpen();

// Tall som teller opp
const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { countUp(e.target, +e.target.dataset.count); cio.unobserve(e.target); } }), { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el));

// Inn-animasjoner
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
document.querySelectorAll('[data-to-top]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }));

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
