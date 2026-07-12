"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

export default function PdfWatermarkClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [text, setText]       = useState("GİZLİ");
  const [fontSize, setFontSize] = useState(60);
  const [opacity, setOpacity] = useState(0.2);
  const [angle, setAngle]     = useState(45);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError]     = useState("");
  const inputRef              = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function apply() {
    if (!file || !text.trim()) return;
    setLoading(true); setError(""); setResultUrl(null);
    try {
      const { PDFDocument, rgb, StandardFonts, degrees } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc   = await PDFDocument.load(bytes);
      const font  = await doc.embedFont(StandardFonts.HelveticaBold);

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const tw = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: (width - tw) / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(angle),
        });
      }

      const out  = await doc.save();
      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("İşlem başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  const downloadName = file ? file.name.replace(/\.pdf$/i, "-filigranli.pdf") : "output.pdf";

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
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>PDF dosyasını sürükle veya tıkla</p>
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

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.35rem" }}>Filigran Metni</label>
              <input type="text" value={text} onChange={e => setText(e.target.value)} maxLength={40}
                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: `1px solid ${border}`, background: "var(--color-bg)", color: textPri, fontFamily: "inherit", fontSize: "0.9rem", boxSizing: "border-box" }} />
            </div>
            {[
              { label: "Yazı Boyutu", min: 20, max: 120, step: 5, value: fontSize, set: setFontSize, unit: "pt" },
              { label: "Saydamlık", min: 5, max: 80, step: 5, value: Math.round(opacity * 100), set: (v: number) => setOpacity(v / 100), unit: "%" },
              { label: "Açı", min: -90, max: 90, step: 15, value: angle, set: setAngle, unit: "°" },
            ].map(({ label, min, max, step, value, set, unit }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <label style={{ color: textSec, fontSize: "0.8rem" }}>{label}</label>
                  <span style={{ color: textTer, fontSize: "0.75rem", fontFamily: "monospace" }}>{value}{unit}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={e => set(Number(e.target.value))}
                  style={{ width: "100%", accentColor }} />
              </div>
            ))}
          </div>

          {error && <p style={{ color: accentColor, fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: `${accentColor}12`, borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>Filigran eklendi!</p>
              <a href={resultUrl} download={downloadName}
                style={{ padding: "0.45rem 1rem", background: "#10B981", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                İndir
              </a>
            </div>
          )}

          <button onClick={apply} disabled={loading || !text.trim()} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: (loading || !text.trim()) ? 0.6 : 1,
          }}>
            {loading ? "İşleniyor…" : "Filigran Ekle ve İndir"}
          </button>
        </>
      )}
    </div>
  );
}
