"use client";

import { useState, useRef, useCallback } from "react";
import {
  compressImage,
  formatSize,
  downloadBlob,
  type OutputFormat,
} from "@/lib/imageProcessor";

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  result?: { blob: Blob; size: number; url: string };
  error?: string;
  processing?: boolean;
};

const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/png",  label: "PNG" },
];

const MAX_FILES = 20;
const MAX_BYTES = 25 * 1024 * 1024;
const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff";

export default function ImageCompressClient() {
  const [images,    setImages]    = useState<ImageFile[]>([]);
  const [quality,   setQuality]   = useState(80);
  const [format,    setFormat]    = useState<OutputFormat>("image/jpeg");
  const [dragOver,  setDragOver]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    const next: ImageFile[] = arr.slice(0, MAX_FILES - images.length).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      originalSize: file.size,
    }));
    setImages(prev => [...prev, ...next]);
  }, [images.length]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const processAll = async () => {
    setImages(prev => prev.map(img => ({ ...img, processing: true, result: undefined, error: undefined })));

    for (const img of images) {
      if (img.file.size > MAX_BYTES) {
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, processing: false, error: "25 MB sınırı aşıldı" } : i));
        continue;
      }
      try {
        const blob = await compressImage(img.file, { quality: quality / 100, format });
        const url  = URL.createObjectURL(blob);
        setImages(prev => prev.map(i =>
          i.id === img.id ? { ...i, processing: false, result: { blob, size: blob.size, url } } : i
        ));
      } catch {
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, processing: false, error: "Sıkıştırma başarısız" } : i));
      }
    }
  };

  const downloadOne = (img: ImageFile) => {
    if (!img.result) return;
    const ext  = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const base = img.file.name.replace(/\.[^.]+$/, "");
    downloadBlob(img.result.blob, `${base}-sikistirilmis.${ext}`);
  };

  const downloadAll = () => {
    images.filter(i => i.result).forEach(downloadOne);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const reset = () => {
    images.forEach(i => URL.revokeObjectURL(i.preview));
    setImages([]);
  };

  const hasResults    = images.some(i => i.result);
  const allProcessed  = images.length > 0 && images.every(i => i.result || i.error);
  const totalOriginal = images.reduce((sum, i) => sum + i.originalSize, 0);
  const totalResult   = images.reduce((sum, i) => sum + (i.result?.size ?? 0), 0);
  const savings       = totalOriginal > 0 && totalResult > 0
    ? Math.round((1 - totalResult / totalOriginal) * 100)
    : null;

  return (
    <div className="space-y-5">

      {/* Ayarlar */}
      <div className="p-4 rounded-xl border space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        {/* Kalite slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
              Kalite
            </label>
            <span className="font-mono text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
              {quality}%
            </span>
          </div>
          <input
            type="range"
            min={10} max={100} step={5}
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "var(--color-accent)" }}
          />
          <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--color-text-3)" }}>
            <span>Küçük dosya</span>
            <span>Yüksek kalite</span>
          </div>
        </div>

        {/* Format */}
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: "var(--color-text)" }}>
            Çıktı Formatı
          </label>
          <div className="flex gap-2">
            {FORMAT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFormat(opt.value)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: format === opt.value ? "var(--color-accent)" : "transparent",
                  color:      format === opt.value ? "#fff" : "var(--color-text-2)",
                  border:     `1px solid ${format === opt.value ? "var(--color-accent)" : "var(--color-border)"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drop zone */}
      {images.length === 0 && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="relative border-2 border-dashed rounded-xl py-14 text-center cursor-pointer transition-all"
          style={{
            borderColor: dragOver ? "var(--color-accent)" : "var(--color-border)",
            background:  dragOver ? "rgba(240,90,40,0.05)" : "var(--color-surface)",
          }}
        >
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            Görselleri buraya sürükle
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
            veya tıkla seç — JPG, PNG, WebP, BMP, TIFF — max 25 MB/görsel
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            className="sr-only"
            onChange={e => e.target.files && addFiles(e.target.files)}
          />
        </div>
      )}

      {/* Görsel listesi */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map(img => {
            const ratio = img.result ? Math.round((1 - img.result.size / img.originalSize) * 100) : null;
            return (
              <div
                key={img.id}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
              >
                {/* Önizleme */}
                <img
                  src={img.result?.url ?? img.preview}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />

                {/* İsim + boyut */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{img.file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs" style={{ color: "var(--color-text-3)" }}>
                      {formatSize(img.originalSize)}
                    </span>
                    {img.result && (
                      <>
                        <span className="text-xs" style={{ color: "var(--color-text-3)" }}>→</span>
                        <span className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>
                          {formatSize(img.result.size)}
                        </span>
                        {ratio !== null && ratio > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-mono" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                            −{ratio}%
                          </span>
                        )}
                      </>
                    )}
                    {img.error && (
                      <span className="text-xs" style={{ color: "#E84545" }}>{img.error}</span>
                    )}
                    {img.processing && (
                      <span className="text-xs animate-pulse" style={{ color: "var(--color-text-3)" }}>işleniyor...</span>
                    )}
                  </div>
                </div>

                {/* İndir/Sil */}
                <div className="flex items-center gap-1 shrink-0">
                  {img.result && (
                    <button
                      onClick={() => downloadOne(img)}
                      className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                      style={{ color: "var(--color-accent)" }}
                      title="İndir"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                  )}
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                    style={{ color: "var(--color-text-3)" }}
                    title="Kaldır"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dosya ekle butonu (liste varken) */}
      {images.length > 0 && images.length < MAX_FILES && (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full py-2.5 rounded-xl border border-dashed text-sm transition-colors hover:opacity-80"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-3)" }}
        >
          + Görsel ekle ({images.length}/{MAX_FILES})
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="sr-only"
        onChange={e => e.target.files && addFiles(e.target.files)}
      />

      {/* Tasarruf özeti */}
      {allProcessed && savings !== null && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>
              Toplam {savings}% tasarruf
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>
              {formatSize(totalOriginal)} → {formatSize(totalResult)}
            </p>
          </div>
          {hasResults && (
            <button
              onClick={downloadAll}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: "#10B981", color: "#fff" }}
            >
              Tümünü İndir
            </button>
          )}
        </div>
      )}

      {/* Ana aksiyon */}
      {images.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={processAll}
            disabled={images.some(i => i.processing)}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            {images.some(i => i.processing) ? "Sıkıştırılıyor..." : `${images.length} Görseli Sıkıştır`}
          </button>
          <button
            onClick={reset}
            className="px-4 py-3 rounded-xl text-sm transition-colors hover:opacity-70"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-2)" }}
          >
            Temizle
          </button>
        </div>
      )}
    </div>
  );
}
