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
  btnHamburger.addEventListener('click', () => {
    const open = btnHamburger.getAttribute('aria-expanded') === 'true';
    btnHamburger.setAttribute('aria-expanded', String(!open));
    mobileMenu.setAttribute('aria-hidden', String(open));
    document.body.style.overflow = open ? '' : 'hidden';
  });

  mobileMenu.addEventListener('click', e => {
    if (e.target === mobileMenu) {
      btnHamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

/* ══════════════════════════════════════════
   Tema toggle (footer)
══════════════════════════════════════════ */
const themeBtns = document.querySelectorAll('[data-theme]');

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('fj-theme', t);
  themeBtns.forEach(b => b.classList.toggle('theme-btn--active', b.dataset.theme === t));
}

if (themeBtns.length) {
  const savedTheme = localStorage.getItem('fj-theme') || 'light';
  applyTheme(savedTheme);
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });
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
  heroDropzone.addEventListener('dragover', e => { e.preventDefault(); heroDropzone.classList.add('drag-over'); });
  heroDropzone.addEventListener('dragleave', () => heroDropzone.classList.remove('drag-over'));
  heroDropzone.addEventListener('drop', e => {
    e.preventDefault();
    heroDropzone.classList.remove('drag-over');
    handleFileDrop(e.dataTransfer.files);
  });
}
if (heroFileInput) {
  heroFileInput.addEventListener('change', () => handleFileDrop(heroFileInput.files));
}
