const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'tasks.json');

// Görev: { id, title, prompt, status, target, priority, seq, createdAt, runAt, intervalHours, order, startedAt, finishedAt, result, attempts, sourceFolder }
// status: queued | running | done | failed  |  target: boru | claude  |  priority: 1|2|3
let state = { tasks: [], cooldownUntil: 0, autoRun: true, taskCounter: 0 };

function load() {
  try { state = Object.assign(state, JSON.parse(fs.readFileSync(FILE, 'utf8'))); } catch {}
  // Sunucu çökmesinden kalan "running" görev → yarım kalmış say, başa al
  for (const t of state.tasks) if (t.status === 'running') { t.status = 'queued'; t.interrupted = true; }
}
function save() { try { fs.writeFileSync(FILE, JSON.stringify(state, null, 2), 'utf8'); } catch {} }
load();

function list() {
  const sorted = [...state.tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
  return {
    queued:  sorted.filter(t => t.status === 'queued'),
    running: sorted.find(t => t.status === 'running') || null,
    done:    [...state.tasks].filter(t => t.status === 'done' || t.status === 'failed').sort((a, b) => (b.finishedAt || 0) - (a.finishedAt || 0)).slice(0, 25),
    cooldownUntil: state.cooldownUntil,
    autoRun: state.autoRun,
  };
}

function add({ title, prompt, runAt, target, priority, intervalHours }) {
  const maxOrder = state.tasks.reduce((m, t) => Math.max(m, t.order || 0), 0);
  const seq = ++state.taskCounter; // toplam görev sayacı → "görev N" klasörü
  const t = {
    id: 'T' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    title: (title || prompt || '').slice(0, 80),
    prompt: prompt || title || '',
    status: 'queued',
    target: target === 'claude' ? 'claude' : 'boru',
    priority: [1, 2, 3].includes(Number(priority)) ? Number(priority) : 2,
    seq,
    createdAt: Date.now(),
    runAt: runAt || null,       // null → hemen sıraya; timestamp → o zamandan sonra
    intervalHours: intervalHours ? Number(intervalHours) : 0, // her N saatte tekrar (Claude Code limit döngüsü)
    order: maxOrder + 1,
    attempts: 0,
  };
  state.tasks.push(t); save();
  return t;
}

function remove(id) { state.tasks = state.tasks.filter(t => t.id !== id); save(); }

// Sonradan görev isteğini/hedefini/önceliğini değiştir
function update(id, fields) {
  const t = state.tasks.find(x => x.id === id);
  if (!t) return null;
  if (fields.prompt != null)   { t.prompt = fields.prompt; t.title = fields.prompt.slice(0, 80); }
  if (fields.target != null)   t.target = fields.target === 'claude' ? 'claude' : 'boru';
  if (fields.priority != null && [1,2,3].includes(Number(fields.priority))) t.priority = Number(fields.priority);
  if (fields.delayHours != null) t.runAt = Number(fields.delayHours) ? Date.now() + Number(fields.delayHours) * 3600000 : null;
  if (fields.intervalHours != null) t.intervalHours = Number(fields.intervalHours) || 0;
  save(); return t;
}

function reorder(ids) {
  ids.forEach((id, i) => { const t = state.tasks.find(x => x.id === id); if (t) t.order = i + 1; });
  save();
}

function setStatus(id, status, extra = {}) {
  const t = state.tasks.find(x => x.id === id);
  if (!t) return;
  t.status = status;
  Object.assign(t, extra);
  save();
}

function clearDone() { state.tasks = state.tasks.filter(t => t.status !== 'done' && t.status !== 'failed'); save(); }

// Şu an çalıştırılabilir bir görev var mı? (cooldown + zamanlama + sıra)
function nextRunnable(now = Date.now()) {
  if (!state.autoRun) return null;
  if (state.cooldownUntil && now < state.cooldownUntil) return null;
  if (state.tasks.some(t => t.status === 'running')) return null;
  const ready = state.tasks
    .filter(t => t.status === 'queued' && (!t.runAt || t.runAt <= now))
    .sort((a, b) => {
      // yarım kalmış (interrupted) her zaman önce
      if (a.interrupted && !b.interrupted) return -1;
      if (!a.interrupted && b.interrupted) return 1;
      // sonra öncelik (P1 < P2 < P3), sonra sıra
      if ((a.priority || 2) !== (b.priority || 2)) return (a.priority || 2) - (b.priority || 2);
      return (a.order || 0) - (b.order || 0);
    });
  return ready[0] || null;
}

function setCooldown(hours) { state.cooldownUntil = Date.now() + hours * 3600 * 1000; save(); }
function clearCooldown()    { state.cooldownUntil = 0; save(); }
function setAutoRun(on)     { state.autoRun = !!on; save(); }
function getState()         { return state; }

module.exports = {
  list, add, update, remove, reorder, setStatus, clearDone,
  nextRunnable, setCooldown, clearCooldown, setAutoRun, getState,
};
