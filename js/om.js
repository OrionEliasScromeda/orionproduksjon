// Om Orion – skrolleffekter
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  // Årstall i bunnteksten
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Inn-animasjoner
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Ordene i [data-lit] deles opp, så de kan lyses opp etter hverandre
  const split = (p) => {
    const words = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const w = document.createElement('span'); w.className = 'w'; w.textContent = part;
            frag.append(w); words.push(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(p);
    return { p, words };
  };
  const lits = [...document.querySelectorAll('[data-lit]')].map(split);
  const mq = document.querySelector('[data-merge-lit]');
  const mWords = mq ? split(mq).words : [];
  const introSec = document.querySelector('.intro'), introPin = document.querySelector('.intro-pin');
  const mergeSec = document.querySelector('.merge'), mergePin = document.querySelector('.merge-pin');
  const smooth = (t) => t * t * (3 - 2 * t);
  const ideasWord = document.querySelector('.ideas-word');
  const wls = [...document.querySelectorAll('.wl')];
  const expBig = document.querySelector('.exp-big');
  const sign = document.querySelector('.sign');
  sign.querySelectorAll('.mark path').forEach((pa) => pa.style.setProperty('--len', Math.ceil(pa.getTotalLength())));
  const signText = document.querySelector('[data-sign]');
  const signWords = split(signText).words;
  const fieldSec = document.querySelector('.field'), fieldPin = document.querySelector('.field-pin');
  const tw = [...document.querySelectorAll('.trio .tw')];

  // ── Portrett ──
  const pixSec = document.querySelector('.pix');
  const pixPin = document.querySelector('.pix-pin');
  const pixStage = document.querySelector('.pix-stage');
  const pixPhoto = document.querySelector('.pix-photo');
  const pixName = document.querySelector('.pix-name');
  // navnet deles i bokstaver
  const nameChars = [];
  [...pixName.textContent].forEach((c) => {
    const el = document.createElement('span');
    if (c === ' ') { el.className = 'sp'; } else { el.className = 'ch'; el.textContent = c; el.style.setProperty('--i', nameChars.length); nameChars.push(el); }
    pixName.append(el);
  });
  pixName.firstChild.remove?.();
  const pixText = document.querySelector('.pix-text');
  const lerp = (a, b, t) => a + (b - a) * t;

  // Fast skjermhøyde (= CSS 100vh): på iPhone endrer innerHeight seg når adresselinja glir inn og ut,
  // og da ville de skroll-styrte effektene hoppet litt midt i scrollingen.
  const vhProbe = document.createElement('div');
  vhProbe.setAttribute('aria-hidden', 'true');
  vhProbe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100vh;visibility:hidden;pointer-events:none';
  document.body.append(vhProbe);
  let VH = vhProbe.offsetHeight || innerHeight;
  addEventListener('resize', () => { VH = vhProbe.offsetHeight || innerHeight; });

  let ticking = false;
  const update = () => {
    ticking = false;
    const H = VH;
    // Alle målinger gjøres først, deretter all skriving. Blandes de, må nettleseren regne ut
    // layouten på nytt flere ganger i samme bilde (tungt på svake mobiler).
    const R = (el) => el.getBoundingClientRect();
    const pr = R(pixSec), ir = R(introSec), mr = R(mergeSec), sb = R(sign);
    const fr = fieldSec && R(fieldSec), eb = expBig && R(expBig), ib = ideasWord && R(ideasWord);
    const wlR = wls.map(R), litR = lits.map(({ p }) => R(p));
    const textH = pixText.offsetHeight;
    const fs = parseFloat(getComputedStyle(tw[0]).fontSize);
    // Portrett: 9:16-utsnitt → 16:9, så flyr navnet inn bak Orion
    const pp = reduced ? 1 : clamp01(-pr.top / (pr.height - H));
    const pin = reduced ? 1 : clamp01((H - pr.top) / (H * 0.9));
    const W = innerWidth;
    const setv = (k, v) => pixPin.style.setProperty(k, v.toFixed(4));
    setv('--in', smooth(pin));
    const z = reduced ? 1 : smooth(clamp01((pp - 0.06) / 0.4));               // 9:16 → 16:9
    const tgap = Math.max(22, H * 0.035);
    const side = W < 700 ? 24 : 48;
    const cw = Math.min(W - side, (H - textH - tgap - 110) * 16 / 9, 1700), ch = cw * 9 / 16;
    const h0 = Math.min(H - (W < 700 ? 100 : 120), (W - side) * 16 / 9), w0 = h0 * 9 / 16;
    const top0 = (H - h0) / 2 + (W < 700 ? 20 : 10), top1 = Math.max(70, (H - (ch + tgap + textH)) / 2);
    const sw = lerp(w0, cw, z), sh = lerp(h0, ch, z), st = lerp(top0, top1, z);
    pixStage.style.width = sw + 'px';
    pixStage.style.height = sh + 'px';
    pixStage.style.top = st + 'px';
    pixStage.style.borderRadius = lerp(W < 700 ? 26 : 34, W < 700 ? 20 : 30, z).toFixed(1) + 'px';
    pixStage.style.boxShadow = '0 40px 120px rgba(0,0,0,.55)';
    // Kortet reiser seg inn i 3D
    const lift = reduced ? 1 : smooth(clamp01((pin - 0.1) / 0.9));
    pixStage.style.setProperty('--rx', (lerp(28, 0, lift)).toFixed(2) + 'deg');
    pixStage.style.setProperty('--ry', (lerp(H * 0.12, 0, lift)).toFixed(1) + 'px');
    const pw = Math.max(sw, sh * 16 / 9);
    pixPhoto.style.width = pw + 'px';
    pixPhoto.style.transform = '';
    // navnet flyr inn bokstav for bokstav når rammen er ute
    const ns = 0.5, n = nameChars.length;
    nameChars.forEach((el, i) => {
      const k = reduced ? 1 : smooth(clamp01((pp - ns - i * 0.016) / 0.12));
      el.style.setProperty('--k', k.toFixed(4));
    });
    pixName.classList.toggle('swoosh', !reduced && pp > ns + n * 0.016 + 0.12);
    // bakgrunnen går litt ut av fokus mens navnet kommer, og tilbake til normal etterpå
    setv('--b', smooth(clamp01((pp - 0.48) / 0.12)) * (1 - smooth(clamp01((pp - 0.74) / 0.12))));
    pixText.style.top = (top1 + ch + tgap) + 'px';
    const tt = smooth(clamp01((pp - 0.8) / 0.12));
    setv('--t', tt);
    pixPin.classList.toggle('waved', tt > 0.9);

    // Intro: tittelen trekker seg sammen og forsvinner inn i dybden
    introPin.style.setProperty('--q', reduced ? 0 : smooth(clamp01(-ir.top / (ir.height - H))).toFixed(4));
    // Film, design og teknologi: kulene kommer inn, møtes og smelter sammen til lys
    const mp = reduced ? 1 : clamp01(-mr.top / (mr.height - H));
    const inn = clamp01((H * 1.15 - mr.top) / (H * 0.7));                 // på vei inn
    mergePin.style.setProperty('--in', smooth(inn).toFixed(3));
    // Film. → Design. → Teknologi.: hvert ord alene, stort, zoomer inn og ut – til slutt samles alle tre
    const mix = (a, b, t) => a + (b - a) * t;
    const enter = [smooth(clamp01((inn - 0.45) / 0.5)), smooth(clamp01((mp - 0.14) / 0.09)), smooth(clamp01((mp - 0.31) / 0.09))];
    const leave = [smooth(clamp01((mp - 0.08) / 0.09)), smooth(clamp01((mp - 0.25) / 0.09)), 0];
    const fin = smooth(clamp01((mp - 0.44) / 0.16));
    const FS = innerWidth < 700 ? 0.62 : 0.5, gap = fs * FS * 1.04;
    tw.forEach((el, i) => {
      const e = enter[i], l = leave[i];
      const soloScale = (2.1 - 1.1 * e) * (1 - 0.45 * l);
      const soloOp = e * (1 - l);
      const op = Math.max(soloOp, fin);
      const sc = mix(soloScale, FS, fin);
      const ty = mix(-l * 40, (i - 1) * gap, fin);
      const bl = mix((1 - e) * 22 + l * 18, 0, fin);
      el.style.opacity = op.toFixed(3);
      el.style.transform = `translateY(${ty.toFixed(1)}px) scale(${sc.toFixed(4)})`;
      el.style.filter = bl > 0.2 ? `blur(${bl.toFixed(1)}px)` : '';
    });
    mergePin.style.setProperty('--qo', smooth(clamp01((mp - 0.52) / 0.1)).toFixed(3));
    const lt = clamp01((mp - 0.55) / 0.36);
    mWords.forEach((w, i) => w.style.setProperty('--o', (0.2 + 0.8 * clamp01(lt * mWords.length * 1.1 - i)).toFixed(3)));

    // «Store bedrifter. Nye virksomheter. Spesielle øyeblikk.» lyses opp etter hverandre
    wls.forEach((el, j) => {
      const b = wlR[j];
      const k = reduced ? 1 : smooth(clamp01((H * 0.72 - b.top) / (H * 0.16)));
      el.style.setProperty('--on', k.toFixed(3));
    });
    // Fargefeltet: fyller skjermen, skifter farge, to budskap etter hverandre
    if (fieldSec) {
      const fp = reduced ? 0.5 : clamp01(-fr.top / (fr.height - H));
      const fin = clamp01((H - fr.top) / H);
      const fout = clamp01((fr.bottom - H * 0.0) / H);
      fieldPin.style.setProperty('--f', (smooth(clamp01((fin - 0.15) / 0.7)) * smooth(clamp01((fout - 0.1) / 0.8))).toFixed(3));
      fieldPin.style.setProperty('--h', smooth(clamp01((fp - 0.35) / 0.3)).toFixed(3));
      fieldPin.style.setProperty('--s1', (smooth(clamp01((fp - 0.0) / 0.14)) * (1 - smooth(clamp01((fp - 0.36) / 0.1)))).toFixed(3));
      fieldPin.style.setProperty('--s2', (smooth(clamp01((fp - 0.5) / 0.14)) * (1 - smooth(clamp01((fp - 0.9) / 0.1)))).toFixed(3));
    }

    // Avslutning: stjernen tegnes og tennes, teksten kommer ord for ord, så navnet
    {
      const sp = reduced ? 1 : clamp01((H * 0.95 - sb.top) / (H * 0.75));
      sign.style.setProperty('--dr', smooth(clamp01(sp / 0.45)).toFixed(4));
      sign.style.setProperty('--fl', smooth(clamp01((sp - 0.38) / 0.2)).toFixed(4));
      const tw = clamp01((sp - 0.5) / 0.3);
      signWords.forEach((w, i) => w.style.setProperty('--o', smooth(clamp01(tw * signWords.length * 1.2 - i)).toFixed(3)));
      sign.style.setProperty('--nm', smooth(clamp01((sp - 0.8) / 0.18)).toFixed(4));
    }
    if (expBig) {
      expBig.style.setProperty('--ep', clamp01((H - eb.top) / (H + eb.height)).toFixed(4));
    }
    // «ideer.» fylles med farge i takt med skrollingen
    if (ideasWord) {
      const fill = reduced ? 1 : clamp01((H * 0.85 - ib.top) / (H * 0.45));
      ideasWord.style.setProperty('--fill', fill.toFixed(4));
    }

    // Ordene lyses opp mens avsnittet passerer midten av skjermen
    lits.forEach(({ words }, j) => {
      const b = litR[j];
      const t = reduced ? 1 : clamp01((H * 0.82 - b.top) / (b.height + H * 0.3));
      const n = words.length;
      words.forEach((w, i) => {
        const k = clamp01(t * n * 1.15 - i);
        w.style.setProperty('--o', (0.16 + 0.84 * k).toFixed(3));
      });
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();

  // Bunntekst: logoen tar deg til toppen
  document.querySelectorAll('[data-to-top]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }));

  // Kommer man via «Bli bedre kjent med Orion», hopper siden rett til portrettet av Orion (ferdig animert)
  if (new URLSearchParams(location.search).has('orion')) {
    history.replaceState(null, '', location.pathname);
    const go = () => {
      const target = pixSec.offsetTop + (pixSec.offsetHeight - innerHeight) * 0.97;
      scrollTo({ top: target, behavior: 'instant' });
      onScroll();
    };
    if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
  }

  // ── Meny (samme som forsiden) ──
  {
    const btn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.topbar .nav');
    const setOpen = (open) => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); if (!open) setTimeout(() => nav.classList.remove('sub-open'), 350); };
    btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target) && !btn.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    const small = matchMedia('(max-width: 833px)');
    document.querySelector('.mm-more').addEventListener('click', (e) => {
      if (!small.matches) return;
      e.preventDefault(); e.stopPropagation(); nav.classList.add('sub-open');
    });
    document.querySelector('.mm-back').addEventListener('click', (e) => { e.stopPropagation(); nav.classList.remove('sub-open'); });
  }
})();
