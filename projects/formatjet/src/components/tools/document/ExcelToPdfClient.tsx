"use client";

import { useState, useRef } from "react";

const accentColor = "#3B82F6";

export default function ExcelToPdfClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [sheets, setSheets]     = useState<string[]>([]);
  const [activeSheet, setActive] = useState(0);
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState("");
  const [error, setError]       = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function loadFile(f: File) {
    setFile(f);
    setError("");
    try {
      const XLSX = await import("xlsx");
      const buffer = await f.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      setSheets(wb.SheetNames);
      setActive(0);
    } catch {
      setError("Dosya okunamadı.");
    }
  }

  async function convert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setStatus("Tablo işleniyor…");
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[activeSheet]];
      const html = XLSX.utils.sheet_to_html(ws);
      const sheetName = wb.SheetNames[activeSheet];

      const fullHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>${sheetName}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: Arial, sans-serif;
    font-size: 9pt;
    margin: 0;
    padding: 1cm;
    color: #000;
    background: #fff;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    table-layout: auto;
  }
  td, th {
    border: 1px solid #999;
    padding: 3px 6px;
    white-space: nowrap;
    vertical-align: middle;
  }
  tr:nth-child(even) td { background: #f5f5f5; }
  @media print {
    @page { margin: 1cm; size: landscape; }
    body { padding: 0; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
  }
</style>
</head>
<body>${html}</body>
</html>`;

      setStatus("Yazdırma penceresi açılıyor…");

      const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank", "width=1000,height=700");
      if (!printWindow) {
        URL.revokeObjectURL(url);
        setError("Tarayıcınız pop-up penceresini engelledi. Pop-up'a izin verin ve tekrar deneyin.");
        return;
      }
      printWindow.addEventListener("load", () => {
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        }, 500);
      });

      setStatus("Yazdırma diyalogunda 'PDF olarak kaydet' seçin.");
    } catch (e: unknown) {
      setError("Dönüştürme başarısız.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Excel dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>XLSX, XLS formatları · Maksimum 50 MB</p>
          <input ref={inputRef} type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{sheets.length} sayfa · {(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setSheets([]); setError(""); setStatus(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {sheets.length > 1 && (
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Sayfa Seç</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {sheets.map((s, i) => (
                  <button key={i} onClick={() => setActive(i)} style={{
                    padding: "0.35rem 0.75rem", borderRadius: "6px", border: `1px solid ${activeSheet === i ? accentColor : border}`,
                    background: activeSheet === i ? `${accentColor}18` : surface, color: activeSheet === i ? accentColor : textSec,
                    fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: "0.75rem 1rem", background: `${accentColor}10`, borderRadius: "10px", border: `1px solid ${accentColor}30` }}>
            <p style={{ color: textSec, fontSize: "0.83rem", margin: 0 }}>
              Tablo PDF yazdırma modunda açılır. Tarayıcıda <strong style={{ color: textPri }}>"PDF Olarak Kaydet"</strong> seçeneğiyle kaydedin.
              Yatay baskı otomatik uygulanır.
            </p>
          </div>

          {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}
          {status && !error && <p style={{ color: textSec, fontSize: "0.85rem" }}>{status}</p>}

          <button onClick={convert} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "İşleniyor…" : "PDF Olarak Dönüştür"}
          </button>
        </>
      )}
    </div>
  );
}
