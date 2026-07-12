"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

function textToDocxXml(pages: string[][]): string {
  const esc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  const paragraphs = pages.flatMap((lines, pi) => {
    const paras = lines.map(line =>
      `<w:p><w:r><w:t xml:space="preserve">${esc(line)}</w:t></w:r></w:p>`
    );
    if (pi < pages.length - 1) {
      paras.push(`<w:p><w:r><w:br w:type="page"/></w:r></w:p>`);
    }
    return paras;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${paragraphs}<w:sectPr/></w:body>
</w:document>`;
}

function buildDocx(docXml: string): Blob {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const wordRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`;

  const enc = new TextEncoder();

  function u8(s: string) { return enc.encode(s); }

  // Minimal ZIP builder
  const files: { name: string; data: Uint8Array }[] = [
    { name: "[Content_Types].xml", data: u8(contentTypes) },
    { name: "_rels/.rels",         data: u8(rels) },
    { name: "word/document.xml",   data: u8(docXml) },
    { name: "word/_rels/document.xml.rels", data: u8(wordRels) },
  ];

  const parts: Uint8Array[] = [];
  const centralDir: Uint8Array[] = [];
  let offset = 0;

  for (const { name, data } of files) {
    const nameBytes = enc.encode(name);
    const local = new Uint8Array(30 + nameBytes.length + data.length);
    const v = new DataView(local.buffer);
    v.setUint32(0,  0x504b0304, true); // signature
    v.setUint16(4,  20, true);         // version needed
    v.setUint16(6,  0, true);          // general purpose
    v.setUint16(8,  0, true);          // compression: stored
    v.setUint16(10, 0, true);          // mod time
    v.setUint16(12, 0, true);          // mod date
    v.setUint32(14, crc32(data), true);
    v.setUint32(18, data.length, true);
    v.setUint32(22, data.length, true);
    v.setUint16(26, nameBytes.length, true);
    v.setUint16(28, 0, true);
    local.set(nameBytes, 30);
    local.set(data, 30 + nameBytes.length);

    const cd = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0,  0x504b0102, true);
    cv.setUint16(4,  20, true); cv.setUint16(6,  20, true);
    cv.setUint16(8,  0, true);  cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);  cv.setUint16(14, 0, true);
    cv.setUint32(16, crc32(data), true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true); cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true); cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    cd.set(nameBytes, 46);

    parts.push(local);
    centralDir.push(cd);
    offset += local.length;
  }

  const cdSize    = centralDir.reduce((s, c) => s + c.length, 0);
  const eocd      = new Uint8Array(22);
  const ev        = new DataView(eocd.buffer);
  ev.setUint32(0, 0x504b0506, true);
  ev.setUint16(4, 0, true); ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const all = [...parts, ...centralDir, eocd];
  const total = all.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const a of all) { out.set(a, pos); pos += a.length; }
  return new Blob([out], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

function crc32(data: Uint8Array): number {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (const b of data) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export default function PdfToWordClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState("");
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function convert() {
    if (!file) return;
    setLoading(true); setError(""); setDone(false); setProgress(5);
    setStatus("PDF yükleniyor…");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

      const ab  = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
      const numPages = pdf.numPages;

      const allPages: string[][] = [];
      for (let i = 1; i <= numPages; i++) {
        setStatus(`Sayfa ${i}/${numPages} okunuyor…`);
        setProgress(Math.round((i / numPages) * 80) + 10);

        const page    = await pdf.getPage(i);
        const content = await page.getTextContent();
        const items   = content.items as Array<{ str: string; transform: number[] }>;

        // Group by Y coordinate (line detection)
        const lineMap = new Map<number, string[]>();
        for (const item of items) {
          const y = Math.round(item.transform[5]);
          if (!lineMap.has(y)) lineMap.set(y, []);
          lineMap.get(y)!.push(item.str);
        }

        const lines = [...lineMap.entries()]
          .sort((a, b) => b[0] - a[0])
          .map(([, words]) => words.join(" ").trim())
          .filter(l => l.length > 0);

        allPages.push(lines);
      }

      setStatus("Word belgesi oluşturuluyor…");
      setProgress(95);

      const docXml = textToDocxXml(allPages);
      const blob   = buildDocx(docXml);
      const url    = URL.createObjectURL(blob);
      const a      = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.pdf$/i, "") + ".docx";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true); setProgress(100); setStatus("Tamamlandı!");
    } catch (e) {
      setError("Dönüştürme başarısız: " + (e instanceof Error ? e.message : ""));
    } finally {
      setLoading(false);
      setTimeout(() => { setProgress(0); setStatus(""); }, 3000);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) setFile(f); }}
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>PDF dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>Metin tabanlı PDF · Maksimum 50 MB</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
            onChange={e => { const f=e.target.files?.[0]; if(f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size/1024/1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setDone(false); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ padding: "0.75rem", background: `${accentColor}0D`, borderRadius: "10px", border: `1px solid ${accentColor}30`, fontSize: "0.8rem", color: textSec }}>
            Metin tabanlı PDF'ler için en iyi sonuç alınır. Taranmış PDF'ler için OCR aracını kullanın.
          </div>

          {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}
          {done  && <div style={{ padding: "0.75rem 1rem", background: "rgba(16,185,129,0.1)", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontSize: "0.85rem" }}>Dönüştürme tamamlandı!</div>}

          {(loading || progress > 0 && !done) && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>{status}</span>
                <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress > 0 ? progress+"%" : ""}</span>
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}

          <button onClick={convert} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Dönüştürülüyor…" : "Word Belgesine Dönüştür"}
          </button>
          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            Tüm işlem tarayıcınızda gerçekleşir. Orijinal biçimlendirme kısmen korunur.
          </p>
        </>
      )}
    </div>
  );
}
