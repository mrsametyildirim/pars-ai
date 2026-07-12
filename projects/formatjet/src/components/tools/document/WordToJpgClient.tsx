"use client";

import { useState, useRef } from "react";

const accentColor = "#3B82F6";
const A4_WIDTH = 794;

export default function WordToJpgClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState("");
  const [jpgUrls, setJpgUrls]   = useState<string[]>([]);
  const [error, setError]       = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function convert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setJpgUrls([]);
    setStatus("Word belgesi okunuyor…");

    try {
      const mammoth = await import("mammoth");
      const ab = await file.arrayBuffer();
      const { value: rawHtml } = await mammoth.convertToHtml({ arrayBuffer: ab });
      setStatus("Görsel oluşturuluyor…");

      const styledHtml = `
        <html><head><style>
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; line-height: 1.6;
                 margin: 40px 48px; color: #1a1a1a; background: #fff; width: ${A4_WIDTH - 96}px; }
          h1,h2,h3 { margin-top: 1em; }
          table { border-collapse: collapse; width: 100%; margin: 0.75em 0; }
          td, th { border: 1px solid #ccc; padding: 4px 8px; }
          p { margin: 0.4em 0; }
          img { max-width: 100%; }
        </style></head><body>${rawHtml}</body></html>
      `;

      const urls = await htmlToJpgPages(styledHtml, A4_WIDTH);
      setJpgUrls(urls);
      setStatus("Tamamlandı!");
    } catch {
      setError("Dönüştürme başarısız. Dosyanın geçerli bir Word belgesi olduğundan emin olun.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 2000);
    }
  }

  async function htmlToJpgPages(html: string, width: number): Promise<string[]> {
    return new Promise((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.style.cssText = `position:fixed;left:-9999px;top:0;width:${width}px;height:1px;visibility:hidden;`;
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument!;
      doc.open(); doc.write(html); doc.close();

      requestAnimationFrame(() => requestAnimationFrame(async () => {
        const bodyEl = doc.body;
        const totalH = Math.max(bodyEl.scrollHeight, bodyEl.offsetHeight, 400);
        const PAGE_H = 1122;
        const pages: string[] = [];
        const pageCount = Math.ceil(totalH / PAGE_H);

        for (let i = 0; i < pageCount; i++) {
          const sliceH = Math.min(PAGE_H, totalH - i * PAGE_H);
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${sliceH}">
            <foreignObject x="0" y="${-i * PAGE_H}" width="${width}" height="${totalH}">
              ${html}
            </foreignObject>
          </svg>`;
          const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
          const svgUrl  = URL.createObjectURL(svgBlob);
          const jpgUrl  = await svgToJpg(svgUrl, width, sliceH);
          URL.revokeObjectURL(svgUrl);
          pages.push(jpgUrl);
        }

        document.body.removeChild(iframe);
        resolve(pages);
      }));
    });
  }

  function svgToJpg(svgUrl: string, w: number, h: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.src = svgUrl;
    });
  }

  function downloadAll() {
    if (!file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    jpgUrls.forEach((url, i) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = jpgUrls.length === 1 ? `${base}.jpg` : `${base}_sayfa${i + 1}.jpg`;
      a.click();
    });
  }

  function reset() {
    jpgUrls.forEach(URL.revokeObjectURL);
    setFile(null); setJpgUrls([]); setError(""); setStatus("");
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
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Word dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>DOC, DOCX · Maksimum 20 MB</p>
          <input ref={inputRef} type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}

          {status && <p style={{ color: textSec, fontSize: "0.85rem", textAlign: "center" }}>{status}</p>}

          {jpgUrls.length > 0 && (
            <div>
              <p style={{ color: textSec, fontSize: "0.8rem", marginBottom: "0.5rem" }}>{jpgUrls.length} sayfa oluşturuldu</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
                {jpgUrls.map((url, i) => (
                  <div key={i} style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${border}`, background: "#fff" }}>
                    <img src={url} alt={`Sayfa ${i + 1}`} style={{ width: "100%", display: "block" }} />
                    <div style={{ padding: "0.4rem 0.5rem", fontSize: "0.7rem", color: textTer, textAlign: "center" }}>Sayfa {i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {jpgUrls.length === 0 ? (
            <button onClick={convert} disabled={loading} style={{
              padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
              color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Dönüştürülüyor…" : "JPG'ye Dönüştür"}
            </button>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={downloadAll} style={{
                flex: 1, padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
                color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 600,
              }}>
                {jpgUrls.length === 1 ? "JPG İndir" : `Tümünü İndir (${jpgUrls.length} dosya)`}
              </button>
              <button onClick={reset} style={{
                padding: "0.875rem 1.25rem", borderRadius: "12px", border: `1px solid ${border}`,
                background: surface, color: textSec, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem",
              }}>
                Yeni
              </button>
            </div>
          )}
          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            Karmaşık formatlamalar (tablo, grafik, özel font) sınırlı desteklenebilir.
          </p>
        </>
      )}
    </div>
  );
}
