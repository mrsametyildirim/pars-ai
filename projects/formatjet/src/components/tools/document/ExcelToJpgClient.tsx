"use client";

import { useState, useRef } from "react";

const accentColor = "#3B82F6";

export default function ExcelToJpgClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState("");
  const [sheets, setSheets]   = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [jpgUrl, setJpgUrl]   = useState<string | null>(null);
  const [error, setError]     = useState("");
  const inputRef              = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function convert(sheetIdx?: number) {
    if (!file) return;
    const idx = sheetIdx ?? activeSheet;
    setLoading(true);
    setError("");
    setJpgUrl(null);
    setStatus("Excel dosyası okunuyor…");

    try {
      const XLSX = await import("xlsx");
      const ab   = await file.arrayBuffer();
      const wb   = XLSX.read(ab, { type: "array" });

      if (sheets.length === 0) setSheets(wb.SheetNames);

      const sheetName = wb.SheetNames[idx];
      const ws        = wb.Sheets[sheetName];
      const tableHtml = XLSX.utils.sheet_to_html(ws, { header: "" });

      setStatus("Görsel oluşturuluyor…");

      const styledHtml = `
        <html><head><style>
          * { box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px;
                 margin: 24px; color: #1a1a1a; background: #fff; min-width: 600px; }
          table { border-collapse: collapse; width: auto; }
          td, th { border: 1px solid #ccc; padding: 4px 8px; white-space: nowrap; }
          tr:nth-child(even) td { background: #f8fafc; }
          thead td, thead th { background: #e2e8f0; font-weight: 600; }
        </style></head><body>${tableHtml}</body></html>
      `;

      const url = await renderHtmlToJpg(styledHtml);
      setJpgUrl(url);
      setStatus("Tamamlandı!");
    } catch {
      setError("Dönüştürme başarısız. Excel dosyasının geçerli olduğundan emin olun.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 2000);
    }
  }

  function renderHtmlToJpg(html: string): Promise<string> {
    return new Promise(resolve => {
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:1200px;height:1px;visibility:hidden;";
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument!;
      doc.open(); doc.write(html); doc.close();

      requestAnimationFrame(() => requestAnimationFrame(() => {
        const body = doc.body;
        const w = Math.max(body.scrollWidth + 48, 400);
        const h = Math.max(body.scrollHeight + 48, 200);

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
          <foreignObject width="${w}" height="${h}">
            ${html}
          </foreignObject>
        </svg>`;
        const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl  = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width  = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(svgUrl);
          document.body.removeChild(iframe);
          resolve(canvas.toDataURL("image/jpeg", 0.92));
        };
        img.src = svgUrl;
      }));
    });
  }

  function download() {
    if (!jpgUrl || !file) return;
    const sheetName = sheets[activeSheet] || "sayfa1";
    const a = document.createElement("a");
    a.href = jpgUrl;
    a.download = file.name.replace(/\.[^.]+$/, "") + `_${sheetName}.jpg`;
    a.click();
  }

  function reset() {
    setFile(null); setSheets([]); setActiveSheet(0); setJpgUrl(null); setError(""); setStatus("");
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
            <path d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Excel dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>XLS, XLSX · Maksimum 20 MB</p>
          <input ref={inputRef} type="file" accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {sheets.length > 1 && (
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Sayfa Seç</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {sheets.map((name, i) => (
                  <button key={i} onClick={() => { setActiveSheet(i); setJpgUrl(null); }} style={{
                    padding: "0.35rem 0.75rem", borderRadius: "6px", border: `1px solid ${activeSheet === i ? accentColor : border}`,
                    background: activeSheet === i ? `${accentColor}18` : surface, color: activeSheet === i ? accentColor : textSec,
                    fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}
          {status && <p style={{ color: textSec, fontSize: "0.85rem", textAlign: "center" }}>{status}</p>}

          {jpgUrl && (
            <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${border}`, background: "#fff" }}>
              <img src={jpgUrl} alt="önizleme" style={{ width: "100%", display: "block", maxHeight: "300px", objectFit: "contain" }} />
            </div>
          )}

          {!jpgUrl ? (
            <button onClick={() => convert(activeSheet)} disabled={loading} style={{
              padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
              color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Dönüştürülüyor…" : "JPG'ye Dönüştür"}
            </button>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={download} style={{
                flex: 1, padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
                color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 600,
              }}>
                JPG İndir
              </button>
              <button onClick={() => setJpgUrl(null)} style={{
                padding: "0.875rem 1.25rem", borderRadius: "12px", border: `1px solid ${border}`,
                background: surface, color: textSec, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem",
              }}>
                Yeni
              </button>
            </div>
          )}
          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            Hücre renkleri ve grafikler desteklenmeyebilir. Sadece tablo içeriği dönüştürülür.
          </p>
        </>
      )}
    </div>
  );
}
