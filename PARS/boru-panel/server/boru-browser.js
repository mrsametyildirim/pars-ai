const { chromium } = require('playwright-core');

let browser = null;
let context = null;
let page = null;

async function ensurePage() {
  if (page && !page.isClosed()) return page;
  if (!browser) {
    browser = await chromium.launch({ headless: false, channel: 'chrome' });
    browser.on('disconnected', () => { browser = null; context = null; page = null; });
  }
  if (!context) context = await browser.newContext({ viewport: null });
  page = await context.newPage();
  return page;
}

function clip(s, n = 2500) {
  s = String(s);
  return s.length > n ? s.slice(0, n) + '…' : s;
}

async function goto(url) {
  const p = await ensurePage();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForTimeout(1200);
  return `[açıldı] ${await p.title()} — ${p.url()}`;
}

// Sayfadaki tıklanabilir/yazılabilir öğeleri döndür — LLM ne olduğunu görsün
async function snapshot() {
  const p = await ensurePage();
  const data = await p.evaluate(() => {
    const vis = el => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 4 && r.height > 4 && s.visibility !== 'hidden' && s.display !== 'none';
    };
    const label = el =>
      (el.getAttribute('aria-label') || el.title || el.value ||
       el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70);
    const out = [];
    const seen = new Set();
    document.querySelectorAll('button,a,[role="button"],input,textarea,[role="option"],[role="tab"],ytmusic-responsive-list-item-renderer,ytd-video-renderer').forEach(el => {
      if (!vis(el)) return;
      const t = label(el);
      if (!t || seen.has(t)) return;
      seen.add(t);
      const tag = el.tagName.toLowerCase();
      out.push(`${tag}: ${t}`);
    });
    return { title: document.title, url: location.href, items: out.slice(0, 40) };
  });
  return `SAYFA: ${data.title}\nURL: ${data.url}\nÖĞELER:\n${data.items.join('\n')}`;
}

async function click(target) {
  const p = await ensurePage();
  const attempts = [
    () => p.getByRole('button', { name: target, exact: false }).first().click({ timeout: 4000 }),
    () => p.getByText(target, { exact: false }).first().click({ timeout: 4000 }),
    () => p.locator(`[aria-label*="${target}" i]`).first().click({ timeout: 4000 }),
    () => p.locator(target).first().click({ timeout: 4000 }),
  ];
  for (const a of attempts) {
    try { await a(); await p.waitForTimeout(900); return `[tıklandı] "${target}"`; } catch {}
  }
  return `[tıklanamadı] "${target}" bulunamadı — snapshot al, doğru metni kullan`;
}

async function type(text, submit) {
  const p = await ensurePage();
  try {
    const box = p.locator('input:visible, textarea:visible, [contenteditable="true"]:visible').first();
    await box.click({ timeout: 4000 });
    await box.fill(text, { timeout: 4000 });
  } catch {
    await p.keyboard.type(text);
  }
  if (submit) { await p.keyboard.press('Enter'); await p.waitForTimeout(1500); }
  return `[yazıldı] "${text}"${submit ? ' + Enter' : ''}`;
}

async function press(key) {
  const p = await ensurePage();
  await p.keyboard.press(key);
  await p.waitForTimeout(700);
  return `[tuş] ${key}`;
}

async function readText() {
  const p = await ensurePage();
  const txt = await p.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
  return clip(txt);
}

async function listTabs() {
  if (!context) return '[açık tarayıcı yok]';
  const pages = context.pages();
  if (!pages.length) return '[açık sekme yok]';
  const info = [];
  for (let i = 0; i < pages.length; i++) {
    let title = '';
    try { title = await pages[i].title(); } catch {}
    info.push(`${i}: ${title} — ${pages[i].url()}${pages[i] === page ? ' (aktif)' : ''}`);
  }
  return info.join('\n');
}

async function switchTab(index) {
  if (!context) return '[açık tarayıcı yok]';
  const pages = context.pages();
  const i = Number(index);
  if (i < 0 || i >= pages.length) return `[geçersiz sekme] 0-${pages.length - 1} arası ver`;
  page = pages[i];
  await page.bringToFront();
  await page.waitForTimeout(300);
  return `[sekme ${i} aktif] ${await page.title()} — ${page.url()}`;
}

async function newTab(url) {
  if (!context) await ensurePage();
  page = await context.newPage();
  if (url) return await goto(url);
  return '[yeni sekme açıldı]';
}

async function screenshot() {
  const p = await ensurePage();
  const out = require('path').join(require('os').tmpdir(), 'boru-page-' + Date.now() + '.png');
  await p.screenshot({ path: out });
  return out;
}

async function close() {
  try { if (browser) await browser.close(); } catch {}
  browser = context = page = null;
  return '[tarayıcı kapatıldı]';
}

module.exports = { goto, snapshot, click, type, press, readText, listTabs, switchTab, newTab, screenshot, close };
