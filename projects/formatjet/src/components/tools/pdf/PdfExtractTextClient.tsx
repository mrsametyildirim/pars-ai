"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

export default function PdfExtractTextClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError]     = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function extract() {
    if (!file) return;
    setLoading(true); setError(""); setResultUrl(null); setPreview(""); setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

      const bytes   = await file.arrayBuffer();
      const pdfDoc  = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
      const pageCount = pdfDoc.numPages;
      const parts: string[] = [];

      for (let i = 1; i <= pageCount; i++) {
        setProgress(Math.round((i / pageCount) * 95));
        const page    = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const text    = content.items.map((item: any) => item.str).join(" ");
        parts.push(`--- Sayfa ${i} ---\n${text}`);
      }

      const fullText = parts.join("\n\n");
      setPreview(fullText.slice(0, 800));
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
    } catch (e) {
      setError("Metin çıkarma başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  const downloadName = file ? file.name.replace(/\.pdf$/i, ".txt") : "output.txt";

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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>PDF dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>Metin tabanlı PDF'ler için en iyi sonuç</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setResultUrl(null); setPreview(""); } }} />
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
            <button onClick={() => { setFile(null); setResultUrl(null); setPreview(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {loading && progress > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>Metin çıkarılıyor…</span>
                <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress}%</span>
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}

          {preview && (
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "0.875rem" }}>
              <p style={{ color: textTer, fontSize: "0.72rem", marginBottom: "0.5rem" }}>Önizleme (ilk 800 karakter)</p>
              <pre style={{ color: textSec, fontSize: "0.78rem", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0, fontFamily: "monospace", maxHeight: "200px", overflowY: "auto" }}>{preview}</pre>
            </div>
          )}

          {error && <p style={{ color: accentColor, fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: `${accentColor}12`, borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>Metin çıkarıldı!</p>
              <a href={resultUrl} download={downloadName}
                style={{ padding: "0.45rem 1rem", background: "#10B981", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                .txt İndir
              </a>
            </div>
          )}

          <button onClick={extract} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "İşleniyor…" : "Metni Çıkar"}
          </button>
        </>
      )}
    </div>
  );
}
