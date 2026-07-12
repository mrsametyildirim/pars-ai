'use strict';

const MAX_FILES    = 10;
const MAX_BYTES    = 25 * 1024 * 1024; // 25 MB

const uploadZone   = document.getElementById('uploadZone');
const fileInput    = document.getElementById('fileInput');
const addMoreInput = document.getElementById('addMoreInput');
const addMoreWrap  = document.getElementById('addMoreWrapper');
const fileList     = document.getElementById('fileList');
const mergeBtn     = document.getElementById('mergeBtn');
const progressBar  = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const resultPanel  = document.getElementById('resultPanel');
const resultMeta   = document.getElementById('resultMeta');
const downloadLink = document.getElementById('downloadLink');
const resetBtn     = document.getElementById('resetBtn');
const uploadPrompt = document.getElementById('uploadPrompt');

let files = [];

/* ── Drag & Drop ── */
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  addFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => addFiles(fileInput.files));
addMoreInput.addEventListener('change', () => addFiles(addMoreInput.files));

/* ── File handling ── */
function addFiles(newFiles) {
  const arr = Array.from(newFiles).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
  const errors = [];

  arr.forEach(f => {
    if (files.length >= MAX_FILES) { errors.push(`Maksimum ${MAX_FILES} dosya yüklenebilir.`); return; }
    if (f.size > MAX_BYTES) { errors.push(`"${f.name}" 25 MB sınırını aşıyor.`); return; }
    if (files.find(x => x.name === f.name && x.size === f.size)) return;
    files.push(f);
  });

  if (errors.length) alert(errors[0]);
  renderList();
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function renderList() {
  fileList.innerHTML = '';

  if (files.length === 0) {
    uploadZone.classList.remove('has-files');
    uploadPrompt.style.display = '';
    addMoreWrap.style.display = 'none';
    mergeBtn.disabled = true;
    return;
  }

  uploadZone.classList.add('has-files');
  uploadPrompt.style.display = 'none';
  addMoreWrap.style.display = files.length < MAX_FILES ? 'block' : 'none';
  mergeBtn.disabled = files.length < 2;

  files.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.draggable = true;
    item.dataset.idx = i;

    // Static structure — no user content in innerHTML
    item.innerHTML = `
      <span class="file-item-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </span>
      <span class="file-item-name"></span>
      <span class="file-item-size"></span>
      <button class="file-item-remove" data-idx="${i}" title="Kaldır">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    `;

    // User-controlled data set via textContent — XSS-safe
    const nameEl = item.querySelector('.file-item-name');
    nameEl.textContent = f.name;
    nameEl.title       = f.name;
    item.querySelector('.file-item-size').textContent = formatSize(f.size);

    fileList.appendChild(item);
  });

  fileList.querySelectorAll('.file-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      files.splice(parseInt(btn.dataset.idx), 1);
      renderList();
    });
  });

  enableDragSort();
}

/* ── Drag-sort within list ── */
let dragSrc = null;

function enableDragSort() {
  const items = fileList.querySelectorAll('.file-item');
  items.forEach(item => {
    item.addEventListener('dragstart', () => { dragSrc = item; item.style.opacity = '0.4'; });
    item.addEventListener('dragend',   () => { item.style.opacity = ''; dragSrc = null; });
    item.addEventListener('dragover',  e => { e.preventDefault(); });
    item.addEventListener('drop', e => {
      e.preventDefault();
      if (!dragSrc || dragSrc === item) return;
      const fromIdx = parseInt(dragSrc.dataset.idx);
      const toIdx   = parseInt(item.dataset.idx);
      const moved   = files.splice(fromIdx, 1)[0];
      files.splice(toIdx, 0, moved);
      renderList();
    });
  });
}

/* ── Merge ── */
mergeBtn.addEventListener('click', async () => {
  if (files.length < 2) return;

  mergeBtn.disabled = true;
  progressBar.classList.add('visible');
  setProgress(5);

  try {
    const { PDFDocument } = PDFLib;
    const merged = await PDFDocument.create();
    const step = 90 / files.length;

    for (let i = 0; i < files.length; i++) {
      const buf  = await files[i].arrayBuffer();
      const doc  = await PDFDocument.load(buf);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
      setProgress(5 + (i + 1) * step);
    }

    setProgress(98);
    const pdfBytes = await merged.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);

    setProgress(100);

    const totalSize = files.reduce((s, f) => s + f.size, 0);
    resultMeta.textContent = `${files.length} dosya birleştirildi · ${formatSize(pdfBytes.byteLength)} (${formatSize(totalSize)}'dan)`;
    downloadLink.href = url;
    downloadLink.download = 'birlesik.pdf';

    setTimeout(() => {
      progressBar.classList.remove('visible');
      resultPanel.classList.add('visible');
    }, 300);

  } catch (err) {
    console.error(err);
    alert('Birleştirme sırasında hata oluştu. Dosyaların geçerli PDF olduğunu kontrol edin.');
    mergeBtn.disabled = false;
    progressBar.classList.remove('visible');
    setProgress(0);
  }
});

function setProgress(pct) {
  progressFill.style.width = pct + '%';
}

/* ── Reset ── */
resetBtn.addEventListener('click', () => {
  files = [];
  resultPanel.classList.remove('visible');
  progressBar.classList.remove('visible');
  setProgress(0);
  if (downloadLink.href.startsWith('blob:')) URL.revokeObjectURL(downloadLink.href);
  renderList();
  uploadZone.classList.remove('has-files');
  uploadPrompt.style.display = '';
});

/* ── Init ── */
renderList();
