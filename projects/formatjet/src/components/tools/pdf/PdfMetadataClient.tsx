"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

interface Meta { title: string; author: string; subject: string; keywords: string; creator: string }

export default function PdfMetadataClient() {
  const [file, setFile]   = useState<File | null>(null);
  const [meta, setMeta]   = useState<Meta>({ title: "", author: "", subject: "", keywords: "", creator: "" });
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function loadMeta(f: File) {
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc   = await PDFDocument.load(bytes);
      setMeta({
        title:    doc.getTitle()    ?? "",
        author:   doc.getAuthor()   ?? "",
        subject:  doc.getSubject()  ?? "",
        keywords: doc.getKeywords() ?? "",
        creator:  doc.getCreator()  ?? "",
      });
    } catch { /* ignore read errors */ }
  }

  async function apply() {
    if (!file) return;
    setLoading(true); setError(""); setResultUrl(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc   = await PDFDocument.load(bytes);
      doc.setTitle(meta.title);
      doc.setAuthor(meta.author);
      doc.setSubject(meta.subject);
      doc.setKeywords(meta.keywords.split(",").map(k => k.trim()).filter(Boolean));
      doc.setCreator(meta.creator);
      doc.setModificationDate(new Date());
      const out  = await doc.save();
      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("İşlem başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  const setField = (k: keyof Meta) => (v: string) => setMeta(prev => ({ ...prev, [k]: v }));
  const downloadName = file ? file.name.replace(/\.pdf$/i, "-meta.pdf") : "output.pdf";

  const fields: { key: keyof Meta; label: string; hint?: string }[] = [
    { key: "title",    label: "Başlık",   hint: "Belge başlığı" },
    { key: "author",   label: "Yazar",    hint: "Yazar adı" },
    { key: "subject",  label: "Konu",     hint: "Belgenin konusu" },
    { key: "keywords", label: "Anahtar Kelimeler", hint: "Virgülle ayrılmış" },
    { key: "creator",  label: "Oluşturan Uygulama" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); loadMeta(f); } }}
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586l5.414 5.414V19a2 2 0 0 1-2 2z"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>PDF dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>Mevcut meta veriler otomatik yüklenir</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); loadMeta(f); setResultUrl(null); } }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586l5.414 5.414V19a2 2 0 0 1-2 2z"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
            </div>
            <button onClick={() => { setFile(null); setResultUrl(null); setMeta({ title: "", author: "", subject: "", keywords: "", creator: "" }); }} style={{ background: "none", border: "none", cursor: "pointer", color: textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {fields.map(({ key, label, hint }) => (
              <div key={key}>
                <label style={{ display: "block", color: textSec, fontSize: "0.78rem", marginBottom: "0.3rem" }}>
                  {label}{hint && <span style={{ color: textTer, marginLeft: "0.4rem" }}>— {hint}</span>}
                </label>
                <input type="text" value={meta[key]} onChange={e => setField(key)(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: `1px solid ${border}`, background: "var(--color-bg)", color: textPri, fontFamily: "inherit", fontSize: "0.875rem", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>

          {error && <p style={{ color: accentColor, fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: `${accentColor}12`, borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>Meta veriler güncellendi!</p>
              <a href={resultUrl} download={downloadName}
                style={{ padding: "0.45rem 1rem", background: "#10B981", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                İndir
              </a>
            </div>
          )}

          <button onClick={apply} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "Kaydediliyor…" : "Kaydet ve İndir"}
          </button>
        </>
      )}
    </div>
  );
}
