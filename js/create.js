// «La oss skape noe.» – Orion Contact (skjema i steg) og Orion Estimate (priskalkulator).
// Alt kjører i nettleseren. Kontaktskjemaet sendes via Web3Forms til info@orionproduksjon.no – se SEND-funksjonen.

import {
  SERVICES, SERVICE_ORDER, ADDONS, DRONE_ADDON, DRONE_INCLUDED_VALUE, TRAVEL, CHANGES, PRIORITY, MVA, BASE_PLACE,
  COMING_SOON, ESTIMATE_TEXT, calculate, defaultFor, DEFAULT_STATE, displayPrice, mvaLabel, fmt, changePrice,
} from './pricing.js';
const BASE = BASE_PLACE;

const I = {
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/></svg>',
  drone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"/><rect x="9.5" y="9.5" width="5" height="5" rx="1.2"/></svg>',
  foto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.5-2h6l1.5 2h2A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.8"/></svg>',
  design: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.6L20.5 9.5l-4.3 4.1 1.1 6-5.3-3-5.3 3 1.1-6L3.5 9.5l5.9-.9z"/></svg>',
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/></svg>',
  calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="4.5" y="2.5" width="15" height="19" rx="3"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.7A8 8 0 1 1 21 12z"/></svg>',
  coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12z"/></svg>',
  scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 21h10M5 7h14M5 7l-2.5 6a3 3 0 0 0 5 0zM19 7l-2.5 6a3 3 0 0 0 5 0z"/></svg>',
  q: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.5V14M12 17.2h.01"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M4 15v3.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V15"/></svg>',
  tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
};

// Samme produkter i «Jeg har en idé» og priskalkulatoren – hentet fra js/pricing.js
const EST_ICON = { design: 'design', video: 'video', edit: 'video', drone: 'drone', foto: 'foto', motion: 'spark', web: 'web' };
const SERVICE_DESC = {
  design: 'Plakater, annonser, logo og grafikk', video: 'Reklame, portrett og innhold til sosiale medier',
  edit: 'Du har filmet – vi redigerer', drone: 'Luftfoto og -video av eiendom, natur og prosjekter',
  foto: 'Produkt-, portrett- og bedriftsbilder', motion: 'Animert logo, tekst og forklaringsgrafikk',
};
const CONTACT_SERVICES = SERVICE_ORDER.map((id) => ({ id, name: SERVICES[id].name, icon: EST_ICON[id], d: SERVICE_DESC[id] }));
const soonOpt = (s) => `<div class="opt soon" aria-disabled="true"><span class="ico">${I[EST_ICON[s.id]]}</span><span><b>${s.name}</b><small>Kommer snart</small></span></div>`;

// ── Hjelpere ──
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const kr = (n) => new Intl.NumberFormat('nb-NO').format(Math.round(n));
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
function tween(el, from, to, fmt) {
  if (reduced || from === to) { el.textContent = fmt(to); return; }
  const t0 = performance.now(), d = 520;
  cancelAnimationFrame(el._raf);
  const step = (now) => {
    const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 4);
    el.textContent = fmt(from + (to - from) * e);
    if (k < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}

// ── Ark (fullskjerm) ──
const AURORA = '';
let lastFocus = null;
function openSheet(sheet, fromEl) {
  lastFocus = document.activeElement;
  const panel = $('.sheet-panel', sheet);
  if (fromEl) {
    const r = fromEl.getBoundingClientRect();
    panel.style.setProperty('--ox', `${r.left + r.width / 2}px`);
    panel.style.setProperty('--oy', `${r.top + r.height / 2}px`);
  }
  sheet.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('shown')));
  setTimeout(() => { const f = $('[autofocus], .step.active input, .step.active button, .sheet-close', sheet); f?.focus({ preventScroll: true }); }, 80);
}
function closeSheet(sheet) {
  sheet.classList.remove('shown');
  setTimeout(() => { sheet.classList.remove('open'); document.documentElement.style.overflow = ''; lastFocus?.focus?.({ preventScroll: true }); }, reduced ? 0 : 420);
}
function makeSheet(id, title, brand) {
  const el = document.createElement('div');
  el.className = 'sheet'; el.id = id;
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', title);
  el.innerHTML = `<div class="sheet-backdrop"></div>
    <div class="sheet-panel">${AURORA}
      <div class="sheet-head"><div class="sheet-brand">Orion <span>${brand}</span></div><div class="progress" aria-hidden="true"></div>
        <button class="sheet-close" type="button" aria-label="Lukk">${I.x}</button></div>
      <div class="sheet-body"></div>
    </div>`;
  document.body.append(el);
  $('.sheet-close', el).addEventListener('click', () => closeSheet(el));
  $('.sheet-backdrop', el).addEventListener('click', () => closeSheet(el));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet(el);
    if (e.key === 'Tab') { // hold fokus inne i arket
      const f = $$('button, input, textarea, a[href], [tabindex]:not([tabindex="-1"])', el).filter((x) => x.offsetParent !== null && !x.disabled);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  return el;
}

// ══════════════════════════════════════════════════════════════════════════
// 01. ORION CONTACT – skjema i steg som tilpasser seg svarene
// ══════════════════════════════════════════════════════════════════════════
const contact = { intent: '', services: [], description: '', link: '', files: [], priority: '', shootDate: '', deadline: '', unsure: false, name: '', email: '', phone: '', estimate: null };
const contactSheet = makeSheet('orion-contact', 'Orion Contact – kontaktskjema', 'Contact');
const cBody = $('.sheet-body', contactSheet);

const opt = (type, name, value, title, desc, icon, checked) => `
  <label class="opt"><input type="${type}" name="${name}" value="${esc(value)}" ${checked ? 'checked' : ''}>
    ${icon ? `<span class="ico">${I[icon]}</span>` : ''}
    <span><b>${title}</b>${desc ? `<small>${desc}</small>` : ''}</span>
    <span class="tick">${I.tick}</span></label>`;

const STEPS = [
  { id: 'intent', render: () => `
      <div class="step-eyebrow">Store ideer starter med en samtale</div>
      <h2>Hva kan vi hjelpe deg med?</h2>
      <p class="sub">Enten du har en ferdig idé eller bare noen tanker, hjelper vi deg med å finne veien videre.</p>
      <div class="opts">
        ${opt('radio', 'intent', 'vet', 'Jeg vet hva jeg trenger.', 'Du har en klar plan – vi tar det derfra.', 'target', contact.intent === 'vet')}
        ${opt('radio', 'intent', 'ide', 'Jeg har en idé, men trenger hjelp.', 'Vi utforsker mulighetene sammen.', 'bulb', contact.intent === 'ide')}
        ${opt('radio', 'intent', 'pris', 'Jeg ønsker et prisestimat.', 'Bygg produksjonen selv og se prisen med en gang.', 'calc', contact.intent === 'pris')}
        ${opt('radio', 'intent', 'annet', 'Jeg har et annet spørsmål.', 'Skriv kort, så svarer vi.', 'chat', contact.intent === 'annet')}
      </div>`,
    valid: () => !!contact.intent },
  { id: 'services', when: () => contact.intent !== 'annet', render: () => `
      <div class="step-eyebrow">Steg 1</div>
      <h2>Hva ønsker du å lage?</h2>
      <p class="sub">Velg én eller flere tjenester.</p>
      <div class="opts two">${CONTACT_SERVICES.map((s) => opt('checkbox', 'services', s.id, s.name, s.d, s.icon, contact.services.includes(s.id))).join('')}${COMING_SOON.map(soonOpt).join('')}</div>`,
    valid: () => contact.services.length > 0 },
  { id: 'describe', render: () => contact.intent === 'annet' ? `
      <div class="step-eyebrow">Spørsmål</div>
      <h2>Hva lurer du på?</h2>
      <label class="field"><span>Spørsmålet ditt</span><textarea name="description" placeholder="Skriv så kort eller langt du vil …">${esc(contact.description)}</textarea></label>` : `
      <div class="step-eyebrow">Steg 2</div>
      <h2>Fortell om prosjektet.</h2>
      <p class="sub">Del så mye eller lite du vil. Referanser hjelper oss å treffe blink.</p>
      <label class="field"><span>Ideen din</span><textarea name="description" placeholder="Hva skal lages, til hvem, og hva ønsker du å oppnå?">${esc(contact.description)}</textarea></label>
      <label class="field"><span>Har du sett noe du liker?</span><input name="link" type="url" inputmode="url" placeholder="Lim inn lenke til en film, nettside eller Instagram-video" value="${esc(contact.link)}"></label>
      <div class="field"><span>Referanser og filer</span>
        <p class="sub" style="margin:0">Filer kan ikke lastes opp her. Lim inn en delingslenke over (f.eks. Google Drive eller WeTransfer), eller send filene til <a href="mailto:info@orionproduksjon.no">info@orionproduksjon.no</a> etter at du har sendt forespørselen.</p></div>`,
    valid: () => contact.intent !== 'annet' || contact.description.trim().length > 2, skippable: () => contact.intent !== 'annet' },
  { id: 'priority', when: () => contact.intent !== 'annet', render: () => `
      <div class="step-eyebrow">Steg 3</div>
      <h2>Hva er viktigst for deg?</h2>
      <p class="sub">Da vet vi hvordan vi best tilpasser tilbudet.</p>
      <div class="opts two">
        ${opt('radio', 'priority', 'pris', 'Lavest mulig pris', 'Smarte valg som holder kostnaden nede.', 'coin', contact.priority === 'pris')}
        ${opt('radio', 'priority', 'kvalitet', 'Best mulig kvalitet', 'Ekstra tid og omtanke i hver detalj.', 'spark', contact.priority === 'kvalitet')}
        ${opt('radio', 'priority', 'rask', 'Rask levering', 'Når det haster – vi prioriterer.', 'bolt', contact.priority === 'rask')}
        ${opt('radio', 'priority', 'balanse', 'God balanse', 'Mest mulig ut av budsjettet.', 'scale', contact.priority === 'balanse')}
      </div>`,
    valid: () => !!contact.priority, skippable: () => true },
  { id: 'dates', when: () => contact.intent !== 'annet', render: () => `
      <div class="step-eyebrow">Steg 4</div>
      <h2>Når trenger du det?</h2>
      <p class="sub">Omtrentlige datoer holder fint.</p>
      <div class="row2">
        <label class="field"><span>Ønsket opptaksdato</span><input type="date" name="shootDate" value="${esc(contact.shootDate)}"></label>
        <label class="field"><span>Leveringsfrist</span><input type="date" name="deadline" value="${esc(contact.deadline)}"></label>
      </div>
      <label class="check"><input type="checkbox" name="unsure" ${contact.unsure ? 'checked' : ''}> Jeg vet ikke ennå</label>`,
    valid: () => true, skippable: () => true },
  { id: 'contact', render: () => `
      <div class="step-eyebrow">Siste steg</div>
      <h2>Hvordan når vi deg?</h2>
      <p class="sub">Vi bruker opplysningene til å behandle og svare på forespørselen din. <a href="personvern.html" target="_blank" rel="noopener">Slik håndterer vi personopplysninger</a>.</p>
      <label class="field"><span>Navn</span><input name="name" autocomplete="name" value="${esc(contact.name)}" required></label>
      <div class="row2">
        <label class="field"><span>E-post</span><input name="email" type="email" autocomplete="email" inputmode="email" value="${esc(contact.email)}" required></label>
        <label class="field"><span>Telefon <em style="font-style:normal;color:var(--ink-3)">(valgfritt)</em></span><input name="phone" type="tel" autocomplete="tel" value="${esc(contact.phone)}"></label>
      </div>
      <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none">
      ${summaryHTML()}`,
    valid: () => contact.name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(contact.email) },
];
function summaryHTML() {
  const rows = [];
  const map = { vet: 'Vet hva jeg trenger', ide: 'Har en idé', pris: 'Ønsker prisestimat', annet: 'Annet spørsmål' };
  if (contact.intent) rows.push(['Henvendelse', map[contact.intent]]);
  if (contact.services.length) rows.push(['Tjenester', contact.services.map((id) => CONTACT_SERVICES.find((s) => s.id === id)?.name).join(', ')]);
  if (contact.estimate) rows.push(['Prisestimat', `${contact.estimate.from ? 'fra ' : ''}${kr(contact.estimate.low)} kr ${contact.estimate.mvaLabel || ''}`], ['Produksjon', contact.estimate.items.map((i) => i[0]).join(', ')]);
  if (contact.description) rows.push(['Beskrivelse', contact.description.length > 120 ? contact.description.slice(0, 120) + ' …' : contact.description]);
  if (contact.link) rows.push(['Referanse', contact.link]);
  if (contact.files.length) rows.push(['Filer', `${contact.files.length} vedlegg`]);
  const pr = { pris: 'Lavest mulig pris', kvalitet: 'Best mulig kvalitet', rask: 'Rask levering', balanse: 'God balanse' };
  if (contact.priority) rows.push(['Viktigst', pr[contact.priority]]);
  if (contact.unsure) rows.push(['Tidspunkt', 'Ikke bestemt ennå']);
  else if (contact.shootDate || contact.deadline) rows.push(['Tidspunkt', [contact.shootDate && `Opptak ${contact.shootDate}`, contact.deadline && `frist ${contact.deadline}`].filter(Boolean).join(', ')]);
  if (!rows.length) return '';
  return `<div class="field"><span>Oppsummering</span><div class="summary">${rows.map(([k, v]) => `<div><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`).join('')}</div></div>`;
}

let cStep = 0;
const activeSteps = () => STEPS.filter((s) => !s.when || s.when());
function renderContact(dir = 1) {
  const steps = activeSteps();
  cStep = Math.max(0, Math.min(cStep, steps.length - 1));
  const s = steps[cStep];
  const prog = $('.progress', contactSheet);
  prog.innerHTML = steps.map((_, i) => `<i style="--f:${i < cStep ? 1 : i === cStep ? 0.5 : 0}"></i>`).join('');
  const last = cStep === steps.length - 1;
  cBody.innerHTML = `<div class="steps"><section class="step active ${dir < 0 ? 'back' : ''}" aria-live="polite">${s.render()}</section></div>
    <div class="nav-row"><div class="inner">
      ${cStep > 0 ? `<button class="btn-x ghost" data-act="back" type="button">${I.back}Tilbake</button>` : ''}
      <span class="spacer"></span>
      ${s.skippable?.() && !last ? '<button class="btn-x link" data-act="skip" type="button">Hopp over</button>' : ''}
      <button class="btn-x primary" data-act="${last ? 'send' : 'next'}" type="button" ${s.valid() ? '' : 'disabled'}>${last ? 'Send forespørsel' : 'Fortsett'}${I.arrow}</button>
    </div></div>`;
  cBody.scrollTop = 0;
}
function updateValidity() {
  const s = activeSteps()[cStep];
  const b = $('[data-act="next"], [data-act="send"]', cBody);
  if (b) b.disabled = !s.valid();
}
cBody.addEventListener('input', (e) => {
  const t = e.target;
  if (t.name === 'services') contact.services = $$('input[name="services"]:checked', cBody).map((x) => x.value);
  else if (t.name === 'unsure') contact.unsure = t.checked;
  else if (t.type === 'file') { contact.files = [...contact.files, ...[...t.files].map((f) => f.name)]; renderContact(0); return; }
  else if (t.name && t.name in contact) contact[t.name] = t.value;
  if (t.name === 'intent') {
    if (t.value === 'pris') { // rett til priskalkulatoren
      setTimeout(() => { closeSheet(contactSheet); setTimeout(() => openEstimate(), reduced ? 0 : 440); }, 260);
      return;
    }
    setTimeout(() => { cStep++; renderContact(1); }, 280); // gå videre automatisk ved ett valg
    return;
  }
  if (t.name === 'priority') { setTimeout(() => { cStep++; renderContact(1); }, 280); return; }
  updateValidity();
});
const dz = () => $('.dropzone', cBody);
cBody.addEventListener('dragover', (e) => { if (e.target.closest('.dropzone')) { e.preventDefault(); dz().classList.add('drag'); } });
cBody.addEventListener('dragleave', (e) => { if (e.target.closest('.dropzone')) dz().classList.remove('drag'); });
cBody.addEventListener('drop', (e) => {
  if (!e.target.closest('.dropzone')) return;
  e.preventDefault();
  contact.files = [...contact.files, ...[...e.dataTransfer.files].map((f) => f.name)];
  renderContact(0);
});
cBody.addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (!act) return;
  if (act === 'next' || act === 'skip') { cStep++; renderContact(1); }
  if (act === 'back') { cStep--; renderContact(-1); }
  if (act === 'send') SEND();
  if (act === 'retry') renderContact(0);
  if (act === 'restart') { Object.assign(contact, { intent: '', services: [], description: '', link: '', files: [], priority: '', shootDate: '', deadline: '', unsure: false, estimate: null }); cStep = 0; renderContact(1); }
  if (act === 'close') closeSheet(contactSheet);
});

function openContact(fromEl, opts = {}) {
  if (opts.estimate) {
    contact.estimate = opts.estimate;
    contact.intent = contact.intent || 'vet';
    if (!contact.services.includes(opts.service)) contact.services = [opts.service];
    cStep = activeSteps().length - 1;   // alt er fylt inn – rett til kontaktinfo
  } else if (opts.reset !== false && !contact.intent) cStep = 0;
  renderContact(1);
  openSheet(contactSheet, fromEl);
}

// SEND – Web3Forms videresender forespørselen som e-post til info@orionproduksjon.no.
// Nøkkelen er laget for å ligge åpent i nettleseren; den kan bare sende til den registrerte adressen.
const WEB3FORMS_KEY = '942965f9-51f4-4802-a03c-bd63c5222564';
const MAIL = 'info@orionproduksjon.no';
function mailText() {
  const map = { vet: 'Vet hva jeg trenger', ide: 'Har en idé', pris: 'Ønsker prisestimat', annet: 'Annet spørsmål' };
  const pr = { pris: 'Lavest mulig pris', kvalitet: 'Best mulig kvalitet', rask: 'Rask levering', balanse: 'God balanse' };
  const f = {
    'Navn': contact.name.trim(),
    'E-post': contact.email.trim(),
    'Telefon': contact.phone.trim() || '–',
    'Henvendelse': map[contact.intent] || '–',
    'Tjenester': contact.services.map((id) => CONTACT_SERVICES.find((x) => x.id === id)?.name).join(', ') || '–',
    'Beskrivelse': contact.description.trim() || '–',
    'Referanselenke': contact.link.trim() || '–',
    'Filer kunden ville legge ved': contact.files.length ? contact.files.join(', ') + ' (ikke vedlagt – be kunden sende dem på e-post)' : '–',
    'Viktigst': pr[contact.priority] || '–',
    'Tidspunkt': contact.unsure ? 'Ikke bestemt ennå' : [contact.shootDate && `Opptak ${contact.shootDate}`, contact.deadline && `frist ${contact.deadline}`].filter(Boolean).join(', ') || '–',
  };
  if (contact.estimate) {
    f['Prisestimat'] = `${contact.estimate.from ? 'fra ' : ''}${kr(contact.estimate.low)} kr ${contact.estimate.mvaLabel || ''}`.trim();
    f['Produksjon'] = contact.estimate.items.map((i) => i[0]).join(', ');
  }
  return f;
}
function doneHTML(ok) {
  const first = esc(contact.name.trim().split(' ')[0]);
  return `<div class="steps"><section class="step active done">
      <div class="badge">${ok ? I.tick : '!'}</div>
      <h2>${ok ? `Takk, ${first}!` : 'Det gikk ikke helt'}</h2>
      <p class="sub" style="margin-inline:auto">${ok
        ? `Forespørselen din er sendt. Du hører fra Orion så snart som mulig.${contact.files.length ? `<br>Send gjerne filene dine til <a href="mailto:${MAIL}">${MAIL}</a>.` : ''}`
        : `Forespørselen ble ikke sendt. Prøv igjen, eller send en e-post direkte til <a href="mailto:${MAIL}">${MAIL}</a>.`}</p>
      ${ok ? summaryHTML() : ''}
      <div style="display:flex;gap:10px;justify-content:center;margin-top:28px">
        ${ok ? '<button class="btn-x ghost" data-act="restart" type="button">Ny forespørsel</button>' : '<button class="btn-x ghost" data-act="retry" type="button">Prøv igjen</button>'}
        <button class="btn-x primary" data-act="close" type="button">${ok ? 'Ferdig' : 'Lukk'}</button></div>
    </section></div>`;
}
let sending = false;
async function SEND() {
  if (sending) return;
  const bot = $('input[name="botcheck"]', cBody)?.checked;
  const btn = $('[data-act="send"]', cBody);
  if (btn) { btn.disabled = true; btn.firstChild.textContent = 'Sender …'; }
  sending = true;
  let ok = false;
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Ny forespørsel fra ${contact.name.trim()} – Orion Produksjon`,
        from_name: 'Orion Produksjon – nettsiden',
        replyto: contact.email.trim(),
        botcheck: bot || '',
        ...mailText(),
      }),
    });
    ok = res.ok && (await res.json()).success === true;
  } catch { ok = false; }
  sending = false;
  if (ok) $('.progress', contactSheet).innerHTML = activeSteps().map(() => '<i style="--f:1"></i>').join('');
  cBody.innerHTML = doneHTML(ok);
}

// ══════════════════════════════════════════════════════════════════════════
// 02. ORION ESTIMATE – bygg produksjonen, se prisen live
// ══════════════════════════════════════════════════════════════════════════
const KEY = 'orion-estimate-v4';
const SKEY = 'orion-estimate-session';        // bevarer valg mellom kalkulator og Prisgrunnlaget
let view = 'privat';                          // 'privat' | 'bedrift' (kun relevant når mva-registrert)
let est = { ...DEFAULT_STATE, dest: null };
const saveSession = () => { try { sessionStorage.setItem(SKEY, JSON.stringify(est)); } catch {} };
const estSheet = makeSheet('orion-estimate', 'Orion Estimate – priskalkulator', 'Estimate');
const eBody = $('.sheet-body', estSheet);
$('.progress', estSheet).remove();

const kp = (exMva) => `${fmt(displayPrice(exMva, view))} kr`;          // vist pris etter mva-status
const radios = (name, options, cur, label) => `<div class="seg" role="radiogroup" aria-label="${label || name}">${options.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}" ${String(cur) === String(v) ? 'checked' : ''}>${l}</label>`).join('')}</div>`;
const tog = (name, cur, label) => `<span class="toggle"><input type="checkbox" name="${name}" ${cur ? 'checked' : ''} aria-label="${label}"><span></span></span>`;
const stepper = (name, cur, max, label) => `<span class="stepper" data-stepper="${name}" data-max="${max}"><button type="button" data-d="-1" aria-label="Færre ${label}" ${cur <= 0 ? 'disabled' : ''}>−</button><output aria-live="polite">${cur}</output><button type="button" data-d="1" aria-label="Flere ${label}" ${cur >= max ? 'disabled' : ''}>+</button></span>`;
const addon = (title, desc, control) => `<div class="addon"><div class="t"><b>${title}</b><small>${desc}</small></div>${control}</div>`;
const more = (summary, body) => `<details class="more-info"><summary>${summary}</summary><div>${body}</div></details>`;

function renderEstimate() {
  const svc = SERVICES[est.service];
  const levels = Object.entries(svc.levels);
  const lvl = svc.levels[est.level];
  const filmish = ['video', 'drone', 'edit'].includes(est.service);
  let n = 1;
  const nn = () => String(n++).padStart(2, '0');
  const mvaNote = MVA.status === 'registrert'
    ? `<div class="vat-switch">${radios('vatView', [['privat', 'Privat · inkl. mva.'], ['bedrift', 'Bedrift · ekskl. mva.']], view, 'Prisvisning')}</div>`
    : '<p class="vat-note">Orion Produksjon er ikke mva-registrert. Prisene er sluttpriser – det kommer ingen mva. i tillegg.</p>';
  eBody.innerHTML = `<div class="est">
    <div class="est-main">
      <div class="est-intro"><div class="step-eyebrow">Orion Estimate</div>
        <h2>Hva koster ideen din?<br>Finn ut på sekunder.</h2>
        <p>Bygg din egen produksjon. Prisen oppdateres mens du velger – uten at du trenger å oppgi e-post.</p>
        ${mvaNote}
        <a class="pg-link" href="prisgrunnlaget.html">Slik er prisene satt – les Prisgrunnlaget ›</a>
        <div class="restore" role="status"><span>Vi har lagret valgene dine fra sist.</span><button class="btn-x link" data-act="reset" type="button">Start på nytt</button></div>
      </div>

      <fieldset class="block"><legend class="block-h"><span class="n">${nn()}</span><h3>Hva ønsker du?</h3></legend>
        <div class="opts two">${SERVICE_ORDER.map((id) => {
          const sv = SERVICES[id]; const first = Object.values(sv.levels)[0];
          return opt('radio', 'service', id, sv.name, `Fra ${kp(first.price)}`, EST_ICON[id], est.service === id);
        }).join('')}${COMING_SOON.map(soonOpt).join('')}</div>
        ${est.service === 'edit' ? '<p class="hint">Et eget miniprodukt: redigering av materiale du allerede har filmet. Ingen opptak eller oppmøte inngår.</p>' : ''}
        ${est.service === 'drone' ? `<p class="hint">${svc.note}</p>` : ''}
      </fieldset>

      ${levels.length > 1 ? `<fieldset class="block"><legend class="block-h"><span class="n">${nn()}</span><h3>Hvor omfattende?</h3></legend>
        <div class="opts three">${levels.map(([k, v]) => `
          <label class="opt lvl"><input type="radio" name="level" value="${k}" ${est.level === k ? 'checked' : ''}>
            <span class="lvl-top"><b>${v.name}</b><span class="tick">${I.tick}</span></span>
            <span class="lvl-price">fra ${kp(v.price)}</span>
            <small><b class="fits">Passer til:</b> ${v.summary}</small>
            <span class="lvl-rounds">${v.rounds} korrekturrunde${v.rounds > 1 ? 'r' : ''} inkludert</span></label>`).join('')}</div>
      </fieldset>` : ''}

      <div class="pkg">
        <h4>Dette får du – ${svc.name.toLowerCase()} ${lvl.name.toLowerCase()}</h4>
        <ul>${lvl.get.map((g) => `<li>${g}</li>`).join('')}<li>${lvl.rounds} samlet${lvl.rounds > 1 ? 'de' : ''} korrekturrunde${lvl.rounds > 1 ? 'r' : ''}</li></ul>
        <details class="pkg-more"><summary>Se pakkeinnhold</summary>
          <p><b>Du leverer:</b> ${lvl.bring}</p>
          <p><b>Krever eget tilbud:</b> ${lvl.quote}</p>
          <p>Omfang (tid, lengde og leveringstid) avtales før oppstart.</p>
        </details>
      </div>

      ${filmish && lvl.rawOnly ? '<p class="hint"><b>Råklipp:</b> Du får utvalgte, uredigerte klipp. Ønsker du en ferdig redigert dronefilm, velg standard eller avansert.</p>' : ''}
      ${filmish && !lvl.rawOnly ? `<div class="block"><div class="block-h"><span class="n">${nn()}</span><h3>Etterarbeid</h3></div>
        <p class="hint">Grunnleggende klipp, normal fargebalanse, enkel lydjustering og eksport er inkludert i ferdig redigerte videoer. Velg bare det du faktisk trenger i tillegg.</p>
        ${addon('Avansert redigering', `Mer omfattende klipp, lyddesign og effekter. Fra ${kp(ADDONS.advEdit.price)}.`, tog('advEdit', est.advEdit, 'Avansert redigering'))}
        ${addon('Utvidet fargearbeid', `Filmatisk, gjennomarbeidet fargeuttrykk. Fra ${kp(ADDONS.color.price)}.`, tog('color', est.color, 'Utvidet fargearbeid'))}
        ${addon('Særskilt musikkutvelgelse', `Utvelgelse og tilpasning av musikk. Fra ${kp(ADDONS.music.price)}. Vanlig bibliotekmusikk som dekkes av lisensen, belastes ikke. Særskilte lisenskjøp avtales separat.`, tog('music', est.music, 'Særskilt musikkutvelgelse'))}
        ${addon('Grafikk og animasjon', est.motion === 'egen' ? `Egenutviklet animasjon fra ${kp(ADDONS.motion.egen.price)} – endelig pris i tilbud etter omfang.` : `Enkel motion graphics fra mal eller ferdige elementer, fra ${kp(ADDONS.motion.enkel.price)}.`, radios('motion', [['ingen', 'Ingen'], ['enkel', 'Fra mal'], ['egen', 'Egenutviklet']], est.motion, 'Grafikk og animasjon'))}
        ${addon('Undertekster', `Kort, enkel video (normalt inntil 60 sek.) og ett språk. Fra ${kp(ADDONS.subs.price)}.`, tog('subs', est.subs, 'Undertekster'))}
        ${addon('Ekstra format', est.format === 'manuell' ? `Manuell tilpasning av grafikk, tekst og utsnitt. Fra ${kp(ADDONS.format.manuell.price)}.` : `F.eks. stående i tillegg til liggende. Enkel beskjæring fra ${kp(ADDONS.format.enkel.price)}, manuell tilpasning fra ${kp(ADDONS.format.manuell.price)}.`, radios('format', [['ingen', 'Nei'], ['enkel', 'Enkel'], ['manuell', 'Manuell']], est.format, 'Ekstra format'))}
        ${addon('Ekstra versjoner', `Enkel ekstra versjon av samme klipp. Fra ${kp(ADDONS.version.price)} per stk.`, stepper('versions', est.versions, 5, 'versjoner'))}
      </div>` : ''}

      ${est.service === 'motion' ? `<div class="block"><div class="block-h"><span class="n">${nn()}</span><h3>Tillegg</h3></div>
        ${addon('Særskilt musikk', `Utvelgelse og tilpasning av musikk. Fra ${kp(ADDONS.music.price)}.`, tog('music', est.music, 'Særskilt musikk'))}
        ${addon('Ekstra format', `F.eks. stående i tillegg til liggende. Enkel fra ${kp(ADDONS.format.enkel.price)}, manuell tilpasning fra ${kp(ADDONS.format.manuell.price)}.`, radios('format', [['ingen', 'Nei'], ['enkel', 'Enkel'], ['manuell', 'Manuell']], est.format, 'Ekstra format'))}
        ${addon('Ekstra versjoner', `Enkel ekstra versjon. Fra ${kp(ADDONS.version.price)} per stk.`, stepper('versions', est.versions, 5, 'versjoner'))}
      </div>` : ''}

      ${est.service === 'video' ? `<div class="block"><div class="block-h"><span class="n">${nn()}</span><h3>Drone ved samme oppmøte</h3></div>
        ${est.level === 'avansert'
          ? `<p class="hint"><b class="incl">Enkel drone inkludert.</b> Oppgradering koster bare mellomlegget: standard +${kp(DRONE_ADDON.standard - DRONE_INCLUDED_VALUE)}, avansert +${kp(DRONE_ADDON.avansert - DRONE_INCLUDED_VALUE)}.</p>`
          : `<p class="hint">Avgrenset tillegg på samme lokasjon og oppmøte. Enkel ${kp(DRONE_ADDON.enkel)}, standard ${kp(DRONE_ADDON.standard)}, avansert ${kp(DRONE_ADDON.avansert)}.</p>`}
        ${addon('Droneopptak', 'Ekstra lokasjon, eget oppmøte eller særskilt planlegging krever eget tilbud. Flyging avhenger av vær og lovlig gjennomføring.',
          radios('drone', est.level === 'avansert' ? [['enkel', 'Enkel · inkl.'], ['standard', 'Standard'], ['avansert', 'Avansert']] : [['ingen', 'Ingen'], ['enkel', 'Enkel'], ['standard', 'Standard'], ['avansert', 'Avansert']], est.level === 'avansert' && est.drone === 'ingen' ? 'enkel' : est.drone, 'Droneopptak'))}
      </div>` : ''}

      ${est.service === 'foto' ? `<div class="block"><div class="block-h"><span class="n">${nn()}</span><h3>Bilder og retusj</h3></div>
        ${addon('Antall bilder totalt', `10 bilder inngår. 25 bilder totalt +${kp(ADDONS.images[25])}, 50 bilder totalt +${kp(ADDONS.images[50])}.`, radios('images', [[10, '10'], [25, '25'], [50, '50']], est.images, 'Antall bilder totalt'))}
        ${addon('Utvidet retusj', `Grundigere retusj av et avtalt antall bilder og type arbeid. Fra ${kp(ADDONS.retouch.price)}. Ikke ubegrenset retusj av hele leveransen.`, tog('retouch', est.retouch, 'Utvidet retusj'))}
      </div>` : ''}

      ${est.service === 'design' ? `<div class="block"><div class="block-h"><span class="n">${nn()}</span><h3>Varianter</h3></div>
        ${addon('Ekstra varianter', `Enkel tilpasning av godkjent design, fra ${kp(ADDONS.variant.price)} per stk. Ny komposisjon eller nytt konsept krever eget estimat.`, stepper('variants', est.variants, 5, 'varianter'))}
      </div>` : ''}

      <div class="block"><div class="block-h"><span class="n">${nn()}</span><h3>Korrektur og endringer</h3></div>
        <p class="hint">${lvl.rounds} samlet${lvl.rounds > 1 ? 'de' : ''} korrekturrunde${lvl.rounds > 1 ? 'r' : ''} er inkludert. En korrekturrunde er én samlet tilbakemelding innenfor avtalt retning og omfang. Feil Orion selv har gjort, rettes alltid uten kostnad.</p>
        <div class="rev">
          <div class="rev-top"><span><b>Anslått ekstra endringsarbeid</b><small class="rev-sub">${fmt(CHANGES.hourly)} kr/time, minimum ${CHANGES.minMinutes} min, deretter per ${CHANGES.stepMinutes} min.</small></span><output class="rev-total">${est.changeMinutes ? est.changeMinutes + ' min' : 'Ingen'}</output></div>
          <input class="rev-range" type="range" name="changeMinutes" min="0" max="240" step="15" value="${est.changeMinutes}" aria-label="Anslått ekstra endringsarbeid i minutter" aria-valuetext="${est.changeMinutes ? est.changeMinutes + ' minutter' : 'Ingen'}">
          <div class="rev-ticks"><span>Ingen</span><span>1 t</span><span>2 t</span><span>3 t</span><span>4 t</span></div>
          <p class="hint">Dette er bare et estimat. Ekstra arbeid avklares og bestilles alltid før det gjøres.</p>
        </div>
      </div>

      <div class="block"><div class="block-h"><span class="n">${nn()}</span><h3>Levering${svc.onsite ? ' og reise' : ''}</h3></div>
        ${addon('Prioritert levering', `+${PRIORITY * 100} % på eget produksjonsarbeid og valgte arbeidstillegg – ikke på reise. Avhenger av kapasitet.`, tog('priority', est.priority, 'Prioritert levering'))}
        ${svc.onsite ? `<div class="travel">
          <div class="travel-top"><div class="tt-h"><b>Avstand én vei</b>
              <span class="info"><button type="button" class="info-btn" aria-expanded="false" aria-controls="travel-info" aria-label="Slik beregnes kjøring">i</button>
                <span class="info-pop" id="travel-info" role="tooltip" hidden>Fra ${BASE.name}. ${TRAVEL.freeKmRoundTrip} km tur-retur og ${TRAVEL.freeHours} time samlet reisetid er inkludert. Deretter ${TRAVEL.perKm} kr/km og ${TRAVEL.perHour} kr/time. Bom, parkering og ferge kommer i tillegg ved behov.</span></span></div>
            <div class="travel-read"><output class="travel-km">${est.km} km</output><span class="travel-time">${est.dest ? esc(est.dest.label) : ''}</span></div></div>
          <div class="travel-search">
            <span class="ts-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/></svg></span>
            <input type="search" class="ts-input" placeholder="Søk etter adresse eller sted" autocomplete="off" aria-label="Søk etter adresse" value="${est.dest ? esc(est.dest.label) : ''}">
            <ul class="ts-list" role="listbox" hidden></ul>
          </div>
          <div class="travel-map"><div class="tm-hint">Trykk i kartet eller søk for å velge sted</div></div>
          <div class="travel-fields">
            <label><span>Avstand én vei (km)</span><input class="travel-km-in" type="number" inputmode="decimal" min="0" step="1" value="${est.km}"></label>
            <label><span>Samlet reisetid tur-retur (timer)</span><input class="travel-hours" type="number" inputmode="decimal" min="0" step="0.25" placeholder="Avklares" value="${est.travelHours ?? ''}"></label>
          </div>
          <p class="hint">Reisetid fylles ut fra ruteberegningen når du velger sted, eller du kan skrive den inn selv. Mangler den, står «Reisetid avklares». Flere turer eller lokasjoner prises særskilt.</p>
        </div>` : '<p class="hint">Digital leveranse – ingen kjøring beregnes.</p>'}
      </div>
    </div>

    <aside class="price" aria-label="Din produksjon">
      <button class="expand" type="button" data-act="expand" aria-expanded="false"><span>Estimert pris</span>${I.chev}</button>
      <h4>Din produksjon</h4>
      <div class="groups"></div>
      <div class="label">Samlet estimat</div>
      <div class="amount" aria-live="polite"><span class="lo">0</span> <small>kr</small></div>
      <div class="span-note vat-line"></div>
      <p class="disclaimer">${ESTIMATE_TEXT}</p>
      <div class="actions">
        <button class="btn-x primary" type="button" data-act="talk">Dette ser bra ut. La oss snakke!${I.arrow}</button>
      </div>
      <div class="mini">
        <a class="btn-x link" href="prisgrunnlaget.html">Prisgrunnlaget</a>
        <button class="btn-x link" type="button" data-act="save">Lagre</button>
      </div>
    </aside>
  </div>`;
  updatePrice(true);
}

let shown = 0;
const GROUPS = [['pakke', 'Grunnpakke'], ['tillegg', 'Valgte tillegg'], ['endringer', 'Ekstra endringsarbeid'], ['hast', 'Prioritert levering'], ['reise', 'Kjøring og reisetid']];
function updatePrice(first) {
  const r = calculate(est);
  const panel = $('.price', eBody);
  $('.groups', panel).innerHTML = GROUPS.map(([g, title]) => {
    const ls = r.lines.filter((l) => l.group === g);
    if (!ls.length) return '';
    return `<div class="grp"><h5>${title}</h5><ul>${ls.map((l) => `<li><span>${esc(l.label)}</span><span>${l.quote && !l.amount ? `<em class="quote">${l.note}</em>` : !l.amount && l.note ? `<em class="free">${l.note}</em>` : `${l.note === 'fra' ? 'fra ' : ''}${kp(l.amount)}`}</span></li>`).join('')}</ul></div>`;
  }).join('') + (MVA.status === 'registrert' ? `<div class="grp"><ul><li><span>Mva. 25 %</span><span>${fmt(r.mva)} kr</span></li></ul></div>` : '');
  const shownTotal = view === 'privat' && MVA.status === 'registrert' ? r.totalInc : r.totalEx;
  tween($('.lo', panel), first ? shownTotal * 0.6 : shown, shownTotal, (v) => fmt(Math.round(v * 100) / 100));
  shown = shownTotal;
  $('.vat-line', panel).textContent = `${r.from ? 'Fra-pris · ' : ''}${mvaLabel(view)}${MVA.status === 'registrert' ? ` · ekskl. mva.: ${fmt(r.totalEx)} kr` : ''}${r.hasQuote ? ' · deler avklares i tilbud' : ''}`;
  setTimeout(updateMap, 0);
  saveSession();
}

let L_ = null, mapObj = null, mapEl = null, destMarker = null, routeLine = null, routeGlow = null;
const loadLeaflet = () => L_ ? Promise.resolve(L_) : new Promise((res) => {
  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.append(css);
  const js = document.createElement('script'); js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  js.onload = () => { L_ = window.L; res(L_); }; document.head.append(js);
});
const dot = (L, cls) => L.divIcon({ className: '', html: `<span class="${cls}"></span>`, iconSize: [22, 22], iconAnchor: [11, 11] });
function clearRoute() {
  if (routeLine) { routeLine.remove(); routeGlow.remove(); routeLine = routeGlow = null; }
  if (destMarker) { destMarker.remove(); destMarker = null; }
  if (mapObj) mapObj.flyTo([BASE.lat, BASE.lon], 9, { duration: .6 });
}
async function routeTo(lat, lon, label) {
  const L = await loadLeaflet();
  const read = $('.travel-time', eBody), kmEl = $('.travel-km', eBody);
  if (read) read.textContent = 'beregner …';
  if (!destMarker) {
    destMarker = L.marker([lat, lon], { icon: dot(L, 'tm-dest'), draggable: true }).addTo(mapObj);
    destMarker.on('dragend', () => { const p = destMarker.getLatLng(); routeTo(p.lat, p.lng); });
  } else destMarker.setLatLng([lat, lon]);
  let km, min, coords;
  try {
    const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${BASE.lon},${BASE.lat};${lon},${lat}?overview=full&geometries=geojson`).then((x) => x.json());
    const rt = r.routes[0];
    km = rt.distance / 1000; min = rt.duration / 60;
    coords = rt.geometry.coordinates.map(([x, y]) => [y, x]);
  } catch {
    km = L.latLng(BASE.lat, BASE.lon).distanceTo([lat, lon]) / 1000 * 1.3;   // luftlinje + omvei
    coords = [[BASE.lat, BASE.lon], [lat, lon]];
  }
  if (!label) {
    try {
      const g = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=14&lat=${lat}&lon=${lon}&accept-language=nb`).then((x) => x.json());
      label = g.address ? (g.address.town || g.address.city || g.address.village || g.address.municipality || g.display_name.split(',')[0]) : 'Valgt sted';
    } catch { label = 'Valgt sted'; }
  }
  est.km = Math.round(km); est.dest = { lat, lon, label };
  est.travelHours = min ? Math.round((2 * min / 60) * 4) / 4 : null;   // tur-retur, nærmeste kvarter
  if (routeLine) { routeLine.remove(); routeGlow.remove(); }
  routeGlow = L.polyline(coords, { color: '#fff', weight: 9, opacity: .12 }).addTo(mapObj);
  routeLine = L.polyline(coords, { color: '#fff', weight: 3, opacity: .95 }).addTo(mapObj);
  mapObj.flyToBounds(routeLine.getBounds().pad(.25), { duration: .8 });
  if (kmEl) kmEl.textContent = `${est.km} km`;
  if (read) read.textContent = min ? `ca. ${min < 60 ? Math.round(min) + ' min' : Math.floor(min / 60) + ' t ' + Math.round(min % 60) + ' min'} én vei · ${label}` : `${label} · reisetid avklares`;
  const th = $('.travel-hours', eBody); if (th) th.value = est.travelHours ?? '';
  const inp = $('.ts-input', eBody); if (inp && label) inp.value = label;
  const kmIn = $('.travel-km-in', eBody); if (kmIn) kmIn.value = est.km;
  saveSession(); updatePrice();
}
function updateMap() {
  const el = $('.travel-map', eBody);
  if (!el || mapEl === el) return;
  loadLeaflet().then((L) => {
    if (mapEl === el) return;
    if (mapObj) mapObj.remove();
    destMarker = routeLine = routeGlow = null;
    mapEl = el;
    mapObj = L.map(el, { zoomControl: false, attributionControl: true, scrollWheelZoom: false, tap: true }).setView([BASE.lat, BASE.lon], 9);
    L.control.zoom({ position: 'bottomright' }).addTo(mapObj);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri, © OpenStreetMap', maxZoom: 16 }).addTo(mapObj);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }).addTo(mapObj);
    L.marker([BASE.lat, BASE.lon], { icon: dot(L, 'tm-base'), interactive: false }).addTo(mapObj);
    L.circle([BASE.lat, BASE.lon], { radius: TRAVEL.freeKmRoundTrip / 2 * 1000, color: '#30d158', weight: 1, dashArray: '4 5', fillColor: '#30d158', fillOpacity: .05 }).addTo(mapObj);
    mapObj.on('click', (e) => { el.classList.add('used'); routeTo(e.latlng.lat, e.latlng.lng); });
    if (est.dest) routeTo(est.dest.lat, est.dest.lon, est.dest.label);
    // søk
    const inp = $('.ts-input', eBody), list = $('.ts-list', eBody);
    let tmr, ctl;
    inp.addEventListener('input', () => {
      clearTimeout(tmr);
      const q = inp.value.trim();
      if (q.length < 3) { list.hidden = true; return; }
      tmr = setTimeout(async () => {
        ctl?.abort(); ctl = new AbortController();
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=no,se&accept-language=nb&q=${encodeURIComponent(q)}`, { signal: ctl.signal }).then((x) => x.json());
          list.innerHTML = res.map((r, i) => `<li role="option" tabindex="0" data-i="${i}"><b>${esc(r.display_name.split(',')[0])}</b><small>${esc(r.display_name.split(',').slice(1, 3).join(','))}</small></li>`).join('') || '<li class="none">Fant ingen steder</li>';
          list.hidden = false;
          list._res = res;
        } catch {}
      }, 380);
    });
    const pick = (li) => {
      const r = list._res?.[+li.dataset.i]; if (!r) return;
      list.hidden = true; el.classList.add('used');
      routeTo(+r.lat, +r.lon, r.display_name.split(',')[0]);
    };
    list.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) pick(li); });
    list.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const li = e.target.closest('li[data-i]'); if (li) pick(li); } });
    inp.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') list.querySelector('li')?.focus(); if (e.key === 'Enter') { e.preventDefault(); const li = list.querySelector('li[data-i]'); if (li) pick(li); } });
  });
}


eBody.addEventListener('input', (e) => {
  const t = e.target;
  if (t.name === 'vatView') { view = t.value; renderEstimate(); return; }
  if (t.classList.contains('travel-km-in')) { est.km = Math.max(0, Number(t.value) || 0); est.dest = null; $('.travel-km', eBody).textContent = `${est.km} km`; updatePrice(); return; }
  if (t.classList.contains('travel-hours')) { const v = t.value === '' ? null : Math.max(0, Number(t.value) || 0); est.travelHours = v; updatePrice(); return; }
  if (!t.name || !(t.name in DEFAULT_STATE)) return;
  const def = DEFAULT_STATE[t.name];
  const v = t.type === 'checkbox' ? t.checked : (typeof def === 'number' ? Number(t.value) : t.value);
  est[t.name] = v;
  if (t.name === 'service') { const keep = { km: est.km, travelHours: est.travelHours, dest: est.dest }; est = { ...defaultFor(v), ...keep }; renderEstimate(); return; }
  if (t.name === 'changeMinutes') { const o = $('.rev-total', eBody); o.textContent = v ? `${v} min` : 'Ingen'; t.setAttribute('aria-valuetext', v ? `${v} minutter` : 'Ingen'); updatePrice(); return; }
  if (['level', 'motion', 'format'].includes(t.name)) { const y = eBody.scrollTop; renderEstimate(); eBody.scrollTop = y; return; }
  updatePrice();
});
eBody.addEventListener('click', (e) => {
  const ib = e.target.closest('.info-btn');
  const pops = $$('.info-pop', eBody);
  if (ib) { const pop = ib.nextElementSibling; const open = pop.hidden; pops.forEach((p) => { p.hidden = true; p.previousElementSibling.setAttribute('aria-expanded', 'false'); }); pop.hidden = !open; ib.setAttribute('aria-expanded', String(open)); return; }
  if (!e.target.closest('.info-pop')) pops.forEach((p) => { p.hidden = true; p.previousElementSibling.setAttribute('aria-expanded', 'false'); });
  const stp = e.target.closest('[data-stepper] button');
  if (stp) {
    const wrap = stp.parentElement, name = wrap.dataset.stepper, max = +wrap.dataset.max;
    est[name] = Math.max(0, Math.min(max, (est[name] || 0) + Number(stp.dataset.d)));
    $('output', wrap).textContent = est[name];
    $$('button', wrap)[0].disabled = est[name] <= 0; $$('button', wrap)[1].disabled = est[name] >= max;
    updatePrice(); return;
  }
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'expand') { const p = $('.price', eBody); p.classList.toggle('expanded'); e.target.closest('button').setAttribute('aria-expanded', p.classList.contains('expanded')); }
  if (act === 'save') {
    store.set(KEY, est);
    const b = e.target.closest('button'); const t = b.textContent; b.textContent = 'Lagret ✓'; setTimeout(() => { b.textContent = t; }, 1600);
  }
  if (act === 'reset') { est = { ...DEFAULT_STATE, dest: null }; store.del(KEY); renderEstimate(); }
  if (act === 'talk') {
    const r = calculate(est);
    closeSheet(estSheet);
    const total = view === 'privat' && MVA.status === 'registrert' ? r.totalInc : r.totalEx;
    setTimeout(() => openContact(null, { estimate: { low: total, high: total, from: r.from, mvaLabel: mvaLabel(view), items: r.lines.filter((l) => l.amount || l.note !== 'inkludert').map((l) => [l.label, l.amount]) }, service: est.service }), reduced ? 0 : 440);
  }
});

function openEstimate(fromEl) {
  let sess = null; try { sess = JSON.parse(sessionStorage.getItem(SKEY)); } catch {}
  const saved = store.get(KEY);
  let restored = false;
  if (sess && SERVICES[sess.service]) est = { ...DEFAULT_STATE, dest: null, ...sess };        // samme besøk
  else if (saved && SERVICES[saved.service]) { est = { ...DEFAULT_STATE, dest: null, ...saved }; restored = true; }
  else est = { ...DEFAULT_STATE, dest: null };
  if (!SERVICES[est.service].levels[est.level]) est.level = Object.keys(SERVICES[est.service].levels)[0];
  renderEstimate();
  if (restored) $('.restore', eBody).classList.add('show');
  openSheet(estSheet, fromEl);
}

// ══════════════════════════════════════════════════════════════════════════
// Seksjonen på siden
// ══════════════════════════════════════════════════════════════════════════
export function initCreate() {
  const section = $('.create');
  if (!section) return;

  // Lysflekk som følger musen på de to store kortene
  $$('.path', section).forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
  $('[data-open="contact"]', section)?.addEventListener('click', (e) => openContact(e.currentTarget));
  $('[data-open="estimate"]', section)?.addEventListener('click', (e) => openEstimate(e.currentTarget));

  // «Kontakt»-lenkene på siden kjører ned til denne delen (se index.html)

  // Myk inn-animasjon når innholdet kommer til syne (med mindre siden styrer den selv)
  if (section.hasAttribute('data-manual-reveal')) return;
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('shown'); io.unobserve(en.target); } }), { threshold: 0.15 });
  $$('.reveal', section).forEach((el) => io.observe(el));
}
