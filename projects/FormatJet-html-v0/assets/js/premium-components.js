'use strict';

/* FormatJet Component Edition — shared interactive components. */
(function () {
  if (!document.documentElement.hasAttribute('data-theme')) {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('fj-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  }
  const BASE = /\/(pages|tools)\//.test(location.pathname) ? '../' : '';
  const PAGE = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  const NS = 'http://www.w3.org/2000/svg';
  const t = (key, fallback, values) => window.fjTF ? window.fjTF(key, fallback, values) : (window.fjT ? window.fjT(key, fallback) : fallback);

  const ICONS = {
    upload: '<path d="M12 16V4m0 0-4 4m4-4 4 4"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 21h14"/>',
    merge: '<rect x="3" y="4" width="7" height="16" rx="2"/><rect x="14" y="4" width="7" height="16" rx="2"/><path d="M8 12h8m-3-3 3 3-3 3"/>',
    split: '<path d="M7 3v18M17 3v18"/><path d="m12 8-3 4 3 4m0-8 3 4-3 4"/>',
    compress: '<path d="m8 3 4 4 4-4M12 7V2M8 21l4-4 4 4M12 17v5"/><rect x="4" y="8" width="16" height="8" rx="2"/>',
    rotate: '<path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 1-2.1-5"/>',
    crop: '<path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    wand: '<path d="m15 4 5 5L8 21l-5-5L15 4Z"/><path d="m14 5 5 5M6 4V2m0 8v-2M2 6h2m4 0h2m9 8v-2m0 8v-2m-4-2h2m4 0h2"/>',
    sliders: '<path d="M4 21v-7m0-4V3M12 21v-9m0-4V3M20 21v-5m0-4V3"/><path d="M1 14h6M9 8h6m2 8h6"/>',
    sparkle: '<path d="m12 3-1.3 4.1a5 5 0 0 1-3.2 3.2L3 12l4.5 1.7a5 5 0 0 1 3.2 3.2L12 21l1.3-4.1a5 5 0 0 1 3.2-3.2L21 12l-4.5-1.7a5 5 0 0 1-3.2-3.2L12 3Z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    text: '<path d="M4 6V4h16v2M12 4v16m-4 0h8"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    unlock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.7-1.5"/>',
    scan: '<path d="M4 7V4h3m10 0h3v3M4 17v3h3m10 0h3v-3"/><path d="M7 12h10M9 9h6m-6 6h6"/>',
    pdf: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h5"/>',
    document: '<path d="M7 3h10l3 3v15H4V6l3-3Z"/><path d="M8 11h8m-8 4h8m-8 4h5"/>',
    video: '<rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-2v8l-4-2v-4Z"/><path d="m9 9 4 3-4 3V9Z"/>',
    frames: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M3 9V5a2 2 0 0 1 2-2h4m12 12v4a2 2 0 0 1-2 2h-4"/>',
    audio: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    wave: '<path d="M3 12h2l2-7 4 14 3-10 3 6 2-3h2"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"/>',
    speed: '<path d="M20 15a8 8 0 1 0-16 0"/><path d="m12 12 4-4M5 19h14"/>',
    subtitle: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 14h4m2 0h4M7 17h10"/>',
    watermark: '<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="7"/>',
    generic: '<path d="M13 2 4 14h8l-1 8 9-12h-8l1-8Z"/>'
  };

  function svg(name, size = 22, stroke = 'currentColor') {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + stroke + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.generic) + '</svg>';
  }

  function iconName(tool, slug) {
    const op = (tool && tool.op) || slug || '';
    if (/merge|concat|birlestir|docs-merge/.test(op + slug)) return 'merge';
    if (/split|extract|bol/.test(op + slug)) return 'split';
    if (/compress|sikistir|bitrate|normalize|denoise/.test(op + slug)) return 'compress';
    if (/rotate|don$|don-/.test(op + slug)) return 'rotate';
    if (/crop|kirp|krop/.test(op + slug)) return 'crop';
    if (/watermark|filigran/.test(op + slug)) return 'watermark';
    if (/sharpen|adjust|renk/.test(op + slug)) return op.includes('adjust') ? 'sliders' : 'sparkle';
    if (/bg-remove|yuzey-kaldir|arkaplan/.test(op + slug)) return 'wand';
    if (/encrypt|kilitle|protect/.test(op + slug)) return 'lock';
    if (/decrypt|koruma-kaldir/.test(op + slug)) return 'unlock';
    if (/ocr/.test(op + slug)) return 'scan';
    if (/xlsx|csv|excel/.test(op + slug)) return 'table';
    if (/docx|word|txt|rtf|odt|pptx|markdown|html/.test(op + slug)) return 'document';
    if (/pdf/.test(op + slug)) return 'pdf';
    if (/video-frames/.test(op)) return 'frames';
    if (/subtitle|altyazi/.test(op + slug)) return 'subtitle';
    if (/video|gif/.test(op + slug)) return 'video';
    if (/tts|stt|metin-ses|ses-metin/.test(op + slug)) return 'mic';
    if (/audio-speed|video-speed|hiz/.test(op + slug)) return 'speed';
    if (/audio|ses|mp3|wav|aac/.test(op + slug)) return 'audio';
    if (/image|gorsel|jpg|png|webp|heic|svg|avif/.test(op + slug)) return 'image';
    return 'generic';
  }

  function decorateIcon(container, tool, slug) {
    if (!container || container.dataset.fjIconReady) return;
    const name = iconName(tool || {}, slug || '');
    container.innerHTML = svg(name, 28);
    container.classList.add('fj-semantic-icon');
    container.dataset.fjIconReady = 'true';
    container.setAttribute('aria-label', (tool && tool.name ? tool.name + ' simgesi' : 'Araç simgesi'));
  }

  function slugFromHref(href) {
    const match = String(href || '').match(/tools\/([^/?#]+)\.html/);
    return match ? match[1] : '';
  }

  function decorateToolIcons(root = document) {
    const slug = PAGE.replace(/\.html$/, '');
    const current = window.FJ_TOOLS && window.FJ_TOOLS[slug];
    const pageIcon = root.querySelector && root.querySelector('.tool-page-icon');
    if (pageIcon && current) {
      const tool = current.alias ? window.FJ_TOOLS[current.alias] : current;
      decorateIcon(pageIcon, tool, slug);
      pageIcon.style.setProperty('--tool-accent', tool.color || 'var(--fj-brand)');
    }
    const cards = root.querySelectorAll ? root.querySelectorAll('.popular-card, .all-tool-card, .cat-tool-card') : [];
    cards.forEach(card => {
      const cardSlug = slugFromHref(card.getAttribute('href'));
      if (!cardSlug) return;
      let tool = (window.FJ_TOOLS && window.FJ_TOOLS[cardSlug]) || { name: card.dataset.name || cardSlug };
      if (tool.alias && window.FJ_TOOLS) tool = window.FJ_TOOLS[tool.alias] || tool;
      decorateIcon(card.querySelector('.popular-card-icon, .all-tool-card-icon, .cat-tool-icon'), tool, cardSlug);
    });
  }

  function setupButtonMotion(root = document) {
    const selector = '.btn-support,.btn-primary-full,.btn-tool-primary,.plan-btn--primary,.plan-btn--ghost,.btn-cta-filled,.btn-cta-outline,.btn-small--primary,.btn-primary-outline,.btn-result-dl';
    root.querySelectorAll(selector).forEach(button => {
      if (button.dataset.fjMotion) return;
      button.dataset.fjMotion = 'true';
      button.addEventListener('pointermove', e => {
        const r = button.getBoundingClientRect();
        button.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        button.style.setProperty('--my', (e.clientY - r.top) + 'px');
        if (matchMedia('(pointer:fine)').matches && !button.disabled) {
          const x = (e.clientX - r.left - r.width / 2) * .055;
          const y = (e.clientY - r.top - r.height / 2) * .08;
          button.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        }
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  function observeBusyButtons() {
    const observer = new MutationObserver(records => {
      records.forEach(record => {
        const el = record.target.nodeType === 1 ? record.target : record.target.parentElement;
        const button = el && el.closest && el.closest('button');
        if (!button) return;
        const busyText = /işleniyor|gönderiliyor|hazırlanıyor|oluşturuluyor|yükleniyor/i.test(button.textContent || '');
        button.classList.toggle('is-busy', !!button.disabled && busyText);
      });
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['disabled'] });
  }

  function setupHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-condensed', scrollY > 22);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    header.querySelectorAll('.nav-link,.btn-all-tools').forEach(link => {
      link.addEventListener('pointermove', e => {
        const r = link.getBoundingClientRect();
        link.style.setProperty('--nav-x', (e.clientX - r.left) + 'px');
      });
    });
    const support = header.querySelector('.btn-support');
    if (support && !support.querySelector('.fj-cosmic-sparks')) {
      const sparks = document.createElement('span');
      sparks.className = 'fj-cosmic-sparks';
      sparks.setAttribute('aria-hidden', 'true');
      sparks.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
      support.appendChild(sparks);
    }
    const hamburger = document.getElementById('btnHamburger');
    if (hamburger) hamburger.addEventListener('click', () => setTimeout(() => hamburger.classList.toggle('is-open', hamburger.getAttribute('aria-expanded') === 'true'), 0));
  }

  function setupMobileDock() {
    if (!document.querySelector('.site-header') || document.querySelector('.fj-mobile-dock')) return;
    document.body.classList.add('has-mobile-dock');
    const dock = document.createElement('nav');
    dock.className = 'fj-mobile-dock';
    dock.setAttribute('aria-label', 'Mobil hızlı menü');
    const items = [
      ['index.html', 'Ana Sayfa', 'generic', false, 'dock-home'],
      ['pdf.html', 'PDF', 'pdf', false, 'nav-pdf'],
      ['tools.html', 'Araçlar', 'sparkle', true, 'footer-tools'],
      ['pages/iletisim.html', 'İletişim', 'mic', false, 'footer-contact'],
      ['hesap.html', 'Hesabım', 'file', false, 'acc-title']
    ];
    items.forEach(([href,label,icon,primary,i18n]) => {
      const a = document.createElement('a');
      a.href = BASE + href;
      if (primary) a.classList.add('is-primary');
      if (PAGE === href.split('/').pop()) a.classList.add('is-active');
      a.innerHTML = '<span class="fj-dock-icon">' + svg(icon, 18) + '</span><span data-i18n="' + i18n + '">' + label + '</span>';
      dock.appendChild(a);
    });
    document.body.appendChild(dock);
  }

  function setupHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const target = hero.querySelector('[data-search-hide]');
    if (target && !hero.querySelector('.fj-hero-trust')) {
      const trust = document.createElement('div');
      trust.className = 'fj-hero-trust';
      trust.innerHTML = [
        svg('lock', 13) + '<span>Dosyalar güvende</span>',
        svg('speed', 13) + '<span>Tarayıcıda işlenir</span>',
        svg('sparkle', 13) + '<span>Kayıt gerekmez</span>'
      ].map(x => '<span class="fj-trust-chip">' + x + '</span>').join('');
      target.appendChild(trust);
    }
  }

  function setupThemeExperience() {
    const sync = () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.querySelectorAll('[data-theme-toggle]').forEach(button => {
        button.setAttribute('aria-pressed', String(dark));
        button.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
      });
    };
    sync();
    addEventListener('fj:themechange', event => {
      sync();
      const old = document.querySelector('.fj-theme-reveal');
      if (old) old.remove();
      const reveal = document.createElement('span');
      reveal.className = 'fj-theme-reveal';
      reveal.dataset.theme = event.detail && event.detail.theme || 'light';
      const source = event.detail && event.detail.source;
      const rect = source && source.getBoundingClientRect ? source.getBoundingClientRect() : null;
      reveal.style.setProperty('--reveal-x', (rect ? rect.left + rect.width / 2 : innerWidth / 2) + 'px');
      reveal.style.setProperty('--reveal-y', (rect ? rect.top + rect.height / 2 : 36) + 'px');
      document.body.appendChild(reveal);
      document.documentElement.classList.add('fj-theme-changing');
      setTimeout(() => { reveal.remove(); document.documentElement.classList.remove('fj-theme-changing'); }, 680);
    });
  }

  function setupParticleHeroes() {
    document.querySelectorAll('.hero,.page-hero,.about-hero,.pricing-hero,.tools-hero,.cat-page-hero').forEach(hero => {
      if (hero.dataset.fjParticle) return;
      hero.dataset.fjParticle = 'true';
      const field = document.createElement('div');
      field.className = 'fj-particle-field';
      field.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 18; i += 1) {
        const particle = document.createElement('i');
        particle.style.setProperty('--px', ((i * 37 + 11) % 96) + '%');
        particle.style.setProperty('--py', ((i * 53 + 7) % 88) + '%');
        particle.style.setProperty('--ps', (2 + (i % 4)) + 'px');
        particle.style.setProperty('--pd', (5 + (i % 7)) + 's');
        field.appendChild(particle);
      }
      hero.prepend(field);
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--hero-x', (e.clientX - r.left) + 'px');
        hero.style.setProperty('--hero-y', (e.clientY - r.top) + 'px');
        hero.style.setProperty('--hero-rx', (((e.clientY - r.top) / r.height - .5) * -2.2) + 'deg');
        hero.style.setProperty('--hero-ry', (((e.clientX - r.left) / r.width - .5) * 2.2) + 'deg');
      });
    });
  }

  function setupFooterAccordions() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    const columns = [...footer.querySelectorAll('.footer-col:not(.footer-col--brand)')];
    const mobile = () => matchMedia('(max-width:760px)').matches;
    columns.forEach((column, index) => {
      const title = column.querySelector('.footer-col-title');
      if (!title || title.dataset.fjAccordion) return;
      title.dataset.fjAccordion = 'true';
      title.setAttribute('role', 'button');
      title.setAttribute('tabindex', '0');
      title.setAttribute('aria-expanded', 'false');
      const toggle = () => {
        if (!mobile()) return;
        const open = !column.classList.contains('is-open');
        columns.forEach(item => {
          item.classList.remove('is-open');
          item.querySelector('.footer-col-title')?.setAttribute('aria-expanded', 'false');
        });
        column.classList.toggle('is-open', open);
        title.setAttribute('aria-expanded', String(open));
      };
      title.addEventListener('click', toggle);
      title.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      });
      if (index === 0 && mobile()) {
        column.classList.add('is-open');
        title.setAttribute('aria-expanded', 'true');
      }
    });
    addEventListener('resize', () => {
      if (mobile()) return;
      columns.forEach(column => {
        column.classList.remove('is-open');
        column.querySelector('.footer-col-title')?.setAttribute('aria-expanded', 'false');
      });
    }, { passive: true });
  }

  function setupInteractiveSurfaces() {
    document.querySelectorAll('.search-wrap,.tools-search-wrap,.cat-search-wrap').forEach(wrap => {
      const input = wrap.querySelector('input');
      if (!input || input.dataset.fjSearchFx) return;
      input.dataset.fjSearchFx = 'true';
      const sync = () => wrap.classList.toggle('is-typing', !!input.value.trim());
      input.addEventListener('input', sync);
      input.addEventListener('focus', () => wrap.classList.add('is-focused'));
      input.addEventListener('blur', () => wrap.classList.remove('is-focused'));
      sync();
    });
    document.querySelectorAll('.about-visual-block,.metric-card,.value-card,.footer-cta-card,.plan-card,.account-card,.amount-card,.jet-credit-card').forEach(card => {
      if (card.dataset.fjTilt) return;
      card.dataset.fjTilt = 'true';
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        card.style.setProperty('--card-x', x + 'px');
        card.style.setProperty('--card-y', y + 'px');
        if (matchMedia('(pointer:fine)').matches && card.matches('.about-visual-block')) {
          card.style.setProperty('--card-rx', (((y / r.height) - .5) * -5) + 'deg');
          card.style.setProperty('--card-ry', (((x / r.width) - .5) * 5) + 'deg');
        }
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--card-rx');
        card.style.removeProperty('--card-ry');
      });
    });
    document.querySelectorAll('.coffee-cta').forEach(card => {
      if (card.dataset.fjPointerGlow) return;
      card.dataset.fjPointerGlow = 'true';
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--coffee-x', (event.clientX - rect.left) + 'px');
        card.style.setProperty('--coffee-y', (event.clientY - rect.top) + 'px');
      });
    });
    document.querySelectorAll('.footer-cta-icon').forEach(icon => {
      if (icon.querySelector('.fj-icon-stars')) return;
      const stars = document.createElement('span');
      stars.className = 'fj-icon-stars';
      stars.setAttribute('aria-hidden', 'true');
      stars.innerHTML = '<i></i><i></i><i></i><i></i>';
      icon.appendChild(stars);
    });
  }

  function setupAccountOverview() {
    const statusPanel = document.querySelector('[data-accpanel="durum"] .account-card');
    if (!statusPanel || statusPanel.querySelector('.fj-account-overview')) return;
    const overview = document.createElement('div');
    overview.className = 'fj-account-overview';
    overview.innerHTML =
      '<div class="fj-account-ring"><div class="fj-ring-chart" data-label="0%"></div><span><strong>Günlük kullanım</strong><small class="fj-account-usage">Veriler hazırlanıyor</small></span></div>' +
      '<div class="fj-account-ring"><div class="fj-storage-ring">' + svg('file',21) + '</div><span><strong>Aktif dosya limiti</strong><small class="fj-account-limit">—</small></span></div>';
    const firstField = statusPanel.querySelector('.account-field');
    statusPanel.insertBefore(overview, firstField || null);
    const quota = document.getElementById('quotaFill');
    const quotaText = document.getElementById('quotaText');
    const limit = document.getElementById('stLimit');
    const sync = () => {
      const pct = Math.max(0, Math.min(100, parseFloat(quota && quota.style.width) || 0));
      const chart = overview.querySelector('.fj-ring-chart');
      chart.style.setProperty('--value', pct);
      chart.dataset.label = quotaText && /limiti yok/i.test(quotaText.textContent) ? '∞' : Math.round(pct) + '%';
      overview.querySelector('.fj-account-usage').textContent = quotaText && quotaText.textContent !== '—' ? quotaText.textContent : 'Veriler hazırlanıyor';
      overview.querySelector('.fj-account-limit').textContent = limit && limit.textContent !== '—' ? limit.textContent : 'Plan bilgisi hazırlanıyor';
    };
    [quota,quotaText,limit].filter(Boolean).forEach(el => new MutationObserver(sync).observe(el, { attributes: true, childList: true, characterData: true, subtree: true }));
    sync();
  }

  function setupOtpTimer() {
    const timer = document.querySelector('.fj-otp-timer');
    const resend = document.getElementById('resendBtn');
    if (!timer || !resend || timer.querySelector('.fj-otp-clock')) return;
    const clock = document.createElement('span');
    clock.className = 'fj-otp-clock';
    clock.innerHTML = '<i></i>';
    timer.prepend(clock);
    const sync = () => {
      const label = resend.querySelector('#otpTimer');
      const seconds = label ? Math.max(0, Math.min(60, Number(label.textContent) || 0)) : 0;
      clock.style.setProperty('--otp-left', (seconds / 60) * 100);
      clock.dataset.seconds = seconds ? seconds + 's' : '✓';
    };
    new MutationObserver(sync).observe(resend, { childList: true, characterData: true, subtree: true });
    sync();
  }

  function setupCommandPalette() {
    if (!window.FJ_TOOLS || document.querySelector('.fj-command-backdrop')) return;
    const tools = Object.entries(window.FJ_TOOLS).filter(([,tool]) => !tool.alias && tool.name);
    const backdrop = document.createElement('div');
    backdrop.className = 'fj-command-backdrop';
    backdrop.innerHTML = '<section class="fj-command" role="dialog" aria-modal="true" aria-label="Araç arama">' +
      '<div class="fj-command-search">' + svg('scan',20) + '<input type="search" placeholder="Ne yapmak istiyorsun?" aria-label="Araç ara"><kbd>ESC</kbd></div>' +
      '<div class="fj-command-meta"><span>Araçlar</span><span>↑ ↓ seç · Enter aç</span></div><div class="fj-command-results"></div></section>';
    document.body.appendChild(backdrop);
    const input = backdrop.querySelector('input');
    const results = backdrop.querySelector('.fj-command-results');
    let active = 0;
    let filtered = tools.slice(0, 12);

    function render() {
      const q = input.value.trim().toLocaleLowerCase('tr-TR');
      filtered = tools.filter(([slug,tool]) => (tool.name + ' ' + (tool.desc || '') + ' ' + slug).toLocaleLowerCase('tr-TR').includes(q)).slice(0, 14);
      active = Math.max(0, Math.min(active, filtered.length - 1));
      results.replaceChildren();
      filtered.forEach(([slug,tool], i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'fj-command-item' + (i === active ? ' is-active' : '');
        btn.innerHTML = '<span class="fj-command-item-icon">' + svg(iconName(tool,slug),20) + '</span><span><strong></strong><span></span></span><em></em>';
        btn.querySelector('strong').textContent = tool.name;
        btn.querySelector('span span').textContent = tool.desc || '';
        btn.querySelector('em').textContent = (window.FJ_CATS && window.FJ_CATS[tool.cat] ? window.FJ_CATS[tool.cat].label : tool.cat || 'Araç');
        btn.addEventListener('mouseenter', () => { active = i; render(); });
        btn.addEventListener('click', () => { location.href = BASE + 'tools/' + slug + '.html'; });
        results.appendChild(btn);
      });
      if (!filtered.length) results.innerHTML = '<p style="padding:24px;text-align:center;color:#64748b">Eşleşen araç bulunamadı.</p>';
    }
    function open() { backdrop.classList.add('is-open'); input.value = ''; active = 0; render(); setTimeout(() => input.focus(), 40); }
    function close() { backdrop.classList.remove('is-open'); }
    addEventListener('keydown', e => {
      if (!backdrop.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); active = (active + (e.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length; render(); results.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' }); }
      if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); location.href = BASE + 'tools/' + filtered[active][0] + '.html'; }
    });
    input.addEventListener('input', () => { active = 0; render(); });
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    document.querySelectorAll('.search-wrap,.tools-search-wrap,.cat-search-wrap').forEach(wrap => {
      wrap.addEventListener('dblclick', open);
    });
  }

  function setupAuth() {
    const brand = document.querySelector('.login-brand');
    if (brand && !brand.querySelector('.fj-auth-visual')) {
      const visual = document.createElement('div');
      visual.className = 'fj-auth-visual';
      visual.innerHTML = '<div class="fj-auth-core">' + svg('lock',27) + '</div><span class="fj-auth-node">Şifreli bağlantı</span><span class="fj-auth-node">Gizli işlem</span><span class="fj-auth-node">Güvenli oturum</span><span class="fj-auth-node">Otomatik silme</span>';
      brand.appendChild(visual);
    }
    document.querySelectorAll('input[autocomplete="new-password"],#password').forEach(input => {
      if (input.dataset.fjMeter || (PAGE === 'login.html' && input.id === 'password')) return;
      input.dataset.fjMeter = 'true';
      const meter = document.createElement('div');
      meter.className = 'fj-password-meter';
      meter.innerHTML = '<div class="fj-password-rail" data-score="0"><span></span><span></span><span></span><span></span></div><div class="fj-password-meta"><span>Şifre güvenliği</span><strong>Henüz girilmedi</strong></div><div class="fj-password-checks"><span class="fj-password-check" data-check="length">En az 8 karakter</span><span class="fj-password-check" data-check="upper">Büyük harf</span><span class="fj-password-check" data-check="number">Rakam</span><span class="fj-password-check" data-check="symbol">Sembol</span></div>';
      const group = input.closest('.form-group');
      if (group) group.appendChild(meter); else input.after(meter);
      const rail = meter.querySelector('.fj-password-rail');
      const label = meter.querySelector('.fj-password-meta strong');
      function update() {
        const v = input.value;
        const checks = { length: v.length >= 8, upper: /[A-ZÇĞİÖŞÜ]/.test(v), number: /\d/.test(v), symbol: /[^\w\sçğıöşüÇĞİÖŞÜ]/.test(v) };
        let score = Object.values(checks).filter(Boolean).length;
        if (!v) score = 0;
        rail.dataset.score = score;
        label.textContent = ['Henüz girilmedi','Zayıf','Orta','Güçlü','Çok güçlü'][score];
        Object.entries(checks).forEach(([key,ok]) => meter.querySelector('[data-check="' + key + '"]').classList.toggle('is-ok', ok));
      }
      input.addEventListener('input', update);
      update();
    });
    const verify = document.getElementById('verifyBox');
    if (verify && !verify.querySelector('.fj-otp-link')) {
      const link = document.createElement('a');
      link.className = 'btn-primary-full fj-otp-link';
      link.style.cssText = 'display:flex;margin:18px auto 0;max-width:260px;text-decoration:none;align-items:center;justify-content:center';
      link.textContent = 'Doğrulama Kodunu Gir';
      link.href = 'otp-dogrulama.html';
      const email = document.getElementById('verifyEmail');
      const sync = () => { if (email && email.textContent) link.href = 'otp-dogrulama.html?email=' + encodeURIComponent(email.textContent.trim()); };
      verify.appendChild(link);
      new MutationObserver(sync).observe(email || verify, { subtree: true, childList: true, characterData: true });
      sync();
    }
  }

  function setupOtpInputs() {
    const group = document.querySelector('.fj-otp-group');
    if (!group) return;
    const inputs = [...group.querySelectorAll('.fj-otp-input')];
    const hidden = document.getElementById('otpToken');
    function sync() {
      const token = inputs.map(i => i.value).join('');
      if (hidden) hidden.value = token;
      inputs.forEach(i => i.classList.toggle('is-filled', !!i.value));
      if (token.length === inputs.length) group.dispatchEvent(new CustomEvent('fj:otp-complete', { bubbles: true, detail: token }));
    }
    inputs.forEach((input,index) => {
      input.addEventListener('input', () => { input.value = input.value.replace(/\D/g,'').slice(-1); if (input.value && inputs[index + 1]) inputs[index + 1].focus(); sync(); });
      input.addEventListener('keydown', e => { if (e.key === 'Backspace' && !input.value && inputs[index - 1]) inputs[index - 1].focus(); if (e.key === 'ArrowLeft' && inputs[index - 1]) inputs[index - 1].focus(); if (e.key === 'ArrowRight' && inputs[index + 1]) inputs[index + 1].focus(); });
      input.addEventListener('paste', e => { const digits = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,inputs.length); if (!digits) return; e.preventDefault(); digits.split('').forEach((d,i) => { if (inputs[i]) inputs[i].value = d; }); inputs[Math.min(digits.length,inputs.length)-1].focus(); sync(); });
    });
  }

  function setupContact() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const guide = document.createElement('div');
    guide.className = 'fj-form-guide';
    guide.innerHTML = '<span><strong>' + t('ui.contact.title', 'Mesaj hazırlığı') + '</strong><small>' + t('ui.contact.steps', '4 kısa adım') + '</small></span><em>' + t('ui.contact.empty', 'Başlamaya hazır') + '</em>';
    const progress = document.createElement('div');
    progress.className = 'fj-form-progress';
    progress.innerHTML = '<span></span><span></span><span></span><span></span>';
    form.prepend(progress);
    form.prepend(guide);
    const fields = ['contactName','contactEmail','contactSubject','contactMessage'].map(id => document.getElementById(id)).filter(Boolean);
    function update() {
      const completed = fields.reduce((count, field, i) => {
        const done = !!String(field.value || '').trim();
        progress.children[i].classList.toggle('is-done', done);
        return count + (done ? 1 : 0);
      }, 0);
      guide.querySelector('small').textContent = t('ui.contact.completed', '{done} / {total} alan tamamlandı', { done: completed, total: fields.length });
      guide.querySelector('em').textContent = completed === fields.length ? t('ui.contact.ready', 'Göndermeye hazır') : completed > 1 ? t('ui.contact.almost', 'Neredeyse hazır') : completed ? t('ui.contact.started', 'İyi başladın') : t('ui.contact.empty', 'Başlamaya hazır');
      guide.dataset.level = completed === fields.length ? 'ready' : completed ? 'progress' : 'empty';
    }
    fields.forEach(field => {
      field.addEventListener('input', update);
      field.addEventListener('change', update);
    });
    const message = document.getElementById('contactMessage');
    if (message) {
      if (message.maxLength < 0) message.maxLength = 2000;
      const counter = document.createElement('div');
      counter.className = 'fj-message-counter';
      message.after(counter);
      const count = () => { counter.textContent = message.value.length + ' / ' + message.maxLength; counter.classList.toggle('is-near', message.value.length > message.maxLength * .85); update(); };
      message.addEventListener('input', count); count();
    }
    form.addEventListener('reset', () => setTimeout(() => {
      const counter = form.querySelector('.fj-message-counter');
      if (counter && message) counter.textContent = '0 / ' + message.maxLength;
      update();
    }, 0));
    update();
  }

  function setupPricing() {
    const cardForm = document.getElementById('cardForm');
    if (!cardForm || cardForm.querySelector('.fj-card-preview')) return;
    const preview = document.createElement('div');
    preview.className = 'fj-card-preview';
    preview.innerHTML = '<div class="fj-card-chip"></div><div class="fj-card-number">•••• •••• •••• ••••</div><div class="fj-card-foot"><span>Kart Sahibi<strong>AD SOYAD</strong></span><span>Son Kullanma<strong>AA/YY</strong></span></div>';
    cardForm.prepend(preview);
    const name = document.getElementById('cardName');
    const number = document.getElementById('cardNumber');
    const expiry = document.getElementById('cardExpiry');
    const sync = () => {
      preview.querySelector('.fj-card-number').textContent = number.value || '•••• •••• •••• ••••';
      preview.querySelector('.fj-card-foot span:first-child strong').textContent = name.value || 'AD SOYAD';
      preview.querySelector('.fj-card-foot span:last-child strong').textContent = expiry.value || 'AA/YY';
    };
    [name,number,expiry].forEach(el => el && el.addEventListener('input', sync));
  }

  function notify(message, type = 'info', title) {
    let region = document.querySelector('.fj-toast-region');
    if (!region) { region = document.createElement('div'); region.className = 'fj-toast-region'; region.setAttribute('aria-live','polite'); document.body.appendChild(region); }
    region.querySelectorAll('.fj-toast').forEach(existing => existing.remove());
    const toast = document.createElement('div');
    toast.className = 'fj-toast';
    toast.dataset.type = type;
    const icon = type === 'error' ? 'generic' : type === 'success' ? 'sparkle' : 'file';
    toast.innerHTML = '<span class="fj-toast-icon">' + svg(icon,19) + '</span><span><strong></strong><p></p></span><button class="fj-toast-close" aria-label="Bildirimi kapat">×</button>';
    toast.querySelector('strong').textContent = title || (type === 'error' ? 'Bir sorun oluştu' : type === 'success' ? 'İşlem tamamlandı' : 'FormatJet');
    toast.querySelector('p').textContent = String(message || '');
    const close = () => { toast.classList.add('is-leaving'); setTimeout(() => toast.remove(), 300); };
    toast.querySelector('button').addEventListener('click', close);
    region.appendChild(toast);
    setTimeout(close, 5000);
    return toast;
  }
  window.fjNotify = notify;

  function confirmDialog(message, options = {}) {
    return new Promise(resolve => {
      const backdrop = document.createElement('div');
      backdrop.className = 'fj-confirm-backdrop';
      backdrop.innerHTML = '<section class="fj-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="fjConfirmTitle">' +
        '<span class="fj-confirm-icon">' + svg('lock',24) + '</span><div><h2 id="fjConfirmTitle"></h2><p></p></div>' +
        '<div class="fj-confirm-actions"><button type="button" class="btn-tool-ghost" data-cancel>Vazgeç</button><button type="button" class="btn-tool-primary" data-confirm>Onayla</button></div></section>';
      backdrop.querySelector('h2').textContent = options.title || 'Bu işlemi onayla';
      backdrop.querySelector('p').textContent = String(message || 'Devam etmek istediğine emin misin?');
      document.body.appendChild(backdrop);
      const finish = value => { backdrop.classList.add('is-closing'); setTimeout(() => backdrop.remove(), 220); removeEventListener('keydown', onKey); resolve(value); };
      const onKey = e => { if (e.key === 'Escape') finish(false); };
      backdrop.querySelector('[data-cancel]').addEventListener('click', () => finish(false));
      backdrop.querySelector('[data-confirm]').addEventListener('click', () => finish(true));
      backdrop.addEventListener('click', e => { if (e.target === backdrop) finish(false); });
      addEventListener('keydown', onKey);
      setTimeout(() => backdrop.querySelector('[data-confirm]').focus(), 20);
    });
  }
  window.fjConfirm = confirmDialog;

  function setupMessageObserver() {
    const targets = document.querySelectorAll('.auth-error,.auth-ok,.contact-success');
    const shown = new WeakMap();
    const check = el => {
      if (el.hidden || !el.textContent.trim()) return;
      if (shown.get(el) === el.textContent) return;
      shown.set(el, el.textContent);
      notify(el.textContent.trim(), el.classList.contains('auth-error') ? 'error' : 'success');
    };
    targets.forEach(el => {
      new MutationObserver(() => check(el)).observe(el, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
      check(el);
    });
  }

  function setupPageLoader() {
    if (sessionStorage.getItem('fj-loader-seen')) return;
    sessionStorage.setItem('fj-loader-seen','1');
    const loader = document.createElement('div');
    loader.className = 'fj-page-loader';
    loader.innerHTML = '<div class="fj-page-loader-core"><div class="fj-loader-mark"><span class="fj-loader-ring"></span>' + svg('generic',31,'#fff') + '</div><span>FormatJet hazırlanıyor</span></div>';
    document.body.appendChild(loader);
    const done = () => { loader.classList.add('is-done'); setTimeout(() => loader.remove(),500); };
    if (document.readyState === 'complete') setTimeout(done,260); else addEventListener('load',() => setTimeout(done,260),{once:true});
    setTimeout(done,1300);
  }

  function setupCheckoutReveal() {
    const section = document.getElementById('checkoutSection');
    if (!section || section.dataset.fjReveal) return;
    section.dataset.fjReveal = 'true';
    const observer = new MutationObserver(() => {
      if (section.classList.contains('visible') && !section.classList.contains('fj-inview')) {
        requestAnimationFrame(() => requestAnimationFrame(() => section.classList.add('fj-inview')));
      }
      if (!section.classList.contains('visible')) section.classList.remove('fj-inview');
    });
    observer.observe(section, { attributes: true, attributeFilter: ['class'] });
  }

  function setupDynamicEnhancement() {
    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        decorateToolIcons(node);
        setupButtonMotion(node);
        if (node.matches && node.matches('.about-visual-block,.metric-card,.value-card,.footer-cta-card,.plan-card,.account-card')) setupInteractiveSurfaces();
      }));
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function init() {
    setupPageLoader();
    setupThemeExperience();
    setupHeader();
    setupMobileDock();
    setupHero();
    setupParticleHeroes();
    setupInteractiveSurfaces();
    setupFooterAccordions();
    setupCommandPalette();
    decorateToolIcons();
    setupButtonMotion();
    observeBusyButtons();
    setupAuth();
    setupOtpInputs();
    setupOtpTimer();
    setupContact();
    setupPricing();
    setupAccountOverview();
    setupCheckoutReveal();
    setupMessageObserver();
    setupDynamicEnhancement();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
