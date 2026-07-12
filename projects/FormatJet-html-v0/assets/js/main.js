'use strict';

/* ══════════════════════════════════════════
   Search & Filter
══════════════════════════════════════════ */
const searchInput       = document.getElementById('toolSearch');
const searchClear       = document.getElementById('searchClear');
const searchResultClear = document.getElementById('searchResultClear');
const searchResultCount = document.getElementById('searchResultCount');
const toolCards         = document.querySelectorAll('.tool-card');
const catTabs           = document.querySelectorAll('.cat-tab');
const noResults         = document.getElementById('noResults');

let activeCategory = 'all';
let searchQuery    = '';

function filterTools() {
  const q = searchQuery.toLowerCase().trim();
  let visible = 0;

  toolCards.forEach(card => {
    const cats     = (card.dataset.cat || '').toLowerCase();
    const keywords = (card.dataset.keywords || '').toLowerCase();
    const name     = card.querySelector('.tool-name')?.textContent.toLowerCase() || '';
    const desc     = card.querySelector('.tool-desc')?.textContent.toLowerCase() || '';

    const catMatch = activeCategory === 'all' || cats.split(' ').includes(activeCategory);
    const qMatch   = !q || name.includes(q) || desc.includes(q) || keywords.includes(q);

    if (catMatch && qMatch) {
      card.removeAttribute('data-hidden');
      visible++;
    } else {
      card.setAttribute('data-hidden', '');
    }
  });

  noResults.classList.toggle('visible', visible === 0);

  if (searchResultCount) {
    searchResultCount.textContent = visible > 0
      ? `"${searchQuery}" için ${visible} araç bulundu`
      : '';
  }
}

function enterSearchMode() {
  document.body.classList.add('search-mode');
}

function exitSearchMode() {
  document.body.classList.remove('search-mode');
  searchQuery = '';
  if (searchInput) searchInput.value = '';
  searchClear?.classList.remove('visible');
  filterTools();
}

/* Search input events */
if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    const hasQuery = searchQuery.trim().length > 0;
    searchClear?.classList.toggle('visible', hasQuery);

    if (hasQuery) {
      enterSearchMode();
    } else {
      exitSearchMode();
    }

    filterTools();
  });

  /* Escape key exits search mode */
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

/* Category tabs */
catTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    catTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.dataset.cat;
    filterTools();
  });
});

/* ══════════════════════════════════════════
   Hero Dropzone — file-type detection
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
  const mime = file.type.toLowerCase();
  const ext  = file.name.split('.').pop().toLowerCase();
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
  } else {
    /* Unknown type — just highlight the tool grid */
    heroDropzone.style.borderColor = 'var(--accent)';
    setTimeout(() => { heroDropzone.style.borderColor = ''; }, 1400);
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

/* ══════════════════════════════════════════
   Animated search placeholder
══════════════════════════════════════════ */
const placeholders = [
  'Ara: PDF birleştir, arka plan kaldır, HEIC dönüştür...',
  'Ara: görsel sıkıştır, boyutlandır, format değiştir...',
  'Ara: Word\'ü PDF\'ye çevir, imza ekle...',
  'Ara: video sıkıştır, MP4\'ten MP3 çıkar...',
  'Ara: PDF böl, sayfa sil, döndür...',
  'Ara: WebP\'yi PNG\'ye çevir, metadata sil...',
];

let phIdx = 0;
function cyclePlaceholder() {
  if (!searchInput || document.activeElement === searchInput || searchQuery) return;
  phIdx = (phIdx + 1) % placeholders.length;
  searchInput.placeholder = placeholders[phIdx];
}

setInterval(cyclePlaceholder, 3200);
