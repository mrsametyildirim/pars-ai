'use strict';

/* ══════════════════════════════════════════
   Header — scroll gölge
══════════════════════════════════════════ */
const siteHeader = document.getElementById('siteHeader');
if (siteHeader) {
  const observer = new IntersectionObserver(
    ([e]) => siteHeader.classList.toggle('scrolled', !e.isIntersecting),
    { rootMargin: '-1px 0px 0px 0px', threshold: 0 }
  );
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}

/* ══════════════════════════════════════════
   Hamburger menü
══════════════════════════════════════════ */
const btnHamburger = document.getElementById('btnHamburger');
const mobileMenu   = document.getElementById('mobileMenu');

if (btnHamburger && mobileMenu) {
  const closeMobileMenu = (restoreFocus) => {
    btnHamburger.setAttribute('aria-expanded', 'false');
    btnHamburger.setAttribute('aria-label', window.fjT ? window.fjT('Menüyü aç', 'Menüyü aç') : 'Menüyü aç');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.style.removeProperty('opacity');
    mobileMenu.style.removeProperty('visibility');
    mobileMenu.style.removeProperty('transform');
    mobileMenu.style.removeProperty('transition');
    document.body.classList.remove('fj-menu-open');
    document.body.style.overflow = '';
    if (restoreFocus) btnHamburger.focus();
  };
  btnHamburger.addEventListener('click', () => {
    const open = btnHamburger.getAttribute('aria-expanded') === 'true';
    if (open) { closeMobileMenu(false); return; }
    btnHamburger.setAttribute('aria-expanded', 'true');
    btnHamburger.setAttribute('aria-label', 'Menüyü kapat');
    mobileMenu.setAttribute('aria-hidden', 'false');
    /* Keep the panel deterministically visible even when an older cached
       transition rule is still present in the browser. */
    mobileMenu.style.setProperty('transition', 'none', 'important');
    mobileMenu.style.setProperty('opacity', '1', 'important');
    mobileMenu.style.setProperty('visibility', 'visible', 'important');
    mobileMenu.style.setProperty('transform', 'none', 'important');
    document.body.classList.add('fj-menu-open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => mobileMenu.querySelector('a,button')?.focus({ preventScroll: true }));
  });

  mobileMenu.addEventListener('click', e => {
    if (e.target === mobileMenu) {
      closeMobileMenu(false);
    }
  });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMobileMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && btnHamburger.getAttribute('aria-expanded') === 'true') closeMobileMenu(true); });
  addEventListener('resize', () => { if (innerWidth > 1180 && btnHamburger.getAttribute('aria-expanded') === 'true') closeMobileMenu(false); }, { passive: true });
}

/* ══════════════════════════════════════════
   Tema toggle (footer)
══════════════════════════════════════════ */
const themeBtns = document.querySelectorAll('[data-theme]');
const themeToggles = document.querySelectorAll('[data-theme-toggle]');

function applyTheme(t, source) {
  const previous = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('fj-theme', t);
  themeBtns.forEach(b => b.classList.toggle('theme-btn--active', b.dataset.theme === t));
  themeToggles.forEach(b => {
    b.setAttribute('aria-pressed', String(t === 'dark'));
    b.setAttribute('aria-label', t === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
  });
  if (previous !== t) {
    window.dispatchEvent(new CustomEvent('fj:themechange', { detail: { theme: t, previous, source: source || null } }));
  }
}

if (themeBtns.length || themeToggles.length) {
  const savedTheme = localStorage.getItem('fj-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme, null);
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme, btn));
  });
  themeToggles.forEach(btn => btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, btn);
  }));
}

/* ══════════════════════════════════════════
   Hero Dropzone — dosya türü tespiti
══════════════════════════════════════════ */
const heroDropzone  = document.getElementById('heroDropzone');
const heroFileInput = document.getElementById('heroFileInput');

const MIME_TOOL_MAP = [
  { types: ['application/pdf'], url: 'tools/pdf-birlestir.html' },
  { types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'], url: 'tools/gorsel-sikistir.html' },
  { types: ['image/heic', 'image/heif'], url: 'tools/heic-jpg.html' },
  { types: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'], url: 'tools/video-sikistir.html' },
  { types: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'], url: 'tools/video-mp3.html' },
  { types: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'], url: 'tools/word-pdf.html' },
  { types: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'], url: 'tools/excel-pdf.html' },
];

function getToolUrl(file) {
  const mime  = file.type.toLowerCase();
  const ext   = file.name.split('.').pop().toLowerCase();
  const entry = MIME_TOOL_MAP.find(m => m.types.includes(mime));
  if (entry) return entry.url;
  if (ext === 'heic' || ext === 'heif') return 'tools/heic-jpg.html';
  return null;
}

function handleFileDrop(files) {
  if (!files || files.length === 0) return;
  const url = getToolUrl(files[0]);
  if (url) window.location.href = url;
}

if (heroDropzone) {
  const defaultDropTitle = heroDropzone.querySelector('.drop-title')?.textContent || '';
  const setHeroDrag = active => {
    heroDropzone.classList.toggle('drag-over', active);
    const title = heroDropzone.querySelector('.drop-title');
    if (title) title.textContent = active ? 'Dosyayı buraya bırak' : defaultDropTitle;
  };
  heroDropzone.addEventListener('dragover', e => { e.preventDefault(); setHeroDrag(true); });
  heroDropzone.addEventListener('dragleave', e => { if (!heroDropzone.contains(e.relatedTarget)) setHeroDrag(false); });
  heroDropzone.addEventListener('drop', e => {
    e.preventDefault();
    setHeroDrag(false);
    handleFileDrop(e.dataTransfer.files);
  });
}
if (heroFileInput) {
  heroFileInput.addEventListener('change', () => handleFileDrop(heroFileInput.files));
}
