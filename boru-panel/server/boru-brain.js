const fs   = require('fs');
const path = require('path');

const SKILLS_DIR   = 'C:\\PARS\\.claude\\skills';
const VAULT_LEARN  = 'C:\\PARS\\bilge-vault\\40-learnings';
const PLAYBOOK_FILE = path.join(VAULT_LEARN, 'playbook.md');

// ── 17 çekirdek PARS skill'i — Börü yönlendirme kataloğu ──
const SKILL_CATALOG = [
  ['00-pars-runtime',    'talebi sınıflandır, risk belirle, doğru ekibi seç'],
  ['01-planning',        'sprint, roadmap, karmaşık görevi adımlara böl, todo'],
  ['02-frontend-design', 'özgün HTML/CSS/JS frontend, generic AI görünümü yasak'],
  ['03-ui-ux-pro-max',   'mevcut arayüzü premium seviyeye çıkar, WCAG, tipografi'],
  ['04-code-review',     'çok dilli kapsamlı kod incelemesi, 4 faz'],
  ['05-owasp-security',  'OWASP Top 10, ASVS, prompt injection, secret taraması'],
  ['06-seo',             'teknik SEO audit, schema markup, GEO'],
  ['07-remotion',        'React+Remotion ile programatik video üretimi'],
  ['08-api-openapi',     'REST API tasarımı, OpenAPI 3.0 spec'],
  ['09-testing-quality', 'Vitest+Playwright test suite, kalite kapısı'],
  ['10-obsidian-bilge',  'Bilge vault okuma/yazma, Obsidian sync, bilgi grafı'],
  ['11-research-kasif',  'repo/benchmark/trend araştırması'],
  ['12-project-bootstrap','yeni proje kurulumu, CEO atama, design system'],
  ['13-voice-boru',      'ses sistemi: whisper STT, XTTS TTS'],
  ['14-mobile-flutter',  'Flutter mobil uygulama'],
  ['15-typescript-react','TypeScript + React geliştirme'],
  ['16-database-orm',    'DB şema, migration, ORM'],
  ['17-devops-cicd',     'CI/CD, deployment, release'],
];

function skillCatalogPrompt() {
  return '\n\nEmrindeki PARS skill\'leri (uygun olduğunda use_skill ile aç ve talimatını uygula):\n' +
    SKILL_CATALOG.map(([id, d]) => `- ${id}: ${d}`).join('\n');
}

function loadSkill(id) {
  const clean = String(id).replace(/[^0-9a-z-]/gi, '');
  const f = path.join(SKILLS_DIR, clean, 'SKILL.md');
  if (!fs.existsSync(f)) {
    const match = SKILL_CATALOG.find(([sid]) => sid.includes(clean) || clean.includes(sid.slice(3)));
    if (match) {
      const f2 = path.join(SKILLS_DIR, match[0], 'SKILL.md');
      if (fs.existsSync(f2)) return fs.readFileSync(f2, 'utf8').slice(0, 4000);
    }
    return `[skill bulunamadı] ${id} — geçerli id'ler: ${SKILL_CATALOG.map(s => s[0]).join(', ')}`;
  }
  return fs.readFileSync(f, 'utf8').slice(0, 4000);
}

// ── Başarı defteri (playbook) — ne işe yaradıysa kaydet, tekrar kullan ──
function recordPlaybook(intent, steps) {
  if (!steps.length) return;
  try {
    if (!fs.existsSync(VAULT_LEARN)) fs.mkdirSync(VAULT_LEARN, { recursive: true });
    if (!fs.existsSync(PLAYBOOK_FILE)) fs.writeFileSync(PLAYBOOK_FILE, '# Başarı Defteri — İşe Yarayan İş Akışları\n\n', 'utf8');
    const date = new Date().toISOString().slice(0, 10);
    const line = `- [${date}] "${intent.slice(0, 60)}" => ${steps.join(' → ').slice(0, 220)}\n`;
    fs.appendFileSync(PLAYBOOK_FILE, line, 'utf8');
  } catch {}
}

function recallPlaybook(intent) {
  try {
    if (!fs.existsSync(PLAYBOOK_FILE)) return '';
    const words = intent.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const lines = fs.readFileSync(PLAYBOOK_FILE, 'utf8').split('\n').filter(l => l.startsWith('- '));
    const scored = lines.map(l => {
      const lc = l.toLowerCase();
      return { l, score: words.filter(w => lc.includes(w)).length };
    }).filter(x => x.score >= 2).sort((a, b) => b.score - a.score).slice(0, 2);
    if (!scored.length) return '';
    return '\n[GEÇMİŞTE İŞE YARAYAN]:\n' + scored.map(x => x.l.trim()).join('\n');
  } catch { return ''; }
}

// ── Yerel LLM (Ollama) — Groq çökünce/limitte çevrimdışı yedek ──
const OLLAMA_URL   = 'http://127.0.0.1:11434';
let ollamaModel = null;

async function checkOllama() {
  try {
    const r = await fetch(OLLAMA_URL + '/api/tags', { signal: AbortSignal.timeout(1500) });
    if (!r.ok) { ollamaModel = null; return false; }
    const data = await r.json();
    const models = (data.models || []).map(m => m.name);
    ollamaModel = models.find(m => /llama3|qwen2|phi/i.test(m)) || models[0] || null;
    return !!ollamaModel;
  } catch { ollamaModel = null; return false; }
}

function ollamaReady() { return !!ollamaModel; }
function ollamaCurrentModel() { return ollamaModel; }

// Ollama düz metin yanıt (sohbet)
async function ollamaChat(messages) {
  const r = await fetch(OLLAMA_URL + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: ollamaModel, messages, stream: false, options: { temperature: 0.7 } }),
    signal: AbortSignal.timeout(90000),
  });
  const data = await r.json();
  return data.message?.content || '';
}

// Groq-biçimli mesajları Ollama'nın beklediği biçime çevir
function sanitizeForOllama(messages) {
  return messages.map(m => {
    if (m.role === 'tool') return { role: 'tool', content: 'Araç sonucu: ' + String(m.content).slice(0, 1200) };
    if (m.role === 'assistant' && m.tool_calls) {
      return {
        role: 'assistant',
        content: m.content || '',
        tool_calls: m.tool_calls.map(tc => ({
          function: {
            name: tc.function?.name,
            arguments: typeof tc.function?.arguments === 'string'
              ? (() => { try { return JSON.parse(tc.function.arguments); } catch { return {}; } })()
              : (tc.function?.arguments || {}),
          },
        })),
      };
    }
    return m;
  });
}

// Ollama araçlı çağrı — Groq formatına normalize edilmiş {ok, message:{content, tool_calls}}
async function ollamaCall(messages, tools) {
  try {
    const body = { model: ollamaModel, messages: sanitizeForOllama(messages), stream: false, options: { temperature: 0.6 } };
    if (tools) body.tools = tools;
    const r = await fetch(OLLAMA_URL + '/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: AbortSignal.timeout(120000),
    });
    if (!r.ok) return { ok: false, status: r.status };
    const data = await r.json();
    const m = data.message || {};
    // Ollama argümanı obje döner → Groq gibi string'e çevir (loop tek biçim beklesin)
    const tool_calls = (m.tool_calls || []).map((tc, i) => ({
      id: tc.id || ('oll_' + Date.now() + '_' + i),
      function: {
        name: tc.function?.name,
        arguments: typeof tc.function?.arguments === 'string'
          ? tc.function.arguments
          : JSON.stringify(tc.function?.arguments || {}),
      },
    }));
    return { ok: true, message: { content: m.content || '', tool_calls: tool_calls.length ? tool_calls : undefined } };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  }
}

module.exports = {
  skillCatalogPrompt, loadSkill,
  recordPlaybook, recallPlaybook,
  checkOllama, ollamaReady, ollamaCurrentModel, ollamaChat, ollamaCall,
};
