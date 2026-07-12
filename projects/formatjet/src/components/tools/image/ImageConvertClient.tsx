"use client";

import { useState, useRef, useCallback } from "react";
import {
  convertFormat,
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

type Props = {
  accept: string;          // ör. "image/webp,.webp"
  targetFormat: OutputFormat;
  targetExt: string;       // ör. "jpg"
  defaultQuality: number;  // 0-100
  accentColor: string;
};

const MAX_FILES = 30;

export default function ImageConvertClient({
  accept,
  targetFormat,
  targetExt,
  defaultQuality,
  accentColor,
}: Props) {
  const [images,   setImages]   = useState<ImageFile[]>([]);
  const [quality,  setQuality]  = useState(defaultQuality);
  const [dragOver, setDragOver] = useState(false);
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
      try {
        const blob = await convertFormat(img.file, targetFormat, quality / 100);
        const url  = URL.createObjectURL(blob);
        setImages(prev => prev.map(i =>
          i.id === img.id ? { ...i, processing: false, result: { blob, size: blob.size, url } } : i
        ));
      } catch {
        setImages(prev => prev.map(i =>
          i.id === img.id ? { ...i, processing: false, error: "Dönüşüm başarısız" } : i
        ));
      }
    }
  };

  const downloadOne = (img: ImageFile) => {
    if (!img.result) return;
    const base = img.file.name.replace(/\.[^.]+$/, "");
    downloadBlob(img.result.blob, `${base}.${targetExt}`);
  };

  const downloadAll = () => images.filter(i => i.result).forEach(downloadOne);

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) { URL.revokeObjectURL(img.preview); img.result && URL.revokeObjectURL(img.result.url); }
      return prev.filter(i => i.id !== id);
    });
  };

  const reset = () => {
    images.forEach(i => { URL.revokeObjectURL(i.preview); i.result && URL.revokeObjectURL(i.result.url); });
    setImages([]);
  };

  const hasResults   = images.some(i => i.result);
  const isProcessing = images.some(i => i.processing);
  const totalOriginal = images.reduce((s, i) => s + i.originalSize, 0);
  const totalResult   = images.reduce((s, i) => s + (i.result?.size ?? 0), 0);
  const savings       = totalOriginal > 0 && totalResult > 0
    ? Math.round((1 - totalResult / totalOriginal) * 100)
    : null;

  return (
    <div className="space-y-5">

      {/* Kalite ayarı */}
      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Kalite</label>
          <span className="font-mono text-sm font-semibold" style={{ color: accentColor }}>{quality}%</span>
        </div>
        <input
          type="range" min={50} max={100} step={5} value={quality}
          onChange={e => setQuality(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor }}
        />
        <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--color-text-3)" }}>
          <span>Küçük dosya</span>
          <span>Yüksek kalite</span>
        </div>
      </div>

      {/* Drop zone */}
      {images.length === 0 && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer transition-all"
          style={{
            borderColor: dragOver ? accentColor : "var(--color-border)",
            background:  dragOver ? `${accentColor}0D` : "var(--color-surface)",
          }}
        >
          <div className="text-4xl mb-3">🔄</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            Görselleri buraya sürükle
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
            veya tıkla seç
          </p>
          <input ref={inputRef} type="file" accept={accept} multiple className="sr-only"
            onChange={e => e.target.files && addFiles(e.target.files)} />
        </div>
      )}

      {/* Görsel listesi */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map(img => {
            const ratio = img.result && img.originalSize > 0
              ? Math.round((1 - img.result.size / img.originalSize) * 100)
              : null;
            return (
              <div key={img.id} className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <img
                  src={img.result?.url ?? img.preview}
                  alt="" className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{img.file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs" style={{ color: "var(--color-text-3)" }}>
                      {formatSize(img.originalSize)}
                    </span>
                    {img.result && (
                      <>
                        <span className="text-xs" style={{ color: "var(--color-text-3)" }}>→</span>
                        <span className="text-xs font-medium" style={{ color: accentColor }}>
                          {formatSize(img.result.size)}
                        </span>
                        {ratio !== null && ratio > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                            style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                            −{ratio}%
                          </span>
                        )}
                        {ratio !== null && ratio <= 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                            style={{ background: "rgba(240,90,40,0.1)", color: "var(--color-accent)" }}>
                            +{Math.abs(ratio)}%
                          </span>
                        )}
                      </>
                    )}
                    {img.error && (
                      <span className="text-xs" style={{ color: "#E84545" }}>{img.error}</span>
                    )}
                    {img.processing && (
                      <span className="text-xs animate-pulse" style={{ color: "var(--color-text-3)" }}>
                        dönüştürülüyor...
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {img.result && (
                    <button onClick={() => downloadOne(img)}
                      className="p-1.5 rounded-lg hover:opacity-80" style={{ color: accentColor }} title="İndir">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  )}
                  <button onClick={() => removeImage(img.id)}
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

      {/* Dosya ekle butonu */}
      {images.length > 0 && images.length < MAX_FILES && (
        <button onClick={() => inputRef.current?.click()}
          className="w-full py-2.5 rounded-xl border border-dashed text-sm hover:opacity-80"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-3)" }}>
          + Görsel ekle ({images.length}/{MAX_FILES})
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} multiple className="sr-only"
        onChange={e => e.target.files && addFiles(e.target.files)} />

      {/* Tasarruf özeti */}
      {hasResults && savings !== null && savings > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>Toplam {savings}% küçüldü</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>
              {formatSize(totalOriginal)} → {formatSize(totalResult)}
            </p>
          </div>
          <button onClick={downloadAll}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80"
            style={{ background: "#10B981", color: "#fff" }}>
            Tümünü İndir
          </button>
        </div>
      )}

      {/* Ana aksiyon */}
      {images.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={processAll}
            disabled={isProcessing}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: accentColor, color: "#fff" }}
          >
            {isProcessing ? "Dönüştürülüyor..." : `${images.length} Görseli Dönüştür`}
          </button>
          {hasResults && !isProcessing && (
            <button onClick={downloadAll}
              className="px-4 py-3 rounded-xl text-sm font-medium hover:opacity-80"
              style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}4D` }}>
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
