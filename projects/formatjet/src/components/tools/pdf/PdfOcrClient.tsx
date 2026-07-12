"use client";

import { useState, useRef } from "react";

type Lang = "tur" | "eng" | "deu" | "fra" | "spa";

const LANG_LABELS: Record<Lang, string> = {
  tur: "Türkçe",
  eng: "İngilizce",
  deu: "Almanca",
  fra: "Fransızca",
  spa: "İspanyolca",
};

const accentColor = "#E84545";

export default function PdfOcrClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [lang, setLang]         = useState<Lang>("tur");
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState("");
  const [result, setResult]     = useState("");
  const [error, setError]       = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);
  const textRef                 = useRef<HTMLTextAreaElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function runOcr() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult("");
    setProgress(5);
    setStatus("PDF sayfaları yükleniyor…");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const { createWorker } = await import("tesseract.js");
      setStatus("OCR motoru başlatılıyor…");
      setProgress(15);

      const worker = await createWorker(lang, 1, {
        workerPath: "/tessdata/worker.min.js",
        langPath: "/tessdata",
        corePath: "/tessdata/tesseract-core-lstm.js",
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 60) + 30);
          }
        },
      });

      let fullText = "";
      for (let i = 1; i <= numPages; i++) {
        setStatus(`Sayfa ${i}/${numPages} taranıyor…`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width  = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, viewport }).promise;

        const { data: { text } } = await worker.recognize(canvas);
        if (text.trim()) {
          fullText += `--- Sayfa ${i} ---\n${text.trim()}\n\n`;
        }
      }

      await worker.terminate();
      setResult(fullText.trim() || "(Metin bulunamadı — görüntü kalitesi düşük olabilir)");
      setProgress(100);
      setStatus("Tamamlandı!");
    } catch (e: unknown) {
      setError("OCR işlemi başarısız. Dosyanın geçerli bir PDF olduğundan emin olun.");
      console.error(e);
    } finally {
      setLoading(false);
      setTimeout(() => { setStatus(""); setProgress(0); }, 3000);
    }
  }

  function copyText() {
    if (textRef.current) {
      navigator.clipboard.writeText(result);
      textRef.current.select();
    }
  }

  function downloadText() {
    if (!result || !file) return;
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = file.name.replace(/\.[^.]+$/, "") + "_ocr.txt";
    a.click();
    URL.revokeObjectURL(url);
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
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Taranmış PDF'i sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>Metin içermeyen, görüntü tabanlı PDF · Maksimum 30 MB</p>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setResult(""); setError(""); setStatus(""); setProgress(0); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {!result && (
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>OCR Dili</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {(Object.entries(LANG_LABELS) as [Lang, string][]).map(([l, label]) => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    padding: "0.35rem 0.75rem", borderRadius: "6px", border: `1px solid ${lang === l ? accentColor : border}`,
                    background: lang === l ? `${accentColor}18` : surface, color: lang === l ? accentColor : textSec,
                    fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}

          {(loading || progress > 0 && !result) && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>{status}</span>
                <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress > 0 ? progress + "%" : ""}</span>
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.5s" }} />
              </div>
            </div>
          )}

          {result && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ color: textSec, fontSize: "0.8rem" }}>Tanınan Metin</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={copyText} style={{ padding: "0.25rem 0.6rem", borderRadius: "6px", border: `1px solid ${border}`, background: surface, color: textSec, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                    Kopyala
                  </button>
                  <button onClick={downloadText} style={{ padding: "0.25rem 0.6rem", borderRadius: "6px", border: `1px solid ${accentColor}`, background: `${accentColor}18`, color: accentColor, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                    .txt İndir
                  </button>
                </div>
              </div>
              <textarea ref={textRef} value={result} readOnly
                style={{ width: "100%", minHeight: "220px", padding: "0.875rem", borderRadius: "10px", border: `1px solid ${border}`, background: surface, color: textPri, fontFamily: "monospace", fontSize: "0.8rem", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }}
              />
            </div>
          )}

          {!result && (
            <button onClick={runOcr} disabled={loading} style={{
              padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
              color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "OCR Çalışıyor…" : "Metni Tanı (OCR)"}
            </button>
          )}
          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            Çok sayfalı PDF'ler uzun sürebilir. Tesseract.js motoruyla çevrimdışı çalışır.
          </p>
        </>
      )}
    </div>
  );
}
