// Vilkår og personvern: årstall i bunnteksten og menyen (samme som de andre sidene)
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
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
