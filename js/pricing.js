// ─────────────────────────────────────────────────────────────────────────────
// Orion Produksjon – ÉN felles kilde til priser, pakkeinnhold og regler.
// Brukes av priskalkulatoren (js/create.js), Prisgrunnlaget (prisgrunnlaget.html)
// og testene (tests/pricing.test.mjs). Endre priser KUN her.
//
// Alle beløp er beregningspriser i NOK FØR eventuell mva.
// ─────────────────────────────────────────────────────────────────────────────

// ── Merverdiavgift ───────────────────────────────────────────────────────────
// status: 'registrert' | 'ikke-registrert' | 'ukjent'
// Per 15. oktober 2026: ikke registrert i Merverdiavgiftsregisteret (oppgitt av Orion).
// Endre til 'registrert' ved registrering – da vises privatpriser inkl. 25 % mva.
export const MVA = { status: 'ikke-registrert', rate: 0.25 };

export const HOURLY = 850;              // kr/time, ekstra endringsarbeid
export const BASE_PLACE = { name: 'Siggerud', lat: 59.789572, lon: 10.953911 };

export const SERVICES = {
  design: {
    name: 'Grafisk design', short: 'Design', onsite: false,
    levels: {
      enkel: {
        price: 499, name: 'Enkel',
        summary: 'Ny tekst på en plakat, nytt format av en annonse eller et bytte av bilde i en mal.',
        get: ['Én liten endring eller tilpasning, f.eks. ny tekst eller nytt format på eksisterende design', 'Ett sluttprodukt'],
        bring: 'Eksisterende fil eller materiell og ønsket endring.',
        rounds: 1,
        quote: 'Ny logo, ny visuell identitet eller nytt design fra grunnen.',
      },
      standard: {
        price: 1490, name: 'Standard',
        summary: 'Én plakat, flyer, annonse eller grafikk til sosiale medier.',
        get: ['Ett design basert på avklart innhold', 'Ett sluttprodukt i avtalt format'],
        bring: 'Tekst, logo og bilder som skal brukes.',
        rounds: 2,
        quote: 'Flere ulike design eller flere konsepter å velge mellom.',
      },
      avansert: {
        price: 3900, name: 'Avansert',
        summary: 'Logo basert på din idé, en meny, en brosjyre eller en liten profilpakke.',
        get: ['Større designoppdrag med tydelig avtalt omfang', 'Leveranser etter avtale før oppstart'],
        bring: 'Innhold, eventuell profil og referanser.',
        rounds: 3,
        quote: 'Komplett merkevarestrategi, omfattende profilmanual og mange konsepter.',
      },
    },
  },
  video: {
    name: 'Film og video', short: 'Film', onsite: true,
    levels: {
      enkel: {
        price: 2490, name: 'Enkel',
        summary: 'En kort reel til Instagram eller TikTok, en enkel produktvideo eller en kort hilsen.',
        get: ['Begrenset opptak på én lokasjon', 'Én ferdig video', 'Grunnleggende etterarbeid: klipp, fargebalanse, enkel lyd og eksport'],
        bring: 'Avklart formål og eventuell tekst/logo.',
        rounds: 1,
        quote: 'Flere lokasjoner eller opptaksdager.',
      },
      standard: {
        price: 4900, name: 'Standard',
        summary: 'En presentasjon av bedriften, en eventvideo eller en reklame til sosiale medier.',
        get: ['Mer opptak og flere vinkler', 'Ett avtalt hovedprodukt', 'Grunnleggende etterarbeid inkludert'],
        bring: 'Avklart formål, tekst og logo.',
        rounds: 2,
        quote: 'Flere selvstendige hovedprodukter.',
      },
      avansert: {
        price: 8900, name: 'Avansert',
        summary: 'En reklamefilm, lanseringsvideo eller bedriftsfilm – med dronebilder inkludert.',
        get: ['Større avgrenset produksjon', 'Mer etterarbeid', 'Enkel dronevideo inkludert ved samme oppmøte'],
        bring: 'Avklart formål, manus/innhold og logo.',
        rounds: 3,
        quote: 'Omfattende VFX, spesialutstyr, flere opptaksdager og store produksjoner.',
      },
    },
  },
  edit: {
    name: 'Videoredigering av ditt materiale', short: 'Redigering', onsite: false,
    levels: {
      enkel: {
        price: 1900, name: 'Enkel', from: true,
        summary: 'Du har filmet selv – vi gjør det om til en ferdig video.',
        get: ['Klipp av materiale du leverer', 'Grunnleggende fargebalanse, lyd og eksport', 'Én ferdig video'],
        bring: 'Ferdig filmet materiale og ønsket resultat.',
        rounds: 1,
        quote: 'Omfattende materiale, grafikk eller flere videoer. Ingen opptak inngår.',
      },
    },
  },
  drone: {
    name: 'Dronevideo (eget oppdrag)', short: 'Drone', onsite: true,
    levels: {
      enkel: {
        price: 1500, name: 'Enkel',
        summary: 'Korte droneopptak av hus, hytte, tomt eller gård – levert som utvalgte råklipp.',
        rawOnly: true,   // råklipp: ferdig redigering inngår ikke
        get: ['Korte droneopptak fra én lokasjon', 'Utvalgte råklipp, ikke ferdig redigert film'],
        bring: 'Adresse og hva som skal vises.',
        rounds: 1,
        quote: 'Flere lokasjoner.',
      },
      standard: {
        price: 3500, name: 'Standard',
        summary: 'En kort, ferdig dronevideo av eiendom, gård eller prosjekt.',
        get: ['Droneopptak fra én lokasjon', 'En kort, ferdig redigert film med grunnleggende etterarbeid'],
        bring: 'Adresse, formål og eventuell logo.',
        rounds: 2,
        quote: 'Flere lokasjoner eller kombinert bakkeopptak.',
      },
      avansert: {
        price: 6500, name: 'Avansert',
        summary: 'Salgsvideo for eiendom, byggeprosjekt eller anlegg, med mer etterarbeid.',
        get: ['Mer omfattende flyging og opptak', 'Ferdig redigert film med mer etterarbeid'],
        bring: 'Adresse, formål, tekst og logo.',
        rounds: 3,
        quote: 'Flere lokasjoner, spesialtillatelser eller særskilt planlegging.',
      },
    },
    note: 'Flyging avhenger av vær, egnede forhold og at det kan gjennomføres lovlig.',
  },
  motion: {
    name: 'Grafikk og animasjon', short: 'Animasjon', onsite: false,
    levels: {
      enkel: {
        price: 1500, name: 'Enkel',
        summary: 'Animert logo, tekstplakater eller en kort intro – laget fra mal.',
        get: ['Animasjon bygget på mal eller ferdige elementer', 'Tilpasset din logo, farger og tekst', 'Én ferdig eksport'],
        bring: 'Logo, tekst og ønsket format.',
        rounds: 1,
        quote: 'Egenutviklet animasjon fra grunnen.',
      },
      standard: {
        price: 3000, name: 'Standard',
        summary: 'Egen, kort animasjon – f.eks. animert logo eller enkel forklaringsgrafikk.',
        get: ['Egenutviklet, kort animasjon', 'Tilpasset din visuelle profil', 'Én ferdig eksport'],
        bring: 'Logo, tekst, profil og referanser.',
        rounds: 2,
        quote: 'Lengre animasjoner, 3D eller mange scener.',
      },
      avansert: {
        price: 5900, name: 'Avansert',
        summary: 'Lengre eller mer kompleks animasjon, som en kort forklaringsvideo.',
        get: ['Flere scener eller mer kompleks bevegelse', 'Manus og storyboard avklares sammen', 'Ferdig eksport i avtalte formater'],
        bring: 'Budskap, tekst, profil og referanser.',
        rounds: 3,
        quote: 'Omfattende 3D, karakteranimasjon og lange produksjoner.',
      },
    },
  },
  foto: {
    name: 'Foto', short: 'Foto', onsite: true,
    levels: {
      enkel: {
        price: 1490, name: 'Enkel',
        summary: 'Profilbilder, enkle produktbilder eller bilder til nettsiden.',
        get: ['10 ferdig behandlede bilder inkludert', 'Enkelt oppsett, én lokasjon'],
        bring: 'Hva og hvem som skal fotograferes.',
        rounds: 1,
        quote: 'Studiooppsett eller flere lokasjoner.',
      },
      standard: {
        price: 2900, name: 'Standard',
        summary: 'Bedriftsbilder med flere personer, miljøbilder og variasjon.',
        get: ['10 ferdig behandlede bilder inkludert', 'Mer variasjon i motiver og oppsett'],
        bring: 'Ønsket stil og motiver.',
        rounds: 2,
        quote: 'Omfattende produksjoner med mange motiver.',
      },
      avansert: {
        price: 4900, name: 'Avansert',
        summary: 'Produktserier, kampanjebilder og mer krevende lys og oppsett.',
        get: ['10 ferdig behandlede bilder inkludert', 'Mer komplekse oppsett og større variasjon'],
        bring: 'Ønsket stil, motiver og referanser.',
        rounds: 3,
        quote: 'Avansert retusj av alle bilder inngår ikke – avtales som tillegg.',
      },
    },
  },
};
export const SERVICE_ORDER = ['design', 'video', 'edit', 'drone', 'foto', 'motion'];
// Tjenester som vises, men ikke kan velges ennå (samme i kalkulator og kontaktskjema)
export const COMING_SOON = [{ id: 'web', name: 'Nettside', d: 'Moderne nettsider med fokus på opplevelse' }];

// ── Tillegg ──────────────────────────────────────────────────────────────────
export const ADDONS = {
  // film/drone (alle «fra»-priser)
  advEdit:   { price: 2500, label: 'Avansert redigering', from: true },
  color:     { price: 800,  label: 'Utvidet fargearbeid', from: true },
  music:     { price: 300,  label: 'Særskilt musikkutvelgelse og tilpasning', from: true },
  motion:    { enkel: { price: 1500, label: 'Enkel motion graphics fra mal' }, egen: { price: 3000, label: 'Egenutviklet animasjon', quote: true } },
  subs:      { price: 500,  label: 'Undertekster (kort video, ett språk)', from: true },
  format:    { enkel: { price: 600, label: 'Ekstra format, enkel beskjæring' }, manuell: { price: 1200, label: 'Ekstra format, manuell tilpasning' } },
  version:   { price: 500,  label: 'Enkel ekstra versjon', from: true },
  // design
  variant:   { price: 450,  label: 'Ekstra variant (enkel tilpasning av godkjent design)', from: true },
  // foto (totalt antall bilder – gjensidig utelukkende)
  images:    { 10: 0, 25: 1500, 50: 3500 },
  retouch:   { price: 900,  label: 'Utvidet retusj (avtalt antall bilder)', from: true },
};

// Drone som tillegg til film (samme oppmøte og lokasjon)
export const DRONE_ADDON = { enkel: 1500, standard: 3000, avansert: 6500 };
export const DRONE_INCLUDED_VALUE = 1500;   // inkludert i avansert film

// Ekstra endringsarbeid
export const CHANGES = { hourly: HOURLY, minMinutes: 30, stepMinutes: 15 };

// Kjøring og reisetid
export const TRAVEL = { freeKmRoundTrip: 40, perKm: 6, freeHours: 1, perHour: 500 };

export const PRIORITY = 0.25;

export const ESTIMATE_TEXT = 'Et prisestimat basert på valgene dine. Endelig omfang og pris avtales før oppstart.';

// ── Hjelpere ─────────────────────────────────────────────────────────────────
const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : d; };
export const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
export const fmt = (n) => new Intl.NumberFormat('nb-NO', { minimumFractionDigits: Number.isInteger(round2(n)) ? 0 : 2, maximumFractionDigits: 2 }).format(round2(n));
export const fmtKr = (n) => `${fmt(n)} kr`;

/** Ekstra endringsarbeid i kr: minimum 30 min, deretter 15-minutters intervaller. 0 = ingen. */
export function changePrice(minutes) {
  const m = num(minutes);
  if (m <= 0) return 0;
  const billed = Math.max(CHANGES.minMinutes, Math.ceil(m / CHANGES.stepMinutes) * CHANGES.stepMinutes);
  return round2(billed / 60 * CHANGES.hourly);
}

/** Kjøring: avstand én vei (km) og samlet reisetid i timer (null = ukjent). */
export function travelPrice(oneWayKm, totalHours) {
  const km = num(oneWayKm);
  const roundTrip = 2 * km;
  const kmPrice = round2(Math.max(0, roundTrip - TRAVEL.freeKmRoundTrip) * TRAVEL.perKm);
  const hoursKnown = totalHours !== null && totalHours !== undefined && totalHours !== '' && Number.isFinite(Number(totalHours)) && Number(totalHours) >= 0;
  const timePrice = hoursKnown ? round2(Math.max(0, Number(totalHours) - TRAVEL.freeHours) * TRAVEL.perHour) : null;
  return { roundTrip, kmPrice, timePrice, hoursKnown };
}

export function mvaFactor() { return MVA.status === 'registrert' ? 1 + MVA.rate : 1; }

/** Pris slik den skal vises til kunden (privat = inkl. mva når registrert). */
export function displayPrice(exMva, view = 'privat') {
  if (MVA.status === 'registrert' && view === 'privat') return round2(exMva * (1 + MVA.rate));
  return round2(exMva);
}
export function mvaLabel(view = 'privat') {
  if (MVA.status === 'registrert') return view === 'privat' ? 'inkl. mva.' : 'ekskl. mva.';
  if (MVA.status === 'ikke-registrert') return 'ingen mva.';
  return 'ekskl. eventuell mva.';
}

// ── Standardvalg: alltid det rimeligste, ingen tillegg forhåndsvalgt ────────
export const DEFAULT_STATE = {
  service: 'design', level: 'enkel',
  changeMinutes: 0, variants: 0,
  advEdit: false, color: false, music: false, motion: 'ingen', subs: false, format: 'ingen', versions: 0,
  drone: 'ingen',
  images: 10, retouch: false,
  km: 0, travelHours: null, priority: false,
};
export const defaultFor = (service) => ({ ...DEFAULT_STATE, service, level: Object.keys(SERVICES[service].levels)[0] });

// ── Selve beregningen ────────────────────────────────────────────────────────
/**
 * Returnerer et oppsett med linjer gruppert etter kategori.
 * Hver linje: { group, label, amount, note, quote, priority: (inngår i hastegrunnlag) }
 */
export function calculate(input) {
  const s = { ...DEFAULT_STATE, ...input };
  const svc = SERVICES[s.service] || SERVICES.design;
  const lvl = svc.levels[s.level] || Object.values(svc.levels)[0];
  const levelKey = Object.keys(svc.levels).find((k) => svc.levels[k] === lvl);
  const lines = [];
  const add = (group, label, amount, extra = {}) => lines.push({ group, label, amount: round2(amount), priority: true, ...extra });

  // Grunnpakke
  add('pakke', `${svc.name} – ${lvl.name.toLowerCase()}`, lvl.price, { note: lvl.from ? 'fra' : '' });
  add('pakke', `${lvl.rounds} samlet${lvl.rounds > 1 ? 'de' : ''} korrekturrunde${lvl.rounds > 1 ? 'r' : ''}`, 0, { note: 'inkludert' });

  const filmish = (s.service === 'video' || s.service === 'drone' || s.service === 'edit') && !lvl.rawOnly;
  if (lvl.rawOnly) add('pakke', 'Utvalgte råklipp – ferdig redigering inngår ikke', 0, { note: 'råklipp' });
  if (filmish) {
    add('pakke', 'Grunnleggende klipp, fargebalanse, lyd og eksport', 0, { note: 'inkludert' });
    if (s.advEdit) add('tillegg', ADDONS.advEdit.label, ADDONS.advEdit.price, { note: 'fra' });
    if (s.color) add('tillegg', ADDONS.color.label, ADDONS.color.price, { note: 'fra' });
    if (s.music) add('tillegg', ADDONS.music.label, ADDONS.music.price, { note: 'fra' });
    if (s.motion === 'enkel') add('tillegg', ADDONS.motion.enkel.label, ADDONS.motion.enkel.price, { note: 'fra' });
    if (s.motion === 'egen') add('tillegg', ADDONS.motion.egen.label, ADDONS.motion.egen.price, { note: 'fra', quote: true });
    if (s.subs) add('tillegg', ADDONS.subs.label, ADDONS.subs.price, { note: 'fra' });
    if (s.format === 'enkel') add('tillegg', ADDONS.format.enkel.label, ADDONS.format.enkel.price, { note: 'fra' });
    if (s.format === 'manuell') add('tillegg', ADDONS.format.manuell.label, ADDONS.format.manuell.price, { note: 'fra' });
    const v = Math.floor(num(s.versions));
    if (v) add('tillegg', `${v} ${ADDONS.version.label.toLowerCase()}${v > 1 ? 'er' : ''}`, ADDONS.version.price * v, { note: 'fra' });
    if (s.advEdit && (s.motion !== 'ingen' || s.color)) {
      add('tillegg', 'Overlapp mellom avansert redigering, grafikk og farge', 0, { note: 'avklares i tilbud', quote: true });
    }
  }

  // Drone som tillegg til film
  if (s.service === 'video') {
    const included = levelKey === 'avansert' ? DRONE_INCLUDED_VALUE : 0;
    if (included && (s.drone === 'ingen' || s.drone === 'enkel')) add('tillegg', 'Enkel drone', 0, { note: 'inkludert' });
    else if (s.drone !== 'ingen' && DRONE_ADDON[s.drone] !== undefined) {
      const pay = Math.max(0, DRONE_ADDON[s.drone] - included);
      add('tillegg', included ? `Oppgradering til ${s.drone} drone (enkel drone inkludert)` : `Drone ${s.drone} (samme oppmøte)`, pay);
    }
  }

  if (s.service === 'motion') {
    if (s.music) add('tillegg', ADDONS.music.label, ADDONS.music.price, { note: 'fra' });
    if (s.format === 'enkel') add('tillegg', ADDONS.format.enkel.label, ADDONS.format.enkel.price, { note: 'fra' });
    if (s.format === 'manuell') add('tillegg', ADDONS.format.manuell.label, ADDONS.format.manuell.price, { note: 'fra' });
    const v = Math.floor(num(s.versions));
    if (v) add('tillegg', `${v} ${ADDONS.version.label.toLowerCase()}${v > 1 ? 'er' : ''}`, ADDONS.version.price * v, { note: 'fra' });
  }

  if (s.service === 'foto') {
    const imgs = [10, 25, 50].includes(Number(s.images)) ? Number(s.images) : 10;
    add(imgs === 10 ? 'pakke' : 'tillegg', `${imgs} bilder totalt`, ADDONS.images[imgs], imgs === 10 ? { note: 'inkludert' } : {});
    if (s.retouch) add('tillegg', ADDONS.retouch.label, ADDONS.retouch.price, { note: 'fra' });
  }

  if (s.service === 'design') {
    const v = Math.floor(num(s.variants));
    if (v) add('tillegg', `${v} ekstra variant${v > 1 ? 'er' : ''} (enkel tilpasning)`, ADDONS.variant.price * v, { note: 'fra' });
  }

  // Ekstra endringsarbeid (estimat)
  const cm = changePrice(s.changeMinutes);
  if (cm) add('endringer', `Ekstra endringsarbeid, ca. ${Math.max(CHANGES.minMinutes, Math.ceil(num(s.changeMinutes) / 15) * 15)} min`, cm, { note: 'estimat' });

  // Hastetillegg – kun på eget produksjonsarbeid og arbeidstillegg
  const workBase = round2(lines.filter((l) => l.priority).reduce((a, l) => a + l.amount, 0));
  if (s.priority) add('hast', 'Prioritert levering (25 % av produksjonsarbeid)', workBase * PRIORITY, { priority: false });

  // Reise (ikke for digitale leveranser)
  let travel = null;
  if (svc.onsite) {
    travel = travelPrice(s.km, s.travelHours);
    if (!(num(s.km) > 0)) add('reise', 'Reise', 0, { priority: false, note: 'avklares når sted er valgt', quote: true });
    else add('reise', `Kjøring ${fmt(travel.roundTrip)} km tur-retur`, travel.kmPrice, { priority: false, note: travel.kmPrice ? '' : 'inkludert' });
    if (travel.hoursKnown) add('reise', `Reisetid ${fmt(round2(Number(s.travelHours)))} t samlet`, travel.timePrice, { priority: false, note: travel.timePrice ? '' : 'inkludert' });
    else if (travel.roundTrip > 0) add('reise', 'Reisetid', 0, { priority: false, note: 'avklares', quote: true });
  }

  const totalEx = round2(lines.reduce((a, l) => a + l.amount, 0));
  const hasQuote = lines.some((l) => l.quote);
  const mva = MVA.status === 'registrert' ? round2(totalEx * MVA.rate) : 0;
  return {
    state: s, service: svc, level: lvl, lines, workBase, travel,
    totalEx, mva, totalInc: round2(totalEx + mva), hasQuote,
    from: lines.some((l) => l.note === 'fra'),
  };
}
