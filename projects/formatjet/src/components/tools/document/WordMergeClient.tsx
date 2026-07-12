"use client";

import { useState, useRef } from "react";

const accentColor = "#3B82F6";

async function mergeDocxFiles(files: File[]): Promise<Blob> {
  const JSZip = (await import("jszip")).default;

  const zips = await Promise.all(files.map(async f => {
    const ab = await f.arrayBuffer();
    return JSZip.loadAsync(ab);
  }));

  const baseZip = zips[0];
  const baseDocXml = await baseZip.file("word/document.xml")!.async("text");

  const bodies: string[] = [];
  for (const zip of zips) {
    const xml = await zip.file("word/document.xml")!.async("text");
    const match = xml.match(/<w:body>([\s\S]*?)<\/w:body>/);
    if (match) {
      const content = match[1].replace(/<w:sectPr[\s\S]*?<\/w:sectPr>/g, "").trim();
      if (content) bodies.push(content);
    }
  }

  const pageBreak = `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
  const combined  = bodies.join(pageBreak);

  const lastXml    = await zips[zips.length - 1].file("word/document.xml")!.async("text");
  const sectPrMatch = lastXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/);
  const sectPr     = sectPrMatch ? sectPrMatch[0] : "";

  const newXml = baseDocXml.replace(/<w:body>[\s\S]*?<\/w:body>/, `<w:body>${combined}${sectPr}</w:body>`);
  baseZip.file("word/document.xml", newXml);

  return baseZip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

export default function WordMergeClient() {
  const [files, setFiles]     = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");
  const inputRef              = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    const docx = Array.from(newFiles).filter(f => f.name.match(/\.docx?$/i));
    setFiles(prev => [...prev, ...docx]);
    setDone(false);
    setError("");
  }

  function removeFile(i: number) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  }

  function moveUp(i: number) {
    if (i === 0) return;
    setFiles(prev => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
  }

  function moveDown(i: number) {
    setFiles(prev => { if (i >= prev.length - 1) return prev; const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; });
  }

  async function merge() {
    if (files.length < 2) { setError("En az 2 belge ekleyin."); return; }
    setLoading(true); setError(""); setDone(false);
    try {
      const blob = await mergeDocxFiles(files);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = "birlestirilmis.docx";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e) {
      setError("Birleştirme başarısız: " + (e instanceof Error ? e.message : ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "2rem", textAlign: "center", cursor: "pointer", background: surface }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 0.75rem" }}>
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
        </svg>
        <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.2rem" }}>DOCX dosyalarını sürükle veya tıkla</p>
        <p style={{ color: textTer, fontSize: "0.8rem" }}>Birden fazla dosya seçilebilir</p>
        <input ref={inputRef} type="file" accept=".doc,.docx" multiple style={{ display: "none" }}
          onChange={e => addFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ color: textSec, fontSize: "0.8rem" }}>Sıra önemlidir — yukarıdan aşağıya birleştirilecek:</p>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.75rem", background: surface, borderRadius: "10px", border: `1px solid ${border}` }}>
              <span style={{ color: textTer, fontSize: "0.75rem", fontFamily: "monospace", minWidth: "1.2rem" }}>{i + 1}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586l5.414 5.414V19a2 2 0 0 1-2 2z"/>
              </svg>
              <span style={{ flex: 1, color: textPri, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
              <span style={{ color: textTer, fontSize: "0.72rem" }}>{(f.size/1024).toFixed(0)} KB</span>
              <button onClick={() => moveUp(i)} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", color: i === 0 ? border : textSec, padding: "2px" }}>↑</button>
              <button onClick={() => moveDown(i)} disabled={i === files.length - 1} style={{ background: "none", border: "none", cursor: i === files.length - 1 ? "default" : "pointer", color: i === files.length - 1 ? border : textSec, padding: "2px" }}>↓</button>
              <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: textTer, padding: "2px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}

      {done && (
        <div style={{ padding: "0.75rem 1rem", background: "rgba(16,185,129,0.1)", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontSize: "0.85rem" }}>
          {files.length} belge başarıyla birleştirildi ve indirildi.
        </div>
      )}

      <button onClick={merge} disabled={loading || files.length < 2} style={{
        padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
        color: "#fff", cursor: loading || files.length < 2 ? "not-allowed" : "pointer",
        fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 600, opacity: loading || files.length < 2 ? 0.6 : 1,
      }}>
        {loading ? "Birleştiriliyor…" : `${files.length} Belgeyi Birleştir ve İndir`}
      </button>
      <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
        Tüm işlem tarayıcınızda gerçekleşir. Dosyalarınız sunucuya yüklenmez.
      </p>
    </div>
  );
}
