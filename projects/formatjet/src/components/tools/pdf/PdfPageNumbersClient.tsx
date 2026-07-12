"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

type Position = "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right";
type Format   = "1" | "Sayfa 1" | "1 / N" | "- 1 -";

const POSITIONS: { value: Position; label: string }[] = [
  { value: "bottom-center", label: "Alt Orta" },
  { value: "bottom-right",  label: "Alt Sağ" },
  { value: "bottom-left",   label: "Alt Sol" },
  { value: "top-center",    label: "Üst Orta" },
  { value: "top-right",     label: "Üst Sağ" },
];

const FORMATS: { value: Format; label: string }[] = [
  { value: "1",         label: "1" },
  { value: "Sayfa 1",   label: "Sayfa 1" },
  { value: "1 / N",     label: "1 / 12" },
  { value: "- 1 -",     label: "- 1 -" },
];

export default function PdfPageNumbersClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [position, setPos]    = useState<Position>("bottom-center");
  const [format, setFormat]   = useState<Format>("1");
  const [startFrom, setStart] = useState(1);
  const [fontSize, setFontSize] = useState(11);
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
    if (!file) return;
    setLoading(true); setError(""); setResultUrl(null);
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc   = await PDFDocument.load(bytes);
      const font  = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;

      pages.forEach((page, i) => {
        const n = i + startFrom;
        const label = format === "1" ? `${n}`
          : format === "Sayfa 1" ? `Sayfa ${n}`
          : format === "1 / N"   ? `${n} / ${total + startFrom - 1}`
          : `- ${n} -`;

        const { width, height } = page.getSize();
        const tw = font.widthOfTextAtSize(label, fontSize);

        const margin = 18;
        let x = width / 2 - tw / 2;
        let y = margin;

        if (position === "bottom-right")  { x = width - tw - margin; y = margin; }
        if (position === "bottom-left")   { x = margin; y = margin; }
        if (position === "top-center")    { x = width / 2 - tw / 2; y = height - margin - fontSize; }
        if (position === "top-right")     { x = width - tw - margin; y = height - margin - fontSize; }

        page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
      });

      const out  = await doc.save();
      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("İşlem başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  const downloadName = file ? file.name.replace(/\.pdf$/i, "-numaralı.pdf") : "output.pdf";

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
              <label style={{ color: textSec, fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Konum</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {POSITIONS.map(p => (
                  <button key={p.value} onClick={() => setPos(p.value)} style={{
                    padding: "0.35rem 0.75rem", borderRadius: "6px", border: `1px solid ${position === p.value ? accentColor : border}`,
                    background: position === p.value ? `${accentColor}1A` : "transparent",
                    color: position === p.value ? accentColor : textSec, cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit",
                  }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: textSec, fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Format</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {FORMATS.map(f => (
                  <button key={f.value} onClick={() => setFormat(f.value)} style={{
                    padding: "0.35rem 0.75rem", borderRadius: "6px", border: `1px solid ${format === f.value ? accentColor : border}`,
                    background: format === f.value ? `${accentColor}1A` : "transparent",
                    color: format === f.value ? accentColor : textSec, cursor: "pointer", fontSize: "0.8rem", fontFamily: "monospace",
                  }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: textSec, fontSize: "0.8rem", display: "block", marginBottom: "0.3rem" }}>Başlangıç Numarası</label>
                <input type="number" min={1} max={999} value={startFrom} onChange={e => setStart(Math.max(1, Number(e.target.value)))}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: `1px solid ${border}`, background: "var(--color-bg)", color: textPri, fontFamily: "monospace", fontSize: "0.9rem", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <label style={{ color: textSec, fontSize: "0.8rem" }}>Yazı Boyutu</label>
                  <span style={{ color: textTer, fontSize: "0.75rem", fontFamily: "monospace" }}>{fontSize}pt</span>
                </div>
                <input type="range" min={8} max={18} step={1} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: "100%", marginTop: "0.6rem", accentColor }} />
              </div>
            </div>
          </div>

          {error && <p style={{ color: accentColor, fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: `${accentColor}12`, borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>Sayfa numaraları eklendi!</p>
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
            {loading ? "İşleniyor…" : "Sayfa Numarası Ekle"}
          </button>
        </>
      )}
    </div>
  );
}
