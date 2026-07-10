const { chromium } = require('playwright-core');
const path = require('path');
const os = require('os');

const GROUP_URL = 'https://web.telegram.org/a/#-5547141071';
const PROFILE   = path.join(os.homedir(), '.boru-telegram-profile'); // kalıcı giriş
const BORU_MARK = '🐺'; // Börü'nün kendi mesajları bu işaretle başlar → komut olarak okunmaz

let ctx = null, page = null, enabled = false, started = false;
let activationId = 0;            // aktivasyon anındaki en büyük mesaj id — öncesi ASLA işlenmez
let processedIds = new Set();    // işlenen komut id'leri (tekrar tetiklenmesin)

async function ensure() {
  if (page && !page.isClosed()) return page;
  if (!ctx) {
    ctx = await chromium.launchPersistentContext(PROFILE, {
      headless: false, channel: 'chrome', viewport: null,
      args: ['--start-maximized'],
    });
    ctx.on('close', () => { ctx = null; page = null; enabled = false; });
  }
  page = ctx.pages()[0] || await ctx.newPage();
  if (!/web\.telegram\.org/.test(page.url())) {
    await page.goto(GROUP_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);
  }
  return page;
}

// Girişli mi + grup açık mı?
async function status() {
  try {
    if (!page || page.isClosed()) return { enabled, loggedIn: false, started };
    const loggedIn = await page.evaluate(() => !document.querySelector('.qr-container, [class*="AuthQr"], [class*="auth-qr"]') && !!document.querySelector('#editable-message-text, .input-message-input, [contenteditable="true"]'));
    return { enabled, loggedIn, started, url: page.url() };
  } catch { return { enabled, loggedIn: false, started }; }
}

async function start() {
  await ensure();
  started = true; enabled = true;
  processedIds = new Set();
  // Aktivasyon çizgisi: şu an görünen en büyük mesaj id — geçmiş bu çizginin altında kalır
  try {
    const msgs = await readMessages();
    activationId = msgs.reduce((mx, m) => Math.max(mx, m.id || 0), 0);
  } catch { activationId = 0; }
  return status();
}

function stop() { enabled = false; return { enabled }; }

// Grup mesajlarını id'leriyle oku — [{id, text, isBoru}] (id = data-message-id, kronolojik ve kalıcı)
async function readMessages() {
  const p = await ensure();
  return p.evaluate((MARK) => {
    const out = [];
    document.querySelectorAll('[data-message-id]').forEach(n => {
      const id = parseInt(n.getAttribute('data-message-id'), 10);
      if (!id || id < 0) return;                       // id'siz/servis öğesi güvenilmez → atla
      const txtEl = n.querySelector('.text-content') || n;
      const text = (txtEl.innerText || txtEl.textContent || '').trim();
      if (!text || text.length < 2) return;
      out.push({ id, text, isBoru: text.startsWith(MARK) });
    });
    out.sort((a, b) => a.id - b.id);
    return out.slice(-40);
  }, BORU_MARK);
}

// SADECE aktivasyon sonrası gelen, işlenmemiş kullanıcı mesajları komuttur.
// Geçmiş (id <= activationId) hiçbir koşulda işlenmez — sayfa yeniden yüklense bile.
async function pollCommands() {
  if (!enabled) return [];
  let msgs;
  try { msgs = await readMessages(); } catch { return []; }
  if (!msgs.length) return [];
  if (!activationId) {   // güvenlik: çizgi yoksa şimdi çek, bu turda hiçbir şey işleme
    activationId = msgs.reduce((mx, m) => Math.max(mx, m.id), 0);
    return [];
  }
  const fresh = [];
  for (const m of msgs) {
    if (m.id <= activationId || m.isBoru || processedIds.has(m.id)) continue;
    processedIds.add(m.id);
    fresh.push(m.text);
  }
  if (processedIds.size > 400) processedIds = new Set([...processedIds].slice(-200));
  return fresh.slice(-2);   // bombardıman koruması: poll başına en fazla son 2 komut
}

async function sendMessage(text) {
  try {
    const p = await ensure();
    const box = p.locator('#editable-message-text, .input-message-input, [contenteditable="true"]').first();
    await box.click({ timeout: 5000 });
    await box.fill(BORU_MARK + ' ' + text);
    await p.waitForTimeout(200);
    await p.keyboard.press('Enter');
    await p.waitForTimeout(400);
    return true;
  } catch { return false; }
}

// Bir dosyayı (ekran görüntüsü vb) gruba gönder
async function sendFile(filePath, caption) {
  try {
    const p = await ensure();
    const input = p.locator('input[type="file"]').first();
    await input.setInputFiles(filePath, { timeout: 5000 });
    await p.waitForTimeout(1500);
    if (caption) { try { const cap = p.locator('.input-message-input, [contenteditable="true"]').last(); await cap.fill(BORU_MARK + ' ' + caption); } catch {} }
    await p.waitForTimeout(300);
    await p.keyboard.press('Enter');
    await p.waitForTimeout(1200);
    return true;
  } catch { return false; }
}

function isEnabled() { return enabled; }

module.exports = { start, stop, status, pollCommands, sendMessage, sendFile, isEnabled };
