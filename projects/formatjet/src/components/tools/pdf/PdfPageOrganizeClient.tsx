"use client";

import { useState, useRef } from "react";

function formatSize(b: number) {
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function PdfPageOrganizeClient() {
  const [file,       setFile]       = useState<File | null>(null);
  const [pageCount,  setPageCount]  = useState(0);
  const [order,      setOrder]      = useState<number[]>([]); // 1-based page numbers in new order
  const [dragIdx,    setDragIdx]    = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl,  setResultUrl]  = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error,      setError]      = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setResultUrl(null); setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc   = await PDFDocument.load(bytes);
      const n = doc.getPageCount();
      setFile(f); setPageCount(n);
      setOrder(Array.from({ length: n }, (_, i) => i + 1));
    } catch { setError("PDF okunamadı."); }
  };

  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver  = (e: React.DragEvent) => e.preventDefault();
  const onDrop      = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;
    setOrder(prev => {
      const arr  = [...prev];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(targetIdx, 0, moved);
      return arr;
    });
    setDragIdx(null);
  };

  const reverseAll = () => setOrder(prev => [...prev].reverse());
  const resetOrder = () => setOrder(Array.from({ length: pageCount }, (_, i) => i + 1));
  const moveUp   = (i: number) => { if (i === 0) return; setOrder(p => { const a=[...p]; [a[i-1],a[i]]=[a[i],a[i-1]]; return a; }); };
  const moveDown = (i: number) => { if (i === order.length-1) return; setOrder(p => { const a=[...p]; [a[i],a[i+1]]=[a[i+1],a[i]]; return a; }); };
  const removePage = (i: number) => setOrder(p => p.filter((_, idx) => idx !== i));

  const save = async () => {
    if (!file || order.length === 0) return;
    setProcessing(true); setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes  = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const outDoc = await PDFDocument.create();
      const copied = await outDoc.copyPages(srcDoc, order.map(p => p - 1));
      copied.forEach(p => outDoc.addPage(p));
      const outBytes = await outDoc.save();
      const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch { setError("Kaydetme başarısız."); }
    setProcessing(false);
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null); setPageCount(0); setOrder([]); setResultUrl(null); setError("");
  };

  const hasChanged = () => order.length !== pageCount || order.some((p, i) => p !== i + 1);

  return (
    <div className="space-y-5">
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]); }}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer hover:opacity-80 transition-all"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF yükle ve sayfaları düzenle</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>Sürükle-bırak ile sayfaları yeniden sırala</p>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only"
            onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Dosya bilgisi + hızlı eylemler */}
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
            <div className="flex gap-2 items-center">
              <button onClick={reverseAll} className="text-xs px-2.5 py-1 rounded-lg hover:opacity-80"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-2)" }}>
                Ters Çevir
              </button>
              <button onClick={resetOrder} className="text-xs px-2.5 py-1 rounded-lg hover:opacity-80"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-2)" }}>
                Sıfırla
              </button>
              <button onClick={reset} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-text-3)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Sayfa listesi */}
          <div className="space-y-1">
            {order.map((pageNum, i) => (
              <div
                key={`${pageNum}-${i}`}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={onDragOver}
                onDrop={e => onDrop(e, i)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all"
                style={{
                  borderColor: "var(--color-border)",
                  background: dragIdx === i ? "var(--color-surface-3)" : "var(--color-surface)",
                  opacity: dragIdx === i ? 0.4 : 1,
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0" style={{ color: "var(--color-text-3)" }}>
                  <path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
                </svg>
                <span className="w-6 text-right font-mono text-xs shrink-0" style={{ color: "var(--color-text-3)" }}>{i + 1}.</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-8 h-10 rounded flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "rgba(232,69,69,0.1)", color: "#E84545", fontSize: "10px" }}>
                    PDF
                  </div>
                  <span className="text-sm" style={{ color: "var(--color-text)" }}>Sayfa {pageNum}</span>
                  {pageNum !== i + 1 && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>taşındı</span>
                  )}
                </div>
                <div className="flex gap-0.5 shrink-0">
                  <button onClick={() => moveUp(i)} disabled={i===0} className="p-1 rounded disabled:opacity-20 hover:opacity-70" style={{ color: "var(--color-text-3)" }}>▲</button>
                  <button onClick={() => moveDown(i)} disabled={i===order.length-1} className="p-1 rounded disabled:opacity-20 hover:opacity-70" style={{ color: "var(--color-text-3)" }}>▼</button>
                  <button onClick={() => removePage(i)} className="p-1 rounded hover:opacity-70" style={{ color: "var(--color-text-3)" }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {order.length !== pageCount && (
            <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
              {pageCount - order.length} sayfa kaldırıldı — orijinal {pageCount} sayfaydı
            </p>
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
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>PDF yeniden düzenlendi</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{order.length} sayfa · {formatSize(resultSize)}</p>
          </div>
          <a href={resultUrl} download={file?.name.replace(/\.pdf$/i, "-sirali.pdf")}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80" style={{ background: "#10B981", color: "#fff" }}>
            İndir
          </a>
        </div>
      )}

      {file && !resultUrl && (
        <button onClick={save} disabled={processing || !hasChanged() || order.length === 0}
          className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ background: "#E84545", color: "#fff" }}>
          {processing ? "Kaydediliyor..." : hasChanged() ? "Değişiklikleri Kaydet" : "Henüz değişiklik yapılmadı"}
        </button>
      )}
    </div>
  );
}
