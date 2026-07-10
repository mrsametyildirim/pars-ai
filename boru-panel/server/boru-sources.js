const fs   = require('fs');
const path = require('path');
const readers = require('./boru-readers');

const KAYNAK   = 'C:\\Users\\MSI-NB\\.claude\\claude-kaynak';
const HALLEDILEN = path.join(KAYNAK, 'halledilen', 'Börü Görevler');

const TEXT_EXT  = ['.txt', '.md', '.json', '.csv', '.log'];
const DOC_EXT   = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
const IMG_EXT   = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'];

// "görev N" klasörünü bul (Türkçe/İngilizce varyantlar); yoksa oluştur
function resolveTaskFolder(seq) {
  if (!fs.existsSync(KAYNAK)) fs.mkdirSync(KAYNAK, { recursive: true });
  const variants = [`görev ${seq}`, `gorev ${seq}`, `görev-${seq}`, `gorev-${seq}`, `görev${seq}`, `task ${seq}`, `task-${seq}`];
  let existing = null;
  try {
    const dirs = fs.readdirSync(KAYNAK, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const v of variants) {
      const hit = dirs.find(d => d.name.toLowerCase() === v.toLowerCase());
      if (hit) { existing = path.join(KAYNAK, hit.name); break; }
    }
  } catch {}
  if (existing) return { folder: existing, created: false };
  const folder = path.join(KAYNAK, `görev ${seq}`);
  fs.mkdirSync(folder, { recursive: true });
  return { folder, created: true };
}

// Klasördeki kaynakları tara — metin/PDF/Word/görsel içeriğini GERÇEKTEN okur. Prompt eki döndür.
async function scanSources(folder) {
  let files;
  try { files = fs.readdirSync(folder, { withFileTypes: true }).filter(d => d.isFile()); }
  catch { return { note: '', count: 0, files: [] }; }
  if (!files.length) return { note: '', count: 0, files: [] };

  let note = '\n\n[GÖREV KAYNAKLARI — işe başlamadan ÖNCE bunları oku ve dikkate al:]\n';
  note += `Kaynak klasörü: ${folder}\n`;
  for (const f of files) {
    const ext = path.extname(f.name).toLowerCase();
    const full = path.join(folder, f.name);
    let body = '';
    try { body = await readers.readAny(full); } catch { body = '[okunamadı]'; }
    note += `\n--- ${f.name} ---\n${String(body).slice(0, 4000)}\n`;
  }
  note += '\nBu kaynakları görmeden işe başlama.\n';
  return { note, count: files.length, files: files.map(f => f.name) };
}

// Görev bitince klasörü halledilen'e taşı (yarım kalırsa taşıMA — devamda tekrar okunsun)
function archiveTaskFolder(folder) {
  try {
    if (!folder || !fs.existsSync(folder)) return false;
    if (!fs.existsSync(HALLEDILEN)) fs.mkdirSync(HALLEDILEN, { recursive: true });
    let dest = path.join(HALLEDILEN, path.basename(folder));
    if (fs.existsSync(dest)) dest += '-' + Date.now().toString(36);
    fs.renameSync(folder, dest);
    return true;
  } catch { return false; }
}

module.exports = { resolveTaskFolder, scanSources, archiveTaskFolder, KAYNAK, HALLEDILEN };
