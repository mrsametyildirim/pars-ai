"use client";

import { useState, useRef } from "react";

type ImageFormat = "jpeg" | "png";
type Scale = 1 | 2 | 4;

export default function PdfToJpgClient() {
  const [file, setFile]           = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [previews, setPreviews]   = useState<string[]>([]);
  const [format, setFormat]       = useState<ImageFormat>("jpeg");
  const [scale, setScale]         = useState<Scale>(2);
  const [quality, setQuality]     = useState(0.92);
  const [loading, setLoading]     = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState("");
  const inputRef                  = useRef<HTMLInputElement>(null);

  const accentColor = "#E84545";

  async function initPdf(f: File) {
    setError("");
    setPreviews([]);
    setLoading(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

      const arrayBuffer = await f.arrayBuffer();
      const pdf         = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const count       = pdf.numPages;
      setPageCount(count);
      setFile(f);

      const thumbs: string[] = [];
      for (let i = 1; i <= Math.min(count, 6); i++) {
        const page     = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas   = document.createElement("canvas");
        canvas.width   = viewport.width;
        canvas.height  = viewport.height;
        await page.render({ canvas, viewport }).promise;
        thumbs.push(canvas.toDataURL("image/jpeg", 0.7));
        setProgress(Math.round((i / Math.min(count, 6)) * 100));
      }
      setPreviews(thumbs);
    } catch {
      setError("PDF yüklenemedi. Lütfen şifresiz geçerli bir PDF seçin.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }

  async function convertAll() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf         = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const baseName    = file.name.replace(/\.pdf$/i, "");

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(Math.round((i / pdf.numPages) * 100));
        const page     = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas   = document.createElement("canvas");
        canvas.width   = viewport.width;
        canvas.height  = viewport.height;
        await page.render({ canvas, viewport }).promise;

        const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
        const ext      = format === "jpeg" ? "jpg" : "png";

        await new Promise<void>(resolve => {
          canvas.toBlob(blob => {
            if (!blob) { resolve(); return; }
            const url = URL.createObjectURL(blob);
            const a   = document.createElement("a");
            a.href     = url;
            a.download = `${baseName}_sayfa_${String(i).padStart(2, "0")}.${ext}`;
            a.click();
            URL.revokeObjectURL(url);
            resolve();
          }, mimeType, quality);
        });

        await new Promise(r => setTimeout(r, 100));
      }
    } catch {
      setError("Dönüştürme başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
      setProgress(0);
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
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") initPdf(f); }}
          style={{
            border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem",
            textAlign: "center", cursor: loading ? "wait" : "pointer", background: surface,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = accentColor; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
          {loading ? (
            <>
              <p style={{ color: textPri, fontWeight: 500 }}>Önizleme oluşturuluyor… {progress}%</p>
              <div style={{ marginTop: "0.75rem", height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </>
          ) : (
            <>
              <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>PDF dosyasını sürükle veya tıkla</p>
              <p style={{ color: textTer, fontSize: "0.8rem" }}>Maksimum 100 MB</p>
            </>
          )}
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) initPdf(f); }} />
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
            <button onClick={() => { setFile(null); setPageCount(0); setPreviews([]); setError(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Page previews */}
          {previews.length > 0 && (
            <div>
              <p style={{ color: textTer, fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                {previews.length < pageCount ? `İlk ${previews.length} sayfa önizleme` : "Önizleme"}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                {previews.map((src, i) => (
                  <img key={i} src={src} alt={`Sayfa ${i + 1}`}
                    style={{ height: "100px", borderRadius: "6px", border: `1px solid ${border}`, flexShrink: 0 }} />
                ))}
                {pageCount > 6 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px", minWidth: "60px", borderRadius: "6px", border: `1px solid ${border}`, background: surface, color: textTer, fontSize: "0.75rem", textAlign: "center", padding: "0.5rem" }}>
                    +{pageCount - 6} sayfa
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Format</label>
              <div style={{ display: "flex", background: surface, borderRadius: "10px", border: `1px solid ${border}`, padding: "3px", gap: "3px" }}>
                {(["jpeg", "png"] as ImageFormat[]).map(f => (
                  <button key={f} onClick={() => setFormat(f)} style={{
                    flex: 1, padding: "0.4rem", borderRadius: "7px", border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: "0.8rem", fontWeight: 500,
                    background: format === f ? accentColor : "transparent",
                    color: format === f ? "#fff" : textSec,
                  }}>
                    {f === "jpeg" ? "JPG" : "PNG"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Çözünürlük</label>
              <div style={{ display: "flex", background: surface, borderRadius: "10px", border: `1px solid ${border}`, padding: "3px", gap: "3px" }}>
                {([1, 2, 4] as Scale[]).map(s => (
                  <button key={s} onClick={() => setScale(s)} style={{
                    flex: 1, padding: "0.4rem", borderRadius: "7px", border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: "0.8rem", fontWeight: 500,
                    background: scale === s ? accentColor : "transparent",
                    color: scale === s ? "#fff" : textSec,
                  }}>
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </div>

          {format === "jpeg" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label style={{ color: textSec, fontSize: "0.8rem" }}>Kalite</label>
                <span style={{ color: textTer, fontSize: "0.75rem", fontFamily: "monospace" }}>{Math.round(quality * 100)}%</span>
              </div>
              <input type="range" min={50} max={100} value={Math.round(quality * 100)}
                onChange={e => setQuality(Number(e.target.value) / 100)}
                style={{ width: "100%", accentColor }} />
            </div>
          )}

          {error && (
            <div style={{ padding: "0.75rem 1rem", background: "rgba(232,69,69,0.1)", borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>
          )}

          {loading && progress > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>Dönüştürülüyor…</span>
                <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress}%</span>
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}

          <button onClick={convertAll} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Dönüştürülüyor…" : `Tüm Sayfaları ${format === "jpeg" ? "JPG" : "PNG"} Olarak İndir`}
          </button>
          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            {pageCount} sayfa ayrı dosyalar olarak indirilecek
          </p>
        </>
      )}
    </div>
  );
}
