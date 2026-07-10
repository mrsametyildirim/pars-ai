const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const browser = require('./boru-browser');
const brain = require('./boru-brain');
const readers = require('./boru-readers');
const telegram = require('./boru-telegram');

function captureScreenFile() {
  const out = path.join(os.tmpdir(), 'boru-shot-' + Date.now() + '.png');
  const ps = `Add-Type -AssemblyName System.Windows.Forms,System.Drawing; $b=[System.Windows.Forms.Screen]::PrimaryScreen.Bounds; $bmp=New-Object System.Drawing.Bitmap $b.Width,$b.Height; $g=[System.Drawing.Graphics]::FromImage($bmp); $g.CopyFromScreen(0,0,0,0,$bmp.Size); $bmp.Save('${out.replace(/\\/g, '\\\\')}'); $g.Dispose(); $bmp.Dispose()`;
  try { spawnSync('powershell', ['-NoProfile', '-Command', ps], { timeout: 10000 }); } catch {}
  return fs.existsSync(out) ? out : null;
}

const CMD_TIMEOUT = 45000;
const MAX_OUTPUT  = 6000;
const DESKTOP_PS  = path.join(__dirname, 'boru-desktop.ps1');

function clip(s) {
  if (s.length <= MAX_OUTPUT) return s;
  return s.slice(0, MAX_OUTPUT) + `\n…[${s.length - MAX_OUTPUT} karakter kısaltıldı]`;
}

function runPowerShell(command) {
  return new Promise((resolve) => {
    const ps = spawn('powershell', ['-NoProfile', '-NonInteractive', '-Command', command], {
      windowsHide: true,
    });
    let out = '', err = '';
    const timer = setTimeout(() => { ps.kill(); err += '\n[zaman aşımı: 45s]'; }, CMD_TIMEOUT);
    ps.stdout.on('data', d => { out += d.toString(); });
    ps.stderr.on('data', d => { err += d.toString(); });
    ps.on('close', code => {
      clearTimeout(timer);
      const parts = [];
      if (out.trim()) parts.push(out.trim());
      if (err.trim()) parts.push('[stderr]\n' + err.trim());
      parts.push(`[çıkış kodu: ${code}]`);
      resolve(clip(parts.join('\n')));
    });
    ps.on('error', e => { clearTimeout(timer); resolve('[çalıştırma hatası] ' + e.message); });
  });
}

function runPsFile(args) {
  return new Promise((resolve) => {
    const ps = spawn('powershell', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', DESKTOP_PS, ...args], { windowsHide: true });
    let out = '', err = '';
    const timer = setTimeout(() => { ps.kill(); err += '\n[zaman aşımı]'; }, 20000);
    ps.stdout.on('data', d => { out += d.toString(); });
    ps.stderr.on('data', d => { err += d.toString(); });
    ps.on('close', () => { clearTimeout(timer); resolve(clip((out + (err.trim() ? '\n[stderr] ' + err : '')).trim())); });
    ps.on('error', e => { clearTimeout(timer); resolve('[hata] ' + e.message); });
  });
}

// Claude Code (VS Code) chat'ine metni pano ile yapıştır + Enter
// Claude CLI headless — görev doğrudan Claude'a verilir; pencere/odak gerekmez, sonuç metin döner
const CLAUDE_EXE = path.join(require('os').homedir(), '.local', 'bin', 'claude.exe');
function runClaudeCli(prompt) {
  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    let p;
    try {
      p = spawn(CLAUDE_EXE, ['-p', String(prompt), '--permission-mode', 'acceptEdits'], {
        cwd: 'C:\\PARS', windowsHide: true,
      });
    } catch (e) { return resolve('[claude çalıştırılamadı] ' + e.message); }
    let out = '', err = '';
    const to = setTimeout(() => { try { p.kill(); } catch {} resolve('[claude zaman aşımı 15dk]' + (out ? '\n' + out.slice(-800) : '')); }, 15 * 60000);
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', code => { clearTimeout(to); resolve(code === 0 && out.trim() ? out.trim() : '[claude hata ' + code + '] ' + (err || out).slice(0, 800)); });
    p.on('error', e => { clearTimeout(to); resolve('[claude çalıştırılamadı] ' + e.message); });
  });
}

async function pasteToClaude(text) {
  const tmp = path.join(require('os').tmpdir(), 'boru-claude-' + Date.now() + '.txt');
  try { fs.writeFileSync(tmp, String(text), 'utf8'); } catch (e) { return '[hata] geçici dosya: ' + e.message; }
  const out = await runPsFile(['-Action', 'paste', '-Match', 'Visual Studio Code', '-TextFile', tmp]);
  try { fs.unlinkSync(tmp); } catch {}
  return out;
}

async function webFetch(url) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Boru/1.0' } });
    const ct = r.headers.get('content-type') || '';
    let body = await r.text();
    if (ct.includes('html')) {
      body = body.replace(/<script[\s\S]*?<\/script>/gi, '')
                 .replace(/<style[\s\S]*?<\/style>/gi, '')
                 .replace(/<[^>]+>/g, ' ')
                 .replace(/\s+/g, ' ').trim();
    }
    return clip(`[${r.status}] ${clip(body)}`);
  } catch (e) {
    return '[fetch hatası] ' + e.message;
  }
}

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'run_powershell',
      description: 'Windows PowerShell komutu çalıştırır ve stdout/stderr/çıkış kodunu döndürür. Kod çalıştırma, npm/git/python, dosya işlemleri, süreç kontrolü için kullan. Bir uygulamayı açmak için Start-Process kullan (örn. chrome açmak: Start-Process chrome "https://...").',
      parameters: {
        type: 'object',
        properties: { command: { type: 'string', description: 'Çalıştırılacak PowerShell komutu' } },
        required: ['command'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Bir dosyanın içeriğini okur — düz metin, kod, log, PDF, Word (docx) ve GÖRSEL (png/jpg: OCR ile yazı + vision ile içerik). Kaynak neyse oku.',
      parameters: {
        type: 'object',
        properties: { file_path: { type: 'string', description: 'Okunacak dosyanın tam yolu' } },
        required: ['file_path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'read_document',
      description: 'PDF/Word/görsel bir belgeyi okur; görselde ne olduğunu belirli bir soruyla inceleyebilir. Örn: bir tasarım PNG’sine "bu arayüzde hangi butonlar var" diye sor.',
      parameters: {
        type: 'object',
        properties: {
          file_path: { type: 'string', description: 'Belgenin tam yolu (pdf/docx/png/jpg)' },
          question:  { type: 'string', description: 'Görsel için opsiyonel soru (ne aradığın)' },
        },
        required: ['file_path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Bir dosyaya içerik yazar (varsa üzerine yazar, yoksa oluşturur). Kod yazmak/güncellemek için.',
      parameters: {
        type: 'object',
        properties: {
          file_path: { type: 'string', description: 'Yazılacak dosyanın tam yolu' },
          content:   { type: 'string', description: 'Dosyaya yazılacak tam içerik' },
        },
        required: ['file_path', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_dir',
      description: 'Bir klasördeki dosya ve alt klasörleri listeler.',
      parameters: {
        type: 'object',
        properties: { dir_path: { type: 'string', description: 'Listelenecek klasörün tam yolu' } },
        required: ['dir_path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_open',
      description: 'Kontrol edilebilir tarayıcıda (Chrome) bir URL açar. Bu tarayıcıda SONRA tıklama/yazma yapabilirsin. YouTube, YouTube Music, web sitesi, arama için bunu kullan — open_url değil. Örn müzik: https://music.youtube.com/search?q=ezhel+geceler',
      parameters: {
        type: 'object',
        properties: { url: { type: 'string', description: 'Açılacak URL' } },
        required: ['url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_look',
      description: 'Açık tarayıcı sayfasındaki tıklanabilir/yazılabilir öğeleri (buton, link, arama kutusu, şarkı) listeler. Tıklamadan ÖNCE bunu çağır ki doğru metni bilesin.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_click',
      description: 'Tarayıcı sayfasında görünür bir öğeye tıklar (buton metni, link, şarkı adı, "Play"/"Oynat"). browser_look ile gördüğün metni ver.',
      parameters: {
        type: 'object',
        properties: { target: { type: 'string', description: 'Tıklanacak öğenin görünen metni veya aria-label' } },
        required: ['target'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_type',
      description: 'Tarayıcıdaki arama/metin kutusuna yazar. submit=true ise Enter’a basar (arama yapar).',
      parameters: {
        type: 'object',
        properties: {
          text:   { type: 'string', description: 'Yazılacak metin' },
          submit: { type: 'boolean', description: 'Enter’a basılsın mı' },
        },
        required: ['text'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_tabs',
      description: 'Açık tarayıcı sekmelerini listeler (numara, başlık, adres). Sekmeler arasında gezinmek için önce bunu çağır.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_switch_tab',
      description: 'Belirli bir tarayıcı sekmesine geçer (browser_tabs’ten gelen numara).',
      parameters: {
        type: 'object',
        properties: { index: { type: 'number', description: 'Sekme numarası' } },
        required: ['index'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_telegram',
      description: 'Telegram grubuna mesaj gönderir. Kullanıcıya bildirim/haber vermek için.',
      parameters: {
        type: 'object',
        properties: { text: { type: 'string', description: 'Gönderilecek mesaj' } },
        required: ['text'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'screenshot_telegram',
      description: 'Ekran görüntüsü alıp Telegram grubuna gönderir. Kullanıcı "ekranı gönder/göster" derse veya bir işi görsel kanıtlamak gerekince.',
      parameters: {
        type: 'object',
        properties: { caption: { type: 'string', description: 'Görselin açıklaması' } },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browser_key',
      description: 'Tarayıcı sayfasında bir klavye tuşuna basar. YouTube’da oynat/duraklat için "k", ileri için "l". Örn: k, Enter, ArrowRight.',
      parameters: {
        type: 'object',
        properties: { key: { type: 'string', description: 'Tuş adı (k, Enter, Space, ArrowRight)' } },
        required: ['key'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'desktop_apps',
      description: 'Şu an açık olan masaüstü pencerelerini (uygulama + başlık) listeler. Bir uygulamaya tuş göndermeden önce açık mı gör.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'desktop_keys',
      description: 'Açık bir masaüstü uygulamasını öne getirip klavye tuşları gönderir. Hesap makinesinde işlem yapmak, Not Defteri’ne yazmak için. Örn hesap makinesi 24*454256: match="Hesap", keys="24*454256=". SendKeys formatı: rakam/işlem düz; Enter için {ENTER}, = için =.',
      parameters: {
        type: 'object',
        properties: {
          match: { type: 'string', description: 'Pencere/uygulama adının bir kısmı (Hesap, Calculator, Not Defteri, Notepad)' },
          keys:  { type: 'string', description: 'Gönderilecek tuşlar (SendKeys formatı)' },
        },
        required: ['match', 'keys'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'use_skill',
      description: 'Bir PARS skill\'inin talimatını yükler ve onu takip edersin. Uzman bir işte (kod incelemesi, güvenlik denetimi, UI tasarımı, planlama, araştırma, API, test) doğru skill\'i aç. id örn: 04-code-review, 05-owasp-security, 03-ui-ux-pro-max, 01-planning.',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string', description: 'Skill id (örn 04-code-review)' } },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'launch_app',
      description: 'Bir masaüstü uygulamasını başlatır (hesap makinesi=calc, not defteri=notepad, paint=mspaint). Sonra desktop_apps ile açıldığını doğrula.',
      parameters: {
        type: 'object',
        properties: { app: { type: 'string', description: 'Uygulama komutu: calc, notepad, mspaint, explorer' } },
        required: ['app'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'web_fetch',
      description: 'İnternetten bir sayfa/API çeker ve metin içeriğini döndürür. Araştırma, güncel bilgi, dokümantasyon için.',
      parameters: {
        type: 'object',
        properties: { url: { type: 'string', description: 'Çekilecek URL' } },
        required: ['url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_process',
      description: 'Belirli bir sürecin (uygulamanın) çalışıp çalışmadığını kontrol eder. Bir şeyi açtıktan sonra gerçekten açıldığını doğrulamak için.',
      parameters: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Süreç adı, örn chrome, node, python' } },
        required: ['name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'start_workflow',
      description: 'Sıfırdan uygulama/site/panel geliştirme akışını başlatır: PLAN → TASARIM → FRONTEND → BACKEND → DENETİM → ÖĞRENİM fazlarını uzman rollerle arka planda yürütür. Kullanıcı "sıfırdan/yeni bir uygulama-site-panel yap/geliştir" dediğinde BUNU kullan; tek tek dosya yazmaya kalkma.',
      parameters: {
        type: 'object',
        properties: { brief: { type: 'string', description: 'Geliştirilecek şeyin tam tarifi (ne, kimin için, hangi özellikler)' } },
        required: ['brief'],
      },
    },
  },
];

// Workflow motoru server.js tarafından enjekte edilir (dairesel bağımlılık önlenir)
let workflowStarter = null;
function registerWorkflow(fn) { workflowStarter = fn; }

async function execTool(name, args) {
  try {
    switch (name) {
      case 'run_powershell':
        return await runPowerShell(args.command || '');
      case 'read_file':
        return await readers.readAny(args.file_path);
      case 'read_document':
        return await readers.readAny(args.file_path, args.question);
      case 'write_file': {
        const p = args.file_path;
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.writeFileSync(p, args.content ?? '', 'utf8');
        return `[yazıldı] ${p} (${(args.content ?? '').length} karakter)`;
      }
      case 'list_dir': {
        const p = args.dir_path;
        if (!fs.existsSync(p)) return `[klasör bulunamadı] ${p}`;
        const items = fs.readdirSync(p, { withFileTypes: true })
          .map(d => (d.isDirectory() ? '📁 ' : '📄 ') + d.name);
        return clip(items.join('\n') || '[boş]');
      }
      case 'browser_open':
        return await browser.goto(args.url || '');
      case 'browser_look':
        return await browser.snapshot();
      case 'browser_click':
        return await browser.click(args.target || '');
      case 'browser_type':
        return await browser.type(args.text || '', !!args.submit);
      case 'browser_key':
        return await browser.press(args.key || 'Enter');
      case 'browser_tabs':
        return await browser.listTabs();
      case 'browser_switch_tab':
        return await browser.switchTab(args.index ?? 0);
      case 'send_telegram': {
        const ok = await telegram.sendMessage(args.text || '');
        return ok ? '[Telegram’a gönderildi]' : '[Telegram kapalı ya da gönderilemedi]';
      }
      case 'screenshot_telegram': {
        const shot = captureScreenFile();
        if (!shot) return '[ekran görüntüsü alınamadı]';
        const ok = await telegram.sendFile(shot, args.caption || 'Ekran görüntüsü');
        try { fs.unlinkSync(shot); } catch {}
        return ok ? '[ekran görüntüsü Telegram’a gönderildi]' : '[Telegram kapalı — gönderilemedi]';
      }
      case 'use_skill':
        return brain.loadSkill(args.id || '');
      case 'start_workflow': {
        if (!workflowStarter) return '[geliştirme motoru hazır değil]';
        const brief = String(args.brief || '').trim();
        if (brief.length < 10) return '[eksik tarif — brief en az bir cümle olmalı]';
        workflowStarter(brief);   // arka planda koşar, beklenmez
        return '[geliştirme akışı başlatıldı] Fazlar arka planda ilerliyor: PLAN → TASARIM → FRONTEND → BACKEND → DENETİM → ÖĞRENİM. İlerleme aksiyon akışında görünecek. Kullanıcıya akışın başladığını ve bitince haber verileceğini söyle.';
      }
      case 'desktop_apps':
        return await runPsFile(['-Action', 'list']);
      case 'desktop_keys':
        return await runPsFile(['-Action', 'keys', '-Match', args.match || '', '-Keys', args.keys || '']);
      case 'launch_app': {
        const app = (args.app || '').replace(/[^a-z0-9_.-]/gi, '');
        await runPowerShell(`Start-Process ${app}`);
        await new Promise(r => setTimeout(r, 2800));
        const list = await runPsFile(['-Action', 'list']);
        return `[başlatıldı] ${app} — pencere hazır\n[açık pencereler]\n${list}`;
      }
      case 'web_fetch':
        return await webFetch(args.url || '');
      case 'check_process': {
        const out = await runPowerShell(
          `Get-Process ${args.name} -ErrorAction SilentlyContinue | Select-Object ProcessName,Id | Format-Table -HideTableHeaders | Out-String`
        );
        return out.trim() && !out.includes('çıkış kodu: 1') && out.replace(/\[.*?\]/g, '').trim()
          ? `[çalışıyor] ${args.name}\n${out}`
          : `[çalışmıyor] ${args.name} süreci bulunamadı`;
      }
      default:
        return `[bilinmeyen araç] ${name}`;
    }
  } catch (e) {
    return `[araç hatası: ${name}] ${e.message}`;
  }
}

const STEP_LABELS = {
  start_workflow: a => '🏗 Geliştirme akışı: ' + (a.brief || '').slice(0, 60),
  run_powershell: a => 'Terminal: ' + (a.command || '').slice(0, 50),
  read_file:      a => 'Okuyor: ' + (a.file_path || ''),
  read_document:  a => 'Belge okuyor: ' + (a.file_path || ''),
  write_file:     a => 'Yazıyor: ' + (a.file_path || ''),
  list_dir:       a => 'Listeliyor: ' + (a.dir_path || ''),
  web_fetch:      a => 'İnternet: ' + (a.url || ''),
  check_process:  a => 'Kontrol: ' + (a.name || '') + ' süreci',
  browser_open:   a => 'Tarayıcı: ' + (a.url || ''),
  browser_look:   () => 'Sayfaya bakıyor',
  browser_click:  a => 'Tıklıyor: ' + (a.target || ''),
  browser_type:   a => 'Yazıyor: ' + (a.text || '').slice(0, 40),
  browser_key:    a => 'Tuş: ' + (a.key || ''),
  browser_tabs:   () => 'Sekmelere bakıyor',
  browser_switch_tab: a => 'Sekme ' + (a.index ?? 0) + '’e geçiyor',
  send_telegram:  () => 'Telegram’a yazıyor',
  screenshot_telegram: () => 'Ekran görüntüsü Telegram’a',
  use_skill:      a => 'Skill: ' + (a.id || ''),
  desktop_apps:   () => 'Açık pencerelere bakıyor',
  desktop_keys:   a => (a.match || '') + ': ' + (a.keys || '').slice(0, 40),
  launch_app:     a => 'Başlatıyor: ' + (a.app || ''),
};
function stepLabel(name, args) {
  return (STEP_LABELS[name] || (() => name))(args);
}

module.exports = { TOOLS, execTool, stepLabel, pasteToClaude, runClaudeCli, registerWorkflow };
