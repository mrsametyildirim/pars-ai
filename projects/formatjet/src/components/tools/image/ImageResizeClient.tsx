"use client";

import { useState, useRef, useCallback } from "react";
import {
  resizeImage,
  formatSize,
  downloadBlob,
  loadImage,
  type OutputFormat,
} from "@/lib/imageProcessor";

type Mode = "pixels" | "percent";

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  originalW: number;
  originalH: number;
  result?: { blob: Blob; size: number; url: string; w: number; h: number };
  error?: string;
  processing?: boolean;
};

const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif,image/bmp";
const MAX_FILES = 10;

const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png",  label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

const PRESET_SIZES = [
  { label: "HD",  w: 1280, h: 720  },
  { label: "FHD", w: 1920, h: 1080 },
  { label: "2K",  w: 2560, h: 1440 },
  { label: "4K",  w: 3840, h: 2160 },
  { label: "Square 1:1", w: 1000, h: 1000 },
  { label: "Instagram",  w: 1080, h: 1080 },
];

export default function ImageResizeClient() {
  const [images,     setImages]     = useState<ImageFile[]>([]);
  const [mode,       setMode]       = useState<Mode>("pixels");
  const [width,      setWidth]      = useState<string>("1920");
  const [height,     setHeight]     = useState<string>("");
  const [percent,    setPercent]    = useState<string>("50");
  const [keepAspect, setKeepAspect] = useState(true);
  const [format,     setFormat]     = useState<OutputFormat>("image/jpeg");
  const [quality,    setQuality]    = useState(88);
  const [dragOver,   setDragOver]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    const next: ImageFile[] = await Promise.all(
      arr.slice(0, MAX_FILES - images.length).map(async file => {
        const img = await loadImage(file);
        return {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          originalSize: file.size,
          originalW: img.naturalWidth,
          originalH: img.naturalHeight,
        };
      })
    );
    setImages(prev => [...prev, ...next]);
  }, [images.length]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const applyPreset = (preset: typeof PRESET_SIZES[number]) => {
    setMode("pixels");
    setWidth(String(preset.w));
    setHeight(String(preset.h));
    setKeepAspect(false);
  };

  const processAll = async () => {
    setImages(prev => prev.map(img => ({ ...img, processing: true, result: undefined, error: undefined })));

    for (const img of images) {
      try {
        let opts = {};

        if (mode === "percent") {
          const pct = Number(percent) / 100;
          opts = {
            width: Math.round(img.originalW * pct),
            height: Math.round(img.originalH * pct),
            keepAspect: false,
            format, quality: quality / 100,
          };
        } else {
          opts = {
            width:  width  ? Number(width)  : undefined,
            height: height ? Number(height) : undefined,
            keepAspect,
            format, quality: quality / 100,
          };
        }

        const blob = await resizeImage(img.file, opts as Parameters<typeof resizeImage>[1]);

        /* Sonuç boyutları: canvas'tan önizleme URL'si üretildiği için proxy */
        const tempImg = await loadImage(new File([blob], "tmp", { type: format }));
        const resultW = tempImg.naturalWidth;
        const resultH = tempImg.naturalHeight;

        const url = URL.createObjectURL(blob);
        setImages(prev => prev.map(i =>
          i.id === img.id
            ? { ...i, processing: false, result: { blob, size: blob.size, url, w: resultW, h: resultH } }
            : i
        ));
      } catch {
        setImages(prev => prev.map(i =>
          i.id === img.id ? { ...i, processing: false, error: "Boyutlandırma başarısız" } : i
        ));
      }
    }
  };

  const downloadOne = (img: ImageFile) => {
    if (!img.result) return;
    const ext  = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const base = img.file.name.replace(/\.[^.]+$/, "");
    downloadBlob(img.result.blob, `${base}-${img.result.w}x${img.result.h}.${ext}`);
  };

  const reset = () => {
    images.forEach(i => URL.revokeObjectURL(i.preview));
    setImages([]);
  };

  const hasResults = images.some(i => i.result);

  return (
    <div className="space-y-5">

      {/* Mod seçimi */}
      <div className="p-4 rounded-xl border space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>

        <div className="flex gap-2">
          {(["pixels", "percent"] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: mode === m ? "var(--color-accent)" : "transparent",
                color:      mode === m ? "#fff" : "var(--color-text-2)",
                border:     `1px solid ${mode === m ? "var(--color-accent)" : "var(--color-border)"}`,
              }}
            >
              {m === "pixels" ? "Piksel" : "Yüzde"}
            </button>
          ))}
        </div>

        {mode === "pixels" ? (
          <div className="space-y-3">
            {/* Boyut girdileri */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>Genişlik (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={e => setWidth(e.target.value)}
                  placeholder="ör. 1920"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                />
              </div>
              <span className="text-lg mt-4" style={{ color: "var(--color-text-3)" }}>×</span>
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>Yükseklik (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  placeholder="ör. 1080"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                />
              </div>
            </div>

            {/* Oran kilidi */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepAspect}
                onChange={e => setKeepAspect(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: "var(--color-accent)" }}
              />
              <span className="text-sm" style={{ color: "var(--color-text-2)" }}>En-boy oranını koru</span>
            </label>

            {/* Hazır ölçüler */}
            <div>
              <p className="text-xs mb-2" style={{ color: "var(--color-text-3)" }}>Hazır ölçüler</p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SIZES.map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className="px-2.5 py-1 rounded-md text-xs transition-colors hover:opacity-80"
                    style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text-3)" }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Yüzde</label>
              <span className="font-mono text-sm font-semibold" style={{ color: "var(--color-accent)" }}>{percent}%</span>
            </div>
            <input
              type="range"
              min={5} max={200} step={5}
              value={percent}
              onChange={e => setPercent(e.target.value)}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "var(--color-accent)" }}
            />
            <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--color-text-3)" }}>
              <span>5%</span>
              <span>200%</span>
            </div>
          </div>
        )}

        {/* Format + Kalite */}
        <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Format</label>
            <div className="flex gap-1.5">
              {FORMAT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-all"
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
          <div className="flex-1">
            <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Kalite: {quality}%</label>
            <input
              type="range"
              min={50} max={100} step={5}
              value={quality}
              onChange={e => setQuality(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "var(--color-accent)" }}
            />
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
            borderColor: dragOver ? "#818CF8" : "var(--color-border)",
            background:  dragOver ? "rgba(129,140,248,0.05)" : "var(--color-surface)",
          }}
        >
          <div className="text-4xl mb-3">📐</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Görselleri buraya sürükle</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>veya tıkla seç — JPG, PNG, WebP, BMP</p>
          <input ref={inputRef} type="file" accept={ACCEPTED} multiple className="sr-only"
            onChange={e => e.target.files && addFiles(e.target.files)} />
        </div>
      )}

      {/* Görsel listesi */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map(img => (
            <div key={img.id} className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <img src={img.result?.url ?? img.preview} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{img.file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono" style={{ color: "var(--color-text-3)" }}>
                    {img.originalW}×{img.originalH}
                  </span>
                  {img.result && (
                    <>
                      <span className="text-xs" style={{ color: "var(--color-text-3)" }}>→</span>
                      <span className="text-xs font-mono font-medium" style={{ color: "#818CF8" }}>
                        {img.result.w}×{img.result.h}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-text-3)" }}>
                        {formatSize(img.result.size)}
                      </span>
                    </>
                  )}
                  {img.error && <span className="text-xs" style={{ color: "#E84545" }}>{img.error}</span>}
                  {img.processing && <span className="text-xs animate-pulse" style={{ color: "var(--color-text-3)" }}>işleniyor...</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {img.result && (
                  <button onClick={() => downloadOne(img)} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "#818CF8" }} title="İndir">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                )}
                <button onClick={() => { URL.revokeObjectURL(img.preview); setImages(p => p.filter(i => i.id !== img.id)); }}
                  className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-text-3)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dosya ekle + input */}
      {images.length > 0 && images.length < MAX_FILES && (
        <button onClick={() => inputRef.current?.click()}
          className="w-full py-2.5 rounded-xl border border-dashed text-sm hover:opacity-80"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-3)" }}>
          + Görsel ekle ({images.length}/{MAX_FILES})
        </button>
      )}
      <input ref={inputRef} type="file" accept={ACCEPTED} multiple className="sr-only"
        onChange={e => e.target.files && addFiles(e.target.files)} />

      {/* Aksiyon */}
      {images.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={processAll}
            disabled={images.some(i => i.processing)}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: "#818CF8", color: "#fff" }}
          >
            {images.some(i => i.processing) ? "Boyutlandırılıyor..." : `${images.length} Görseli Boyutlandır`}
          </button>
          {hasResults && (
            <button
              onClick={() => images.filter(i => i.result).forEach(downloadOne)}
              className="px-4 py-3 rounded-xl text-sm font-medium hover:opacity-80"
              style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8", border: "1px solid rgba(129,140,248,0.3)" }}
            >
              Tümünü İndir
            </button>
          )}
          <button
            onClick={reset}
            className="px-4 py-3 rounded-xl text-sm hover:opacity-70"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-2)" }}
          >
            Temizle
          </button>
        </div>
      )}
    </div>
  );
}
