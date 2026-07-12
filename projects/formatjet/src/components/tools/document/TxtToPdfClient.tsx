"use client";

import { useState, useRef } from "react";

const accentColor = "#3B82F6";
const CHARS_PER_LINE = 90;
const LINES_PER_PAGE = 45;
const FONT_SIZE = 10;
const MARGIN = 40;
const LINE_HEIGHT = 14;

function wrapLine(line: string): string[] {
  const out: string[] = [];
  let remaining = line;
  while (remaining.length > CHARS_PER_LINE) {
    const breakAt = remaining.lastIndexOf(" ", CHARS_PER_LINE) > 0 ? remaining.lastIndexOf(" ", CHARS_PER_LINE) : CHARS_PER_LINE;
    out.push(remaining.slice(0, breakAt));
    remaining = remaining.slice(breakAt).trimStart();
  }
  out.push(remaining);
  return out;
}

export default function TxtToPdfClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError]     = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function convert() {
    if (!file) return;
    setLoading(true); setError(""); setResultUrl(null);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const rawText = await file.text();
      const inputLines = rawText.split("\n");
      const allLines: string[] = [];
      for (const line of inputLines) {
        allLines.push(...wrapLine(line));
      }

      const doc  = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Courier);
      const PAGE_W = 595.28, PAGE_H = 841.89;

      let lineIdx = 0;
      let pages = 0;
      while (lineIdx < allLines.length) {
        const page = doc.addPage([PAGE_W, PAGE_H]);
        pages++;
        for (let r = 0; r < LINES_PER_PAGE && lineIdx < allLines.length; r++, lineIdx++) {
          const y = PAGE_H - MARGIN - r * LINE_HEIGHT;
          page.drawText(allLines[lineIdx], { x: MARGIN, y, size: FONT_SIZE, font, color: rgb(0.1, 0.1, 0.1) });
        }
      }

      if (pages === 0) {
        doc.addPage([PAGE_W, PAGE_H]);
        pages = 1;
      }

      setPageCount(pages);
      const out  = await doc.save();
      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("Dönüştürme başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  const downloadName = file ? file.name.replace(/\.txt$/i, ".pdf") : "output.pdf";

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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>TXT dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>Satır kılavuzu 90 karakter, Courier monospace</p>
          <input ref={inputRef} type="file" accept=".txt,text/plain" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setResultUrl(null); } }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={() => { setFile(null); setResultUrl(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {error && <p style={{ color: "#E84545", fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: "#E8454512", borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>{pageCount} sayfa PDF oluşturuldu</p>
              <a href={resultUrl} download={downloadName}
                style={{ padding: "0.45rem 1rem", background: "#10B981", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                İndir
              </a>
            </div>
          )}

          <button onClick={convert} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "Dönüştürülüyor…" : "PDF'e Dönüştür"}
          </button>
        </>
      )}
    </div>
  );
}
