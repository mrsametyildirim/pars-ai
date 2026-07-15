'use strict';

/* ══════════════════════════════════════════════════════════
   FormatJet Layout — tek kaynaklı header + footer + favicon
   Her sayfada [data-fj-header] ve [data-fj-footer]
   yer tutucularını doldurur. Böylece tüm sayfalar birebir
   aynı header/footer'ı kullanır.
══════════════════════════════════════════════════════════ */

(function () {
  const BASE = /\/(pages|tools)\//.test(location.pathname) ? '../' : '';
  const PAGE = location.pathname.split('/').pop() || 'index.html';

  /* ── Dil paneli stili her sayfada yüklü olsun ── */
  if (!document.querySelector('link[href*="lang-panel.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = BASE + 'assets/css/lang-panel.css';
    document.head.appendChild(css);
  }

  /* ── Tema duyarlı favicon ── */
  document.querySelectorAll('link[rel="icon"]').forEach(l => l.remove());
  const icons = [
    { href: BASE + 'assets/img/favicon-light.png', media: '(prefers-color-scheme: light)' },
    { href: BASE + 'assets/img/favicon-dark.png',  media: '(prefers-color-scheme: dark)' },
    { href: BASE + 'assets/img/favicon-light.png', media: '' },
  ];
  icons.reverse().forEach(ic => {
    const l = document.createElement('link');
    l.rel = 'icon'; l.type = 'image/png'; l.href = ic.href;
    if (ic.media) l.media = ic.media;
    document.head.prepend(l);
  });

  /* ── Header ── */
  const NAV = [
    ['pdf.html',    'nav-pdf',    'PDF'],
    ['belge.html',  'nav-belge',  'Belge'],
    ['gorsel.html', 'nav-gorsel', 'Görsel'],
    ['video.html',  'nav-video',  'Video'],
    ['ses.html',    'nav-ses',    'Ses'],
  ];

  const navLinks = NAV.map(([href, key, label]) =>
    '<a href="' + BASE + href + '" class="nav-link' + (PAGE === href ? ' active' : '') + '" data-i18n="' + key + '">' + label + '</a>'
  ).join('\n      ');

  const headerHtml =
'<header class="site-header" id="siteHeader">' +
'  <div class="header-inner container-wide">' +
'    <a href="' + BASE + 'index.html" class="logo" aria-label="FormatJet Ana Sayfa">' +
'      <img src="' + BASE + 'assets/img/logo-icon.png" alt="" class="logo-icon-img" data-fj-set="logo_icon" aria-hidden="true">' +
'      <img src="' + BASE + 'assets/img/logo-text.png" alt="FormatJet" class="logo-text-img" data-fj-set="logo_text">' +
'    </a>' +
'    <nav class="header-nav" aria-label="Kategori menüsü">' +
       navLinks +
'      <a href="' + BASE + 'tools.html" class="btn-all-tools' + (PAGE === 'tools.html' ? ' active' : '') + '">' +
'        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="0" y="0" width="4" height="4" rx="1"/><rect x="6" y="0" width="4" height="4" rx="1"/><rect x="12" y="0" width="4" height="4" rx="1"/><rect x="0" y="6" width="4" height="4" rx="1"/><rect x="6" y="6" width="4" height="4" rx="1"/><rect x="12" y="6" width="4" height="4" rx="1"/><rect x="0" y="12" width="4" height="4" rx="1"/><rect x="6" y="12" width="4" height="4" rx="1"/><rect x="12" y="12" width="4" height="4" rx="1"/></svg>' +
'        <span data-i18n="nav-all-tools">Tüm Araçlar</span>' +
'      </a>' +
'    </nav>' +
'    <div class="header-right">' +
'      <button class="btn-support">' +
'        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
'        <span data-i18n="btn-support">Destek Ol</span>' +
'      </button>' +
'      <a href="' + BASE + 'pages/hakkimizda.html" class="btn-bizi-tani" data-i18n="btn-about">Bizi Tanı</a>' +
'      <div class="lang-wrapper">' +
'        <button class="btn-lang" id="btnLang" aria-label="Dil seç">' +
'          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
'          <span class="btn-lang-text">TR</span>' +
'          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
'        </button>' +
'        <div class="lang-panel" id="langPanel" hidden>' +
'          <div class="lang-panel-inner">' +
'            <div class="lang-list">' +
'              <button class="lang-option" data-lang="tr">🇹🇷 Türkçe</button>' +
'              <button class="lang-option" data-lang="en">🇬🇧 English</button>' +
'              <button class="lang-option" data-lang="es">🇪🇸 Español</button>' +
'              <button class="lang-option" data-lang="de">🇩🇪 Deutsch</button>' +
'              <button class="lang-option" data-lang="fr">🇫🇷 Français</button>' +
'            </div>' +
'            <div class="lang-more-note" data-i18n="more-langs">Diğer diller — yakında</div>' +
'          </div>' +
'        </div>' +
'      </div>' +
'      <button class="btn-login" onclick="location.href=\'' + BASE + 'login.html\'">' +
'        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
'        <span data-i18n="btn-login">Giriş Yap</span>' +
'      </button>' +
'      <button class="btn-hamburger" id="btnHamburger" aria-label="Menüyü aç" aria-expanded="false"><span></span><span></span><span></span></button>' +
'    </div>' +
'  </div>' +
'  <div class="mobile-menu" id="mobileMenu" aria-hidden="true">' +
'    <div class="mobile-menu-inner">' +
'      <nav class="mobile-nav">' +
         NAV.map(([href, key, label]) => '<a href="' + BASE + href + '" class="mobile-nav-link" data-i18n="' + key + '">' + label + '</a>').join('') +
'        <a href="' + BASE + 'tools.html" class="mobile-nav-link" data-i18n="nav-all-tools">Tüm Araçlar</a>' +
'        <a href="' + BASE + 'pages/hakkimizda.html" class="mobile-nav-link" data-i18n="btn-about">Bizi Tanı</a>' +
'      </nav>' +
'      <div class="mobile-menu-footer">' +
'        <button class="btn-login w-full" onclick="location.href=\'' + BASE + 'login.html\'"><span data-i18n="btn-login">Giriş Yap</span></button>' +
'      </div>' +
'    </div>' +
'  </div>' +
'</header>';

  /* ── Footer ── */
  const footerHtml =
'<footer class="site-footer">' +
'  <div class="footer-cta-band">' +
'    <div class="container">' +
'      <div class="footer-cta-grid">' +
'        <div class="footer-cta-card">' +
'          <div class="footer-cta-icon">' +
'            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
'          </div>' +
'          <div class="footer-cta-body">' +
'            <strong data-i18n="cta-request-title">İhtiyacın olan araç burada yok mu?</strong>' +
'            <span data-i18n="cta-request-sub">Önerini gönder, geliştirme listemize ekleyelim.</span>' +
'          </div>' +
'          <button class="btn-cta-outline" data-i18n="btn-request-tool">Yeni Araç Talep Et</button>' +
'        </div>' +
'        <div class="footer-cta-card">' +
'          <div class="footer-cta-icon footer-cta-icon--blue">' +
'            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
'          </div>' +
'          <div class="footer-cta-body">' +
'            <strong data-i18n="cta-support-title">Ücretsiz araçları birlikte büyütelim</strong>' +
'            <span data-i18n="cta-support-sub">Desteğin, ücretsiz limitleri herkes için yükseltir.</span>' +
'          </div>' +
'          <button class="btn-cta-filled" data-i18n="btn-support">Destek Ol</button>' +
'        </div>' +
'      </div>' +
'    </div>' +
'  </div>' +
'  <div class="footer-body">' +
'    <div class="container">' +
'      <div class="footer-grid footer-grid--4">' +
'        <div class="footer-col footer-col--brand">' +
'          <a href="' + BASE + 'index.html" class="footer-logo" aria-label="FormatJet">' +
'            <img src="' + BASE + 'assets/img/logo-icon-dark.png" alt="" class="footer-logo-icon" data-fj-set="logo_icon_dark" aria-hidden="true">' +
'            <img src="' + BASE + 'assets/img/logo-text-dark.png" alt="FormatJet" class="footer-logo-text-img footer-logo-text-img--native" data-fj-set="logo_text_dark">' +
'          </a>' +
'          <p class="footer-tagline" data-i18n="footer-tagline">Dosyalarını hızlı, güvenli ve kolayca dönüştür.</p>' +
'          <div class="footer-trust">' +
'            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
'            <span data-i18n="footer-trust">Dosyalar işlemden sonra otomatik silinir.</span>' +
'          </div>' +
'        </div>' +
'        <div class="footer-col">' +
'          <h4 class="footer-col-title" data-i18n="footer-tools">Araçlar</h4>' +
'          <ul class="footer-links">' +
'            <li><a href="' + BASE + 'pdf.html" data-i18n="nav-pdf">PDF</a></li>' +
'            <li><a href="' + BASE + 'belge.html" data-i18n="nav-belge">Belge</a></li>' +
'            <li><a href="' + BASE + 'gorsel.html" data-i18n="nav-gorsel">Görsel</a></li>' +
'            <li><a href="' + BASE + 'video.html" data-i18n="nav-video">Video</a></li>' +
'            <li><a href="' + BASE + 'ses.html" data-i18n="nav-ses">Ses</a></li>' +
'            <li><a href="' + BASE + 'tools.html" class="footer-link-accent" data-i18n="nav-all-tools">Tüm Araçlar</a></li>' +
'          </ul>' +
'        </div>' +
'        <div class="footer-col">' +
'          <h4 class="footer-col-title">FormatJet</h4>' +
'          <ul class="footer-links">' +
'            <li><a href="' + BASE + 'pages/hakkimizda.html" data-i18n="footer-about">Hakkımızda</a></li>' +
'            <li><a href="' + BASE + 'pages/iletisim.html" data-i18n="footer-contact">İletişim</a></li>' +
'            <li><a href="' + BASE + 'pages/iletisim.html?konu=arac-talebi" data-i18n="btn-request-tool">Yeni Araç Talep Et</a></li>' +
'            <li><a href="' + BASE + 'odeme.html?kaynak=destek" data-i18n="btn-support">Destek Ol</a></li>' +
'          </ul>' +
'        </div>' +
'        <div class="footer-col">' +
'          <h4 class="footer-col-title" data-i18n="footer-legal">Yasal</h4>' +
'          <ul class="footer-links">' +
'            <li><a href="' + BASE + 'pages/gizlilik.html" data-i18n="footer-privacy">Gizlilik Politikası</a></li>' +
'            <li><a href="' + BASE + 'pages/kullanim-kosullari.html" data-i18n="footer-terms">Kullanım Koşulları</a></li>' +
'            <li><a href="' + BASE + 'pages/cerez.html" data-i18n="footer-cookies">Çerez Politikası</a></li>' +
'            <li><a href="' + BASE + 'pages/kvkk.html">KVKK</a></li>' +
'          </ul>' +
'        </div>' +
'      </div>' +
'    </div>' +
'  </div>' +
'  <div class="footer-bar">' +
'    <div class="container">' +
'      <div class="footer-bar-inner">' +
'        <button class="btn-lang-footer" id="btnLangFooter">' +
'          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
'          <span class="btn-lang-footer-text">Türkçe</span>' +
'          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>' +
'        </button>' +
'        <p class="footer-copy">© 2026 FormatJet. <span data-i18n="footer-rights">Tüm hakları saklıdır.</span></p>' +
'        <div class="footer-theme-toggle">' +
'          <button class="theme-btn theme-btn--active" data-theme="light" aria-label="Açık tema"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg></button>' +
'          <span class="theme-label" data-i18n="footer-theme">Görünüm</span>' +
'          <button class="theme-btn" data-theme="dark" aria-label="Koyu tema"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button>' +
'        </div>' +
'      </div>' +
'    </div>' +
'  </div>' +
'</footer>';

  const headerSlot = document.querySelector('[data-fj-header]');
  if (headerSlot) headerSlot.outerHTML = headerHtml;
  const footerSlot = document.querySelector('[data-fj-footer]');
  if (footerSlot) footerSlot.outerHTML = footerHtml;

  /* ── Ortak buton davranışları ── */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-cta-outline').forEach(el => {
      el.addEventListener('click', () => { location.href = BASE + 'pages/iletisim.html?konu=arac-talebi'; });
    });
  });

  /* ── Site ayarları (admin panelinden düzenlenebilir) ── */
  window.fjApplySiteSettings = function (settings) {
    if (!settings) return;
    document.querySelectorAll('[data-fj-set]').forEach(el => {
      const key = el.dataset.fjSet;
      if (settings[key]) el.src = settings[key];
    });
    if (settings.favicon_light || settings.favicon_dark) {
      document.querySelectorAll('link[rel="icon"]').forEach(l => {
        if (l.media === '(prefers-color-scheme: dark)') { if (settings.favicon_dark) l.href = settings.favicon_dark; }
        else if (settings.favicon_light) l.href = settings.favicon_light;
      });
    }
    let navLabels = settings.nav_labels || [];
    if (typeof navLabels === 'string') {
      try { navLabels = JSON.parse(navLabels); } catch (_) { navLabels = []; }
    }
    navLabels.forEach((label, i) => {
      if (!label) return;
      document.querySelectorAll('[data-i18n="nav-' + ['pdf','belge','gorsel','video','ses'][i] + '"]').forEach(el => { el.textContent = label; });
    });

    /* Metin geçersiz kılmaları (admin panelinden) */
    const textMap = {
      hero_title: '[data-i18n="hero-title"]',
      hero_title_accent: '[data-i18n="hero-title-accent"]',
      hero_sub: '[data-i18n="hero-sub"]',
      btn_support_label: '[data-i18n="btn-support"]',
      btn_about_label: '[data-i18n="btn-about"]',
      footer_tagline: '[data-i18n="footer-tagline"]',
      footer_trust: '[data-i18n="footer-trust"]',
      cta_request_title: '[data-i18n="cta-request-title"]',
      cta_request_sub: '[data-i18n="cta-request-sub"]',
      cta_support_title: '[data-i18n="cta-support-title"]',
      cta_support_sub: '[data-i18n="cta-support-sub"]',
    };
    Object.entries(textMap).forEach(([key, sel]) => {
      if (settings[key]) {
        document.querySelectorAll(sel).forEach(el => {
          el.textContent = settings[key];
          el.removeAttribute('data-i18n');
        });
      }
    });

    /* İletişim bilgileri — [data-fj-contact] işaretli öğeler */
    document.querySelectorAll('[data-fj-contact]').forEach(el => {
      const key = 'contact_' + el.dataset.fjContact;
      if (!settings[key]) return;
      el.textContent = settings[key];
      if (el.dataset.fjContact === 'email' && el.tagName === 'A') el.href = 'mailto:' + settings[key];
    });

    /* Dil sıralaması */
    if (settings.lang_order) {
      try {
        const order = JSON.parse(settings.lang_order);
        const list = document.querySelector('.lang-list');
        if (list && Array.isArray(order)) {
          order.forEach(code => {
            const btn = list.querySelector('[data-lang="' + code + '"]');
            if (btn) list.appendChild(btn);
          });
        }
      } catch (_) {}
    }
  };

  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.fjSupabase) return;
    try {
      const { data } = await window.fjSupabase.from('site_settings').select('key, value');
      if (data && data.length) {
        const s = {};
        data.forEach(r => { s[r.key] = r.value; });
        window.FJ_SITE = s;
        window.fjApplySiteSettings(s);
        document.dispatchEvent(new CustomEvent('fj:settings', { detail: s }));
      }
    } catch (_) { /* ayarlar opsiyonel */ }
  });
})();
