"use client";

import { useState, useRef } from "react";

function formatSize(b: number) {
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

export default function PdfPageDeleteClient() {
  const [file,       setFile]       = useState<File | null>(null);
  const [pageCount,  setPageCount]  = useState(0);
  const [selected,   setSelected]   = useState<number[]>([]);
  const [pageInput,  setPageInput]  = useState("");
  const [inputMode,  setInputMode]  = useState<"click"|"text">("click");
  const [processing, setProcessing] = useState(false);
  const [resultUrl,  setResultUrl]  = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error,      setError]      = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setResultUrl(null); setError(""); setSelected([]); setPageInput("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc   = await PDFDocument.load(bytes);
      setFile(f); setPageCount(doc.getPageCount());
    } catch { setError("PDF okunamadı."); }
  };

  const togglePage = (p: number) =>
    setSelected(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p].sort((a,b)=>a-b));

  const resolvePages = (): number[] | null => {
    if (inputMode === "text") return parsePages(pageInput, pageCount);
    return selected.length > 0 ? selected : null;
  };

  const deletePagesAndSave = async () => {
    if (!file) return;
    const toDelete = resolvePages();
    if (!toDelete) { setError("Silinecek sayfalar belirtilmedi veya geçersiz."); return; }
    if (toDelete.length >= pageCount) { setError("En az 1 sayfa kalmalı."); return; }
    setProcessing(true); setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes  = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const outDoc = await PDFDocument.create();
      const deleteSet = new Set(toDelete);
      const keepIndices = Array.from({ length: pageCount }, (_, i) => i).filter(i => !deleteSet.has(i + 1));
      const copied = await outDoc.copyPages(srcDoc, keepIndices);
      copied.forEach(p => outDoc.addPage(p));
      const outBytes = await outDoc.save();
      const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch { setError("Silme işlemi başarısız."); }
    setProcessing(false);
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null); setPageCount(0); setSelected([]); setResultUrl(null); setError("");
  };

  const toDelete = resolvePages() ?? [];
  const remaining = pageCount - toDelete.length;

  return (
    <div className="space-y-5">
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]); }}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer hover:opacity-80 transition-all"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="text-4xl mb-3">🗑️</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF yükle ve sayfa sil</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>veya tıkla seç</p>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only"
            onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Dosya bilgisi */}
          <div className="flex items-center gap-3 p-3 rounded-xl border"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{file.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{formatSize(file.size)} · {pageCount} sayfa</p>
            </div>
            <button onClick={reset} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-text-3)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Mod seçimi */}
          <div className="flex gap-2 p-3 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <button onClick={() => setInputMode("click")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: inputMode==="click" ? "#E84545" : "transparent", color: inputMode==="click" ? "#fff" : "var(--color-text-2)", border: `1px solid ${inputMode==="click" ? "#E84545" : "var(--color-border)"}` }}>
              Tıklayarak Seç
            </button>
            <button onClick={() => setInputMode("text")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: inputMode==="text" ? "#E84545" : "transparent", color: inputMode==="text" ? "#fff" : "var(--color-text-2)", border: `1px solid ${inputMode==="text" ? "#E84545" : "var(--color-border)"}` }}>
              Metin Gir
            </button>
          </div>

          {inputMode === "click" && (
            <div>
              <p className="text-xs mb-2" style={{ color: "var(--color-text-3)" }}>Silmek istediğin sayfaları seç:</p>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => togglePage(p)}
                    className="w-10 h-10 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: selected.includes(p) ? "#E84545" : "var(--color-surface)",
                      color: selected.includes(p) ? "#fff" : "var(--color-text-2)",
                      border: `1px solid ${selected.includes(p) ? "#E84545" : "var(--color-border)"}`,
                      textDecoration: selected.includes(p) ? "line-through" : "none",
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {inputMode === "text" && (
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>
                Silinecek sayfa numaraları (örn. 2,4,6-8) — Toplam {pageCount} sayfa
              </label>
              <input type="text" value={pageInput} onChange={e => setPageInput(e.target.value)}
                placeholder="2,4,6-8,12"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
            </div>
          )}

          {toDelete.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ background: "rgba(232,69,69,0.08)", border: "1px solid rgba(232,69,69,0.2)" }}>
              <span style={{ color: "#E84545" }}>
                {toDelete.length} sayfa silinecek → {remaining} sayfa kalacak
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm px-4 py-2 rounded-lg" style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>{error}</p>
      )}

      {resultUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>Sayfalar silindi</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{remaining} sayfa · {formatSize(resultSize)}</p>
          </div>
          <a href={resultUrl} download={file?.name.replace(/\.pdf$/i, "-duzenli.pdf")}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80" style={{ background: "#10B981", color: "#fff" }}>
            İndir
          </a>
        </div>
      )}

      {file && !resultUrl && (
        <button onClick={deletePagesAndSave} disabled={processing || toDelete.length === 0}
          className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ background: "#E84545", color: "#fff" }}>
          {processing ? "İşleniyor..." : toDelete.length > 0 ? `${toDelete.length} Sayfayı Sil` : "Sayfa Seç"}
        </button>
      )}
    </div>
  );
}
