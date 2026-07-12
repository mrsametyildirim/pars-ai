"use client";

import { useState, useRef } from "react";

type Mode = "excel-to-csv" | "csv-to-excel";

type Props = { mode: Mode };

export default function ExcelCsvClient({ mode }: Props) {
  const [file, setFile]       = useState<File | null>(null);
  const [sheets, setSheets]   = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const inputRef              = useRef<HTMLInputElement>(null);

  const isE2C = mode === "excel-to-csv";
  const accentColor = "#3B82F6";

  const accept = isE2C ? ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                       : ".csv,text/csv";

  async function handleFile(f: File) {
    setError("");
    setSheets([]);
    if (isE2C) {
      try {
        const XLSX   = await import("xlsx");
        const buffer = await f.arrayBuffer();
        const wb     = XLSX.read(buffer, { type: "array" });
        setSheets(wb.SheetNames);
        setActiveSheet(0);
        setFile(f);
      } catch {
        setError("Excel dosyası okunamadı.");
      }
    } else {
      setFile(f);
    }
  }

  async function convert() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const XLSX = await import("xlsx");
      if (isE2C) {
        const buffer   = await file.arrayBuffer();
        const wb       = XLSX.read(buffer, { type: "array" });
        const sheetName = wb.SheetNames[activeSheet] ?? wb.SheetNames[0];
        const ws       = wb.Sheets[sheetName];
        const csv      = XLSX.utils.sheet_to_csv(ws);
        const blob     = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
        const url      = URL.createObjectURL(blob);
        const a        = document.createElement("a");
        a.href         = url;
        a.download     = file.name.replace(/\.(xls|xlsx)$/i, "") + (sheets.length > 1 ? `_${sheetName}` : "") + ".csv";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const text  = await file.text();
        const ws    = XLSX.utils.aoa_to_sheet(
          text.split("\n").map(row =>
            row.split(",").map(cell => cell.replace(/^"|"$/g, "").replace(/""/g, '"'))
          )
        );
        const wb    = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const out   = XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
        const blob  = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url   = URL.createObjectURL(blob);
        const a     = document.createElement("a");
        a.href      = url;
        a.download  = file.name.replace(/\.csv$/i, "") + ".xlsx";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      setError("Dönüştürme başarısız. Lütfen dosyayı kontrol edin.");
    } finally {
      setLoading(false);
    }
  }

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          style={{
            border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem",
            textAlign: "center", cursor: "pointer", background: surface,
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>
            {isE2C ? "Excel dosyasını sürükle veya tıkla" : "CSV dosyasını sürükle veya tıkla"}
          </p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>
            {isE2C ? ".xls veya .xlsx" : ".csv"} · Maksimum 50 MB
          </p>
          <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>
                {isE2C && sheets.length > 0 ? `${sheets.length} sekme` : (file.size / 1024).toFixed(0) + " KB"}
              </p>
            </div>
            <button onClick={() => { setFile(null); setSheets([]); setError(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {isE2C && sheets.length > 1 && (
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.5rem" }}>Hangi sekmeyi dönüştür?</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {sheets.map((name, i) => (
                  <button key={name} onClick={() => setActiveSheet(i)} style={{
                    padding: "0.35rem 0.75rem", borderRadius: "8px", border: `1.5px solid ${activeSheet === i ? accentColor : border}`,
                    background: activeSheet === i ? `${accentColor}18` : surface,
                    color: activeSheet === i ? accentColor : textSec,
                    cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem", fontWeight: activeSheet === i ? 600 : 400,
                  }}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: "0.75rem 1rem", background: "rgba(59,130,246,0.1)", borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>
          )}

          <button onClick={convert} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Dönüştürülüyor…" : isE2C ? "CSV Olarak İndir" : "Excel Olarak İndir"}
          </button>
        </>
      )}
    </div>
  );
}
