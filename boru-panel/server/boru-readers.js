const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const TESSERACT = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe';
const TESSDATA  = path.join(__dirname, 'tessdata');
const OLLAMA_URL = 'http://127.0.0.1:11434';

const MAX = 12000;
function clip(s) { s = String(s); return s.length > MAX ? s.slice(0, MAX) + `\n…[${s.length - MAX} karakter kısaltıldı]` : s; }

// ── PDF → metin (pdftotext) ──
function readPdf(file) {
  try {
    const r = spawnSync('pdftotext', ['-enc', 'UTF-8', '-layout', file, '-'], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 30000 });
    const txt = (r.stdout || '').trim();
    return txt ? clip(txt) : '[PDF metni boş — taranmış olabilir, OCR gerekebilir]';
  } catch (e) { return '[PDF okunamadı] ' + e.message; }
}

// ── DOCX → metin (zip içinden word/document.xml) ──
function readDocx(file) {
  const ps = `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
    `$z=[System.IO.Compression.ZipFile]::OpenRead('${file.replace(/'/g, "''")}');` +
    `$e=$z.Entries|Where-Object{$_.FullName -eq 'word/document.xml'};` +
    `if($e){$r=New-Object System.IO.StreamReader($e.Open());$x=$r.ReadToEnd();$r.Close();` +
    `$x=$x -replace '</w:p>',"\`n";$x=$x -replace '<[^>]+>','';` +
    `[System.Web.HttpUtility]::HtmlDecode($x)}$z.Dispose()`;
  try {
    const r = spawnSync('powershell', ['-NoProfile', '-Command', ps], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 20000 });
    const txt = (r.stdout || '').trim();
    return txt ? clip(txt) : '[DOCX metni çıkarılamadı]';
  } catch (e) { return '[DOCX okunamadı] ' + e.message; }
}

// ── Görsel OCR (tesseract, tr+en) ──
function ocrImage(file) {
  try {
    const r = spawnSync(TESSERACT, ['--tessdata-dir', TESSDATA, file, 'stdout', '-l', 'tur+eng'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, timeout: 40000 });
    return (r.stdout || '').trim();
  } catch { return ''; }
}

// ── Görsel anlama (moondream vision, varsa) ──
let visionModel = null;
async function detectVision() {
  try {
    const r = await fetch(OLLAMA_URL + '/api/tags', { signal: AbortSignal.timeout(1500) });
    const data = await r.json();
    const m = (data.models || []).map(x => x.name).find(n => /moondream|llava|vl|vision/i.test(n));
    visionModel = m || null;
    return visionModel;
  } catch { visionModel = null; return null; }
}
detectVision();
setInterval(detectVision, 30000);

async function describeImage(file, question) {
  if (!visionModel) return '';
  try {
    const b64 = fs.readFileSync(file).toString('base64');
    const r = await fetch(OLLAMA_URL + '/api/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: visionModel, prompt: question || 'Describe this image in detail. If it contains text, transcribe it.', images: [b64], stream: false }),
      signal: AbortSignal.timeout(90000),
    });
    const data = await r.json();
    return (data.response || '').trim();
  } catch { return ''; }
}

async function readImage(file, question) {
  const ocr = ocrImage(file);
  const vis = await describeImage(file, question);
  let out = '';
  if (vis) out += '[Görsel içeriği] ' + vis + '\n';
  if (ocr) out += '[Görseldeki yazı (OCR)] ' + ocr;
  return clip(out.trim() || '[Görsel okunamadı — OCR ve vision boş döndü]');
}

const IMG = ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif'];

// ── Herhangi bir dosya → metin ──
async function readAny(file, question) {
  if (!fs.existsSync(file)) return '[dosya bulunamadı] ' + file;
  const ext = path.extname(file).toLowerCase();
  if (ext === '.pdf') return readPdf(file);
  if (ext === '.docx' || ext === '.doc') return readDocx(file);
  if (IMG.includes(ext)) return await readImage(file, question);
  // metin
  try { return clip(fs.readFileSync(file, 'utf8')); } catch (e) { return '[okunamadı] ' + e.message; }
}

function visionReady() { return !!visionModel; }

module.exports = { readAny, readPdf, readDocx, readImage, ocrImage, visionReady, IMG };
