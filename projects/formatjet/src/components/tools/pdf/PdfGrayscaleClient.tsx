"use client";

import { useState, useRef } from "react";

const accentColor = "#E84545";

export default function PdfGrayscaleClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError]     = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function apply() {
    if (!file) return;
    setLoading(true); setError(""); setResultUrl(null); setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      const { PDFDocument } = await import("pdf-lib");

      const bytes   = await file.arrayBuffer();
      const srcPdf  = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
      const pageCount = srcPdf.numPages;
      const dstPdf  = await PDFDocument.create();

      for (let i = 1; i <= pageCount; i++) {
        setProgress(Math.round((i / pageCount) * 90));
        const page     = await srcPdf.getPage(i);
        const vp       = page.getViewport({ scale: 1.5 });
        const canvas   = document.createElement("canvas");
        canvas.width   = vp.width;
        canvas.height  = vp.height;
        const ctx      = canvas.getContext("2d")!;

        await page.render({ canvasContext: ctx, canvas, viewport: vp }).promise;

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data    = imgData.data;
        for (let p = 0; p < data.length; p += 4) {
          const lum = Math.round(0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]);
          data[p] = data[p + 1] = data[p + 2] = lum;
        }
        ctx.putImageData(imgData, 0, 0);

        const jpegBlob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), "image/jpeg", 0.88));
        const jpegArr  = new Uint8Array(await jpegBlob.arrayBuffer());
        const embImg   = await dstPdf.embedJpg(jpegArr);
        const dstPage  = dstPdf.addPage([vp.width / 1.5, vp.height / 1.5]);
        dstPage.drawImage(embImg, { x: 0, y: 0, width: vp.width / 1.5, height: vp.height / 1.5 });
      }

      setProgress(95);
      const out  = await dstPdf.save();
      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
    } catch (e) {
      setError("İşlem başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  const downloadName = file ? file.name.replace(/\.pdf$/i, "-gri.pdf") : "output.pdf";

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
            <circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9 2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9 2.83-2.83"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>PDF dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>PDF · Maksimum 50 MB — Tüm sayfalar görsel olarak dönüştürülür</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setResultUrl(null); } }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586l5.414 5.414V19a2 2 0 0 1-2 2z"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button onClick={() => { setFile(null); setResultUrl(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "0.875rem 1rem" }}>
            <p style={{ color: textTer, fontSize: "0.8rem" }}>Her sayfa renkli olarak render edilip gri tona dönüştürülür. Metin katmanı görsel hale gelir (aranabilirlik kaybolur).</p>
          </div>

          {loading && progress > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>Sayfalar işleniyor…</span>
                <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress}%</span>
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}

          {error && <p style={{ color: accentColor, fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: `${accentColor}12`, borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>Gri tona dönüştürüldü!</p>
              <a href={resultUrl} download={downloadName}
                style={{ padding: "0.45rem 1rem", background: "#10B981", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                İndir
              </a>
            </div>
          )}

          <button onClick={apply} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "İşleniyor…" : "Gri Tona Çevir"}
          </button>
        </>
      )}
    </div>
  );
}
