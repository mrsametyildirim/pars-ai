"use client";

import { useState, useRef } from "react";

const accentColor = "#3B82F6";

export default function CsvToPdfClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);
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
      const XLSX     = (await import("xlsx")).default;
      const { jsPDF } = await import("jspdf");

      const text  = await file.text();
      const wb    = XLSX.read(text, { type: "string" });
      const ws    = wb.Sheets[wb.SheetNames[0]];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows  = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 }) as string[][];
      if (!rows.length) throw new Error("CSV boş veya okunamıyor");

      setRowCount(rows.length);
      const headers = rows[0].map(String);
      const data    = rows.slice(1).map(r => headers.map((_, i) => String(r[i] ?? "")));

      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const PAGE_W = 841.89, PAGE_H = 595.28;
      const MARGIN = 32, ROW_H = 18, HEADER_H = 22;
      const FONT_SIZE_H = 8, FONT_SIZE_D = 7.5;

      const colCount = headers.length;
      const maxColW  = (PAGE_W - MARGIN * 2) / colCount;
      const colWidths = headers.map(() => Math.min(maxColW, 120));
      const tableW   = colWidths.reduce((a, b) => a + b, 0);
      const startX   = (PAGE_W - tableW) / 2;

      let y = MARGIN;
      let isFirst = true;

      const drawHeader = () => {
        doc.setFillColor(40, 80, 180);
        doc.rect(startX, y, tableW, HEADER_H, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(FONT_SIZE_H);
        doc.setFont("helvetica", "bold");
        let cx = startX;
        headers.forEach((h, i) => {
          const cellText = h.length > 20 ? h.slice(0, 19) + "…" : h;
          doc.text(cellText, cx + 4, y + HEADER_H - 6);
          cx += colWidths[i];
        });
        y += HEADER_H;
      };

      let rowsOnPage = 0;
      const rowsPerPage = Math.floor((PAGE_H - MARGIN * 2 - HEADER_H) / ROW_H);

      doc.setFontSize(FONT_SIZE_D);
      doc.setFont("helvetica", "normal");

      for (let ri = 0; ri < data.length; ri++) {
        if (isFirst || rowsOnPage >= rowsPerPage) {
          if (!isFirst) { doc.addPage(); y = MARGIN; }
          drawHeader();
          rowsOnPage = 0;
          isFirst = false;
        }

        const fillColor = rowsOnPage % 2 === 0 ? [248, 249, 252] : [255, 255, 255];
        doc.setFillColor(...fillColor as [number,number,number]);
        doc.rect(startX, y, tableW, ROW_H, "F");
        doc.setDrawColor(220, 222, 228);
        doc.rect(startX, y, tableW, ROW_H, "S");

        doc.setTextColor(30, 30, 30);
        let cx = startX;
        data[ri].forEach((cell, i) => {
          const cellText = cell.length > 25 ? cell.slice(0, 24) + "…" : cell;
          doc.text(cellText, cx + 4, y + ROW_H - 5);
          cx += colWidths[i];
        });

        y += ROW_H;
        rowsOnPage++;
      }

      const pdfBlob = doc.output("blob");
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(pdfBlob));
    } catch (e) {
      setError("Dönüştürme başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  const downloadName = file ? file.name.replace(/\.(csv|xlsx?)$/i, ".pdf") : "output.pdf";

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
            <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5z"/><path d="M9 3v5h10"/>
            <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>CSV dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>Tablo olarak PDF'e aktarılır · Yatay A4</p>
          <input ref={inputRef} type="file" accept=".csv,text/csv" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setResultUrl(null); } }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5z"/>
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
              <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>{rowCount} satır PDF'e aktarıldı</p>
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
