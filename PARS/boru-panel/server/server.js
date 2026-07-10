const express  = require('express');
const { spawnSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');
const { TOOLS, execTool, stepLabel, pasteToClaude, runClaudeCli, registerWorkflow } = require('./boru-tools');
const workflow = require('./boru-workflow');
const brain = require('./boru-brain');
const metrics = require('./boru-metrics');
const tasks = require('./boru-tasks');
const sources = require('./boru-sources');
const telegram = require('./boru-telegram');

const app  = express();
const PORT = 3737;

const GROQ_KEY_FILE = path.join(__dirname, 'groq.key');
const GROQ_API      = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL    = 'llama-3.3-70b-versatile';
const GROQ_FALLBACK = 'llama-3.1-8b-instant';

function getGroqKey() {
  return fs.readFileSync(GROQ_KEY_FILE, 'utf8').trim();
}

app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const history = [];

// ── Bilge Vault — Otomatik Oturum Notu + Konu Haritası ──
const VAULT_SESSIONS = 'C:\\PARS\\bilge-vault\\50-sessions';
const VAULT_INDEX    = 'C:\\PARS\\bilge-vault\\00-index';
const TOPIC_JSON     = path.join(VAULT_INDEX, 'topic-map.json');
const TOPIC_MD       = path.join(VAULT_INDEX, 'topic-map.md');

if (!fs.existsSync(VAULT_SESSIONS)) fs.mkdirSync(VAULT_SESSIONS, { recursive: true });

const VAULT_LEARN   = 'C:\\PARS\\bilge-vault\\40-learnings';
if (!fs.existsSync(VAULT_LEARN)) fs.mkdirSync(VAULT_LEARN, { recursive: true });

// ── Parola güvenlik katmanı (hash karşılaştırma — ham değer asla loglanmaz) ──
const PASS_HASH_FILE = path.join(__dirname, 'pass.key');
const TR_DIGIT_MAP = [
  ['sıfır','0'],['sifir','0'],['bir','1'],['iki','2'],
  ['üç','3'],['uc','3'],['uç','3'],['dört','4'],['dort','4'],
  ['beş','5'],['bes','5'],['altı','6'],['alti','6'],
  ['yedi','7'],['sekiz','8'],['dokuz','9'],
];
function normalizeSpokenToDigits(text) {
  const s = (text || '').replace(/İ/g, 'i').toLowerCase().replace(/̇/g, '').trim();
  const digitMap = new Map(TR_DIGIT_MAP);
  return s.split(/[\s,;.!?\-]+/).map(w => digitMap.get(w) || w).join('').replace(/\D/g, '');
}
function isPasswordMatch(transcript) {
  if (!fs.existsSync(PASS_HASH_FILE)) return false;
  const stored = fs.readFileSync(PASS_HASH_FILE, 'utf8').replace(/^﻿/, '').trim();
  const norm    = normalizeSpokenToDigits(transcript);
  const rawDig  = (transcript || '').replace(/\D/g, '');
  const h = t => crypto.createHash('sha256').update(t).digest('hex');
  return (norm && h(norm) === stored) || (rawDig && h(rawDig) === stored);
}

const TOPIC_KEYS = {
  'ses-tts':   ['xtts','kokoro','speaker','tts','sesi','konuş','ses ','wav','voice'],
  'ses-stt':   ['whisper','stt','mikrofon','dinle','speech','transc','vad'],
  'hafiza':    ['obsidian','bilge','vault','hafız','not al','kaydet','memory','topic','konu harita'],
  'tasarim':   ['tasarım','tasarim','css','html','panel','dashboard','hud','renk','ui','ux','görsel','font','wolf'],
  'kod':       ['python','javascript','node','server.js','script','fonksiyon','endpoint','port ','server '],
  'guvenlik':  ['güvenlik','guvenlik','security','owasp','kalkan','token','secret','cors'],
  'sistem':    ['başlat','basla','boru panel','pars ','çalıştır','process','restart','port 373'],
  'hata':      ['hata','error','çalışmıyor','bulunamıyor','başarısız','404','500','sorun','kırık','düzelt'],
  'tercih':    ['her zaman','artık böyle','böyle yap','istemiyorum','tercih','daha iyi','beğendim','süper'],
  'skill':     ['skill','agent','bilge','kaşif','kalkan','töre','yuva','boru'],
  'ARES':      ['ares','afet','deprem','tahliye','cbs','risk model'],
  'XR':        [' xr ','artırılmış','sanal gerçek'],
  'MEDIA':     ['media','video','içerik','sosyal medya','youtube','remotion'],
  'KNOWLEDGE': ['knowledge','bilgi yönet'],
  'SECURITY':  ['security proje','güvenlik projesi'],
  'arastirma': ['araştır','arastir','kaşif','research','incele'],
};

const ERROR_SIGNALS = ['hata','error','çalışmıyor','bulunamıyor','404','500','sorun','neden çalışmıyor','düzelt'];
const PREF_SIGNALS  = ['her zaman','artık böyle','böyle yap','istemiyorum','tercih ediyorum','daha iyi','beğendim','süper'];

function detectLearnings(userMsg, boruReply) {
  const u = userMsg.toLowerCase();
  const b = boruReply.toLowerCase();

  if (ERROR_SIGNALS.some(s => u.includes(s))) {
    const excerpt = userMsg.slice(0, 80).replace(/\n/g, ' ');
    const fix     = boruReply.slice(0, 120).replace(/\n/g, ' ');
    const now     = new Date();
    const line    = `- [${now.toISOString().slice(0,10)}] **Sorun:** ${excerpt} → **Çözüm:** ${fix}\n`;
    const errFile = path.join(VAULT_LEARN, 'errors.md');
    if (!fs.existsSync(errFile)) fs.writeFileSync(errFile, '# Hatalar ve Çözümler\n\n', 'utf8');
    fs.appendFileSync(errFile, line, 'utf8');
  }

  if (PREF_SIGNALS.some(s => u.includes(s))) {
    const excerpt = userMsg.slice(0, 100).replace(/\n/g, ' ');
    const now     = new Date();
    const line    = `- [${now.toISOString().slice(0,10)}] ${excerpt}\n`;
    const prefFile = path.join(VAULT_LEARN, 'preferences.md');
    if (!fs.existsSync(prefFile)) fs.writeFileSync(prefFile, '# Kullanıcı Tercihleri\n\n', 'utf8');
    fs.appendFileSync(prefFile, line, 'utf8');
  }
}

const MAX_VAULT_CTX_CHARS = 600; // Vault bağlamı prompt'u şişirmemeli

function retrieveContext(userMsg) {
  const tags = extractTags(userMsg, '');
  let ctx = '';
  try {
    const map = loadTopicMap();
    for (const tag of tags.slice(0, 3)) {
      if (!map[tag] || !map[tag].length) continue;
      const recent = map[tag].slice(-2);
      ctx += `[${tag}]: ` + recent.map(e => `${e.date} "${e.excerpt}"`).join(' | ') + '\n';
    }
    const prefFile = path.join(VAULT_LEARN, 'preferences.md');
    if (fs.existsSync(prefFile)) {
      const lines = fs.readFileSync(prefFile, 'utf8').split('\n').filter(l => l.startsWith('- ')).slice(-4);
      if (lines.length) ctx += '[Tercihler]: ' + lines.slice(0, 3).join(' / ') + '\n';
    }
    if (tags.includes('hata')) {
      const errFile = path.join(VAULT_LEARN, 'errors.md');
      if (fs.existsSync(errFile)) {
        const lines = fs.readFileSync(errFile, 'utf8').split('\n').filter(l => l.startsWith('- ')).slice(-3);
        if (lines.length) ctx += '[Önceki Hatalar]: ' + lines.join(' / ') + '\n';
      }
    }
  } catch {}
  if (!ctx) return '';
  const trimmed = ctx.length > MAX_VAULT_CTX_CHARS ? ctx.slice(0, MAX_VAULT_CTX_CHARS) + '…' : ctx;
  return `[BAĞLAM]\n${trimmed}\n`;
}

function extractTags(a, b) {
  const txt = (a + ' ' + b).toLowerCase();
  return Object.entries(TOPIC_KEYS)
    .filter(([, kws]) => kws.some(kw => txt.includes(kw)))
    .map(([tag]) => tag);
}

function loadTopicMap() {
  try { return JSON.parse(fs.readFileSync(TOPIC_JSON, 'utf8')); } catch { return {}; }
}

function rebuildTopicMd(map) {
  let md = '# Konu Haritası\n\n> Otomatik güncellenir — Börü oturumlarından\n\n';
  for (const tag of Object.keys(map).sort()) {
    const entries = map[tag].slice(-10).reverse();
    if (!entries.length) continue;
    md += `## ${tag}\n`;
    for (const e of entries) md += `- [[${e.date}]] ${e.time} — ${e.excerpt}\n`;
    md += '\n';
  }
  fs.writeFileSync(TOPIC_MD, md, 'utf8');
}

function captureToVault(userMsg, boruReply) {
  try {
    const now    = new Date();
    const date   = now.toISOString().slice(0, 10);
    const time   = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const tags   = extractTags(userMsg, boruReply);
    const tagStr = tags.map(t => `#${t}`).join(' ');

    // Oturum notu — Obsidian frontmatter ile
    const file = path.join(VAULT_SESSIONS, `${date}.md`);
    if (!fs.existsSync(file)) {
      const frontmatter = `---\ntarih: ${date}\ntürü: oturum\nprojet: PARS\n---\n\n# Oturum — ${date}\n\n`;
      fs.writeFileSync(file, frontmatter, 'utf8');
    }
    const entry = `## ${time}${tagStr ? '  ' + tagStr : ''}\n**Sen:** ${userMsg}\n\n**Börü:** ${boruReply}\n\n---\n\n`;
    fs.appendFileSync(file, entry, 'utf8');

    // Hata/tercih öğrenimi + konuşma tarzı
    detectLearnings(userMsg, boruReply);
    captureSpeechSample(userMsg);

    // Konu haritası
    if (tags.length) {
      const map    = loadTopicMap();
      const excerpt = userMsg.slice(0, 65).replace(/\n/g, ' ') + (userMsg.length > 65 ? '…' : '');
      for (const tag of tags) {
        if (!map[tag]) map[tag] = [];
        map[tag].push({ date, time, excerpt });
        if (map[tag].length > 50) map[tag] = map[tag].slice(-50);
      }
      fs.writeFileSync(TOPIC_JSON, JSON.stringify(map, null, 2), 'utf8');
      rebuildTopicMd(map);
    }
  } catch (e) {
    console.error('[VAULT] Hata:', e.message);
  }
}
const SYSTEM_BASE = `Sen Börü'sun — PARS sisteminin sesli asistanı. SADECE TÜRKÇE konuş, TEK bir yabancı kelime bile kullanma.

DİL KURALI (EN ÖNEMLİ):
- Yanıtın %100 Türkçe olacak. İngilizce kelime YASAK: "okay/ok" değil "tamam"; "sorry" değil "özür"; "task" değil "görev"; "file" değil "dosya"; "update" değil "güncelle"; "check" değil "kontrol et"; "start" değil "başlat"; "done" değil "tamam/bitti".
- Sadece özel teknik terimler (API, PDF, URL, Groq gibi) geçebilir; onun dışında her kelime Türkçe.
- Doğal, akıcı, düzgün Türkçe cümle kur. Devrik/bozuk cümle kurma. Kısa ve net konuş.

Kullanıcı profili:
- Adı Kaya. Ona "Kaya" diye hitap edebilirsin ama sık kullanma, doğal konuş.
- Kısa, doğrudan konuşur. "dur", "bak", "şimdi şunu yap" gibi günlük Türkçe kullanır.
- Bazen cümleyi yarıda bırakır, bağlamdan anlarsın.
- Teknik konuları bilir; basit anlatmana gerek yok, direkt git.
- Sesli konuştuğu için yazım hataları olabilir — anlamına göre yorumla.
- "gene" = yine/tekrar, "hala" = hâlâ, "vs" = falan, "apı" = API.

Konuşma kuralları:
- Maksimum 2-3 kısa cümle. Nokta koy, devam et.
- Günlük dil: "tamam", "şöyle", "yani", "aslında" — doğal konuş.
- Kalıp yasak: "Tabii ki", "Kesinlikle", "Harika", "Mükemmel".
- Soru sormak zorundaysan tek soru sor.
- Liste yok — akıcı konuş.
- Eğer bir şey net değilse kısa sor: "Ne demek istedin tam olarak?"
- Yanıt zaten sesle okunacak, süslü format yazma.
- Misafir konuşması gelirse (sistem bunu belirtir) kısa ve resmi yanıt ver.

Yeteneklerin — GERÇEKTEN yapabilirsin, bunlar için araçların var:
- run_powershell: PowerShell komutu (kod, git, npm, python, dosya, süreç).
- read_file / read_document: her kaynağı okursun — metin, kod, PDF, Word (docx), GÖRSEL (png/jpg: OCR ile yazı + vision ile içerik). write_file / list_dir: yazar, listelersin.
- browser_tabs / browser_switch_tab: açık sekmeleri görüp aralarında gezersin.
- send_telegram: kullanıcıya Telegram’dan haber verirsin. screenshot_telegram: ekran görüntüsü alıp Telegram’a gönderirsin ("ekranı gönder" denince).
- web_fetch: internetten sayfa/API çekersin. check_process: uygulama çalışıyor mu bakarsın.
- browser_open: kontrol edilebilir Chrome’da sayfa açarsın. browser_look: sayfadaki öğeleri görürsün.
  browser_click: öğeye tıklarsın. browser_type: kutuya yazarsın. browser_key: tuşa basarsın.
- launch_app: masaüstü uygulaması başlatırsın. desktop_apps: açık pencereleri görürsün.
  desktop_keys: bir uygulamayı öne getirip klavye tuşları gönderirsin.

Sadece AÇMAK yetmez — İSTENEN İŞİ SONUNA KADAR YAP:
- Müzik/video ("YouTube Music’te şu şarkıyı aç ve çal"): browser_open ile arama sayfasını aç → browser_look ile şarkıyı gör → browser_click ile şarkıya tıkla (çalmaya başlar). Çalmazsa browser_look’a tekrar bak, "Play"/"Oynat" öğesine tıkla ya da browser_key "k".
- Hesap makinesi ("24*454256 yap"): launch_app calc → desktop_keys match="Hesap" keys="24*454256=" → sonucu SÖYLEMEK için run_powershell ile 24*454256 hesapla ve rakamı ver. Olmayan log dosyası OKUMAYA ÇALIŞMA.
- Not defteri/uygulamaya yazma: launch_app → desktop_keys ile metni yaz.

Araç kuralları:
- Somut istekte konuşma, ARACI KULLAN ve işi bitir. Yarım bırakma.
- Her eylemden sonra SONUCU DOĞRULA. "Açtım/yaptım" deme; önce teyit et, sonra "oldu" ya da "olmadı, şu sorun var" de.
- Tıklama başarısız olursa browser_look ile tekrar bak, doğru metni bul, tekrar dene.
- Hata çıkarsa dur, oku, düzelt, tekrar dene. Sessizce geçme.
- Araç çıktısı uzun olabilir; kullanıcıya kısa özet ver.

Düşünme ve azim:
- Zor bir işte önce KISA BİR PLAN kur (1-2 cümle, hangi adımlar), sonra araçlarla uygula.
- Bir yol başarısız olursa PES ETME: hatayı oku, başka bir yol dene (farklı araç, farklı komut, farklı seçici). Yapana kadar makul şekilde uğraş.
- Uzman iş (kod incelemesi, güvenlik, UI, planlama, araştırma, API, test) gerekiyorsa use_skill ile ilgili skill'i aç ve talimatını uygula.
- Emin değilsen küçük bir adım at, sonucu gör, ona göre devam et. Kör tahmin yapma.
- Dosya yolunu BİLMİYORSAN uydurma; list_dir veya run_powershell (Get-ChildItem -Recurse -Filter) ile ÖNCE bul, sonra oku. Panel dosyaları C:\PARS\boru-panel altında.

Geliştirme akışı (EN GÜÇLÜ YETENEĞİN):
- Kullanıcı SIFIRDAN bir uygulama/site/panel/araç yapmanı isterse start_workflow aracını kullan — tek tek dosya yazmaya kalkma. Akış uzman fazlarla (PLAN → TASARIM → FRONTEND → BACKEND → DENETİM → ÖĞRENİM) arka planda yürür, projeler C:\PARS\workspace altına yazılır, her akıştan ders çıkarılıp Bilge'ye kaydedilir.
- Küçük düzeltme/tek dosya işi için workflow açma; normal araçlarla yap.`;

// ── Konuşma tarzı öğrenme ─────────────────────────
const SPEECH_SAMPLES_FILE = path.join(VAULT_LEARN, 'speech-samples.md');
const MAX_SPEECH_SAMPLES  = 40;

function captureSpeechSample(msg) {
  const line = msg.trim().slice(0, 150).replace(/\n/g, ' ');
  if (!line) return;
  if (!fs.existsSync(SPEECH_SAMPLES_FILE)) fs.writeFileSync(SPEECH_SAMPLES_FILE, '', 'utf8');
  fs.appendFileSync(SPEECH_SAMPLES_FILE, line + '\n', 'utf8');
  _sysCache = null; // yeni örnek → cache geçersiz
}

function getSpeechContext() {
  try {
    const lines = fs.readFileSync(SPEECH_SAMPLES_FILE, 'utf8')
      .split('\n').filter(l => l.trim()).slice(-MAX_SPEECH_SAMPLES);
    if (!lines.length) return '';
    return `\n\nKullanıcının gerçek konuşma örnekleri — bu tarza adapte ol:\n${lines.map(l => `"${l}"`).join('\n')}`;
  } catch { return ''; }
}

let _sysCache = null;
let _sysCacheAt = 0;
const SYS_TTL = 120000; // 2 dakika — speech samples ve skill catalog nadiren değişir

function getSystem() {
  const now = Date.now();
  if (_sysCache && now - _sysCacheAt < SYS_TTL) return _sysCache;
  _sysCache = SYSTEM_BASE + brain.skillCatalogPrompt() + getSpeechContext();
  _sysCacheAt = now;
  return _sysCache;
}

// Workflow fazları için YALIN sistem — sesli asistan kuralları/konuşma örnekleri taşınmaz (token ekonomisi)
const SYSTEM_LEAN = `Sen Börü'nün geliştirme uzmanısın. SADECE TÜRKÇE yaz.
- Araçların var: read_file, write_file, list_dir, run_powershell, use_skill. Konuşma, İŞİ YAP.
- Her yazımdan sonra doğrula (list_dir). Dosya yolu uydurma; önce bul.
- Uzun içeriği dosyaya yaz, yanıtında tek cümle özet ver.
- Bittiğinde son satıra "FAZ TAMAM: <özet>" ya da "FAZ EKSİK: <kalan>" yaz.`;

// Araçsız sohbet için HIZLI sistem — skill catalog + speech samples taşınmaz (~100 token vs 2220 token)
const SYSTEM_FAST = `Sen Börü'sun — Kaya'nın PARS sesli asistanı. SADECE TÜRKÇE konuş.
Kaya: kısa ve teknik konuşur, sesli söyler (yazım hatası olabilir). "dur"/"bak"/"şimdi" kullanır.
Kurallar: maks 2-3 cümle · doğal dil · kalıp yok ("Tabii ki"/"Kesinlikle") · liste yok.
Misafir gelirse sistem belirtir; o zaman kısa ve resmi yanıt ver.`;

// Yabancı kelime güvenlik ağı — yaygın İngilizce sızıntıları Türkçeye çevir (tam kelime, büyük/küçük korunur)
const FOREIGN_MAP = {
  'okay': 'tamam', 'ok': 'tamam', 'sorry': 'özür dilerim', 'please': 'lütfen',
  'thanks': 'teşekkürler', 'thank you': 'teşekkürler', 'yes': 'evet', 'no': 'hayır',
  'hello': 'merhaba', 'hi': 'merhaba', 'hey': 'hey', 'done': 'tamam', 'sure': 'tabii',
  'task': 'görev', 'file': 'dosya', 'folder': 'klasör', 'update': 'güncelleme',
  'error': 'hata', 'done!': 'bitti', 'let me': 'bir bakayım', 'wait': 'bekle',
  'now': 'şimdi', 'here': 'işte', 'great': 'güzel', 'nice': 'güzel', 'good': 'iyi',
  'problem': 'sorun', 'check': 'kontrol', 'start': 'başlat', 'stop': 'durdur',
};
function deforeign(text) {
  if (!text) return text;
  let out = text;
  for (const [en, tr] of Object.entries(FOREIGN_MAP)) {
    const re = new RegExp('\\b' + en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    out = out.replace(re, m => (m[0] === m[0].toUpperCase() ? tr.charAt(0).toUpperCase() + tr.slice(1) : tr));
  }
  return out;
}

// ── Streaming sohbet ───────────────────────────────
const MAX_HISTORY_TURNS = 8;

const MAX_TOOL_ROUNDS = 6;

// Eylem niyeti — sadece bunlarda tool aç, sıradan sohbeti ucuz tut
const ACTION_HINTS = [
  'aç','açar','başlat','çalıştır','kur','yükle','indir','klasör','dosya','oku','yaz','oluştur',
  'sil','düzenle','güncelle','kontrol et','kontrol','bak ','listele','çalışıyor mu','process','süreç',
  'terminal','powershell','komut','kod yaz','script','git ','npm','node','python','chrome','tarayıcı',
  'internet','ara ','araştır','çek ','fetch','url','http','port','test et','deploy','build','commit',
  'çal','oynat','şarkı','müzik','video','youtube','izle','dinle','hesap','hesapla','tıkla','yap ',
  'hesap makinesi','not defteri','notepad','uygulama','pencere','tuşla',
];
function needsTools(msg) {
  const m = msg.toLowerCase();
  return ACTION_HINTS.some(h => m.includes(h));
}

function postGroq(key, body, timeoutMs = 25000) {
  return fetch(GROQ_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
}

async function groqCall(key, messages, toolsArr, maxTokens, patient) {
  const body = { model: GROQ_MODEL, max_tokens: maxTokens || 1024, temperature: 0.7, messages };
  if (toolsArr) { body.tools = toolsArr; body.tool_choice = 'auto'; }

  // Sohbet: hız öncelik (8B). Araçlı: 70B → 8B. Sabırlı (workflow): 8B'ye DÜŞME.
  const plan = toolsArr
    ? (patient ? [GROQ_MODEL, GROQ_MODEL, GROQ_MODEL] : [GROQ_MODEL, GROQ_FALLBACK, GROQ_FALLBACK])
    : [GROQ_FALLBACK, GROQ_FALLBACK, GROQ_FALLBACK];
  let r, netErr = false;
  for (let i = 0; i < plan.length; i++) {
    body.model = plan[i];
    body.max_tokens = plan[i] === GROQ_FALLBACK ? Math.min(maxTokens || 1024, 2500) : (maxTokens || 1024);
    if (patient && i > 0) await new Promise(res => setTimeout(res, i === 1 ? 8000 : 15000));
    else if (i > 0 && !patient) await new Promise(res => setTimeout(res, 800)); // kısa bekleme — rate limit geçsin
    // Hızlı mod (sohbet, araçsız): tek deneme yeterli — rate limit gelirse hemen hata dön
    const tOut = (!toolsArr && !patient) ? 20000 : 25000;
    try {
      r = await postGroq(key, body, tOut);
    } catch { netErr = true; break; }
    if (!toolsArr && !patient && r.status === 429) break; // sohbet: rate limit → hemen dön, retry bekleme yok
    if (r.status === 413 && patient) { body.max_tokens = Math.max(1500, Math.floor(body.max_tokens / 2)); continue; }
    if (r.ok || (r.status !== 429 && r.status < 500)) return r;
  }
  if (netErr) return { ok: false, status: 0, offline: true };
  return r;
}

// Yerel Öncelik modu — açıkken her şey Ollama'da (tam çevrimdışı, sıfır token)
let localFirst = false;
app.get('/mode', (_req, res) => res.json({ localFirst, localReady: brain.ollamaReady() }));
app.post('/mode', (req, res) => { localFirst = !!req.body.localFirst; res.json({ localFirst }); });

// Birleşik LLM çağrısı — {ok, status, message:{content, tool_calls}} döner
async function llmCall(provider, key, messages, toolsArr, maxTokens, patient) {
  if (provider === 'ollama') {
    return brain.ollamaCall(messages, toolsArr);
  }
  const resp = await groqCall(key, messages, toolsArr, maxTokens, patient);
  if (!resp.ok) {
    let detail = '';
    try { detail = (await resp.text()).slice(0, 300); } catch {}
    return { ok: false, status: resp.status, error: detail };
  }
  try { const data = await resp.json(); return { ok: true, message: data.choices?.[0]?.message || {} }; }
  catch (e) { return { ok: false, status: 0, error: e.message }; }
}

// Sağlayıcı seçimi: HIZ + Türkçe kalite önce. Groq varsa hep Groq (sohbet 8B ~380ms,
// araç 70B). Yerel (qwen ~5s, bozuk Türkçe) sadece Yerel-Öncelik açıkken ya da Groq yokken.
function decideProvider(key, useTools) {
  const canGroq = !!key, canLocal = brain.ollamaReady();
  if (localFirst && canLocal) return 'ollama';
  if (!canGroq) return 'ollama';
  return 'groq';
}

// ── Çekirdek ajan motoru — hem chat hem görev zamanlayıcısı kullanır ──
async function runAgent(rawText, { onEvent = () => {}, isGuest = false, ephemeral = false, systemExtra = '', forceTools = false, providerLock = null, excludeTools = [], maxTokens = 0, leanSystem = false } = {}) {
  const userMsg = String(rawText || '').trim();
  if (!userMsg) return { ok: false, reply: '', err: 'boş girdi' };
  // useTools burada henüz belli değil — hızlı ön kontrol
  const _fastMode = !forceTools && !leanSystem && !needsTools(userMsg);
  const vaultCtx = (leanSystem || _fastMode) ? '' : retrieveContext(userMsg);
  const playbook = (leanSystem || _fastMode) ? '' : brain.recallPlaybook(userMsg);
  const guestNote = isGuest ? '\n\n[SİSTEM: Bu mesaj misafir bir kişiden geliyor, Kaya onayladı.]' : '';
  const userContent = (vaultCtx ? `${userMsg}\n\n${vaultCtx}` : userMsg) + playbook + guestNote;

  // ephemeral (görev): paylaşılan chat geçmişini kirletme — bağımsız çalış
  if (!ephemeral) history.push({ role: 'user', content: userContent });
  let convo = ephemeral ? [{ role: 'user', content: userContent }] : history.slice(-(MAX_HISTORY_TURNS * 2));
  if (convo[0]?.role === 'assistant') convo = convo.slice(1);

  // Geliştirme isteği → LLM'e sormadan deterministik başlat (sıfır sınıflandırma tokeni)
  if (!leanSystem && workflow.isDevRequest(userMsg)) {
    const st = workflow.status();
    if (!st || st.done) {
      startWorkflowBg(userMsg);
      const reply = 'Geliştirme akışını başlattım. Fazlar arka planda ilerliyor: plan, tasarım, arayüz, denetim. Bitince haber veririm.';
      if (!ephemeral) history.push({ role: 'assistant', content: reply });
      metrics.pushAction('done', '✓ Akış tetiklendi (doğrudan)', 'done');
      return { ok: true, reply, steps: ['start_workflow'] };
    }
  }

  let key = null;
  try { key = getGroqKey(); } catch {}
  if (!key && !brain.ollamaReady()) { if (!ephemeral) history.pop(); return { ok: false, reply: '', err: 'Groq key yok ve yerel model kapalı' }; }

  // Araçsız basit sohbet → SYSTEM_FAST (~100 token). Araçlı → tam sistem (~2220 token). Workflow → LEAN.
  const useTools = forceTools || needsTools(userMsg);
  const sysContent = leanSystem ? SYSTEM_LEAN : (useTools ? getSystem() : SYSTEM_FAST);
  const messages = [{ role: 'system', content: sysContent + (systemExtra ? '\n\n' + systemExtra : '') }, ...convo];
  const toolset = useTools ? (excludeTools.length ? TOOLS.filter(t => !excludeTools.includes(t.function.name)) : TOOLS) : null;
  let fullReply = '', rateLimited = false, dailyLimited = false;
  const doneSteps = [];
  const t0 = Date.now();
  metrics.noteTurnStart();
  metrics.setProviders(key ? GROQ_MODEL : null, brain.ollamaReady() ? brain.ollamaCurrentModel() : null);
  metrics.pushAction('user', userMsg, 'done');
  const emitAct = (kind, text, status) => { const a = metrics.pushAction(kind, text, status); onEvent({ s: text, act: { kind, status } }); return a; };

  let provider = providerLock || decideProvider(key, useTools);
  let escalated = !!providerLock;   // kilitliyken sağlayıcı değiştirme
  if (provider === 'ollama') emitAct('local', (key ? '⚡ Yerel model' : '⚡ Çevrimdışı — yerel model') + ' (' + brain.ollamaCurrentModel() + ')', 'run');
  metrics.noteProvider(provider);

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      // sabırlı mod: kısa nefes + ESKİ araç sonuçlarını buda — tek istek 12k TPM tavanını aşmasın
      if (leanSystem && round > 0) {
        await new Promise(r2 => setTimeout(r2, 6000));
        for (let i = 0; i < messages.length - 2; i++) {
          if (messages[i].role === 'tool' && messages[i].content.length > 600)
            messages[i].content = messages[i].content.slice(0, 500) + '…[kırpıldı — dosya diskte tam]';
        }
      }
      // qwen gibi zayıf yerel modele geliştirme akışı tetikletme (halüsinasyon riski)
      const roundTools = (provider === 'ollama' && toolset)
        ? toolset.filter(t => t.function.name !== 'start_workflow') : toolset;
      const r = await llmCall(provider, key, messages, roundTools, maxTokens, leanSystem);
      if (!r.ok) {
        if (r.status === 429) { metrics.noteRateLimit(); rateLimited = true; if (/per day|TPD/i.test(String(r.error || ''))) dailyLimited = true; }
        emitAct('plan', '⚠ LLM hata ' + (r.status || 0) + (r.error ? ': ' + String(r.error).slice(0, 120) : ''), 'fail');
        metrics.noteRetry();
        // localFirst açıksa Ollama'ya düş; kapalıysa Groq hatası direkt döner (Ollama çok yavaş)
        if (!escalated && provider === 'groq' && localFirst && brain.ollamaReady()) {
          provider = 'ollama'; escalated = true;
          emitAct('local', '⚡ Yerel modele geçiliyor (' + brain.ollamaCurrentModel() + ')', 'run');
          metrics.noteProvider('ollama'); continue;
        }
        if (!escalated && provider === 'ollama' && key) {
          provider = 'groq'; escalated = true;
          emitAct('plan', '↑ Buluta yükseltiliyor', 'done');
          metrics.noteProvider('groq'); continue;
        }
        if (doneSteps.length) { fullReply = 'Şunları yaptım: ' + doneSteps.join(', ') + '.'; break; }
        const msg = r.status === 429 ? 'Bir saniye yoğunluk oldu, tekrar söyler misin.' : 'Beyin şu an yanıt veremedi.';
        onEvent({ err: msg });
        return { ok: false, reply: '', err: msg, rateLimited, dailyLimited };
      }
      const aMsg = r.message;
      if (!aMsg) { onEvent({ err: 'Boş yanıt' }); break; }

      const toolCalls = aMsg.tool_calls;
      if (toolCalls && toolCalls.length) {
        if (aMsg.content && aMsg.content.trim()) emitAct('plan', '💭 ' + aMsg.content.trim().slice(0, 90), 'done');
        messages.push({ role: 'assistant', content: aMsg.content || '', tool_calls: toolCalls });
        for (const tc of toolCalls) {
          let args = {};
          try { args = JSON.parse(tc.function.arguments || '{}'); } catch {}
          const label = stepLabel(tc.function.name, args);
          const act = emitAct('tool', label, 'run');
          doneSteps.push(label);
          metrics.noteTool(tc.function.name);
          if (tc.function.name === 'use_skill') metrics.noteSkill(args.id);
          const result = await execTool(tc.function.name, args);
          const failed = /\[.*(hata|bulunamadı|tıklanamadı|çalışmıyor)/i.test(result);
          metrics.setActionStatus(act, failed ? 'fail' : 'done');
          onEvent({ actUpdate: { text: label, status: failed ? 'fail' : 'done' } });
          messages.push({ role: 'tool', tool_call_id: tc.id, name: tc.function.name, content: leanSystem ? String(result).slice(0, 2600) : result });
        }
        continue;
      }
      fullReply = aMsg.content || '';
      break;
    }
  } catch (e) {
    onEvent({ err: e.message });
    return { ok: false, reply: fullReply, err: e.message, rateLimited };
  }

  if (!fullReply) fullReply = 'İşlemi tamamladım ama özet üretemedim.';
  fullReply = deforeign(fullReply);
  metrics.noteTurnEnd(Date.now() - t0);
  emitAct('done', '✓ Tamamlandı', 'done');
  if (!ephemeral) history.push({ role: 'assistant', content: fullReply });
  captureToVault(userMsg, fullReply);
  if (doneSteps.length >= 2) brain.recordPlaybook(userMsg, doneSteps);
  return { ok: true, reply: fullReply, steps: doneSteps, rateLimited, dailyLimited };
}

app.post('/stream', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') return res.status(400).end();
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sse = obj => { if (!res.destroyed) res.write(`data: ${JSON.stringify(obj)}\n\n`); };

  const result = await runAgent(text, { isGuest: req.body.guest === true, onEvent: ev => sse(ev) });

  if (result.ok) {
    for (const word of result.reply.split(/(\s+)/)) { sse({ t: word }); await new Promise(r => setTimeout(r, 2)); }
  }
  sse('[DONE]');
  if (!res.destroyed) res.end();
});

// ── TTS — msedge-tts (Node.js native, ~200ms) ──────
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const DEFAULT_VOICE = 'tr-TR-AhmetNeural';

const ttsPool = new MsEdgeTTS();
let ttsReady = false;

async function getTTS() {
  if (!ttsReady) {
    await ttsPool.setMetadata(DEFAULT_VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    ttsReady = true;
  }
  return ttsPool;
}

// Warm-up on startup
getTTS().catch(() => {});

const XTTS_URL = 'http://127.0.0.1:8020/tts';
let xttsAvailable = false;

async function checkXTTS() {
  try {
    const r = await fetch('http://127.0.0.1:8020/health', { signal: AbortSignal.timeout(3000) });
    const wasAvailable = xttsAvailable;
    xttsAvailable = r.ok;
    if (!wasAvailable && xttsAvailable) console.log('[TTS] XTTS v2 GPU aktif');
  } catch { xttsAvailable = false; }
}
setInterval(checkXTTS, 5000);
checkXTTS();

// ── STT — Whisper ──────────────────────────────────
const WHISPER_URL = 'http://127.0.0.1:8021/transcribe';
let whisperAvailable = false;

async function checkWhisper() {
  try {
    const r = await fetch('http://127.0.0.1:8021/health', { signal: AbortSignal.timeout(3000) });
    const was = whisperAvailable;
    whisperAvailable = r.ok;
    if (!was && whisperAvailable) console.log('[STT] Whisper large-v3 GPU aktif');
  } catch { whisperAvailable = false; }
}
setInterval(checkWhisper, 5000);
checkWhisper();

app.post('/stt', express.raw({ type: () => true, limit: '15mb' }), async (req, res) => {
  if (!whisperAvailable) return res.status(503).json({ error: 'Whisper hazır değil' });
  if (!req.body || req.body.length === 0) return res.status(400).json({ error: 'Ses verisi yok' });

  try {
    const ct = req.headers['content-type'] || 'audio/wav';
    const r = await fetch(WHISPER_URL, {
      method: 'POST',
      headers: { 'Content-Type': ct, 'Content-Length': req.body.length },
      body: req.body,
      signal: AbortSignal.timeout(20000),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/tts', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') return res.status(400).end();

  // XTTS önce — özel klonlanmış ses (speaker.wav). Her zaman dene: kapalıysa bağlantı
  // anında reddedilir (yavaşlatmaz), açıksa Kaya'nın sesi tutarlı kalır.
  try {
    const r = await fetch(XTTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 800) }),
      signal: AbortSignal.timeout(15000),
    });
    if (r.ok) {
      res.setHeader('Content-Type', 'audio/wav');
      r.body.pipeTo(new WritableStream({
        write(chunk) { res.write(chunk); },
        close() { res.end(); },
        abort() { if (!res.writableEnded) res.end(); },
      }));
      return;
    }
  } catch {}

  // Yedek — MsEdge TTS
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(DEFAULT_VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text.slice(0, 1800), { rate: '+18%', pitch: '+4Hz' });
    res.setHeader('Content-Type', 'audio/mpeg');
    audioStream.pipe(res);
    audioStream.on('error', () => { if (!res.writableEnded) res.end(); });
  } catch (e) {
    if (!res.headersSent) res.status(500).json({ err: e.message });
  }
});

// ── Debug ──────────────────────────────────────────
app.get('/debug', async (req, res) => {
  const start = Date.now();
  try {
    const key = getGroqKey();
    const r = await fetch(GROQ_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'tek kelime: tamam' }],
      }),
      signal: AbortSignal.timeout(10000),
    });
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content;
    res.json({ ok: r.ok, ms: Date.now() - start, reply, status: r.status, provider: GROQ_MODEL });
  } catch (e) {
    res.json({ ok: false, ms: Date.now() - start, error: e.message });
  }
});

// ── Terminale gönder ───────────────────────────────
app.post('/terminal', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ ok: false });
  try {
    const env = { ...process.env, BORU_CMD: text.trim() };
    spawnSync('powershell',
      ['-NonInteractive', '-File', 'C:\\PARS\\scripts\\send-to-terminal.ps1'],
      { env, timeout: 5000 });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Auto Startup ───────────────────────────────────
const startupDir  = path.join(process.env.APPDATA || '',
  'Microsoft\\Windows\\Start Menu\\Programs\\Startup');
const startupFile = path.join(startupDir, 'BORU-Panel.bat');

app.post('/startup', (req, res) => {
  try {
    if (req.body.enable) {
      fs.writeFileSync(startupFile,
        `@echo off\npowershell -WindowStyle Hidden -File "C:\\PARS\\scripts\\boru_panel.ps1"\n`);
    } else if (fs.existsSync(startupFile)) {
      fs.unlinkSync(startupFile);
    }
    res.json({ ok: true, enabled: !!req.body.enable });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/startup', (_req, res) => res.json({ enabled: fs.existsSync(startupFile) }));

// ── Ses doğrulama proxy ────────────────────────────
// Ses benzerliği (resemblyzer) ve STT parola kontrolü paralel çalışır (hız).
// Parola eşleşmesi loglanmaz, Telegram'a yazılmaz, yanıtta ham metin dönmez.
app.post('/verify', express.raw({ type: () => true, limit: '15mb' }), async (req, res) => {
  if (!xttsAvailable && !whisperAvailable) return res.json({ verified: true, similarity: 1.0 });

  const ct = req.headers['content-type'] || 'audio/wav';
  const buf = req.body;

  const [voiceP, sttP] = await Promise.allSettled([
    xttsAvailable
      ? fetch('http://127.0.0.1:8020/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'audio/wav', 'Content-Length': buf.length },
          body: buf,
          signal: AbortSignal.timeout(7000),
        }).then(r => r.json())
      : Promise.resolve({ verified: true, similarity: 1.0 }),

    whisperAvailable
      ? fetch(WHISPER_URL, {
          method: 'POST',
          headers: { 'Content-Type': ct, 'Content-Length': buf.length },
          body: buf,
          signal: AbortSignal.timeout(12000),
        }).then(r => r.json())
      : Promise.resolve(null),
  ]);

  const voice = voiceP.status === 'fulfilled' ? voiceP.value : { verified: true, similarity: 1.0 };
  console.log('[VERIFY] ses:', voice.verified ? 'OK' : 'RED', 'sim:', voice.similarity,
    '| stt:', sttP.status, sttP.value ? 'var' : 'yok',
    '| whisperReady:', whisperAvailable);
  if (voice.verified) return res.json(voice);

  // Ses tanınamadı → parola kontrolü (asla loglama)
  if (sttP.status === 'fulfilled' && sttP.value) {
    const transcript = sttP.value.text || sttP.value.transcription || '';
    if (isPasswordMatch(transcript)) {
      return res.json({ verified: true, similarity: voice.similarity || 0, passwordMatch: true });
    }
  }

  return res.json(voice);
});

// ── Misafir onay ───────────────────────────────────
let guestApproved = false;
let guestTimer    = null;

app.post('/approve-guest', (_req, res) => {
  guestApproved = true;
  clearTimeout(guestTimer);
  guestTimer = setTimeout(() => { guestApproved = false; }, 90000);
  res.json({ ok: true });
});

// ── Görev kuyruğu + zamanlayıcı ────────────────────
const COOLDOWN_HOURS = 6;   // Groq kotası bitince genel bekleme
const RETRY_HOURS    = 5;   // başarısız/yarım görev — oldurana kadar 5 saatte bir dene
let taskRunning = false;

function finishRecurringOrArchive(t, folder) {
  // Tekrarlı görev (her N saatte) → arşivleme, yeniden kuyruğa; değilse klasörü arşivle
  if (t.intervalHours && t.intervalHours > 0) {
    tasks.setStatus(t.id, 'queued', { runAt: Date.now() + t.intervalHours * 3600000, interrupted: false, startedAt: null });
    metrics.pushAction('task', '↻ Tekrar planlandı: ' + t.title + ' (' + t.intervalHours + 'sa sonra)', 'done');
  } else if (folder) {
    const moved = sources.archiveTaskFolder(folder);
    if (moved) metrics.pushAction('task', '📁 Kaynak klasörü halledilen’e taşındı', 'done');
  }
}

// ── Geliştirme akışını araç katmanına bağla (start_workflow arka planda koşar) ──
const workflowAct = (kind, text, status) => metrics.pushAction(kind, text, status);
function startWorkflowBg(brief) {
  workflow.runWorkflow(brief, { runAgentFn: runAgent, onAct: workflowAct })
    .then(r => {
      if (r.ok) { notifyTelegram('🏁 Geliştirme bitti: ' + brief.slice(0, 80) + '\nKlasör: ' + r.ws); return; }
      if (r.daily) {  // günlük kota → görev kuyruğuna devret, kota yenilenince kaldığı yerden
        const dup = tasks.list().some(t => t.status === 'queued' && t.prompt === brief);
        if (!dup) tasks.add({ title: 'Geliştirmeye devam: ' + brief.slice(0, 50), prompt: brief, runAt: Date.now() + 6 * 3600000, target: 'boru' });
        notifyTelegram('⏸ Günlük kota doldu — geliştirme görev kuyruğuna alındı, kota yenilenince kaldığı yerden devam edecek: ' + brief.slice(0, 70));
        return;
      }
      notifyTelegram('⚠ Geliştirme yarım kaldı (' + (r.phase || '?') + '): ' + (r.err || ''));
    })
    .catch(e => metrics.pushAction('workflow', '✗ Akış hatası: ' + e.message, 'fail'));
}
registerWorkflow(startWorkflowBg);
app.get('/workflow/status', (_req, res) => res.json(workflow.status() || { done: true, idle: true }));

async function taskTick() {
  if (taskRunning) return;
  const t = tasks.nextRunnable();
  if (!t) return;
  taskRunning = true;
  tasks.setStatus(t.id, 'running', { startedAt: Date.now(), interrupted: false });
  metrics.pushAction('task', (t.interrupted ? '▶ Yarım görev sürdürülüyor: ' : '▶ Görev başladı: ') + t.title, 'run');

  // Kaynak klasörü (görev N) — bul/oluştur, içindekileri incele
  let folder = null, srcNote = '';
  try {
    const rf = sources.resolveTaskFolder(t.seq || 1);
    folder = rf.folder;
    const scan = await sources.scanSources(folder);
    if (scan.count) { srcNote = scan.note; metrics.pushAction('task', '🔎 ' + scan.count + ' kaynak inceleniyor (görev ' + (t.seq || 1) + ')', 'run'); }
  } catch {}
  const fullPrompt = t.prompt + srcNote;

  try {
    if (t.target === 'claude') {
      // Claude CLI headless — görevi gerçek bir Claude oturumu yapar, pencere/odak gerekmez
      metrics.pushAction('task', '↪ Claude Code çalıştırıyor (CLI): ' + t.title, 'run');
      const out = await runClaudeCli(fullPrompt);
      const ok = !/^\[claude (hata|zaman|çalıştırılamadı)/.test(out);
      if (ok) {
        tasks.setStatus(t.id, 'done', { finishedAt: Date.now(), result: 'Claude Code yaptı:\n' + out.slice(0, 1500) });
        metrics.pushAction('task', '✓ Claude Code tamamladı: ' + t.title, 'done');
        notifyTelegram('✓ Görev ' + t.seq + ' Claude Code tarafından yapıldı: ' + t.title + '\n' + out.slice(0, 400));
        finishRecurringOrArchive(t, folder);
      } else {
        // CLI başarısız (oturum limiti vb) → 5 saatte bir, oldurana kadar tekrar dene
        const attempts = (t.attempts || 0) + 1;
        tasks.setStatus(t.id, 'queued', { attempts, interrupted: true, runAt: Date.now() + RETRY_HOURS * 3600000, result: out.slice(0, 500) });
        metrics.pushAction('task', '↻ Claude CLI başarısız — ' + RETRY_HOURS + 'sa sonra tekrar (deneme ' + attempts + ')', 'fail');
      }
    } else {
      // Börü kendi motoruyla yapar — sıfırdan geliştirme görevi ise tam uzman akışıyla
      const result = workflow.isDevRequest(fullPrompt)
        ? await (async () => {
            const w = await workflow.runWorkflow(fullPrompt, { runAgentFn: runAgent, onAct: workflowAct });
            return { ok: w.ok, reply: w.ok ? 'Geliştirme tamamlandı: ' + w.ws : (w.err || 'akış yarım kaldı'), rateLimited: w.err === 'rate-limit' };
          })()
        : await runAgent(fullPrompt, { ephemeral: true });
      if (result.ok) {
        tasks.setStatus(t.id, 'done', { finishedAt: Date.now(), result: (result.reply || '').slice(0, 1500) });
        metrics.pushAction('task', '✓ Görev tamamlandı: ' + t.title, 'done');
        notifyTelegram('✓ Görev ' + t.seq + ' gerçekleşti: ' + t.title + '\n' + (result.reply || '').slice(0, 500));
        finishRecurringOrArchive(t, folder);
      } else if (result.rateLimited) {
        tasks.setStatus(t.id, 'queued', { interrupted: true, attempts: (t.attempts || 0) + 1 });
        tasks.setCooldown(COOLDOWN_HOURS);
        metrics.pushAction('task', '⏸ Limit — ' + COOLDOWN_HOURS + 'sa bekleme, görev sırada kaldı', 'fail');
      } else {
        // başarısız/yarım → oldurana kadar 5 saatte bir tekrar dene (failed'a düşürme)
        const attempts = (t.attempts || 0) + 1;
        tasks.setStatus(t.id, 'queued', { attempts, interrupted: true, runAt: Date.now() + RETRY_HOURS * 3600000, result: result.err || 'yarım kaldı' });
        metrics.pushAction('task', '↻ Görev tamamlanmadı — ' + RETRY_HOURS + 'sa sonra tekrar (deneme ' + attempts + ')', 'fail');
      }
    }
  } catch (e) {
    tasks.setStatus(t.id, 'queued', { attempts: (t.attempts || 0) + 1, interrupted: true });
  } finally { taskRunning = false; }
}
setInterval(taskTick, 10000);
setTimeout(taskTick, 4000);

// ── Telegram (web) uzaktan kontrol ─────────────────
function notifyTelegram(text) { if (telegram.isEnabled()) telegram.sendMessage(text).catch(() => {}); }

function captureScreen() {
  return new Promise((resolve) => {
    const out = path.join(require('os').tmpdir(), 'boru-shot-' + Date.now() + '.png');
    const ps = `Add-Type -AssemblyName System.Windows.Forms,System.Drawing; $b=[System.Windows.Forms.Screen]::PrimaryScreen.Bounds; $bmp=New-Object System.Drawing.Bitmap $b.Width,$b.Height; $g=[System.Drawing.Graphics]::FromImage($bmp); $g.CopyFromScreen(0,0,0,0,$bmp.Size); $bmp.Save('${out.replace(/\\/g, '\\\\')}'); $g.Dispose(); $bmp.Dispose()`;
    const p = spawnSync('powershell', ['-NoProfile', '-Command', ps], { timeout: 10000 });
    resolve(fs.existsSync(out) ? out : null);
  });
}

let tgBusy = false;
async function telegramPoll() {
  if (!telegram.isEnabled() || tgBusy) return;
  tgBusy = true;
  try {
    const cmds = await telegram.pollCommands();
    for (const cmd of cmds) {
      const low = cmd.toLowerCase();
      // Ekran görüntüsü isteği
      if (/(ekran görüntüsü|ekran goruntusu|ss (gönder|at|yolla)|görsel(i)? (gönder|at|yolla)|screenshot)/i.test(low)) {
        await telegram.sendMessage('Ekran görüntüsü hazırlanıyor…');
        const shot = await captureScreen();
        if (shot) { await telegram.sendFile(shot, 'İşte güncel ekran.'); try { fs.unlinkSync(shot); } catch {} }
        else await telegram.sendMessage('Ekran görüntüsü alınamadı.');
        continue;
      }
      // Görev olarak ekle
      if (/^(görev|gorev|ekle|task)\s*[:：]/i.test(cmd)) {
        const promptText = cmd.replace(/^(görev|gorev|ekle|task)\s*[:：]\s*/i, '').trim();
        const t = tasks.add({ title: promptText.slice(0, 60), prompt: promptText, target: 'boru' });
        await telegram.sendMessage('Görev ' + t.seq + ' sıraya eklendi: ' + t.title + '. Bitince haber vereceğim.');
        continue;
      }
      // Doğrudan cevapla / yap — tek mesaj: sadece cevap (gürültü yok)
      const r = await runAgent(cmd, { ephemeral: true });
      await telegram.sendMessage(r.ok ? (r.reply || 'Tamam.').slice(0, 3500) : 'Şu an yapamadım: ' + (r.err || 'hata'));
    }
  } catch {}
  finally { tgBusy = false; }
}
setInterval(telegramPoll, 12000);

app.get('/telegram/status', async (_req, res) => res.json(await telegram.status()));
app.post('/telegram/start', async (_req, res) => { try { res.json(await telegram.start()); } catch (e) { res.status(500).json({ err: e.message }); } });
app.post('/telegram/stop', (_req, res) => res.json(telegram.stop()));
app.post('/telegram/send', async (req, res) => { const ok = await telegram.sendMessage(req.body.text || ''); res.json({ ok }); });

app.get('/tasks', (_req, res) => res.json(tasks.list()));
app.post('/tasks', (req, res) => {
  const { title, prompt, delayHours, target, priority, intervalHours } = req.body || {};
  if (!prompt && !title) return res.status(400).json({ err: 'başlık veya görev metni gerekli' });
  const runAt = delayHours ? Date.now() + Number(delayHours) * 3600 * 1000 : null;
  res.json(tasks.add({ title, prompt, runAt, target, priority, intervalHours }));
});
app.patch('/tasks/:id', (req, res) => { const t = tasks.update(req.params.id, req.body || {}); res.json(t || { err: 'bulunamadı' }); });
app.delete('/tasks/:id', (req, res) => { tasks.remove(req.params.id); res.json({ ok: true }); });
app.post('/tasks/reorder', (req, res) => { tasks.reorder(req.body.ids || []); res.json({ ok: true }); });
app.post('/tasks/run', (req, res) => { tasks.clearCooldown(); setTimeout(taskTick, 100); res.json({ ok: true }); });
app.post('/tasks/autorun', (req, res) => { tasks.setAutoRun(!!req.body.on); res.json({ ok: true, autoRun: !!req.body.on }); });
app.post('/tasks/clear-done', (_req, res) => { tasks.clearDone(); res.json({ ok: true }); });

// ── Geçmiş sil ─────────────────────────────────────
app.delete('/history', (_req, res) => { history.length = 0; metrics.resetConvo(); res.json({ ok: true }); });

// ── Canlı aksiyon akışı ────────────────────────────
app.get('/actions', (_req, res) => res.json({ actions: metrics.getActions() }));

// ── Sistem metrikleri (gerçek veri) ────────────────
app.get('/metrics', (_req, res) => res.json(metrics.getMetrics()));

// ── KNOWLEDGE — Bilge vault özeti ──────────────────
app.get('/knowledge', (_req, res) => res.json(metrics.getKnowledge()));

// ── ARES — son güncellemeler + html linki ──────────
app.get('/ares', (_req, res) => res.json(metrics.getAres()));

// ── Durum ──────────────────────────────────────────
brain.checkOllama();
setInterval(() => brain.checkOllama(), 15000);

app.get('/health', (_req, res) => {
  let apiReady = false;
  try { apiReady = !!getGroqKey(); } catch {}
  res.json({
    status: 'ok', port: PORT, apiReady, provider: GROQ_MODEL,
    whisperReady: whisperAvailable, xttsReady: xttsAvailable,
    localLLM: brain.ollamaReady() ? brain.ollamaCurrentModel() : null,
    turns: Math.floor(history.length / 2),
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`BÖRÜ Panel → http://localhost:${PORT}`);
});
