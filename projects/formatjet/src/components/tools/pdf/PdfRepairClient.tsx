"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

export default function PdfRepairClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize]   = useState(0);
  const [error, setError]       = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function repair() {
    if (!file) return;
    setLoading(true); setError(""); setResultUrl(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc   = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const out   = await doc.save();
      const blob  = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setOrigSize(file.size);
      setNewSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("Onarım başarısız: " + (e instanceof Error ? e.message.slice(0, 120) : "Dosya çok hasarlı olabilir."));
    }
    setLoading(false);
  }

  const downloadName = file ? file.name.replace(/\.pdf$/i, "-onarilmis.pdf") : "output.pdf";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Hasarlı PDF dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>PDF · Maksimum 100 MB</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setResultUrl(null); } }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586l5.414 5.414V19a2 2 0 0 1-2 2z"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button onClick={() => { setFile(null); setResultUrl(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "1rem" }}>
            <p style={{ color: textSec, fontSize: "0.82rem", marginBottom: "0.5rem" }}>Bu araç şunları düzeltir:</p>
            <ul style={{ color: textTer, fontSize: "0.78rem", lineHeight: 1.8, paddingLeft: "1.2rem", margin: 0 }}>
              <li>Bozuk çapraz referans tabloları (xref)</li>
              <li>Eksik veya hatalı nesne işaretçileri</li>
              <li>Truncate edilmiş dosyalar</li>
              <li>Uyumsuz PDF yapısı</li>
            </ul>
          </div>

          {error && <p style={{ color: accentColor, fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: `${accentColor}12`, borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ padding: "1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>Onarım tamamlandı!</p>
                <a href={resultUrl} download={downloadName}
                  style={{ padding: "0.45rem 1rem", background: "#10B981", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                  İndir
                </a>
              </div>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <div><p style={{ color: textTer, fontSize: "0.72rem" }}>Orijinal</p><p style={{ color: textPri, fontSize: "0.85rem", fontWeight: 500 }}>{(origSize / 1024).toFixed(0)} KB</p></div>
                <div><p style={{ color: textTer, fontSize: "0.72rem" }}>Onarılmış</p><p style={{ color: "#10B981", fontSize: "0.85rem", fontWeight: 500 }}>{(newSize / 1024).toFixed(0)} KB</p></div>
              </div>
            </div>
          )}

          <button onClick={repair} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "Onarılıyor…" : "PDF Onar ve İndir"}
          </button>
        </>
      )}
    </div>
  );
}
