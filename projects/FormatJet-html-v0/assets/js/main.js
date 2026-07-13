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
   Nav link'e tıkla → kategoriye scroll
══════════════════════════════════════════ */
const navLinks    = document.querySelectorAll('.nav-link[data-cat]');
const catSections = document.querySelectorAll('.cat-section[id]');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const catId  = link.dataset.cat;
    const target = document.getElementById(catId);
    if (target) {
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 60;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

/* Nav aktif state — scroll spy */
if (catSections.length > 0 && navLinks.length > 0) {
  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cat = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.cat === cat));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  catSections.forEach(sec => spyObserver.observe(sec));
}

/* ══════════════════════════════════════════
   Araç veritabanı (search için)
══════════════════════════════════════════ */
const COLOR_RE = /^#[0-9A-Fa-f]{3,8}$|^rgb\(|^rgba\(|^hsl\(/;
function safeColor(v) { return COLOR_RE.test((v || '').trim()) ? v.trim() : '#2563EB'; }

const TOOLS = Array.from(document.querySelectorAll('.mini-tool-card, .popular-card')).reduce((acc, card) => {
  const name = card.querySelector('.mini-tool-name, .popular-card-name')?.textContent?.trim();
  const desc = card.querySelector('.popular-card-desc')?.textContent?.trim() || '';
  const href = card.getAttribute('href') || '#';
  const cat  = (card.dataset.cat || '').trim();
  const kw   = (card.dataset.keywords || '').trim();
  if (name && !acc.find(t => t.name === name)) {
    const iconContainer = card.querySelector('.mini-tool-icon, .popular-card-icon');
    const iconColor = safeColor(iconContainer?.style.getPropertyValue('--icon-color') || '#2563EB');
    const iconNode  = iconContainer?.querySelector('svg')?.cloneNode(true) || null;
    acc.push({ name, desc, href, cat, kw, iconNode, iconColor });
  }
  return acc;
}, []);

/* ══════════════════════════════════════════
   Search & Filter
══════════════════════════════════════════ */
const searchInput    = document.getElementById('toolSearch');
const searchWrap     = document.getElementById('searchWrap');
const searchClear    = document.getElementById('searchClear');
const searchDropdown = document.getElementById('searchDropdown');
const searchResults  = document.getElementById('searchResults');
const searchEmpty    = document.getElementById('searchEmpty');
const searchResultBar   = document.getElementById('searchResultBar');
const searchResultCount = document.getElementById('searchResultCount');
const searchResultClear = document.getElementById('searchResultClear');
const noResults         = document.getElementById('noResults');

let searchQuery = '';

function buildResultItem(tool) {
  const a = document.createElement('a');
  a.href = tool.href;
  a.className = 'search-result-item';
  a.setAttribute('role', 'option');

  const iconWrap = document.createElement('div');
  iconWrap.className = 'search-result-icon';
  iconWrap.style.setProperty('--icon-color', tool.iconColor);
  iconWrap.style.background = `color-mix(in srgb, ${tool.iconColor} 10%, transparent)`;
  iconWrap.style.color = tool.iconColor;
  if (tool.iconNode) iconWrap.appendChild(tool.iconNode.cloneNode(true));

  const textWrap = document.createElement('div');
  const nameEl = document.createElement('div');
  nameEl.className = 'search-result-name';
  nameEl.textContent = tool.name;
  textWrap.appendChild(nameEl);

  if (tool.desc) {
    const descEl = document.createElement('div');
    descEl.className = 'search-result-desc';
    descEl.textContent = tool.desc;
    textWrap.appendChild(descEl);
  }

  a.appendChild(iconWrap);
  a.appendChild(textWrap);
  return a;
}

function showDropdown(query) {
  const q = query.toLowerCase().trim();
  if (!q) { hideDropdown(); return; }

  const matches = TOOLS.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.kw.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q)
  ).slice(0, 8);

  searchResults.innerHTML = '';
  if (matches.length > 0) {
    matches.forEach(tool => searchResults.appendChild(buildResultItem(tool)));
    searchEmpty.hidden = true;
  } else {
    searchEmpty.hidden = false;
  }

  searchDropdown.hidden = false;
}

function hideDropdown() {
  if (!searchDropdown) return;
  searchDropdown.hidden = true;
  searchResults.innerHTML = '';
}

function enterSearchMode() {
  document.body.classList.add('search-mode');
  if (searchResultBar) {
    searchResultBar.hidden = false;
    if (searchResultCount) {
      searchResultCount.textContent = `"${searchQuery}" araması`;
    }
  }
}

function exitSearchMode() {
  document.body.classList.remove('search-mode');
  searchQuery = '';
  if (searchInput) searchInput.value = '';
  searchClear?.classList.remove('visible');
  hideDropdown();
  if (searchResultBar) searchResultBar.hidden = true;
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    const hasQuery = searchQuery.trim().length > 0;
    searchClear?.classList.toggle('visible', hasQuery);

    if (hasQuery) {
      showDropdown(searchQuery);
      enterSearchMode();
    } else {
      exitSearchMode();
    }
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      exitSearchMode();
      searchInput.blur();
    }
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    exitSearchMode();
    searchInput?.focus();
  });
}

if (searchResultClear) {
  searchResultClear.addEventListener('click', () => {
    exitSearchMode();
    searchInput?.focus();
  });
}

document.addEventListener('click', e => {
  if (!e.target.closest('#searchContainer')) {
    hideDropdown();
  }
});

/* ══════════════════════════════════════════
   Animasyonlu placeholder rotasyonu
══════════════════════════════════════════ */
const placeholders = [
  'Ne yapmak istiyorsun?',
  'PDF birleştir, sıkıştır, dönüştür...',
  'Arka plan kaldır, görsel küçült...',
  'HEIC\'ten JPG\'ye çevir...',
  'Word belgeni PDF yap...',
  'Video\'dan MP3 çıkar...',
];

let phIdx = 0;
function cyclePlaceholder() {
  if (!searchInput || document.activeElement === searchInput || searchQuery) return;
  phIdx = (phIdx + 1) % placeholders.length;
  searchInput.setAttribute('placeholder', placeholders[phIdx]);
}
setInterval(cyclePlaceholder, 3500);

/* ══════════════════════════════════════════
   Tema toggle (footer + header)
══════════════════════════════════════════ */
const themeBtns = document.querySelectorAll('[data-theme]');

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('fj-theme', t);
  themeBtns.forEach(b => b.classList.toggle('theme-btn--active', b.dataset.theme === t));
}

const savedTheme = localStorage.getItem('fj-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeBtns.forEach(btn => {
  btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
});

/* ══════════════════════════════════════════
   Hero Dropzone — dosya türü tespiti
══════════════════════════════════════════ */
const heroDropzone  = document.getElementById('heroDropzone');
const heroFileInput = document.getElementById('heroFileInput');

const MIME_TOOL_MAP = [
  { types: ['application/pdf'],
    url: 'tools/pdf-birlestir.html' },
  { types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
    url: 'tools/gorsel-sikistir.html' },
  { types: ['image/heic', 'image/heif'],
    url: 'tools/heic-jpg.html' },
  { types: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
    url: 'tools/video-sikistir.html' },
  { types: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'],
    url: 'tools/video-mp3.html' },
  { types: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'],
    url: 'tools/word-pdf.html' },
  { types: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'],
    url: 'tools/excel-pdf.html' },
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
  if (url) {
    sessionStorage.setItem('pendingFiles', JSON.stringify(
      Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type }))
    ));
    window.location.href = url;
  }
}

if (heroDropzone) {
  heroDropzone.addEventListener('dragover', e => {
    e.preventDefault();
    heroDropzone.classList.add('drag-over');
  });
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
