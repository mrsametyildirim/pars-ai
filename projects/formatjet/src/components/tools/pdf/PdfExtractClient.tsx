"use client";

import { useState, useRef } from "react";

type SelectMode = "grid" | "text";

function parsePages(input: string, max: number): number[] | null {
  const result = new Set<number>();
  const parts = input.split(",").map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      if (isNaN(a) || isNaN(b) || a < 1 || b > max || a > b) return null;
      for (let i = a; i <= b; i++) result.add(i);
    } else {
      const n = Number(part);
      if (isNaN(n) || n < 1 || n > max) return null;
      result.add(n);
    }
  }
  return result.size > 0 ? Array.from(result).sort((a, b) => a - b) : null;
}

export default function PdfExtractClient() {
  const [file, setFile]             = useState<File | null>(null);
  const [pageCount, setPageCount]   = useState(0);
  const [selected, setSelected]     = useState<Set<number>>(new Set());
  const [textInput, setTextInput]   = useState("");
  const [mode, setMode]             = useState<SelectMode>("grid");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const inputRef                    = useRef<HTMLInputElement>(null);

  const accentColor = "#E84545";

  async function handleFile(f: File) {
    setError("");
    setSelected(new Set());
    setTextInput("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc   = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
      setFile(f);
    } catch {
      setError("Geçersiz veya şifreli PDF dosyası.");
    }
  }

  function togglePage(n: number) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  }

  function selectAll() { setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i + 1))); }
  function clearAll()  { setSelected(new Set()); }

  async function extract() {
    if (!file) return;
    let pages: number[] | null;
    if (mode === "text") {
      pages = parsePages(textInput, pageCount);
      if (!pages) { setError("Geçersiz sayfa aralığı. Örnek: 1,3,5-8"); return; }
    } else {
      if (selected.size === 0) { setError("En az bir sayfa seçin."); return; }
      pages = Array.from(selected).sort((a, b) => a - b);
    }

    setLoading(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes  = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const outDoc = await PDFDocument.create();
      const copied = await outDoc.copyPages(srcDoc, pages.map(p => p - 1));
      copied.forEach(p => outDoc.addPage(p));
      const out  = await outDoc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.pdf$/i, `_sayfa_${pages[0]}${pages.length > 1 ? `-${pages[pages.length-1]}` : ""}.pdf`);
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Sayfa çıkarma başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  const surface   = "var(--color-surface)";
  const border    = "var(--color-border)";
  const textPri   = "var(--color-text)";
  const textSec   = "var(--color-text-2)";
  const textTer   = "var(--color-text-3)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Drop zone */}
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") handleFile(f); }}
          style={{
            border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem",
            textAlign: "center", cursor: "pointer", transition: "border-color 0.2s",
            background: surface,
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>PDF dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>Maksimum 50 MB</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : (
        <>
          {/* File info */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{pageCount} sayfa · {(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setPageCount(0); setSelected(new Set()); setError(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", background: surface, borderRadius: "10px", border: `1px solid ${border}`, padding: "4px", gap: "4px" }}>
            {(["grid", "text"] as SelectMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "0.5rem", borderRadius: "7px", border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: "0.8rem", fontWeight: 500,
                background: mode === m ? accentColor : "transparent",
                color: mode === m ? "#fff" : textSec,
                transition: "all 0.15s",
              }}>
                {m === "grid" ? "Tıklayarak Seç" : "Metin ile Gir"}
              </button>
            ))}
          </div>

          {mode === "grid" ? (
            <>
              {/* Select controls */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button onClick={selectAll} style={{ padding: "0.4rem 0.75rem", borderRadius: "8px", border: `1px solid ${border}`, background: surface, color: textSec, cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>Tümü</button>
                <button onClick={clearAll}  style={{ padding: "0.4rem 0.75rem", borderRadius: "8px", border: `1px solid ${border}`, background: surface, color: textSec, cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>Temizle</button>
                <span style={{ marginLeft: "auto", color: textTer, fontSize: "0.75rem" }}>{selected.size} sayfa seçili</span>
              </div>

              {/* Page grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))", gap: "0.5rem", maxHeight: "280px", overflowY: "auto", padding: "0.25rem" }}>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => {
                  const sel = selected.has(n);
                  return (
                    <button key={n} onClick={() => togglePage(n)} style={{
                      padding: "0.5rem 0.25rem", borderRadius: "8px", border: `1.5px solid ${sel ? accentColor : border}`,
                      background: sel ? `${accentColor}18` : surface, color: sel ? accentColor : textSec,
                      cursor: "pointer", fontSize: "0.8rem", fontWeight: sel ? 600 : 400, fontFamily: "inherit",
                      transition: "all 0.12s",
                    }}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                Sayfa numaraları (örn: 1, 3, 5-8, 12)
              </label>
              <input
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="1, 3-5, 7"
                style={{
                  width: "100%", padding: "0.625rem 0.875rem", borderRadius: "10px",
                  border: `1px solid ${border}`, background: surface, color: textPri,
                  fontSize: "0.875rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
          )}

          {error && (
            <div style={{ padding: "0.75rem 1rem", background: "rgba(232,69,69,0.1)", borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>
          )}

          <button onClick={extract} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1, transition: "opacity 0.15s",
          }}>
            {loading ? "İşleniyor…" : "Sayfaları Çıkar"}
          </button>
        </>
      )}
    </div>
  );
}
