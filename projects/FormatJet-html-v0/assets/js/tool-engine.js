'use strict';

/* ══════════════════════════════════════════════════════════
   FormatJet Tool Engine — tarayıcı içi gerçek dosya işleme
   pdf-lib · pdfjs · canvas · heic2any · mammoth · xlsx ·
   jspdf · jszip · tesseract.js · ffmpeg.wasm
══════════════════════════════════════════════════════════ */

(function () {
  const VENDOR = '../assets/js/vendor/';
  const ASSETS = '../assets/vendor/';

  /* ── Script yükleyici ── */
  const loaded = {};
  function loadScript(src) {
    if (loaded[src]) return loaded[src];
    loaded[src] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Yüklenemedi: ' + src));
      document.head.appendChild(s);
    });
    return loaded[src];
  }

  /* ── Yardımcılar ── */
  const readBuf  = (f) => f.arrayBuffer();
  const readText = (f) => f.text();

  function baseName(f) { return f.name.replace(/\.[^.]+$/, ''); }
  function trSafe(s) {
    const map = { 'ğ':'g','Ğ':'G','ş':'s','Ş':'S','ı':'i','İ':'I','ç':'c','Ç':'C','ö':'o','Ö':'O','ü':'u','Ü':'U' };
    return s.replace(/[ğĞşŞıİçÇöÖüÜ]/g, (c) => map[c] || c);
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function zipResults(results, zipName) {
    await loadScript(VENDOR + 'jszip.min.js');
    const zip = new JSZip();
    results.forEach(r => zip.file(r.name, r.blob));
    const blob = await zip.generateAsync({ type: 'blob' });
    return { name: zipName, blob };
  }

  async function imageFromFile(file) {
    let blob = file;
    const isHeic = /\.hei[cf]$/i.test(file.name);
    if (isHeic) {
      await loadScript(VENDOR + 'heic2any.min.js');
      blob = await heic2any({ blob: file, toType: 'image/png' });
      if (Array.isArray(blob)) blob = blob[0];
    }
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error(file.name + ' okunamadı')); img.src = url; });
      return img;
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  }

  function canvasOf(img, w, h) {
    const c = document.createElement('canvas');
    c.width = w || img.naturalWidth || img.width;
    c.height = h || img.naturalHeight || img.height;
    return c;
  }

  function canvasBlob(c, type, quality) {
    return new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error('Dönüştürme başarısız')), type, quality));
  }

  const MIME = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

  /* ── pdf-lib / pdfjs / ffmpeg yükleyiciler ── */
  async function pdfLib(encrypted) {
    await loadScript(VENDOR + (encrypted ? 'cantoo-pdf-lib.min.js' : 'pdf-lib.min.js'));
    return window.PDFLib;
  }

  async function pdfJs() {
    await loadScript(VENDOR + 'pdfjs.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = VENDOR + 'pdfjs.worker.min.js';
    return window.pdfjsLib;
  }

  let _ffmpeg = null;
  async function ffmpeg(onProgress) {
    if (_ffmpeg) return _ffmpeg;
    setStatus('FFmpeg çekirdeği yükleniyor (~31 MB, tek seferlik)...');
    await loadScript(VENDOR + 'ffmpeg.js');
    await loadScript(VENDOR + 'ffmpeg-util.js');
    const inst = new FFmpegWASM.FFmpeg();
    inst.on('progress', ({ progress }) => {
      if (onProgress && progress >= 0 && progress <= 1) onProgress(progress);
    });
    await inst.load({
      coreURL: new URL(ASSETS + 'ffmpeg/ffmpeg-core.js', location.href).href,
      wasmURL: new URL(ASSETS + 'ffmpeg/ffmpeg-core.wasm', location.href).href,
    });
    _ffmpeg = inst;
    return inst;
  }

  async function ffRun(files, args, outName, outMime, onProgress) {
    const ff = await ffmpeg(onProgress);
    const { fetchFile } = FFmpegUtil;
    for (const f of files) await ff.writeFile(f.vname, await fetchFile(f.file));
    await ff.exec(args);
    const data = await ff.readFile(outName);
    for (const f of files) { try { await ff.deleteFile(f.vname); } catch (_) {} }
    try { await ff.deleteFile(outName); } catch (_) {}
    return { name: outName, blob: new Blob([data.buffer], { type: outMime }) };
  }

  function ext(f) { return f.name.split('.').pop().toLowerCase(); }
  function vname(f, i) { return 'in' + i + '.' + ext(f); }

  /* ── jsPDF metin sayfalayıcı ── */
  async function textToPdf(text, title) {
    await loadScript(VENDOR + 'jspdf.umd.min.js');
    const doc = new jspdf.jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 48, lineH = 16, pageH = doc.internal.pageSize.getHeight();
    const lines = doc.splitTextToSize(trSafe(text), doc.internal.pageSize.getWidth() - margin * 2);
    doc.setFont('helvetica'); doc.setFontSize(11);
    let y = margin;
    for (const line of lines) {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += lineH;
    }
    return { name: trSafe(title) + '.pdf', blob: doc.output('blob') };
  }

  /* ── DOCX üretici (minimal OOXML) ── */
  async function textToDocx(text, title) {
    await loadScript(VENDOR + 'jszip.min.js');
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const paras = text.split(/\r?\n/).map(p =>
      '<w:p><w:r><w:t xml:space="preserve">' + esc(p) + '</w:t></w:r></w:p>').join('');
    const zip = new JSZip();
    zip.file('[Content_Types].xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
    zip.file('_rels/.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
    zip.file('word/document.xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
      paras + '</w:body></w:document>');
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    return { name: title + '.docx', blob };
  }

  /* ── PDF metin çıkarma (pdfjs) ── */
  async function pdfText(file) {
    const lib = await pdfJs();
    const doc = await lib.getDocument({ data: await readBuf(file) }).promise;
    let out = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const tc = await page.getTextContent();
      out.push(tc.items.map(it => it.str).join(' '));
    }
    return out.join('\n\n');
  }

  /* ── Sayfa aralığı çözümleyici: "1,3,5-8" ── */
  function parseRange(str, max) {
    if (!str || !str.trim()) return Array.from({ length: max }, (_, i) => i);
    const out = [];
    for (const part of str.split(',')) {
      const m = part.trim().match(/^(\d+)(?:-(\d+))?$/);
      if (!m) continue;
      const a = +m[1], b = m[2] ? +m[2] : a;
      for (let i = a; i <= b && i <= max; i++) if (i >= 1) out.push(i - 1);
    }
    return out.length ? out : Array.from({ length: max }, (_, i) => i);
  }

  /* ══════════════════ İŞLEMLER ══════════════════ */

  const OPS = {

    /* ── Görsel ── */
    async 'image-convert'(files, o, t) {
      const results = [];
      for (const f of files) {
        const img = await imageFromFile(f);
        let w = img.naturalWidth, h = img.naturalHeight;
        if (o.width && /svg/i.test(f.type + f.name)) { const r = o.width / w; w = +o.width; h = Math.round(h * r); }
        const c = canvasOf(img, w, h);
        const ctx = c.getContext('2d');
        if (t.target === 'jpg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
        results.push({ name: baseName(f) + '.' + t.target, blob: await canvasBlob(c, MIME[t.target], 0.92) });
      }
      return results;
    },

    async 'image-compress'(files, o) {
      const results = [];
      for (const f of files) {
        const img = await imageFromFile(f);
        const c = canvasOf(img);
        c.getContext('2d').drawImage(img, 0, 0);
        const type = f.type === 'image/png' ? 'image/webp' : (f.type || 'image/jpeg');
        const e = type === 'image/webp' ? 'webp' : (type === 'image/png' ? 'png' : 'jpg');
        results.push({ name: baseName(f) + '-kucuk.' + e, blob: await canvasBlob(c, type, o.quality / 100) });
      }
      return results;
    },

    async 'image-resize'(files, o) {
      if (!o.width && !o.height) throw new Error('Genişlik veya yükseklik gir.');
      const results = [];
      for (const f of files) {
        const img = await imageFromFile(f);
        let w = +o.width || 0, h = +o.height || 0;
        if (!w) w = Math.round(img.naturalWidth * (h / img.naturalHeight));
        if (!h) h = Math.round(img.naturalHeight * (w / img.naturalWidth));
        const c = canvasOf(img, w, h);
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        results.push({ name: baseName(f) + '-' + w + 'x' + h + '.' + (ext(f) === 'png' ? 'png' : 'jpg'), blob: await canvasBlob(c, f.type || 'image/jpeg', 0.92) });
      }
      return results;
    },

    async 'image-rotate'(files, o) {
      const a = +o.angle;
      const results = [];
      for (const f of files) {
        const img = await imageFromFile(f);
        const swap = a === 90 || a === 270;
        const c = canvasOf(img, swap ? img.naturalHeight : img.naturalWidth, swap ? img.naturalWidth : img.naturalHeight);
        const ctx = c.getContext('2d');
        ctx.translate(c.width / 2, c.height / 2);
        ctx.rotate(a * Math.PI / 180);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        results.push({ name: baseName(f) + '-dondu.' + ext(f), blob: await canvasBlob(c, f.type || 'image/png', 0.92) });
      }
      return results;
    },

    async 'image-crop'(files, o) {
      const f = files[0];
      const img = await imageFromFile(f);
      const w = +o.w || img.naturalWidth, h = +o.h || img.naturalHeight;
      const c = canvasOf(null, w, h);
      c.getContext('2d').drawImage(img, +o.x || 0, +o.y || 0, w, h, 0, 0, w, h);
      return [{ name: baseName(f) + '-kirp.' + ext(f), blob: await canvasBlob(c, f.type || 'image/png', 0.92) }];
    },

    async 'image-watermark'(files, o) {
      const results = [];
      for (const f of files) {
        const img = await imageFromFile(f);
        const c = canvasOf(img);
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const size = Math.max(18, Math.round(c.width / 24));
        ctx.font = '700 ' + size + 'px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 2;
        const text = o.text || 'FormatJet';
        if (o.pos === 'center') {
          ctx.save();
          ctx.translate(c.width / 2, c.height / 2);
          ctx.rotate(-Math.PI / 6);
          ctx.textAlign = 'center';
          ctx.strokeText(text, 0, 0); ctx.fillText(text, 0, 0);
          ctx.restore();
        } else {
          const m = size;
          const x = o.pos === 'tl' ? m : c.width - m;
          const y = o.pos === 'tl' ? m + size : c.height - m;
          ctx.textAlign = o.pos === 'tl' ? 'left' : 'right';
          ctx.strokeText(text, x, y); ctx.fillText(text, x, y);
        }
        results.push({ name: baseName(f) + '-filigran.' + ext(f), blob: await canvasBlob(c, f.type || 'image/png', 0.92) });
      }
      return results;
    },

    async 'image-adjust'(files, o) {
      const f = files[0];
      const img = await imageFromFile(f);
      const c = canvasOf(img);
      const ctx = c.getContext('2d');
      ctx.filter = 'brightness(' + o.brightness + '%) contrast(' + o.contrast + '%) saturate(' + o.saturate + '%)';
      ctx.drawImage(img, 0, 0);
      return [{ name: baseName(f) + '-renk.' + ext(f), blob: await canvasBlob(c, f.type || 'image/jpeg', 0.92) }];
    },

    async 'image-sharpen'(files, o) {
      const f = files[0];
      const img = await imageFromFile(f);
      const c = canvasOf(img);
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const w = c.width, h = c.height;
      const src = ctx.getImageData(0, 0, w, h);
      const dst = ctx.createImageData(w, h);
      const k = +o.amount * 0.25;
      const kern = [0, -k, 0, -k, 1 + 4 * k, -k, 0, -k, 0];
      const s = src.data, d = dst.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          for (let ch = 0; ch < 3; ch++) {
            let v = 0, ki = 0;
            for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++) {
              const px = Math.min(w - 1, Math.max(0, x + kx));
              const py = Math.min(h - 1, Math.max(0, y + ky));
              v += s[(py * w + px) * 4 + ch] * kern[ki++];
            }
            d[(y * w + x) * 4 + ch] = Math.min(255, Math.max(0, v));
          }
          d[(y * w + x) * 4 + 3] = s[(y * w + x) * 4 + 3];
        }
      }
      ctx.putImageData(dst, 0, 0);
      return [{ name: baseName(f) + '-keskin.' + ext(f), blob: await canvasBlob(c, f.type || 'image/jpeg', 0.92) }];
    },

    async 'heic-convert'(files, o) {
      await loadScript(VENDOR + 'heic2any.min.js');
      const results = [];
      for (const f of files) {
        let blob = await heic2any({ blob: f, toType: 'image/jpeg', quality: (o.quality || 92) / 100 });
        if (Array.isArray(blob)) blob = blob[0];
        results.push({ name: baseName(f) + '.jpg', blob });
      }
      return results;
    },

    async 'images-to-pdf'(files) {
      const { PDFDocument } = await pdfLib();
      const doc = await PDFDocument.create();
      for (const f of files) {
        const img = await imageFromFile(f);
        const c = canvasOf(img);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0);
        const jpg = await canvasBlob(c, 'image/jpeg', 0.92);
        const embedded = await doc.embedJpg(await jpg.arrayBuffer());
        const page = doc.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
      }
      return [{ name: 'gorseller.pdf', blob: new Blob([await doc.save()], { type: 'application/pdf' }) }];
    },

    async 'bg-remove'(files) {
      setStatus('AI modeli yükleniyor (ilk kullanımda ~40 MB indirilir)...');
      const mod = await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm');
      const blob = await mod.removeBackground(files[0], {
        progress: (key, cur, total) => setStatus('İşleniyor: ' + key + ' ' + Math.round(cur / total * 100) + '%'),
      });
      return [{ name: baseName(files[0]) + '-seffaf.png', blob }];
    },

    /* ── PDF ── */
    async 'pdf-merge'(files) {
      const { PDFDocument } = await pdfLib();
      const out = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await readBuf(f), { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach(p => out.addPage(p));
      }
      return [{ name: 'birlesik.pdf', blob: new Blob([await out.save()], { type: 'application/pdf' }) }];
    },

    async 'pdf-split'(files) {
      const { PDFDocument } = await pdfLib();
      const src = await PDFDocument.load(await readBuf(files[0]), { ignoreEncryption: true });
      const results = [];
      for (let i = 0; i < src.getPageCount(); i++) {
        const doc = await PDFDocument.create();
        const [p] = await doc.copyPages(src, [i]);
        doc.addPage(p);
        results.push({ name: baseName(files[0]) + '-sayfa-' + (i + 1) + '.pdf', blob: new Blob([await doc.save()], { type: 'application/pdf' }) });
      }
      return results;
    },

    async 'pdf-compress'(files) {
      const { PDFDocument } = await pdfLib();
      const src = await PDFDocument.load(await readBuf(files[0]), { ignoreEncryption: true });
      const bytes = await src.save({ useObjectStreams: true });
      return [{ name: baseName(files[0]) + '-kucuk.pdf', blob: new Blob([bytes], { type: 'application/pdf' }) }];
    },

    async 'pdf-rotate'(files, o) {
      const PL = await pdfLib();
      const src = await PL.PDFDocument.load(await readBuf(files[0]), { ignoreEncryption: true });
      src.getPages().forEach(p => p.setRotation(PL.degrees((p.getRotation().angle + +o.angle) % 360)));
      return [{ name: baseName(files[0]) + '-dondu.pdf', blob: new Blob([await src.save()], { type: 'application/pdf' }) }];
    },

    async 'pdf-extract'(files, o) {
      const { PDFDocument } = await pdfLib();
      const src = await PDFDocument.load(await readBuf(files[0]), { ignoreEncryption: true });
      const idx = parseRange(o.pages, src.getPageCount());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, idx);
      pages.forEach(p => out.addPage(p));
      return [{ name: baseName(files[0]) + '-duzenli.pdf', blob: new Blob([await out.save()], { type: 'application/pdf' }) }];
    },

    async 'pdf-watermark'(files, o) {
      const PL = await pdfLib();
      const src = await PL.PDFDocument.load(await readBuf(files[0]), { ignoreEncryption: true });
      const font = await src.embedFont(PL.StandardFonts.HelveticaBold);
      const text = trSafe(o.text || 'FormatJet');
      src.getPages().forEach(page => {
        const { width, height } = page.getSize();
        const size = Math.min(width, height) / 8;
        page.drawText(text, {
          x: width / 2 - font.widthOfTextAtSize(text, size) / 2,
          y: height / 2,
          size, font,
          color: PL.rgb(0.75, 0.75, 0.75),
          opacity: 0.35,
          rotate: PL.degrees(30),
        });
      });
      return [{ name: baseName(files[0]) + '-filigran.pdf', blob: new Blob([await src.save()], { type: 'application/pdf' }) }];
    },

    async 'pdf-encrypt'(files, o) {
      if (!o.password) throw new Error('Parola gir.');
      const { PDFDocument } = await pdfLib(true);
      const src = await PDFDocument.load(await readBuf(files[0]), { ignoreEncryption: true });
      const bytes = await src.save({ userPassword: o.password, ownerPassword: o.password });
      return [{ name: baseName(files[0]) + '-kilitli.pdf', blob: new Blob([bytes], { type: 'application/pdf' }) }];
    },

    async 'pdf-decrypt'(files, o) {
      const { PDFDocument } = await pdfLib(true);
      const src = await PDFDocument.load(await readBuf(files[0]), { password: o.password || undefined, ignoreEncryption: !o.password });
      const bytes = await src.save();
      return [{ name: baseName(files[0]) + '-acik.pdf', blob: new Blob([bytes], { type: 'application/pdf' }) }];
    },

    async 'pdf-to-images'(files, o) {
      const lib = await pdfJs();
      const doc = await lib.getDocument({ data: await readBuf(files[0]) }).promise;
      const results = [];
      for (let i = 1; i <= doc.numPages; i++) {
        setStatus('Sayfa ' + i + ' / ' + doc.numPages + ' işleniyor...');
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 2 });
        const c = canvasOf(null, vp.width, vp.height);
        await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
        results.push({ name: baseName(files[0]) + '-sayfa-' + i + '.jpg', blob: await canvasBlob(c, 'image/jpeg', (o.quality || 90) / 100) });
      }
      return results;
    },

    async 'pdf-to-word'(files) {
      const text = await pdfText(files[0]);
      if (!text.trim()) throw new Error('PDF\'te seçilebilir metin bulunamadı. Taranmış PDF için OCR aracını kullan.');
      return [await textToDocx(text, baseName(files[0]))];
    },

    async 'pdf-to-excel'(files) {
      await loadScript(VENDOR + 'xlsx.full.min.js');
      const text = await pdfText(files[0]);
      if (!text.trim()) throw new Error('PDF\'te seçilebilir metin bulunamadı.');
      const rows = text.split(/\n+/).map(line => line.split(/\s{2,}|\t/).filter(Boolean));
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sayfa1');
      const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      return [{ name: baseName(files[0]) + '.xlsx', blob: new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) }];
    },

    async 'ocr'(files, o) {
      await loadScript(VENDOR + 'tesseract.min.js');
      setStatus('OCR modeli hazırlanıyor...');
      const worker = await Tesseract.createWorker(o.lang || 'tur', 1, {
        workerPath: VENDOR + 'tesseract-worker.min.js',
        corePath: VENDOR,
        langPath: ASSETS + 'tessdata',
        logger: (m) => { if (m.status === 'recognizing text') setStatus('Metin tanınıyor: %' + Math.round(m.progress * 100)); },
      });
      let input = files[0];
      if (ext(files[0]) === 'pdf') {
        const lib = await pdfJs();
        const doc = await lib.getDocument({ data: await readBuf(files[0]) }).promise;
        const page = await doc.getPage(1);
        const vp = page.getViewport({ scale: 2.5 });
        const c = canvasOf(null, vp.width, vp.height);
        await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
        input = await canvasBlob(c, 'image/png');
      }
      const { data } = await worker.recognize(input);
      await worker.terminate();
      showTextResult(data.text || '(metin bulunamadı)');
      return [{ name: baseName(files[0]) + '-ocr.txt', blob: new Blob([data.text], { type: 'text/plain;charset=utf-8' }) }];
    },

    /* ── Belge ── */
    async 'docx-to-pdf'(files) {
      await loadScript(VENDOR + 'mammoth.browser.min.js');
      const { value } = await mammoth.extractRawText({ arrayBuffer: await readBuf(files[0]) });
      return [await textToPdf(value, baseName(files[0]))];
    },

    async 'docx-to-txt'(files) {
      await loadScript(VENDOR + 'mammoth.browser.min.js');
      const { value } = await mammoth.extractRawText({ arrayBuffer: await readBuf(files[0]) });
      return [{ name: baseName(files[0]) + '.txt', blob: new Blob([value], { type: 'text/plain;charset=utf-8' }) }];
    },

    async 'txt-to-docx'(files) {
      return [await textToDocx(await readText(files[0]), baseName(files[0]))];
    },

    async 'txt-to-pdf'(files) {
      return [await textToPdf(await readText(files[0]), baseName(files[0]))];
    },

    async 'rtf-to-pdf'(files) {
      let t = await readText(files[0]);
      t = t.replace(/\\par[d]?/g, '\n').replace(/\{\\[^{}]+\}/g, '').replace(/\\'[0-9a-f]{2}/g, '').replace(/\\[a-z]+-?\d* ?/g, '').replace(/[{}]/g, '');
      return [await textToPdf(t.trim(), baseName(files[0]))];
    },

    async 'odt-to-pdf'(files) {
      await loadScript(VENDOR + 'jszip.min.js');
      const zip = await JSZip.loadAsync(await readBuf(files[0]));
      const xml = await zip.file('content.xml').async('string');
      const text = xml.replace(/<text:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '').trim();
      return [await textToPdf(text, baseName(files[0]))];
    },

    async 'html-to-pdf'(files) {
      const html = await readText(files[0]);
      const dom = new DOMParser().parseFromString(html, 'text/html');
      dom.querySelectorAll('script,style').forEach(el => el.remove());
      return [await textToPdf(dom.body.textContent.replace(/\n{3,}/g, '\n\n').trim(), baseName(files[0]))];
    },

    async 'xlsx-to-pdf'(files) {
      await loadScript(VENDOR + 'xlsx.full.min.js');
      await loadScript(VENDOR + 'jspdf.umd.min.js');
      const wb = XLSX.read(await readBuf(files[0]), { type: 'array' });
      const doc = new jspdf.jsPDF({ unit: 'pt', format: 'a4', orientation: 'landscape' });
      const margin = 40;
      let first = true;
      for (const name of wb.SheetNames) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 });
        if (!rows.length) continue;
        if (!first) doc.addPage();
        first = false;
        doc.setFontSize(13); doc.setFont('helvetica', 'bold');
        doc.text(trSafe(name), margin, margin);
        doc.setFontSize(9); doc.setFont('helvetica', 'normal');
        let y = margin + 22;
        const pageH = doc.internal.pageSize.getHeight();
        for (const row of rows.slice(0, 200)) {
          if (y > pageH - margin) { doc.addPage(); y = margin; }
          doc.text(trSafe(row.map(v => String(v ?? '')).join('  |  ')).slice(0, 160), margin, y);
          y += 13;
        }
      }
      return [{ name: baseName(files[0]) + '.pdf', blob: doc.output('blob') }];
    },

    async 'xlsx-to-csv'(files) {
      await loadScript(VENDOR + 'xlsx.full.min.js');
      const wb = XLSX.read(await readBuf(files[0]), { type: 'array' });
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
      return [{ name: baseName(files[0]) + '.csv', blob: new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }) }];
    },

    async 'csv-to-xlsx'(files) {
      await loadScript(VENDOR + 'xlsx.full.min.js');
      const wb = XLSX.read(await readText(files[0]), { type: 'string' });
      const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      return [{ name: baseName(files[0]) + '.xlsx', blob: new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) }];
    },

    async 'pptx-to-pdf'(files) {
      await loadScript(VENDOR + 'jszip.min.js');
      const zip = await JSZip.loadAsync(await readBuf(files[0]));
      const slides = Object.keys(zip.files)
        .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
        .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
      if (!slides.length) throw new Error('Sunumda slayt bulunamadı.');
      let text = '';
      for (let i = 0; i < slides.length; i++) {
        const xml = await zip.file(slides[i]).async('string');
        const parts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m => m[1]);
        text += '--- Slayt ' + (i + 1) + ' ---\n' + parts.join('\n') + '\n\n';
      }
      return [await textToPdf(text, baseName(files[0]))];
    },

    async 'md-to-html'(files) {
      let md = await readText(files[0]);
      const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      md = esc(md)
        .replace(/^###### (.*)$/gm, '<h6>$1</h6>')
        .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
        .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*)$/gm, '<h1>$1</h1>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^[-*] (.*)$/gm, '<li>$1</li>')
        .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\n{2,}/g, '</p><p>');
      const html = '<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>' + baseName(files[0]) + '</title><style>body{font-family:system-ui;max-width:720px;margin:40px auto;padding:0 20px;line-height:1.7;color:#111}code{background:#f3f4f6;padding:2px 6px;border-radius:4px}</style></head><body><p>' + md + '</p></body></html>';
      return [{ name: baseName(files[0]) + '.html', blob: new Blob([html], { type: 'text/html;charset=utf-8' }) }];
    },

    async 'docs-merge'(files) {
      const { PDFDocument } = await pdfLib();
      const out = await PDFDocument.create();
      for (const f of files) {
        const e = ext(f);
        if (e === 'pdf') {
          const src = await PDFDocument.load(await readBuf(f), { ignoreEncryption: true });
          (await out.copyPages(src, src.getPageIndices())).forEach(p => out.addPage(p));
        } else {
          let text = '';
          if (e === 'txt') text = await readText(f);
          else {
            await loadScript(VENDOR + 'mammoth.browser.min.js');
            text = (await mammoth.extractRawText({ arrayBuffer: await readBuf(f) })).value;
          }
          const part = await textToPdf(text, 'part');
          const src = await PDFDocument.load(await part.blob.arrayBuffer());
          (await out.copyPages(src, src.getPageIndices())).forEach(p => out.addPage(p));
        }
      }
      return [{ name: 'birlesik-belgeler.pdf', blob: new Blob([await out.save()], { type: 'application/pdf' }) }];
    },

    async 'docx-compress'(files, o) {
      await loadScript(VENDOR + 'jszip.min.js');
      const zip = await JSZip.loadAsync(await readBuf(files[0]));
      const media = Object.keys(zip.files).filter(n => /^word\/media\/.+\.(jpe?g|png)$/i.test(n));
      for (const name of media) {
        const blob = await zip.file(name).async('blob');
        try {
          const img = await imageFromFile(new File([blob], name, { type: /png$/i.test(name) ? 'image/png' : 'image/jpeg' }));
          const c = canvasOf(img);
          c.getContext('2d').drawImage(img, 0, 0);
          const small = await canvasBlob(c, 'image/jpeg', (o.quality || 70) / 100);
          if (small.size < blob.size) zip.file(name, small);
        } catch (_) { /* medya atlanır */ }
      }
      const out = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 }, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      return [{ name: baseName(files[0]) + '-kucuk.docx', blob: out }];
    },

    /* ── Video / Ses (ffmpeg) ── */
    async 'video-compress'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-c:v', 'libx264', '-crf', o.crf, '-preset', 'fast', '-c:a', 'aac', '-b:a', '128k', 'out.mp4'],
        'out.mp4', 'video/mp4', prog)];
    },

    async 'video-to-mp3'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-vn', '-b:a', o.bitrate || '192k', 'out.mp3'],
        'out.mp3', 'audio/mpeg', prog)];
    },

    async 'video-convert'(files, o, t, prog) {
      const f = files[0];
      const fmt = t.target || o.format || 'mp4';
      const args = ['-i', vname(f, 0)];
      if (fmt === 'mp4') args.push('-c:v', 'libx264', '-preset', 'fast', '-c:a', 'aac');
      if (fmt === 'webm') args.push('-c:v', 'libvpx', '-b:v', '1M', '-c:a', 'libvorbis');
      args.push('out.' + fmt);
      return [await ffRun([{ file: f, vname: vname(f, 0) }], args, 'out.' + fmt, 'video/' + fmt, prog)];
    },

    async 'video-trim'(files, o, t, prog) {
      if (!o.end) throw new Error('Bitiş zamanı gir (örn: 00:00:30).');
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-ss', o.start || '00:00:00', '-to', o.end, '-i', vname(f, 0), '-c', 'copy', 'out.' + ext(f)],
        'out.' + ext(f), f.type || 'video/mp4', prog)];
    },

    async 'video-concat'(files, o, t, prog) {
      const ff = await ffmpeg(prog);
      const { fetchFile } = FFmpegUtil;
      const names = [];
      for (let i = 0; i < files.length; i++) {
        const n = vname(files[i], i);
        await ff.writeFile(n, await fetchFile(files[i]));
        names.push(n);
      }
      const inputs = names.flatMap(n => ['-i', n]);
      const filter = names.map((_, i) => '[' + i + ':v][' + i + ':a]').join('') + 'concat=n=' + names.length + ':v=1:a=1[v][a]';
      await ff.exec([...inputs, '-filter_complex', filter, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'fast', '-c:a', 'aac', 'out.mp4']);
      const data = await ff.readFile('out.mp4');
      return [{ name: 'birlesik.mp4', blob: new Blob([data.buffer], { type: 'video/mp4' }) }];
    },

    async 'video-gif'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-vf', 'fps=' + (o.fps || 10) + ',scale=' + (o.width || 480) + ':-1:flags=lanczos', '-t', '15', 'out.gif'],
        'out.gif', 'image/gif', prog)];
    },

    async 'video-rotate'(files, o, t, prog) {
      const f = files[0];
      const vf = o.dir === '12' ? 'transpose=1,transpose=1' : 'transpose=' + o.dir;
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-vf', vf, '-c:a', 'copy', 'out.mp4'],
        'out.mp4', 'video/mp4', prog)];
    },

    async 'video-speed'(files, o, t, prog) {
      const f = files[0];
      const s = +o.speed;
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-filter_complex', '[0:v]setpts=' + (1 / s).toFixed(4) + '*PTS[v];[0:a]atempo=' + s + '[a]', '-map', '[v]', '-map', '[a]', 'out.mp4'],
        'out.mp4', 'video/mp4', prog)];
    },

    async 'video-frames'(files, o, t, prog) {
      const ff = await ffmpeg(prog);
      const { fetchFile } = FFmpegUtil;
      const f = files[0];
      await ff.writeFile(vname(f, 0), await fetchFile(f));
      await ff.exec(['-i', vname(f, 0), '-vf', 'fps=1', 'kare-%03d.jpg']);
      const list = await ff.listDir('/');
      const results = [];
      for (const item of list) {
        if (/^kare-\d+\.jpg$/.test(item.name)) {
          const data = await ff.readFile(item.name);
          results.push({ name: item.name, blob: new Blob([data.buffer], { type: 'image/jpeg' }) });
          await ff.deleteFile(item.name);
        }
      }
      if (!results.length) throw new Error('Kare çıkarılamadı.');
      return results;
    },

    async 'video-crop'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-vf', 'crop=' + o.w + ':' + o.h + ':' + o.x + ':' + o.y, '-c:a', 'copy', 'out.mp4'],
        'out.mp4', 'video/mp4', prog)];
    },

    async 'video-mute'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-c:v', 'copy', '-an', 'out.' + ext(f)],
        'out.' + ext(f), f.type || 'video/mp4', prog)];
    },

    async 'video-subtitle'(files, o, t, prog) {
      const video = files.find(f => ext(f) !== 'srt');
      const srt = files.find(f => ext(f) === 'srt');
      if (!video || !srt) throw new Error('Bir video ve bir .srt dosyası seç.');
      return [await ffRun(
        [{ file: video, vname: 'in.mp4' }, { file: srt, vname: 'sub.srt' }],
        ['-i', 'in.mp4', '-i', 'sub.srt', '-c', 'copy', '-c:s', 'mov_text', '-metadata:s:s:0', 'language=tur', 'out.mp4'],
        'out.mp4', 'video/mp4', prog)];
    },

    async 'audio-convert'(files, o, t, prog) {
      const f = files[0];
      const fmt = t.target || o.format || 'mp3';
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), 'out.' + fmt],
        'out.' + fmt, 'audio/' + (fmt === 'mp3' ? 'mpeg' : fmt), prog)];
    },

    async 'audio-trim'(files, o, t, prog) {
      if (!o.end) throw new Error('Bitiş zamanı gir (örn: 00:00:30).');
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-ss', o.start || '00:00:00', '-to', o.end, '-i', vname(f, 0), '-c', 'copy', 'out.' + ext(f)],
        'out.' + ext(f), f.type || 'audio/mpeg', prog)];
    },

    async 'audio-concat'(files, o, t, prog) {
      const ff = await ffmpeg(prog);
      const { fetchFile } = FFmpegUtil;
      const names = [];
      for (let i = 0; i < files.length; i++) {
        const n = vname(files[i], i);
        await ff.writeFile(n, await fetchFile(files[i]));
        names.push(n);
      }
      const inputs = names.flatMap(n => ['-i', n]);
      const filter = names.map((_, i) => '[' + i + ':a]').join('') + 'concat=n=' + names.length + ':v=0:a=1[a]';
      await ff.exec([...inputs, '-filter_complex', filter, '-map', '[a]', 'out.mp3']);
      const data = await ff.readFile('out.mp3');
      return [{ name: 'birlesik.mp3', blob: new Blob([data.buffer], { type: 'audio/mpeg' }) }];
    },

    async 'audio-bitrate'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-b:a', o.bitrate, 'out.mp3'],
        'out.mp3', 'audio/mpeg', prog)];
    },

    async 'audio-volume'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-af', 'volume=' + o.gain + 'dB', 'out.' + (ext(f) === 'wav' ? 'wav' : 'mp3')],
        'out.' + (ext(f) === 'wav' ? 'wav' : 'mp3'), 'audio/mpeg', prog)];
    },

    async 'audio-denoise'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-af', 'afftdn=nf=-25', 'out.mp3'],
        'out.mp3', 'audio/mpeg', prog)];
    },

    async 'audio-speed'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-af', 'atempo=' + o.speed, 'out.mp3'],
        'out.mp3', 'audio/mpeg', prog)];
    },

    async 'audio-normalize'(files, o, t, prog) {
      const f = files[0];
      return [await ffRun([{ file: f, vname: vname(f, 0) }],
        ['-i', vname(f, 0), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', 'out.mp3'],
        'out.mp3', 'audio/mpeg', prog)];
    },
  };

  /* ══════════════════ SAYFA UI ══════════════════ */

  const $ = (id) => document.getElementById(id);
  let statusEl = null;

  function setStatus(msg) {
    if (statusEl) { statusEl.textContent = msg; statusEl.hidden = !msg; }
  }

  function showTextResult(text) {
    let box = $('engineTextResult');
    if (!box) {
      box = document.createElement('textarea');
      box.id = 'engineTextResult';
      box.className = 'form-input';
      box.rows = 10;
      box.readOnly = true;
      box.style.cssText = 'width:100%;margin-top:16px;resize:vertical;font-family:ui-monospace,monospace;font-size:13px';
      $('toolWorkspace').appendChild(box);
    }
    box.value = text;
    box.hidden = false;
  }

  function renderOpts(tool) {
    const wrap = $('toolOptions');
    if (!tool.opts || !tool.opts.length) { wrap.hidden = true; return; }
    wrap.innerHTML = '';
    tool.opts.forEach(opt => {
      const row = document.createElement('div');
      row.className = 'option-row';
      const label = document.createElement('label');
      label.className = 'option-label';
      label.textContent = opt.label;
      const ctrl = document.createElement('div');
      ctrl.className = 'option-control';

      if (opt.type === 'select') {
        const sel = document.createElement('select');
        sel.className = 'select-input';
        sel.id = 'opt_' + opt.id;
        opt.choices.forEach(([v, l]) => {
          const op = document.createElement('option');
          op.value = v; op.textContent = l;
          if (v === opt.value) op.selected = true;
          sel.appendChild(op);
        });
        ctrl.appendChild(sel);
      } else if (opt.type === 'range') {
        const r = document.createElement('input');
        r.type = 'range'; r.className = 'range-input';
        r.id = 'opt_' + opt.id;
        r.min = opt.min; r.max = opt.max; r.value = opt.value;
        const val = document.createElement('span');
        val.className = 'range-value';
        val.textContent = opt.value + (opt.suffix || '');
        r.addEventListener('input', () => { val.textContent = r.value + (opt.suffix || ''); });
        ctrl.appendChild(r); ctrl.appendChild(val);
      } else {
        const inp = document.createElement('input');
        inp.type = opt.type === 'number' ? 'number' : 'text';
        inp.className = 'form-input';
        inp.id = 'opt_' + opt.id;
        inp.style.maxWidth = '220px';
        if (opt.placeholder) inp.placeholder = opt.placeholder;
        if (opt.value !== undefined) inp.value = opt.value;
        ctrl.appendChild(inp);
      }
      row.appendChild(label); row.appendChild(ctrl);
      wrap.appendChild(row);
    });
    wrap.hidden = false;
  }

  function collectOpts(tool) {
    const o = {};
    (tool.opts || []).forEach(opt => { o[opt.id] = $('opt_' + opt.id).value; });
    return o;
  }

  function renderResults(results, slug) {
    const panel = $('resultPanel');
    panel.innerHTML = '';
    panel.hidden = false;

    const head = document.createElement('div');
    head.className = 'result-head';
    head.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>';
    const strong = document.createElement('strong');
    strong.textContent = results.length === 1 ? 'Dosyan hazır!' : results.length + ' dosya hazır!';
    head.appendChild(strong);
    panel.appendChild(head);

    const list = document.createElement('div');
    list.className = 'result-list';
    results.slice(0, 30).forEach(r => {
      const row = document.createElement('div');
      row.className = 'result-row';
      const name = document.createElement('span');
      name.className = 'result-name';
      name.textContent = r.name + ' (' + (r.blob.size / 1024 / 1024).toFixed(2) + ' MB)';
      const btn = document.createElement('button');
      btn.className = 'btn-tool-primary btn-result-dl';
      btn.textContent = 'İndir';
      btn.addEventListener('click', () => downloadBlob(r.blob, r.name));
      row.appendChild(name); row.appendChild(btn);
      list.appendChild(row);
    });
    panel.appendChild(list);

    if (results.length > 1) {
      const zipBtn = document.createElement('button');
      zipBtn.className = 'btn-tool-primary';
      zipBtn.style.marginTop = '12px';
      zipBtn.textContent = 'Tümünü ZIP Olarak İndir';
      zipBtn.addEventListener('click', async () => {
        zipBtn.textContent = 'Hazırlanıyor...';
        const z = await zipResults(results, slug + '.zip');
        downloadBlob(z.blob, z.name);
        zipBtn.textContent = 'Tümünü ZIP Olarak İndir';
      });
      panel.appendChild(zipBtn);
    }

    /* İlk dosyayı otomatik indir */
    if (results.length === 1) downloadBlob(results[0].blob, results[0].name);
  }

  /* ── TTS / STT özel arayüzleri ── */
  function renderTTS() {
    const ws = $('toolWorkspace');
    ws.innerHTML =
      '<div class="form-group"><label class="form-label">Seslendirilecek metin</label>' +
      '<textarea id="ttsText" class="form-input" rows="6" style="width:100%;resize:vertical" placeholder="Metni buraya yaz..."></textarea></div>' +
      '<div class="option-row" style="margin-bottom:16px"><label class="option-label">Hız</label><div class="option-control">' +
      '<input type="range" id="ttsRate" class="range-input" min="0.5" max="2" step="0.1" value="1"><span class="range-value" id="ttsRateVal">1×</span></div></div>' +
      '<div class="tool-actions" style="border:none;padding:0;margin:0">' +
      '<button class="btn-tool-primary" id="ttsPlay">Seslendir</button>' +
      '<button class="btn-tool-ghost" id="ttsStop">Durdur</button></div>';
    $('ttsRate').addEventListener('input', () => { $('ttsRateVal').textContent = $('ttsRate').value + '×'; });
    $('ttsPlay').addEventListener('click', () => {
      const text = $('ttsText').value.trim();
      if (!text) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'tr-TR';
      u.rate = +$('ttsRate').value;
      const trVoice = speechSynthesis.getVoices().find(v => v.lang.startsWith('tr'));
      if (trVoice) u.voice = trVoice;
      speechSynthesis.speak(u);
    });
    $('ttsStop').addEventListener('click', () => speechSynthesis.cancel());
  }

  function renderSTT() {
    const ws = $('toolWorkspace');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      ws.innerHTML = '<p style="color:var(--text-2);font-size:14px;padding:20px 0">Tarayıcın konuşma tanımayı desteklemiyor. Chrome veya Edge kullanmayı dene.</p>';
      return;
    }
    ws.innerHTML =
      '<div class="tool-actions" style="border:none;padding:0;margin:0 0 16px">' +
      '<button class="btn-tool-primary" id="sttStart">🎙 Dinlemeyi Başlat</button>' +
      '<button class="btn-tool-ghost" id="sttStop" disabled>Durdur</button></div>' +
      '<div class="form-group"><label class="form-label">Tanınan metin</label>' +
      '<textarea id="sttText" class="form-input" rows="8" style="width:100%;resize:vertical" placeholder="Konuşmaya başla, metin burada belirecek..."></textarea></div>' +
      '<button class="btn-tool-ghost" id="sttCopy">Metni Kopyala</button>';
    const rec = new SR();
    rec.lang = 'tr-TR'; rec.continuous = true; rec.interimResults = true;
    let finalText = '';
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
        else interim += e.results[i][0].transcript;
      }
      $('sttText').value = finalText + interim;
    };
    $('sttStart').addEventListener('click', () => { rec.start(); $('sttStart').disabled = true; $('sttStop').disabled = false; });
    $('sttStop').addEventListener('click', () => { rec.stop(); $('sttStart').disabled = false; $('sttStop').disabled = true; });
    $('sttCopy').addEventListener('click', () => navigator.clipboard.writeText($('sttText').value));
  }

  /* ══════════════════ BAŞLATICI ══════════════════ */

  function init() {
    const slug = location.pathname.split('/').pop().replace('.html', '');
    let tool = window.FJ_TOOLS[slug];
    if (tool && tool.alias) tool = window.FJ_TOOLS[tool.alias];
    if (!tool) return;

    statusEl = $('engineStatus');

    if (tool.op === 'tts') { renderTTS(); return; }
    if (tool.op === 'stt') { renderSTT(); return; }

    const uploadZone   = $('uploadZone');
    const fileInput    = $('fileInput');
    const uploadPrompt = $('uploadPrompt');
    const fileList     = $('fileList');
    const actions      = $('toolActions');
    const processBtn   = $('btnProcess');
    const progressWrap = $('progressWrap');
    const progressFill = $('progressFill');

    fileInput.accept = tool.accept || '';
    fileInput.multiple = !!tool.multiple;

    let selectedFiles = [];

    function showFiles(files) {
      selectedFiles = Array.from(files);
      fileList.innerHTML = '';
      selectedFiles.forEach(f => {
        const div = document.createElement('div');
        div.className = 'file-item';
        const n = document.createElement('span');
        n.className = 'file-item-name'; n.textContent = f.name;
        const s = document.createElement('span');
        s.className = 'file-item-size'; s.textContent = (f.size / 1024 / 1024).toFixed(2) + ' MB';
        div.appendChild(n); div.appendChild(s);
        fileList.appendChild(div);
      });
      uploadPrompt.hidden = true;
      fileList.hidden = false;
      renderOpts(tool);
      actions.hidden = false;
      $('resultPanel').hidden = true;
    }

    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone.addEventListener('drop', e => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length) showFiles(e.dataTransfer.files);
    });
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => { if (fileInput.files.length) showFiles(fileInput.files); });

    $('btnReset').addEventListener('click', () => {
      selectedFiles = [];
      fileInput.value = '';
      fileList.hidden = true;
      uploadPrompt.hidden = false;
      $('toolOptions').hidden = true;
      actions.hidden = true;
      $('resultPanel').hidden = true;
      const tr = $('engineTextResult');
      if (tr) tr.hidden = true;
      setStatus('');
    });

    processBtn.addEventListener('click', async () => {
      if (!selectedFiles.length) return;
      const orig = processBtn.textContent;
      processBtn.textContent = 'İşleniyor...';
      processBtn.disabled = true;
      progressWrap.hidden = !tool.heavy;
      progressFill.style.width = '0%';
      setStatus(tool.heavy ? 'Hazırlanıyor...' : 'İşleniyor...');

      try {
        const results = await OPS[tool.op](
          selectedFiles,
          collectOpts(tool),
          tool,
          (p) => { progressFill.style.width = Math.round(p * 100) + '%'; }
        );
        setStatus('');
        renderResults(results, slug);
        if (window.fjAuth) window.fjAuth.logToolUsage(slug);
      } catch (err) {
        setStatus('');
        alert('Hata: ' + (err.message || err));
      } finally {
        processBtn.textContent = orig;
        processBtn.disabled = false;
        progressWrap.hidden = true;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
