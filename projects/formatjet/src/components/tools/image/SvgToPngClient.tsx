"use client";

import { useState, useRef, useCallback } from "react";

type Scale = 1 | 2 | 4 | 8;
const SCALES: { v: Scale; l: string }[] = [
  { v: 1, l: "1× (Orijinal)" },
  { v: 2, l: "2× (2 Kat)" },
  { v: 4, l: "4× (4 Kat)" },
  { v: 8, l: "8× (8 Kat)" },
];

export default function SvgToPngClient() {
  const [file,       setFile]       = useState<File | null>(null);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [svgSize,    setSvgSize]    = useState<{ w: number; h: number } | null>(null);
  const [scale,      setScale]      = useState<Scale>(2);
  const [outputUrl,  setOutputUrl]  = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadSvg = useCallback((f: File) => {
    setOutputUrl(null); setError(null);
    if (!f.name.toLowerCase().endsWith(".svg") && f.type !== "image/svg+xml") {
      setError("Yalnızca SVG dosyaları desteklenir."); return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => {
      const svgText = e.target?.result as string;
      const blob = new Blob([svgText], { type: "image/svg+xml" });
      const url  = URL.createObjectURL(blob);
      const img  = new Image();
      img.onload = () => {
        setSvgSize({ w: img.naturalWidth || 100, h: img.naturalHeight || 100 });
        setPreview(url);
      };
      img.onerror = () => setError("SVG ayrıştırılamadı.");
      img.src = url;
    };
    reader.readAsText(f);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) loadSvg(f);
  }, [loadSvg]);

  const convert = () => {
    if (!preview || !svgSize) return;
    setProcessing(true); setError(null); setOutputUrl(null);
    const img = new Image();
    img.onload = () => {
      const w = (svgSize.w || img.naturalWidth) * scale;
      const h = (svgSize.h || img.naturalHeight) * scale;
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        if (blob) { setOutputUrl(URL.createObjectURL(blob)); setOutputSize(blob.size); }
        else setError("PNG oluşturulamadı.");
        setProcessing(false);
      }, "image/png");
    };
    img.onerror = () => { setError("Dönüştürme başarısız."); setProcessing(false); };
    img.src = preview;
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null); setPreview(null); setSvgSize(null); setOutputUrl(null); setError(null);
  };

  function formatSize(b: number) {
    if (b < 1024) return `${b} B`;
    if (b < 1048576) return `${Math.round(b / 1024)} KB`;
    return `${(b / 1048576).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-5">

      {/* Drop zone */}
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer transition-all hover:opacity-80"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="text-4xl mb-3">🔷</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>SVG dosyasını buraya sürükle</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>veya tıkla seç</p>
          <input ref={inputRef} type="file" accept=".svg,image/svg+xml" className="sr-only"
            onChange={e => e.target.files?.[0] && loadSvg(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Önizleme */}
          <div className="p-4 rounded-xl border flex items-center gap-4"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            {preview && (
              <img src={preview} alt="SVG önizleme" className="w-20 h-20 object-contain rounded shrink-0"
                style={{ background: "repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%) 0 0 / 10px 10px" }} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate font-medium" style={{ color: "var(--color-text)" }}>{file.name}</p>
              {svgSize && (
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>
                  {svgSize.w} × {svgSize.h} piksel · {formatSize(file.size)}
                </p>
              )}
              {svgSize && (
                <p className="text-xs mt-1" style={{ color: "var(--color-text-2)" }}>
                  Çıktı: {svgSize.w * scale} × {svgSize.h * scale} px
                </p>
              )}
            </div>
            <button onClick={reset} className="p-1.5 rounded-lg hover:opacity-80 shrink-0" style={{ color: "var(--color-text-3)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Ölçek seçimi */}
          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <label className="text-xs mb-2 block font-medium" style={{ color: "var(--color-text)" }}>Çıktı Boyutu</label>
            <div className="flex flex-wrap gap-2">
              {SCALES.map(s => (
                <button key={s.v} onClick={() => setScale(s.v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: scale === s.v ? "#818CF8" : "transparent",
                    color: scale === s.v ? "#fff" : "var(--color-text-2)",
                    border: `1px solid ${scale === s.v ? "#818CF8" : "var(--color-border)"}`,
                  }}>
                  {s.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hata */}
      {error && (
        <p className="text-sm px-4 py-2.5 rounded-lg" style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>
          {error}
        </p>
      )}

      {/* Sonuç */}
      {outputUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>PNG oluşturuldu</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>
              {svgSize ? `${svgSize.w * scale} × ${svgSize.h * scale} px` : ""} · {formatSize(outputSize)}
            </p>
          </div>
          <a
            href={outputUrl}
            download={file ? file.name.replace(/\.svg$/i, `@${scale}x.png`) : "output.png"}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80"
            style={{ background: "#10B981", color: "#fff" }}>
            İndir
          </a>
        </div>
      )}

      {/* Aksiyon */}
      {file && !outputUrl && (
        <button onClick={convert} disabled={processing || !svgSize}
          className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ background: "#818CF8", color: "#fff" }}>
          {processing ? "Dönüştürülüyor..." : "PNG'ye Dönüştür"}
        </button>
      )}
    </div>
  );
}
