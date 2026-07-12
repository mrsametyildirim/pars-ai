"use client";

import { useState, useRef } from "react";

const accentColor = "#3B82F6";

export default function WordToPdfClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState("");
  const [error, setError]     = useState("");
  const inputRef              = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function convert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setStatus("Dosya işleniyor…");
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>${file.name.replace(/\.[^.]+$/, "")}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    line-height: 1.6;
    margin: 0;
    padding: 2.54cm;
    color: #000;
    background: #fff;
  }
  h1, h2, h3, h4, h5, h6 { margin-top: 1em; margin-bottom: 0.5em; }
  p { margin: 0 0 0.8em; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  td, th { border: 1px solid #333; padding: 4px 8px; }
  img { max-width: 100%; height: auto; }
  @media print {
    @page { margin: 2.54cm; }
    body { padding: 0; }
  }
</style>
</head>
<body>
${result.value}
</body>
</html>`;

      setStatus("Yazdırma penceresi açılıyor…");

      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank", "width=800,height=600");
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
      setError("Dönüştürme başarısız. Dosyanın geçerli bir .docx olduğundan emin olun.");
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
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Word dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>DOCX formatı · Maksimum 50 MB</p>
          <input ref={inputRef} type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setError(""); setStatus(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ padding: "0.875rem 1rem", background: `${accentColor}10`, borderRadius: "10px", border: `1px solid ${accentColor}30` }}>
            <p style={{ color: textSec, fontSize: "0.83rem', margin: 0" }}>
              <strong style={{ color: textPri }}>Nasıl çalışır?</strong> Belge işlenip tarayıcı yazdırma diyalogunda açılır.
              "Hedef: PDF Olarak Kaydet" seçeneğiyle bilgisayarınıza kaydedin.
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
