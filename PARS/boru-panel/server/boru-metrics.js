const fs   = require('fs');
const path = require('path');

const VAULT       = 'C:\\PARS\\bilge-vault';
const VAULT_LEARN = path.join(VAULT, '40-learnings');
const VAULT_SESS  = path.join(VAULT, '50-sessions');
const ARES_DIR    = 'C:\\PARS\\projects\\ARES';

// ── Canlı durum + metrik state ──
const startTime = Date.now();
const state = {
  actions: [],            // canlı aksiyon akışı (ring buffer)
  turns: 0,
  totalReqs: 0,
  retries: 0,             // fallback/tekrar deneme sayısı
  rateLimits: 0,          // 429 olayları
  toolCalls: 0,
  skillUsage: {},         // { '05-owasp-security': 3 }
  ttftSamples: [],        // ilk-token süreleri (ms)
  lastRateLimitAt: null,  // son token bitiş anı
  convoStartAt: null,     // kullanıcı ilk mesaj anı (bu oturum)
  rateLimitAfterMs: [],   // konuşma başından token bitişine süre
  provider: null,
  localLLM: null,
  localTurns: 0,
  cloudTurns: 0,
};

function pushAction(kind, text, status = 'run') {
  const a = { t: Date.now(), kind, text: String(text).slice(0, 160), status };
  state.actions.push(a);
  if (state.actions.length > 60) state.actions.shift();
  return a;
}
function setActionStatus(action, status) { if (action) action.status = status; }

function noteTurnStart() {
  state.totalReqs++;
  if (!state.convoStartAt) state.convoStartAt = Date.now();
}
function noteTurnEnd(ttft) {
  state.turns++;
  if (ttft) { state.ttftSamples.push(ttft); if (state.ttftSamples.length > 50) state.ttftSamples.shift(); }
}
function noteRetry()     { state.retries++; }
function noteRateLimit() {
  state.rateLimits++;
  state.lastRateLimitAt = Date.now();
  if (state.convoStartAt) state.rateLimitAfterMs.push(Date.now() - state.convoStartAt);
}
function noteTool(name) {
  state.toolCalls++;
  if (name === 'use_skill') return;
}
function noteSkill(id)   { if (id) state.skillUsage[id] = (state.skillUsage[id] || 0) + 1; }
function noteProvider(p) { if (p === 'ollama') state.localTurns++; else state.cloudTurns++; }
function setProviders(groq, local) { state.provider = groq; state.localLLM = local; }
function resetConvo()    { state.convoStartAt = null; }

function avg(arr) { return arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0; }

// 17 çekirdek skill — kullanım yüzdesi için
const CORE_SKILLS = ['00-pars-runtime','01-planning','02-frontend-design','03-ui-ux-pro-max','04-code-review','05-owasp-security','06-seo','07-remotion','08-api-openapi','09-testing-quality','10-obsidian-bilge','11-research-kasif','12-project-bootstrap','13-voice-boru','14-mobile-flutter','15-typescript-react','16-database-orm','17-devops-cicd'];

function getMetrics() {
  const usedSkills = Object.keys(state.skillUsage).length;
  const totalCalls = state.totalReqs || 1;
  return {
    uptimeMin: Math.round((Date.now() - startTime) / 60000),
    turns: state.turns,
    totalReqs: state.totalReqs,
    retries: state.retries,
    retryRate: Math.round((state.retries / totalCalls) * 100),
    rateLimits: state.rateLimits,
    toolCalls: state.toolCalls,
    avgTtft: avg(state.ttftSamples),
    skillCoverage: Math.round((usedSkills / CORE_SKILLS.length) * 100),
    skillUsage: state.skillUsage,
    topSkills: Object.entries(state.skillUsage).sort((a, b) => b[1] - a[1]).slice(0, 5),
    avgTokenBurnMin: state.rateLimitAfterMs.length ? Math.round(avg(state.rateLimitAfterMs) / 60000 * 10) / 10 : null,
    lastRateLimitAgo: state.lastRateLimitAt ? Math.round((Date.now() - state.lastRateLimitAt) / 60000) : null,
    provider: state.provider,
    localLLM: state.localLLM,
    localTurns: state.localTurns,
    cloudTurns: state.cloudTurns,
    localRatio: (state.localTurns + state.cloudTurns) ? Math.round(state.localTurns / (state.localTurns + state.cloudTurns) * 100) : 0,
  };
}

function getActions() { return state.actions.slice(-40); }

// ── Bilge / KNOWLEDGE verisi ──
function readTail(file, n, prefix) {
  try {
    const lines = fs.readFileSync(file, 'utf8').split('\n')
      .filter(l => (prefix ? l.startsWith(prefix) : l.trim()));
    return lines.slice(-n).map(l => l.replace(/^[-*]\s*/, '').trim());
  } catch { return []; }
}

function getKnowledge() {
  const sessions = (() => {
    try {
      return fs.readdirSync(VAULT_SESS).filter(f => f.endsWith('.md')).sort().slice(-3).reverse();
    } catch { return []; }
  })();
  return {
    learnings:    readTail(path.join(VAULT_LEARN, 'playbook.md'), 5),
    errors:       readTail(path.join(VAULT_LEARN, 'errors.md'), 4),
    preferences:  readTail(path.join(VAULT_LEARN, 'preferences.md'), 4),
    speechCount:  readTail(path.join(VAULT_LEARN, 'speech-samples.md'), 9999).length,
    sessions,
    voiceId: fs.existsSync('C:\\PARS\\assets\\voice\\speaker.wav') ? 'Kaya — speaker.wav kayıtlı' : 'tanımsız',
  };
}

// ── ARES verisi ──
function getAres() {
  const updates = [];
  try {
    const scan = (dir, depth) => {
      if (depth > 2) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'archive') continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) scan(full, depth + 1);
        else {
          const st = fs.statSync(full);
          updates.push({ file: full.replace(ARES_DIR + '\\', ''), mtime: st.mtimeMs });
        }
      }
    };
    scan(ARES_DIR, 0);
  } catch {}
  updates.sort((a, b) => b.mtime - a.mtime);
  const hasHtml = fs.existsSync(path.join(ARES_DIR, 'website', 'ARES.html'));
  return {
    recent: updates.slice(0, 6).map(u => ({
      file: u.file,
      ago: Math.round((Date.now() - u.mtime) / 60000),
    })),
    htmlPath: hasHtml ? 'file:///C:/PARS/projects/ARES/website/ARES.html' : null,
  };
}

module.exports = {
  pushAction, setActionStatus,
  noteTurnStart, noteTurnEnd, noteRetry, noteRateLimit, noteTool, noteSkill, noteProvider, setProviders, resetConvo,
  getMetrics, getActions, getKnowledge, getAres,
};
