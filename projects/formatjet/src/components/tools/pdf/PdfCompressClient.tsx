"use client";

import { useState, useRef, useCallback } from "react";

type PdfFile = {
  id: string;
  file: File;
  originalSize: number;
  result?: { blob: Blob; size: number; url: string };
  error?: string;
  processing?: boolean;
};

type Level = "screen" | "ebook" | "printer";
const LEVELS: { value: Level; label: string; desc: string; quality: number }[] = [
  { value: "screen",  label: "Web / Ekran",  desc: "En küçük boyut",    quality: 0.6 },
  { value: "ebook",   label: "E-Kitap",       desc: "Dengeli",           quality: 0.75 },
  { value: "printer", label: "Baskı Kalitesi",desc: "Yüksek kalite",    quality: 0.9 },
];

const MAX_FILES = 10;
const MAX_BYTES = 50 * 1024 * 1024;

function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function PdfCompressClient() {
  const [files,    setFiles]    = useState<PdfFile[]>([]);
  const [level,    setLevel]    = useState<Level>("ebook");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming).filter(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    const next: PdfFile[] = arr.slice(0, MAX_FILES - files.length).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      originalSize: file.size,
    }));
    setFiles(prev => [...prev, ...next]);
  }, [files.length]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const processAll = async () => {
    setFiles(prev => prev.map(f => ({ ...f, processing: true, result: undefined, error: undefined })));
    const quality = LEVELS.find(l => l.value === level)!.quality;

    for (const pf of files) {
      if (pf.file.size > MAX_BYTES) {
        setFiles(prev => prev.map(f => f.id === pf.id ? { ...f, processing: false, error: "50 MB sınırı aşıldı" } : f));
        continue;
      }
      try {
        const { PDFDocument } = await import("pdf-lib");
        const srcBytes = await pf.file.arrayBuffer();
        const srcDoc   = await PDFDocument.load(srcBytes, { ignoreEncryption: true });

        const outDoc = await PDFDocument.create();
        const pages  = await outDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        pages.forEach(p => outDoc.addPage(p));

        /* Metadata temizle — boyutu biraz küçültür */
        outDoc.setTitle("");
        outDoc.setAuthor("");
        outDoc.setSubject("");
        outDoc.setKeywords([]);
        outDoc.setProducer("FormatJet");
        outDoc.setCreator("FormatJet");

        const outBytes = await outDoc.save({ useObjectStreams: quality < 0.8 });
        const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });

        /* Eğer çıktı orijinalden büyükse orijinali ver */
        const finalBlob = blob.size < pf.file.size ? blob : pf.file;
        const url = URL.createObjectURL(finalBlob);

        setFiles(prev => prev.map(f =>
          f.id === pf.id ? { ...f, processing: false, result: { blob: finalBlob, size: finalBlob.size, url } } : f
        ));
      } catch {
        setFiles(prev => prev.map(f =>
          f.id === pf.id ? { ...f, processing: false, error: "Sıkıştırma başarısız" } : f
        ));
      }
    }
  };

  const downloadOne = (pf: PdfFile) => {
    if (!pf.result) return;
    const base = pf.file.name.replace(/\.pdf$/i, "");
    const a = document.createElement("a");
    a.href = pf.result.url;
    a.download = `${base}-sikistirilmis.pdf`;
    a.click();
  };

  const reset = () => {
    files.forEach(f => f.result && URL.revokeObjectURL(f.result.url));
    setFiles([]);
  };

  const hasResults   = files.some(f => f.result);
  const isProcessing = files.some(f => f.processing);
  const totalOrig    = files.reduce((s, f) => s + f.originalSize, 0);
  const totalResult  = files.reduce((s, f) => s + (f.result?.size ?? 0), 0);
  const savings      = totalOrig > 0 && totalResult > 0
    ? Math.round((1 - totalResult / totalOrig) * 100) : null;

  return (
    <div className="space-y-5">

      {/* Seviye seçimi */}
      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <label className="text-sm font-medium block mb-3" style={{ color: "var(--color-text)" }}>Sıkıştırma Seviyesi</label>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map(lv => (
            <button
              key={lv.value}
              onClick={() => setLevel(lv.value)}
              className="p-3 rounded-lg border text-left transition-all"
              style={{
                borderColor: level === lv.value ? "#E84545" : "var(--color-border)",
                background:  level === lv.value ? "rgba(232,69,69,0.08)" : "transparent",
              }}
            >
              <p className="text-sm font-medium" style={{ color: level === lv.value ? "#E84545" : "var(--color-text)" }}>
                {lv.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{lv.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      {files.length === 0 && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer transition-all"
          style={{
            borderColor: dragOver ? "#E84545" : "var(--color-border)",
            background:  dragOver ? "rgba(232,69,69,0.05)" : "var(--color-surface)",
          }}
        >
          <div className="text-4xl mb-3">📄</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF dosyalarını buraya sürükle</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>veya tıkla seç — max 50 MB/dosya</p>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple className="sr-only"
            onChange={e => e.target.files && addFiles(e.target.files)} />
        </div>
      )}

      {/* Dosya listesi */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(pf => {
            const ratio = pf.result && pf.originalSize > 0
              ? Math.round((1 - pf.result.size / pf.originalSize) * 100) : null;
            return (
              <div key={pf.id} className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{pf.file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs" style={{ color: "var(--color-text-3)" }}>{formatSize(pf.originalSize)}</span>
                    {pf.result && (
                      <>
                        <span className="text-xs" style={{ color: "var(--color-text-3)" }}>→</span>
                        <span className="text-xs font-medium" style={{ color: "#E84545" }}>{formatSize(pf.result.size)}</span>
                        {ratio !== null && ratio > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                            style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>−{ratio}%</span>
                        )}
                        {ratio !== null && ratio <= 0 && (
                          <span className="text-xs" style={{ color: "var(--color-text-3)" }}>zaten optimize</span>
                        )}
                      </>
                    )}
                    {pf.error && <span className="text-xs" style={{ color: "#E84545" }}>{pf.error}</span>}
                    {pf.processing && <span className="text-xs animate-pulse" style={{ color: "var(--color-text-3)" }}>sıkıştırılıyor...</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {pf.result && (
                    <button onClick={() => downloadOne(pf)} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "#E84545" }} title="İndir">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  )}
                  <button onClick={() => setFiles(p => p.filter(f => f.id !== pf.id))}
                    className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-text-3)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {files.length > 0 && files.length < MAX_FILES && (
        <button onClick={() => inputRef.current?.click()}
          className="w-full py-2.5 rounded-xl border border-dashed text-sm hover:opacity-80"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-3)" }}>
          + PDF ekle ({files.length}/{MAX_FILES})
        </button>
      )}
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple className="sr-only"
        onChange={e => e.target.files && addFiles(e.target.files)} />

      {/* Tasarruf özeti */}
      {hasResults && savings !== null && savings > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>Toplam {savings}% küçüldü</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{formatSize(totalOrig)} → {formatSize(totalResult)}</p>
          </div>
          <button onClick={() => files.filter(f => f.result).forEach(downloadOne)}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80"
            style={{ background: "#10B981", color: "#fff" }}>
            Tümünü İndir
          </button>
        </div>
      )}

      {/* Aksiyon */}
      {files.length > 0 && (
        <div className="flex gap-3">
          <button onClick={processAll} disabled={isProcessing}
            className="flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
            style={{ background: "#E84545", color: "#fff" }}>
            {isProcessing ? "Sıkıştırılıyor..." : `${files.length} PDF'i Sıkıştır`}
          </button>
          {hasResults && !isProcessing && (
            <button onClick={() => files.filter(f => f.result).forEach(downloadOne)}
              className="px-4 py-3 rounded-xl text-sm font-medium hover:opacity-80"
              style={{ background: "rgba(232,69,69,0.15)", color: "#E84545", border: "1px solid rgba(232,69,69,0.3)" }}>
              Tümünü İndir
            </button>
          )}
          <button onClick={reset}
            className="px-4 py-3 rounded-xl text-sm hover:opacity-70"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-2)" }}>
            Temizle
          </button>
        </div>
      )}
    </div>
  );
}
