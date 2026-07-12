"use client";

import { useState, useRef, useCallback } from "react";
import { compressImage, formatSize, downloadBlob, type OutputFormat } from "@/lib/imageProcessor";

type ImgFile = {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  result?: { blob: Blob; size: number; url: string };
  error?: string;
  processing?: boolean;
};

const FORMAT_OPTS: { value: OutputFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/png",  label: "PNG" },
];

export default function TargetSizeClient() {
  const [images,    setImages]    = useState<ImgFile[]>([]);
  const [targetKB,  setTargetKB]  = useState("200");
  const [format,    setFormat]    = useState<OutputFormat>("image/jpeg");
  const [dragOver,  setDragOver]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    const next: ImgFile[] = arr.slice(0, 20 - images.length).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      originalSize: file.size,
    }));
    setImages(prev => [...prev, ...next]);
  }, [images.length]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const processAll = async () => {
    const maxBytes = Math.round(parseFloat(targetKB) * 1024);
    if (!maxBytes || maxBytes <= 0) return;

    setImages(prev => prev.map(i => ({ ...i, processing: true, result: undefined, error: undefined })));

    for (const img of images) {
      try {
        const blob = await compressImage(img.file, { quality: 0.92, format, maxBytes });
        const url  = URL.createObjectURL(blob);
        setImages(prev => prev.map(i =>
          i.id === img.id ? { ...i, processing: false, result: { blob, size: blob.size, url } } : i
        ));
      } catch {
        setImages(prev => prev.map(i =>
          i.id === img.id ? { ...i, processing: false, error: "İşlenemedi" } : i
        ));
      }
    }
  };

  const downloadOne = (img: ImgFile) => {
    if (!img.result) return;
    const ext  = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const base = img.file.name.replace(/\.[^.]+$/, "");
    downloadBlob(img.result.blob, `${base}-${targetKB}kb.${ext}`);
  };

  const reset = () => {
    images.forEach(i => URL.revokeObjectURL(i.preview));
    setImages([]);
  };

  const hasResults   = images.some(i => i.result);
  const isProcessing = images.some(i => i.processing);

  const PRESETS = ["50", "100", "200", "500", "1000"];

  return (
    <div className="space-y-5">
      {/* Hedef boyut */}
      <div className="p-4 rounded-xl border space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: "var(--color-text)" }}>Hedef Dosya Boyutu (KB)</label>
          <div className="flex items-center gap-3">
            <input
              type="number" min={1} max={10240} value={targetKB}
              onChange={e => setTargetKB(e.target.value)}
              className="w-32 px-3 py-2 rounded-lg text-sm outline-none border"
              style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            />
            <span className="text-sm" style={{ color: "var(--color-text-3)" }}>KB</span>
            <span className="text-sm" style={{ color: "var(--color-text-3)" }}>≈ {Number(targetKB) > 1024 ? `${(Number(targetKB)/1024).toFixed(1)} MB` : `${targetKB} KB`}</span>
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {PRESETS.map(p => (
              <button key={p} onClick={() => setTargetKB(p)}
                className="px-2.5 py-1 rounded-md text-xs transition-all hover:opacity-80"
                style={{ background: targetKB === p ? "var(--color-accent)" : "var(--color-bg)", color: targetKB === p ? "#fff" : "var(--color-text-3)", border: `1px solid ${targetKB === p ? "var(--color-accent)" : "var(--color-border)"}` }}>
                {Number(p) >= 1000 ? `${Number(p)/1000}MB` : `${p}KB`}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Çıktı Formatı</label>
          <div className="flex gap-1.5">
            {FORMAT_OPTS.map(o => (
              <button key={o.value} onClick={() => setFormat(o.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: format === o.value ? "var(--color-accent)" : "transparent", color: format === o.value ? "#fff" : "var(--color-text-2)", border: `1px solid ${format === o.value ? "var(--color-accent)" : "var(--color-border)"}` }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {images.length === 0 && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer transition-all"
          style={{ borderColor: dragOver ? "var(--color-accent)" : "var(--color-border)", background: dragOver ? "rgba(240,90,40,0.05)" : "var(--color-surface)" }}>
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Görselleri buraya sürükle</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>JPG, PNG, WebP</p>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only"
            onChange={e => e.target.files && addFiles(e.target.files)} />
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-2">
          {images.map(img => {
            const ratio = img.result && img.originalSize > 0
              ? Math.round((1 - img.result.size / img.originalSize) * 100) : null;
            const hit = img.result && img.result.size <= parseInt(targetKB) * 1024;
            return (
              <div key={img.id} className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <img src={img.result?.url ?? img.preview} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{img.file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs" style={{ color: "var(--color-text-3)" }}>{formatSize(img.originalSize)}</span>
                    {img.result && (
                      <>
                        <span className="text-xs" style={{ color: "var(--color-text-3)" }}>→</span>
                        <span className="text-xs font-medium" style={{ color: hit ? "#10B981" : "var(--color-accent)" }}>
                          {formatSize(img.result.size)}
                        </span>
                        {ratio !== null && ratio > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                            style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>−{ratio}%</span>
                        )}
                        {!hit && (
                          <span className="text-xs" style={{ color: "var(--color-text-3)" }}>hedef sınır altına düşürülemedi</span>
                        )}
                      </>
                    )}
                    {img.error && <span className="text-xs" style={{ color: "#E84545" }}>{img.error}</span>}
                    {img.processing && <span className="text-xs animate-pulse" style={{ color: "var(--color-text-3)" }}>sıkıştırılıyor...</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {img.result && (
                    <button onClick={() => downloadOne(img)} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-accent)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                  )}
                  <button onClick={() => { URL.revokeObjectURL(img.preview); setImages(p => p.filter(i => i.id !== img.id)); }}
                    className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-text-3)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {images.length > 0 && images.length < 20 && (
        <button onClick={() => inputRef.current?.click()}
          className="w-full py-2.5 rounded-xl border border-dashed text-sm hover:opacity-80"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-3)" }}>
          + Görsel ekle ({images.length}/20)
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only"
        onChange={e => e.target.files && addFiles(e.target.files)} />

      {images.length > 0 && (
        <div className="flex gap-3">
          <button onClick={processAll} disabled={isProcessing}
            className="flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "#fff" }}>
            {isProcessing ? "Sıkıştırılıyor..." : `${images.length} Görseli ${targetKB} KB'ye Sıkıştır`}
          </button>
          {hasResults && !isProcessing && (
            <button onClick={() => images.filter(i => i.result).forEach(downloadOne)}
              className="px-4 py-3 rounded-xl text-sm font-medium hover:opacity-80"
              style={{ background: "rgba(240,90,40,0.15)", color: "var(--color-accent)", border: "1px solid rgba(240,90,40,0.3)" }}>
              Tümünü İndir
            </button>
          )}
          <button onClick={reset} className="px-4 py-3 rounded-xl text-sm hover:opacity-70"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-2)" }}>
            Temizle
          </button>
        </div>
      )}
    </div>
  );
}
