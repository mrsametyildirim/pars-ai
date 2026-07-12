"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

type Row = string[];
type Sheet = { name: string; rows: Row[] };

function detectRows(items: Array<{ str: string; transform: number[] }>): Row[] {
  if (items.length === 0) return [];
  const lineMap = new Map<number, Array<{ x: number; str: string }>>();
  for (const item of items) {
    const y = Math.round(item.transform[5]);
    if (!lineMap.has(y)) lineMap.set(y, []);
    lineMap.get(y)!.push({ x: item.transform[4], str: item.str });
  }

  return [...lineMap.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, cells]) => {
      const sorted = cells.sort((a, b) => a.x - b.x);
      return sorted.map(c => c.str.trim()).filter(s => s.length > 0);
    })
    .filter(r => r.length > 0);
}

export default function PdfToExcelClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState("");
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function convert() {
    if (!file) return;
    setLoading(true); setError(""); setDone(false); setProgress(5);
    setStatus("PDF yükleniyor…");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

      const ab  = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
      const numPages = pdf.numPages;

      const sheets: Sheet[] = [];
      for (let i = 1; i <= numPages; i++) {
        setStatus(`Sayfa ${i}/${numPages} işleniyor…`);
        setProgress(Math.round((i / numPages) * 80) + 10);

        const page    = await pdf.getPage(i);
        const content = await page.getTextContent();
        const items   = content.items as Array<{ str: string; transform: number[] }>;
        const rows    = detectRows(items);
        sheets.push({ name: `Sayfa ${i}`, rows });
      }

      setStatus("Excel dosyası oluşturuluyor…");
      setProgress(95);

      const XLSX = await import("xlsx");
      const wb   = XLSX.utils.book_new();
      for (const sheet of sheets) {
        if (sheet.rows.length === 0) continue;
        const ws = XLSX.utils.aoa_to_sheet(sheet.rows);
        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
      }

      const xlsxData = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([xlsxData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.pdf$/i, "") + ".xlsx";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true); setProgress(100); setStatus("Tamamlandı!");
    } catch (e) {
      setError("Dönüştürme başarısız: " + (e instanceof Error ? e.message : ""));
    } finally {
      setLoading(false);
      setTimeout(() => { setProgress(0); setStatus(""); }, 3000);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) setFile(f); }}
          style={{ border:`2px dashed ${border}`,borderRadius:"16px",padding:"3rem 2rem",textAlign:"center",cursor:"pointer",background:surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin:"0 auto 1rem" }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/>
          </svg>
          <p style={{ color:textPri,fontWeight:500,marginBottom:"0.25rem" }}>PDF dosyasını sürükle veya tıkla</p>
          <p style={{ color:textTer,fontSize:"0.8rem" }}>Her sayfa ayrı Excel sayfasına dönüşür · Maks 50 MB</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display:"none" }}
            onChange={e => { const f=e.target.files?.[0]; if(f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.875rem 1rem",background:surface,borderRadius:"12px",border:`1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ color:textPri,fontSize:"0.875rem",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</p>
              <p style={{ color:textTer,fontSize:"0.75rem" }}>{(file.size/1024/1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setDone(false); setError(""); }} style={{ background:"none",border:"none",cursor:"pointer",color:textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ padding:"0.75rem",background:`${accentColor}0D`,borderRadius:"10px",border:`1px solid ${accentColor}30`,fontSize:"0.8rem",color:textSec }}>
            Her PDF sayfası ayrı bir Excel sekmesine aktarılır. Tablo yapısı metindeki kolon hizalamasına göre belirlenir.
          </div>

          {error && <div style={{ padding:"0.75rem 1rem",background:`${accentColor}18`,borderRadius:"10px",color:accentColor,fontSize:"0.85rem" }}>{error}</div>}
          {done  && <div style={{ padding:"0.75rem 1rem",background:"rgba(16,185,129,0.1)",borderRadius:"10px",border:"1px solid rgba(16,185,129,0.3)",color:"#10B981",fontSize:"0.85rem" }}>Excel dosyası oluşturuldu!</div>}

          {(loading || (progress > 0 && !done)) && (
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.35rem" }}>
                <span style={{ color:textSec,fontSize:"0.8rem" }}>{status}</span>
                <span style={{ color:textTer,fontSize:"0.75rem" }}>{progress>0?progress+"%":""}</span>
              </div>
              <div style={{ height:"4px",background:border,borderRadius:"4px",overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${progress}%`,background:accentColor,borderRadius:"4px",transition:"width 0.3s" }} />
              </div>
            </div>
          )}

          <button onClick={convert} disabled={loading} style={{
            padding:"0.875rem",borderRadius:"12px",border:"none",background:accentColor,
            color:"#fff",cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",
            fontSize:"0.9rem",fontWeight:600,opacity:loading?0.7:1,
          }}>
            {loading ? "Dönüştürülüyor…" : "Excel'e Dönüştür"}
          </button>
        </>
      )}
    </div>
  );
}
