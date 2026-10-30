// «Follo / Oslo-området» i bunnteksten: åpner et lite kart over området (ingen eksakt adresse)
const btn = document.querySelector('.ft-place');
if (btn) {
  const AREA = { lat: 59.8, lon: 10.82, r: 20000 };   // Follo med Oslo i nord
  let pop, map;
  const loadLeaflet = () => window.L ? Promise.resolve(window.L) : new Promise((res) => {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.append(css);
    const js = document.createElement('script'); js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = () => res(window.L); document.head.append(js);
  });
  const close = () => { pop.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus({ preventScroll: true }); };
  const build = () => {
    pop = document.createElement('div');
    pop.className = 'ft-map';
    pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Kart over Follo og Oslo-området');
    pop.innerHTML = `<div class="ft-map-card">
        <div class="ft-map-head"><div><b>Follo / Oslo-området</b><span>Base i Follo · reiser gjerne lenger</span></div>
          <button class="ft-map-x" type="button" aria-label="Lukk kart"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>
        <div class="ft-map-canvas"></div>
      </div>`;
    document.body.append(pop);
    pop.addEventListener('click', (e) => { if (e.target === pop) close(); });
    pop.querySelector('.ft-map-x').addEventListener('click', close);
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && pop.classList.contains('open')) close(); });
  };
  btn.addEventListener('click', async () => {
    if (!pop) build();
    requestAnimationFrame(() => pop.classList.add('open'));
    btn.setAttribute('aria-expanded', 'true');
    const L = await loadLeaflet();
    if (map) { map.invalidateSize(); return; }
    map = L.map(pop.querySelector('.ft-map-canvas'), { zoomControl: false, scrollWheelZoom: false, attributionControl: true }).setView([AREA.lat + 0.08, AREA.lon], 9);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri, © OpenStreetMap', maxZoom: 13 }).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 13 }).addTo(map);
    const area = L.circle([AREA.lat, AREA.lon], { radius: AREA.r, color: '#fff', weight: 1.2, opacity: .7, fillColor: '#fff', fillOpacity: .08 }).addTo(map);
    setTimeout(() => { map.invalidateSize(); map.fitBounds(area.getBounds(), { padding: [18, 18] }); }, 350);
  });
}

// Grå tjenester i bunnteksten: vis «Kommer snart» ved trykk
document.querySelectorAll('.ft-soon').forEach((el) => el.addEventListener('click', () => {
  el.classList.add('tapped'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('tapped'), 1800);
}));
