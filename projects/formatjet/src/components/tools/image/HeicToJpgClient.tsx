"use client";

import { useState, useRef, useCallback } from "react";
import { formatSize, downloadBlob, convertFormat, type OutputFormat } from "@/lib/imageProcessor";

type ImageFile = {
  id: string;
  file: File;
  originalSize: number;
  result?: { blob: Blob; size: number; url: string };
  error?: string;
  processing?: boolean;
};

const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPG" },
  { value: "image/png",  label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

const MAX_FILES = 20;

export default function HeicToJpgClient() {
  const [images,   setImages]   = useState<ImageFile[]>([]);
  const [format,   setFormat]   = useState<OutputFormat>("image/jpeg");
  const [quality,  setQuality]  = useState(90);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f =>
      f.type === "image/heic" ||
      f.type === "image/heif" ||
      f.name.toLowerCase().endsWith(".heic") ||
      f.name.toLowerCase().endsWith(".heif")
    );
    if (arr.length === 0) return;
    const next: ImageFile[] = arr.slice(0, MAX_FILES - images.length).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
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

    /* heic2any kütüphanesini dinamik yükle */
    let heic2any: (opts: { blob: Blob; toType: string; quality: number }) => Promise<Blob | Blob[]>;
    try {
      const mod = await import("heic2any");
      heic2any = mod.default as typeof heic2any;
    } catch {
      setImages(prev => prev.map(img => ({ ...img, processing: false, error: "heic2any yüklenemedi" })));
      return;
    }

    for (const img of images) {
      try {
        /* 1) HEIC → ara Blob */
        const intermediateMime = "image/jpeg";
        const raw = await heic2any({
          blob: img.file,
          toType: intermediateMime,
          quality: 0.95,
        });
        const intermediateBlob = Array.isArray(raw) ? raw[0] : raw;

        /* 2) Hedef formata çevir (canvas ile) */
        const intermediateFile = new File([intermediateBlob], img.file.name, { type: intermediateMime });
        const finalBlob = format === "image/jpeg"
          ? intermediateBlob
          : await convertFormat(intermediateFile, format, quality / 100);

        const url = URL.createObjectURL(finalBlob);
        setImages(prev => prev.map(i =>
          i.id === img.id ? { ...i, processing: false, result: { blob: finalBlob, size: finalBlob.size, url } } : i
        ));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Dönüşüm başarısız";
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, processing: false, error: msg } : i));
      }
    }
  };

  const downloadOne = (img: ImageFile) => {
    if (!img.result) return;
    const ext  = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const base = img.file.name.replace(/\.(heic|heif)$/i, "");
    downloadBlob(img.result.blob, `${base}.${ext}`);
  };

  const reset = () => setImages([]);
  const hasResults = images.some(i => i.result);

  return (
    <div className="space-y-5">

      {/* Ayarlar */}
      <div className="p-4 rounded-xl border space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Çıktı Formatı</label>
            <div className="flex gap-1.5">
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
          <div className="flex-1 min-w-32">
            <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Kalite: {quality}%</label>
            <input
              type="range" min={50} max={100} step={5} value={quality}
              onChange={e => setQuality(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "var(--color-accent)" }}
            />
          </div>
        </div>
      </div>

      {/* Bilgi bandı */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg border" style={{ borderColor: "rgba(240,90,40,0.3)", background: "rgba(240,90,40,0.05)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" style={{ color: "var(--color-accent)" }}>
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
        </svg>
        <p className="text-xs" style={{ color: "var(--color-text-2)" }}>
          HEIC, iPhone ve iPad&apos;lerin varsayılan fotoğraf formatıdır. Bu araç HEIC/HEIF dosyalarını dönüştürür ve tarayıcıda çalışır.
        </p>
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
          <div className="text-4xl mb-3">📱</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>HEIC / HEIF dosyalarını buraya sürükle</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>veya tıkla seç — iPhone/iPad fotoğrafları</p>
          <input ref={inputRef} type="file" accept=".heic,.heif" multiple className="sr-only"
            onChange={e => e.target.files && addFiles(e.target.files)} />
        </div>
      )}

      {/* Görsel listesi */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map(img => (
            <div key={img.id} className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              {/* HEIC için önizleme yok */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: img.result ? "none" : "rgba(240,90,40,0.1)" }}>
                {img.result ? (
                  <img src={img.result.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <span className="text-lg">📷</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{img.file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs" style={{ color: "var(--color-text-3)" }}>{formatSize(img.originalSize)}</span>
                  {img.result && (
                    <>
                      <span className="text-xs" style={{ color: "var(--color-text-3)" }}>→</span>
                      <span className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>{formatSize(img.result.size)}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>✓ hazır</span>
                    </>
                  )}
                  {img.error && <span className="text-xs" style={{ color: "#E84545" }}>{img.error}</span>}
                  {img.processing && <span className="text-xs animate-pulse" style={{ color: "var(--color-text-3)" }}>dönüştürülüyor...</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {img.result && (
                  <button onClick={() => downloadOne(img)} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-accent)" }} title="İndir">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                )}
                <button onClick={() => setImages(p => p.filter(i => i.id !== img.id))}
                  className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-text-3)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && images.length < MAX_FILES && (
        <button onClick={() => inputRef.current?.click()}
          className="w-full py-2.5 rounded-xl border border-dashed text-sm hover:opacity-80"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-3)" }}>
          + Dosya ekle ({images.length}/{MAX_FILES})
        </button>
      )}
      <input ref={inputRef} type="file" accept=".heic,.heif" multiple className="sr-only"
        onChange={e => e.target.files && addFiles(e.target.files)} />

      {/* Aksiyon */}
      {images.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={processAll}
            disabled={images.some(i => i.processing)}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            {images.some(i => i.processing) ? "Dönüştürülüyor..." : `${images.length} Dosyayı Dönüştür`}
          </button>
          {hasResults && (
            <button
              onClick={() => images.filter(i => i.result).forEach(downloadOne)}
              className="px-4 py-3 rounded-xl text-sm font-medium hover:opacity-80"
              style={{ background: "rgba(240,90,40,0.15)", color: "var(--color-accent)", border: "1px solid rgba(240,90,40,0.3)" }}
            >
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
