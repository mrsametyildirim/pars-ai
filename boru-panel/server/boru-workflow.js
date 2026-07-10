const fs   = require('fs');
const path = require('path');

// ═══════════ BÖRÜ GELİŞTİRME MOTORU ═══════════
// Sıfırdan uygulama geliştirme: PLAN → TASARIM → FRONTEND → BACKEND → DENETİM → DOĞRULAMA → ÖĞRENİM
// Her faz bağımsız uzman çağrısıdır (ephemeral). Fazlar arası hafıza DİSKTİR (BORU-PLAN.md),
// bağlam taşınmaz → minimum token. Anayasa: bilge-vault/30-systems/gelistirme-anayasasi.md

const WORKSPACE   = 'C:\\PARS\\workspace';
const VAULT       = 'C:\\PARS\\bilge-vault';
const LESSONS     = path.join(VAULT, '40-learnings', 'gelistirme-dersleri.md');
const SESSIONS    = path.join(VAULT, '50-sessions');

// ── Fable damıtması: her uzmanın paylaştığı çekirdek disiplin ──
const CORE = `
[UZMAN DİSİPLİNİ — her adımda uygula]
- ÖNCE OKU sonra yaz: dosyaya dokunmadan önce read_file ile mevcut hali gör.
- KÜÇÜK ADIM: her seferde tek dosya / tek iş. Dev tek hamle yok.
- DOĞRULA: her yazımdan sonra dosyanın oluştuğunu kontrol et (list_dir). "Yaptım" deme, teyit et.
- TOKEN EKONOMİSİ: uzun içeriği konuşmada tekrarlama; dosyaya yaz, tek cümle özet ver.
- Yorum satırı ekleme; iyi isimlendirme yeterli. Magic number yok, sabit tanımla.
- Secret/anahtar asla koda gömme. SQL parametreli. Kullanıcı girdisi doğrulanır.
- Bittiğinde SON MESAJINDA tek satır durum ver: "FAZ TAMAM: <yapılanlar>" ya da "FAZ EKSİK: <kalanlar>".`;

// ── Uzman rolleri — Fable'ın düşünce mantığı fazlara damıtıldı ──
const ROLES = {
  mimar: `[UZMAN ROLÜ: MİMAR — sistem tasarımcısı]${CORE}
Görevin: istekten üretim kalitesinde bir plan çıkarmak. Kod YAZMA, sadece plan.
1) İsteği analiz et: ne isteniyor, kim kullanacak, hangi ekranlar/özellikler.
2) Teknoloji seç: varsayılan vanilla HTML/CSS/JS (tek dosya değil, modüler). Backend GEREKLİYSE Node/Express + JSON dosya deposu; gerekmiyorsa "BACKEND: YOK" yaz.
3) Dosya ağacını belirle: index.html, assets/css/, assets/js/, (varsa server/).
4) write_file ile <PROJE>/BORU-PLAN.md dosyasını yaz. İçinde MUTLAKA şu bölümler:
# PLAN / ## Hedef / ## Ekranlar ve Özellikler / ## Teknoloji (BACKEND: VAR ya da YOK satırı)
## Dosya Ağacı / ## Kabul Kriterleri (5-8 madde, ölçülebilir) / ## Fazlara Görev Dağılımı
Kısa, keskin, uygulanabilir yaz. Süslü metin yok.`,

  tasarimci: `[UZMAN ROLÜ: TASARIMCI — premium arayüz ustası]${CORE}
Görevin: BORU-PLAN.md'yi oku, projeye özgün bir tasarım sistemi kur ve <PROJE>/design-system.md yaz.
KURALLAR (ihlal edilemez):
- MOR YASAK (purple/violet/indigo ve tüm tonları). Generic mavi-mor gradient YASAK.
- Neon glow, pulse buton, "yapay zeka ürünü" görünümü YASAK. Varsayılan Tailwind paleti YASAK.
- Zemin koyu (lacivert/siyah aile) ya da sektöre uygun açık tema; 3 renk: zemin + birincil vurgu + kritik vurgu.
- Tipografi önce: başlık 600-700 büyük, gövde 400 gri, veri etiketi monospace. Max 2 font ailesi.
- Boşluk tasarımın parçası; 8px taban ölçek. Asimetrik oranlar (3:2, 5:3) simetrik kart yığınından iyidir.
- Referans estetik: Stripe, Linear, Palantir, Vercel — sektörüne en yakın olanı seç ve yaz.
design-system.md içeriği: ## Renkler (hex + CSS değişken adları) / ## Tipografi (ölçek) / ## Spacing
## Bileşen Envanteri (ekran başına hangi bileşenler) / ## Estetik Referans + ana ekranın ASCII yerleşim taslağı.`,

  frontend: `[UZMAN ROLÜ: FRONTEND USTASI]${CORE}
Görevin: BORU-PLAN.md + design-system.md'yi OKU, frontend dosyalarını EKSIKSIZ yaz.
- HTML anlamsal (<main><section><nav>); her bileşen kendi sınıfıyla; satır içi stil yasak.
- CSS: design-system.md'deki değişkenleri :root'a koy, her renk/boşluk değişkenden gelsin. kebab-case sınıf.
- JS: modüler, her fonksiyon tek iş, olay delegasyonu, demo veri statik JS dosyasında.
- Responsive zorunlu (mobil kırılım 768px). Splash/yükleme durumu ekle.
- Çalışan, tam içerikli dosyalar yaz — iskelet/placeholder değil. Boş fonksiyon bırakma.
Sıra: önce assets/css/main.css → assets/js/data.js → assets/js/app.js → index.html. Her dosyayı write_file ile yaz, list_dir ile doğrula.`,

  backend: `[UZMAN ROLÜ: BACKEND USTASI]${CORE}
Görevin: BORU-PLAN.md'yi OKU; backend gerekiyorsa server/ altına Node/Express yaz.
- RESTful: /api/v1/<kaynak-çoğul>. GET okur, POST yazar, PUT günceller, DELETE siler.
- Hata formatı: { "error": "mesaj", "code": 400 }. Her girdi doğrulanır.
- Depo: JSON dosyası (server/data/*.json) — demo için veritabanı kurma.
- CORS'u localhost'a kısıtla, '*' bırakma. Secret env değişkeninden.
- server/index.js tek giriş; rotalar server/routes/ altında modüler.
- package.json yaz (sadece express bağımlılığı). Sonra node --check ile sözdizimini run_powershell ile doğrula.`,

  denetci: `[UZMAN ROLÜ: DENETÇİ — kalite ve güvenlik]${CORE}
Görevin: projeyi denetle ve bulduğun sorunları DÜZELT (sadece raporlama değil).
Kontrol listesi:
1) list_dir ile ağaç BORU-PLAN.md'deki ağaçla uyuşuyor mu; eksik dosya varsa YAZ.
2) index.html: CSS/JS yolları doğru mu, sayfa iskeleti tam mı.
3) CSS: mor ton var mı (#7-9 aralığı mor hexler, purple/violet) → varsa değiştir. Değişken kullanımı tutarlı mı.
4) JS: node --check ile her .js dosyasını sözdizimi kontrolünden geçir (run_powershell).
5) Güvenlik: koda gömülü secret, CORS '*', doğrulanmamış girdi → düzelt.
6) Kabul kriterlerini tek tek işaretle: hangileri sağlandı, hangileri eksik.
Bulgu formatı son mesajda: [KRİTİK]/[ÖNERİ]/[ONAY] maddeleri + FAZ TAMAM/EKSİK satırı.`,

  ogretmen: `[UZMAN ROLÜ: ÖĞRETMEN — Bilge kayıtçısı]${CORE}
Görevin: biten geliştirme akışından ders çıkarmak. Sana verilen faz özetlerini oku.
3-6 madde yaz: ne İYİ çalıştı (tekrar kullan), ne SORUN çıkardı (kaçın), bir dahaki projede ne FARKLI yapılmalı.
Kısa ve genellenebilir yaz — proje adı değil kalıp öğren. Sadece maddeleri döndür, araç kullanma.`,
};

// ── Faz tanımları ──
function phases(ws) {
  const p = (f) => path.join(ws, f);
  return [
    { id: 'plan',     rol: 'mimar',
      prompt: (brief) => `Yeni geliştirme görevi. İstek:\n"${brief}"\n\nProje klasörü: ${ws} (var, list_dir ile bak). Planı ${p('BORU-PLAN.md')} dosyasına yaz.`,
      check: () => fs.existsSync(p('BORU-PLAN.md')) },
    { id: 'tasarim',  rol: 'tasarimci',
      prompt: () => `Proje klasörü: ${ws}. Önce ${p('BORU-PLAN.md')} dosyasını oku, sonra ${p('design-system.md')} dosyasını yaz.`,
      check: () => fs.existsSync(p('design-system.md')) },
    { id: 'frontend', rol: 'frontend',
      prompt: () => `Proje klasörü: ${ws}. Önce ${p('BORU-PLAN.md')} ve ${p('design-system.md')} dosyalarını oku, sonra frontend dosyalarını yaz.`,
      check: () => fs.existsSync(p('index.html')) },
    { id: 'backend',  rol: 'backend', optional: true,
      prompt: () => `Proje klasörü: ${ws}. Önce ${p('BORU-PLAN.md')} dosyasını oku; backend'i server/ altına yaz.`,
      check: () => fs.existsSync(path.join(ws, 'server', 'index.js')),
      skipIf: () => { try { return /BACKEND:\s*YOK/i.test(fs.readFileSync(p('BORU-PLAN.md'), 'utf8')); } catch { return false; } } },
    { id: 'denetim',  rol: 'denetci',
      prompt: () => `Proje klasörü: ${ws}. Denetle ve düzelt. Plan: ${p('BORU-PLAN.md')}.`,
      check: () => true },
  ];
}

// ── Durum ──
let current = null;   // {slug, brief, ws, phase, log:[], startedAt, done, ok}
function status() { return current; }

function slugify(s) {
  const map = { 'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u' };
  return String(s).toLowerCase().replace(/[çğıöşü]/g, ch => map[ch])
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'proje';
}

// Aynı projeye farklı cümleyle dönülse de kaldığı yerden devam: kelime örtüşmesiyle mevcut klasörü bul
function findExistingWs(brief) {
  try {
    const map = { 'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u' };
    const norm = String(brief).toLowerCase().replace(/[çğıöşü]/g, ch => map[ch]).replace(/[^a-z0-9]+/g, '-');
    const words = norm.split('-').filter(w => w.length > 3);
    let best = null, bs = 0;
    for (const d of fs.readdirSync(WORKSPACE)) {
      const dw = new Set(d.split('-'));
      const s = words.filter(w => dw.has(w)).length;
      if (s >= 3 && s > bs) { bs = s; best = d; }
    }
    return best;
  } catch { return null; }
}

function recordLesson(brief, notes) {
  try {
    const dir = path.dirname(LESSONS);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(LESSONS)) fs.writeFileSync(LESSONS, '# Geliştirme Dersleri — Börü\n\n', 'utf8');
    const date = new Date().toISOString().slice(0, 10);
    fs.appendFileSync(LESSONS, `\n## [${date}] ${brief.slice(0, 70)}\n${notes.trim()}\n`, 'utf8');
  } catch {}
}

function recallLessons() {
  try {
    if (!fs.existsSync(LESSONS)) return '';
    const txt = fs.readFileSync(LESSONS, 'utf8');
    const blocks = txt.split(/\n## /).slice(1).slice(-3);
    if (!blocks.length) return '';
    return '\n\n[ÖNCEKİ PROJELERDEN DERSLER — dikkate al]:\n## ' + blocks.join('\n## ').slice(0, 1200);
  } catch { return ''; }
}

function writeSession(slug, log) {
  try {
    if (!fs.existsSync(SESSIONS)) fs.mkdirSync(SESSIONS, { recursive: true });
    const f = path.join(SESSIONS, new Date().toISOString().slice(0, 10) + '-workflow-' + slug + '.md');
    fs.writeFileSync(f, `# Geliştirme Akışı — ${slug}\n\n` + log.map(l => `- [${l.phase}] ${l.ok ? '✓' : '✗'} ${l.summary}`).join('\n') + '\n', 'utf8');
  } catch {}
}

// ── Ana akış ──
async function runWorkflow(brief, { runAgentFn, onAct = () => {} } = {}) {
  if (current && !current.done) return { ok: false, err: 'Zaten süren bir geliştirme akışı var: ' + current.slug };
  const slug = findExistingWs(brief) || slugify(brief);
  const ws = path.join(WORKSPACE, slug);
  fs.mkdirSync(ws, { recursive: true });
  current = { slug, brief, ws, phase: 'plan', log: [], startedAt: Date.now(), done: false, ok: false };
  onAct('workflow', '🏗 Geliştirme akışı başladı: ' + slug, 'run');

  const lessons = recallLessons();
  let firstPhase = true;
  for (const ph of phases(ws)) {
    if (ph.skipIf && ph.skipIf()) { onAct('workflow', '↷ ' + ph.id + ' atlandı (plana göre gerekmiyor)', 'done'); continue; }
    // kaldığı yerden devam: çıktı zaten diskte ise fazı atla (denetim hariç)
    if (ph.id !== 'denetim' && ph.check()) {
      current.log.push({ phase: ph.id, ok: true, summary: 'önceki akıştan hazır' });
      onAct('workflow', '↷ ' + ph.id + ' hazır (kaldığı yerden devam)', 'done'); continue;
    }
    if (!firstPhase) await new Promise(r => setTimeout(r, 8000));    // fazlar arası kısa nefes
    firstPhase = false;
    current.phase = ph.id;
    onAct('workflow', '▶ Faz: ' + ph.id.toUpperCase(), 'run');
    let ok = false, lastReply = '', rlWaits = 0;
    for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
      const prompt = (attempt === 1 ? ph.prompt(brief) : `Önceki deneme eksik kaldı. Proje klasörü: ${ws}. list_dir ile durumu gör, EKSİK kalanları tamamla. Görev: ${ph.prompt(brief)}`)
        + (ph.id === 'plan' ? lessons : '');
      const r = await runAgentFn(prompt, {
        ephemeral: true, forceTools: true, systemExtra: ROLES[ph.rol],
        leanSystem: true,                     // yalın sistem promptu — token ekonomisi
        providerLock: 'groq',                 // fazlar zayıf yerel modele düşmez
        excludeTools: ['start_workflow'],     // faz içinden akış tekrar tetiklenemez
        maxTokens: 3000,                      // TPM rezervi küçük kalsın (Groq max_tokens'ı limite sayar)
      });
      lastReply = (r.reply || '').slice(0, 300);
      ok = r.ok && ph.check() && !/FAZ EKSİK/i.test(r.reply || '');
      if (r.rateLimited && !ok) {
        if (r.dailyLimited) {  // günlük kota — beklemek anlamsız, görev kuyruğuna devret
          current.done = true; current.ok = false;
          onAct('workflow', '⏸ Günlük kota doldu (' + ph.id + ') — akış görev kuyruğuna devredildi, kota yenilenince kaldığı yerden sürer.', 'fail');
          writeSession(slug, current.log);
          return { ok: false, err: 'rate-limit', daily: true, phase: ph.id, ws };
        }
        if (rlWaits < 2) {  // dakikalık limit: kısa dinlen, aynı fazı yeniden dene
          rlWaits++; attempt--;
          onAct('workflow', '⏳ Limit — dinlenip ' + ph.id + ' fazına devam (' + rlWaits + '/2)', 'run');
          await new Promise(r2 => setTimeout(r2, 20000)); continue;
        }
        current.done = true; current.ok = false;
        onAct('workflow', '⏸ Limit — akış duraklatıldı (' + ph.id + '). Aynı istekle tekrar başlatılırsa kaldığı yerden devam eder.', 'fail');
        writeSession(slug, current.log);
        return { ok: false, err: 'rate-limit', phase: ph.id, ws };
      }
    }
    current.log.push({ phase: ph.id, ok, summary: lastReply.slice(0, 160) });
    onAct('workflow', (ok ? '✓ ' : '✗ ') + ph.id + ': ' + lastReply.slice(0, 90), ok ? 'done' : 'fail');
    if (!ok && ph.id !== 'denetim') { current.done = true; current.ok = false; writeSession(slug, current.log); return { ok: false, err: ph.id + ' fazı tamamlanamadı', phase: ph.id, ws }; }
  }

  // Öğrenim fazı — dersleri Bilge'ye kaydet
  current.phase = 'ogrenim';
  onAct('workflow', '▶ Faz: ÖĞRENİM (Bilge kaydı)', 'run');
  try {
    const summary = current.log.map(l => `[${l.phase}${l.ok ? ' tamam' : ' sorunlu'}] ${l.summary}`).join('\n');
    const r = await runAgentFn(`Geliştirme akışı bitti. İstek: "${brief}"\nFaz özetleri:\n${summary}\n\nDers maddelerini yaz.`,
      { ephemeral: true, systemExtra: ROLES.ogretmen });
    if (r.ok && r.reply) recordLesson(brief, r.reply);
    onAct('workflow', '✓ Dersler Bilge\'ye kaydedildi', 'done');
  } catch {}

  writeSession(slug, current.log);
  current.done = true; current.ok = true;
  onAct('workflow', '🏁 Geliştirme tamamlandı: ' + ws, 'done');
  return { ok: true, ws, slug, phases: current.log };
}

function isDevRequest(text) {
  const t = String(text).toLowerCase();
  return /\b(uygulama|site|websitesi|web sitesi|panel|dashboard|arayüz|araç|oyun|app)\b/.test(t)
      && /(yap|geliştir|oluştur|kur|inşa|hazırla|tasarla ve|yaz)/.test(t)
      && /(sıfırdan|baştan|yeni|komple|full|tam)/.test(t);
}

module.exports = { runWorkflow, status, isDevRequest, recallLessons, recordLesson, WORKSPACE };
