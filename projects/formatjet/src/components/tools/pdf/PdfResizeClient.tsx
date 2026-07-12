"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

const PAGE_SIZES: { label: string; w: number; h: number }[] = [
  { label: "A4 (210×297 mm)",    w: 595.28,  h: 841.89 },
  { label: "A3 (297×420 mm)",    w: 841.89,  h: 1190.55 },
  { label: "A5 (148×210 mm)",    w: 419.53,  h: 595.28 },
  { label: "Letter (216×279 mm)", w: 612,     h: 792 },
  { label: "Legal (216×356 mm)", w: 612,     h: 1008 },
];

export default function PdfResizeClient() {
  const [file, setFile]     = useState<File | null>(null);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [orient, setOrient] = useState<"portrait" | "landscape">("portrait");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError]   = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function apply() {
    if (!file) return;
    setLoading(true); setError(""); setResultUrl(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const src   = await PDFDocument.load(bytes);
      const dst   = await PDFDocument.create();
      const sel   = PAGE_SIZES[sizeIdx];
      const targetW = orient === "portrait" ? sel.w : sel.h;
      const targetH = orient === "portrait" ? sel.h : sel.w;

      for (let i = 0; i < src.getPageCount(); i++) {
        const [emb] = await dst.embedPages([src.getPage(i)]);
        const page  = dst.addPage([targetW, targetH]);
        const { width: sw, height: sh } = emb;
        const scale = Math.min(targetW / sw, targetH / sh);
        const dx = (targetW - sw * scale) / 2;
        const dy = (targetH - sh * scale) / 2;
        page.drawPage(emb, { x: dx, y: dy, width: sw * scale, height: sh * scale });
      }

      const out  = await dst.save();
      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("İşlem başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  const downloadName = file ? file.name.replace(/\.pdf$/i, `-${PAGE_SIZES[sizeIdx].label.split(" ")[0]}.pdf`) : "output.pdf";

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
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
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
            </div>
            <button onClick={() => { setFile(null); setResultUrl(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div>
              <label style={{ color: textSec, fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Hedef Sayfa Boyutu</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {PAGE_SIZES.map((s, i) => (
                  <label key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", padding: "0.4rem 0.6rem", borderRadius: "8px", background: sizeIdx === i ? `${accentColor}12` : "transparent", border: `1px solid ${sizeIdx === i ? accentColor : "transparent"}` }}>
                    <input type="radio" name="size" checked={sizeIdx === i} onChange={() => setSizeIdx(i)} style={{ accentColor }} />
                    <span style={{ color: sizeIdx === i ? accentColor : textPri, fontSize: "0.85rem" }}>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: textSec, fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>Yönelim</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["portrait", "landscape"] as const).map(o => (
                  <button key={o} onClick={() => setOrient(o)} style={{
                    flex: 1, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${orient === o ? accentColor : border}`,
                    background: orient === o ? `${accentColor}1A` : "transparent",
                    color: orient === o ? accentColor : textSec, cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit",
                  }}>
                    {o === "portrait" ? "Dikey (Portrait)" : "Yatay (Landscape)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p style={{ color: accentColor, fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: `${accentColor}12`, borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>Boyutlandırma tamamlandı!</p>
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
            {loading ? "İşleniyor…" : "Boyutlandır ve İndir"}
          </button>
        </>
      )}
    </div>
  );
}
