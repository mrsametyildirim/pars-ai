"use client";

import { useState, useRef } from "react";

type SplitMode = "pages" | "range" | "every";

type PdfState = {
  file: File;
  pageCount: number;
  error?: string;
};

function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function parsePages(input: string, max: number): number[] | null {
  const pages = new Set<number>();
  for (const part of input.split(",")) {
    const t = part.trim();
    if (!t) continue;
    const range = t.match(/^(\d+)-(\d+)$/);
    if (range) {
      const lo = parseInt(range[1]), hi = parseInt(range[2]);
      if (lo < 1 || hi > max || lo > hi) return null;
      for (let i = lo; i <= hi; i++) pages.add(i);
    } else {
      const n = parseInt(t);
      if (isNaN(n) || n < 1 || n > max) return null;
      pages.add(n);
    }
  }
  return pages.size > 0 ? Array.from(pages).sort((a, b) => a - b) : null;
}

export default function PdfSplitClient() {
  const [pdf,        setPdf]        = useState<PdfState | null>(null);
  const [mode,       setMode]       = useState<SplitMode>("pages");
  const [rangeInput, setRangeInput] = useState("");
  const [everyN,     setEveryN]     = useState("1");
  const [processing, setProcessing] = useState(false);
  const [results,    setResults]    = useState<{ name: string; blob: Blob; url: string }[]>([]);
  const [error,      setError]      = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (file: File) => {
    setResults([]);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc   = await PDFDocument.load(bytes);
      setPdf({ file, pageCount: doc.getPageCount() });
    } catch {
      setPdf({ file, pageCount: 0, error: "PDF okunamadı" });
    }
  };

  const split = async () => {
    if (!pdf || !pdf.pageCount) return;
    setProcessing(true);
    setError("");
    setResults([]);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const srcBytes = await pdf.file.arrayBuffer();
      const srcDoc   = await PDFDocument.load(srcBytes);
      const baseName = pdf.file.name.replace(/\.pdf$/i, "");
      const out: { name: string; blob: Blob; url: string }[] = [];

      if (mode === "pages") {
        /* Her sayfa ayrı PDF */
        for (let i = 0; i < srcDoc.getPageCount(); i++) {
          const doc = await PDFDocument.create();
          const [page] = await doc.copyPages(srcDoc, [i]);
          doc.addPage(page);
          const bytes = await doc.save();
          const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
          out.push({ name: `${baseName}-sayfa-${i + 1}.pdf`, blob, url: URL.createObjectURL(blob) });
        }
      } else if (mode === "range") {
        const pages = parsePages(rangeInput, srcDoc.getPageCount());
        if (!pages) { setError("Geçersiz sayfa aralığı"); setProcessing(false); return; }
        const doc = await PDFDocument.create();
        const copied = await doc.copyPages(srcDoc, pages.map(p => p - 1));
        copied.forEach(p => doc.addPage(p));
        const bytes = await doc.save();
        const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
        out.push({ name: `${baseName}-secilmis.pdf`, blob, url: URL.createObjectURL(blob) });
      } else {
        /* Her N sayfada böl */
        const n = Math.max(1, parseInt(everyN) || 1);
        const total = srcDoc.getPageCount();
        for (let i = 0; i < total; i += n) {
          const indices = Array.from({ length: Math.min(n, total - i) }, (_, k) => i + k);
          const doc = await PDFDocument.create();
          const copied = await doc.copyPages(srcDoc, indices);
          copied.forEach(p => doc.addPage(p));
          const bytes = await doc.save();
          const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
          const part  = Math.floor(i / n) + 1;
          out.push({ name: `${baseName}-bolum-${part}.pdf`, blob, url: URL.createObjectURL(blob) });
        }
      }

      setResults(out);
    } catch {
      setError("Bölme işlemi başarısız");
    }
    setProcessing(false);
  };

  const downloadAll = () => results.forEach(r => {
    const a = document.createElement("a");
    a.href = r.url; a.download = r.name; a.click();
  });

  const reset = () => {
    results.forEach(r => URL.revokeObjectURL(r.url));
    setPdf(null); setResults([]); setError("");
  };

  return (
    <div className="space-y-5">

      {/* Mod seçimi */}
      <div className="p-4 rounded-xl border space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="flex gap-2">
          {([
            { v: "pages" as SplitMode, l: "Her Sayfayı Ayır" },
            { v: "range" as SplitMode, l: "Sayfa Seç" },
            { v: "every" as SplitMode, l: "N Sayfada Böl" },
          ]).map(m => (
            <button key={m.v} onClick={() => setMode(m.v)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: mode === m.v ? "#E84545" : "transparent",
                color:      mode === m.v ? "#fff" : "var(--color-text-2)",
                border:     `1px solid ${mode === m.v ? "#E84545" : "var(--color-border)"}`,
              }}>
              {m.l}
            </button>
          ))}
        </div>

        {mode === "range" && (
          <div>
            <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>
              Sayfa numaraları (örn. 1,3,5-8,12)
              {pdf && <span> — Toplam {pdf.pageCount} sayfa</span>}
            </label>
            <input type="text" value={rangeInput} onChange={e => setRangeInput(e.target.value)}
              placeholder="1,3,5-8,12"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
              style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
          </div>
        )}

        {mode === "every" && (
          <div>
            <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>Her kaç sayfada bir böl?</label>
            <input type="number" min={1} max={100} value={everyN} onChange={e => setEveryN(e.target.value)}
              className="w-32 px-3 py-2 rounded-lg text-sm outline-none border"
              style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
          </div>
        )}
      </div>

      {/* Drop zone / Dosya bilgisi */}
      {!pdf ? (
        <div onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer transition-all hover:opacity-80"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="text-4xl mb-3">✂️</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF dosyasını buraya sürükle</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>veya tıkla seç</p>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only"
            onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 rounded-xl border"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{pdf.file.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>
              {formatSize(pdf.file.size)} · {pdf.pageCount} sayfa
            </p>
          </div>
          <button onClick={reset} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-text-3)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm px-4 py-2 rounded-lg" style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>
          {error}
        </p>
      )}

      {/* Sonuçlar */}
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{results.length} parça oluşturuldu</p>
            <button onClick={downloadAll} className="text-sm font-medium hover:underline" style={{ color: "#E84545" }}>
              Tümünü İndir
            </button>
          </div>
          {results.slice(0, 20).map(r => (
            <div key={r.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <span className="text-sm truncate" style={{ color: "var(--color-text)" }}>{r.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs" style={{ color: "var(--color-text-3)" }}>{formatSize(r.blob.size)}</span>
                <a href={r.url} download={r.name}
                  className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "#E84545" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
          {results.length > 20 && (
            <p className="text-xs text-center" style={{ color: "var(--color-text-3)" }}>
              +{results.length - 20} dosya daha — "Tümünü İndir" ile hepsini al
            </p>
          )}
        </div>
      )}

      {/* Aksiyon */}
      {pdf && !pdf.error && results.length === 0 && (
        <button onClick={split} disabled={processing}
          className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ background: "#E84545", color: "#fff" }}>
          {processing ? "Bölünüyor..." : "PDF'i Böl"}
        </button>
      )}
    </div>
  );
}
