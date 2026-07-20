'use strict';

/* ══════════════════════════════════════════════════════════
   FormatJet Arama — focus modu
   Sorgu yazılınca sayfa aramaya odaklanır: diğer bölümler
   gizlenir, eşleşen araçlar arama kutusunun altında listelenir.
   Silinince sayfa eski haline döner.
══════════════════════════════════════════════════════════ */

(function () {
  const BASE = /\/(pages|tools)\//.test(location.pathname) ? '../' : '';

  function norm(s) {
    return (s || '').toLocaleLowerCase('tr-TR')
      .replace(/i̇/g, 'i');
  }

  /* ── Anasayfa: registry tabanlı sonuç grid'i ── */
  const heroInput = document.getElementById('toolSearch');
  if (heroInput && window.FJ_TOOLS) {
    const resultsWrap = document.getElementById('fjSearchResults');
    const resultsGrid = document.getElementById('fjSearchGrid');
    const resultsEmpty = document.getElementById('fjSearchEmpty');

    const CAT_COLORS = { pdf: '#2563EB', gorsel: '#D97706', belge: '#059669', video: '#DC2626', ses: '#059669' };

    function buildCard(slug, tool) {
      const a = document.createElement('a');
      a.href = BASE + 'tools/' + slug + '.html';
      a.className = 'popular-card';

      const icon = document.createElement('div');
      icon.className = 'popular-card-icon';
      const color = tool.color || CAT_COLORS[tool.cat] || '#2563EB';
      icon.style.setProperty('--icon-color', color);
      icon.style.background = 'color-mix(in srgb, ' + color + ' 10%, transparent)';
      icon.style.color = color;
      icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';

      const body = document.createElement('div');
      body.className = 'popular-card-body';
      const name = document.createElement('strong');
      name.className = 'popular-card-name';
      name.dataset.toolName = '';
      name.dataset.tr = tool.name;
      const lang = localStorage.getItem('fj-lang') || 'tr';
      name.textContent = window.fjToolName ? window.fjToolName(tool.name, lang) : tool.name;
      const desc = document.createElement('span');
      desc.className = 'popular-card-desc';
      const templates = {
        en: `Use ${name.textContent} quickly and securely in your browser.`,
        es: `Usa ${name.textContent} de forma rápida y segura en tu navegador.`,
        de: `${name.textContent} schnell und sicher im Browser nutzen.`,
        fr: `Utilisez ${name.textContent} rapidement et en toute sécurité dans votre navigateur.`
      };
      desc.textContent = lang === 'tr' ? (tool.desc || '') : templates[lang];
      body.appendChild(name);
      body.appendChild(desc);

      const arrow = document.createElement('div');
      arrow.className = 'popular-card-arrow';
      arrow.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>';

      a.appendChild(icon);
      a.appendChild(body);
      a.appendChild(arrow);
      return a;
    }

    function runSearch(q) {
      const query = norm(q).trim();
      if (!query) {
        document.body.classList.remove('fj-search-active');
        if (resultsWrap) resultsWrap.hidden = true;
        return;
      }
      document.body.classList.add('fj-search-active');
      if (!resultsWrap || !resultsGrid) return;

      resultsGrid.innerHTML = '';
      let count = 0;
      for (const [slug, raw] of Object.entries(window.FJ_TOOLS)) {
        if (raw.alias) continue;
        const hay = norm(raw.name + ' ' + (raw.desc || '') + ' ' + slug.replace(/-/g, ' '));
        if (hay.includes(query)) {
          resultsGrid.appendChild(buildCard(slug, raw));
          count++;
          if (count >= 18) break;
        }
      }
      resultsWrap.hidden = false;
      resultsEmpty.hidden = count > 0;
      resultsGrid.hidden = count === 0;
    }

    heroInput.addEventListener('input', () => runSearch(heroInput.value));
    heroInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { heroInput.value = ''; runSearch(''); heroInput.blur(); }
    });

    /* Placeholder rotasyonu */
    const placeholders = [
      'Ne yapmak istiyorsun?',
      'PDF birleştir, sıkıştır, dönüştür...',
      'Arka plan kaldır, görsel küçült...',
      "HEIC'ten JPG'ye çevir...",
      'Word belgeni PDF yap...',
      "Video'dan MP3 çıkar...",
    ];
    let phIdx = 0;
    setInterval(() => {
      if (document.activeElement === heroInput || heroInput.value) return;
      if ((localStorage.getItem('fj-lang') || 'tr') !== 'tr') return;
      phIdx = (phIdx + 1) % placeholders.length;
      heroInput.setAttribute('placeholder', placeholders[phIdx]);
    }, 3500);
  }

  /* ── Kategori sayfaları: grid içi canlı filtre ── */
  const catInput = document.querySelector('.cat-search-input');
  if (catInput) {
    const cards = Array.from(document.querySelectorAll('.cat-tool-card'));
    let emptyNote = null;

    catInput.addEventListener('input', () => {
      const q = norm(catInput.value).trim();
      let visible = 0;
      cards.forEach(card => {
        const match = !q || norm(card.textContent).includes(q);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      document.body.classList.toggle('fj-search-active', !!q);

      if (!emptyNote) {
        emptyNote = document.createElement('div');
        emptyNote.className = 'fj-search-empty';
        emptyNote.innerHTML = 'Araç bulunamadı. <a href="' + BASE + 'pages/iletisim.html?konu=arac-talebi">Yeni Araç Talep Et →</a>';
        const grid = document.querySelector('.cat-tool-grid');
        if (grid) grid.after(emptyNote);
      }
      emptyNote.hidden = !q || visible > 0;
    });
    catInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { catInput.value = ''; catInput.dispatchEvent(new Event('input')); }
    });
  }
})();
