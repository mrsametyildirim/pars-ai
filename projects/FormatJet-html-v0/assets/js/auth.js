'use strict';

/* ══════════════════════════════════════════
   FormatJet Auth — Supabase tabanlı oturum yönetimi
   Her sayfada supabase-js CDN + fj-config.js sonrası yüklenir.
══════════════════════════════════════════ */

(function () {
  if (!window.supabase || !window.FJ_CONFIG) return;

  const sb = window.supabase.createClient(
    window.FJ_CONFIG.SUPABASE_URL,
    window.FJ_CONFIG.SUPABASE_ANON_KEY
  );
  window.fjSupabase = sb;

  /* Sayfa konumuna göre kök yol (pages/ ve tools/ alt dizinleri) */
  const BASE = /\/(pages|tools)\//.test(location.pathname) ? '../' : '';
  window.FJ_BASE = BASE;

  /* ── Yardımcılar ── */

  async function getSession() {
    const { data } = await sb.auth.getSession();
    return data.session;
  }

  async function getProfile() {
    const session = await getSession();
    if (!session) return null;
    const { data } = await sb
      .from('profiles')
      .select('id, email, full_name, role, plan, plan_expires_at, created_at')
      .eq('id', session.user.id)
      .single();
    return data;
  }

  async function signOut() {
    await sb.auth.signOut();
    location.href = BASE + 'index.html';
  }

  async function logToolUsage(toolSlug) {
    try {
      const session = await getSession();
      const lang = localStorage.getItem('fj-lang') || 'tr';
      await sb.from('tool_usage').insert({
        tool_slug: toolSlug,
        user_id: session ? session.user.id : null,
        lang,
      });
    } catch (_) { /* kullanım kaydı kritik değil */ }
  }

  window.fjAuth = { sb, getSession, getProfile, signOut, logToolUsage };

  /* ── Header: Giriş Yap ↔ Kullanıcı menüsü ── */

  function initial(nameOrEmail) {
    return (nameOrEmail || '?').trim().charAt(0).toUpperCase() || '?';
  }

  function buildUserMenu(profile) {
    const wrap = document.createElement('div');
    wrap.className = 'user-menu-wrap';

    const btn = document.createElement('button');
    btn.className = 'user-menu-btn';
    btn.setAttribute('aria-label', 'Hesap menüsü');

    const avatar = document.createElement('span');
    avatar.className = 'user-avatar';
    avatar.textContent = initial(profile.full_name || profile.email);
    btn.appendChild(avatar);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'user-menu-name';
    nameSpan.textContent = (profile.full_name || profile.email.split('@')[0]).split(' ')[0];
    btn.appendChild(nameSpan);

    const chev = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chev.setAttribute('width', '11'); chev.setAttribute('height', '11');
    chev.setAttribute('viewBox', '0 0 24 24');
    chev.innerHTML = '<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>';
    btn.appendChild(chev);

    const panel = document.createElement('div');
    panel.className = 'user-menu-panel';
    panel.hidden = true;

    const planBadge = profile.plan === 'free'
      ? '<span class="user-plan-badge">Ücretsiz</span>'
      : '<span class="user-plan-badge user-plan-badge--pro">' + (profile.plan === 'pro' ? 'Pro' : 'Business') + '</span>';

    panel.innerHTML =
      '<div class="user-menu-head"><strong></strong><span class="user-menu-email"></span>' + planBadge + '</div>' +
      '<a href="' + BASE + 'hesap.html" class="user-menu-item">Hesabım</a>' +
      (profile.plan === 'free'
        ? '<a href="' + BASE + 'odeme.html" class="user-menu-item user-menu-item--accent">Pro\'ya Geç</a>'
        : '') +
      (profile.role === 'admin'
        ? '<a href="' + BASE + 'admin.html" class="user-menu-item">Yönetici Paneli</a>'
        : '') +
      '<button class="user-menu-item user-menu-item--danger" data-signout>Çıkış Yap</button>';

    panel.querySelector('.user-menu-head strong').textContent = profile.full_name || 'Kullanıcı';
    panel.querySelector('.user-menu-email').textContent = profile.email;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.hidden = !panel.hidden;
    });
    document.addEventListener('click', () => { panel.hidden = true; });
    panel.querySelector('[data-signout]').addEventListener('click', signOut);

    wrap.appendChild(btn);
    wrap.appendChild(panel);
    return wrap;
  }

  async function renderHeaderAuth() {
    const profile = await getProfile();
    if (!profile) return;

    document.querySelectorAll('.btn-login').forEach((el) => {
      const menu = buildUserMenu(profile);
      el.replaceWith(menu);
    });

    /* Eski araç sayfası nav'ındaki Giriş Yap / Pro'ya Geç */
    document.querySelectorAll('.btn-nav.btn-ghost').forEach((el) => {
      if (el.textContent.trim() === 'Giriş Yap') el.replaceWith(buildUserMenu(profile));
    });
    if (profile.plan !== 'free') {
      document.querySelectorAll('.btn-nav.btn-accent').forEach((el) => {
        if (el.textContent.trim() === "Pro'ya Geç") {
          el.textContent = profile.plan === 'pro' ? 'Pro Üye' : 'Business Üye';
          el.style.pointerEvents = 'none';
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', renderHeaderAuth);

  /* Destek Ol / Pro'ya Geç butonlarını ödeme sayfasına bağla */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-support, .btn-cta-filled').forEach((el) => {
      if (!el.closest('form')) el.addEventListener('click', () => { location.href = BASE + 'odeme.html?kaynak=destek'; });
    });
    document.querySelectorAll('.btn-nav.btn-accent').forEach((el) => {
      if (el.textContent.trim() === "Pro'ya Geç") el.addEventListener('click', () => { location.href = BASE + 'odeme.html'; });
    });
    document.querySelectorAll('.btn-cta-outline').forEach((el) => {
      el.addEventListener('click', () => { location.href = BASE + 'pages/iletisim.html?konu=arac-talebi'; });
    });
  });
})();
