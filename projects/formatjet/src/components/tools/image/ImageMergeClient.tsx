"use client";

import { useState, useRef, useCallback } from "react";

type Direction = "horizontal" | "vertical" | "grid";
type ImgItem = { id: string; file: File; url: string; w: number; h: number };

function formatSize(b: number) {
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function ImageMergeClient() {
  const [images,    setImages]    = useState<ImgItem[]>([]);
  const [direction, setDirection] = useState<Direction>("horizontal");
  const [gap,       setGap]       = useState(0);
  const [bgColor,   setBgColor]   = useState("#ffffff");
  const [format,    setFormat]    = useState<"image/jpeg"|"image/png">("image/jpeg");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize,setResultSize]= useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList) => {
    Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, 10 - images.length).forEach(file => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => setImages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, file, url, w: img.naturalWidth, h: img.naturalHeight }]);
      img.src = url;
    });
  }, [images.length]);

  const remove = (id: string) => {
    setImages(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter(i => i.id !== id);
    });
  };

  const moveUp   = (i: number) => { const a = [...images]; [a[i-1],a[i]] = [a[i],a[i-1]]; setImages(a); };
  const moveDown = (i: number) => { const a = [...images]; [a[i],a[i+1]] = [a[i+1],a[i]]; setImages(a); };

  const merge = () => {
    if (images.length < 2) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    if (direction === "horizontal") {
      const maxH = Math.max(...images.map(i => i.h));
      const totalW = images.reduce((s, i) => s + Math.round(i.w * maxH / i.h), 0) + gap * (images.length - 1);
      canvas.width = totalW; canvas.height = maxH;
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, totalW, maxH);
      let x = 0;
      images.forEach(img => {
        const scale = maxH / img.h;
        const dw = Math.round(img.w * scale);
        const htmlImg = new Image(); htmlImg.src = img.url;
        ctx.drawImage(htmlImg, x, 0, dw, maxH);
        x += dw + gap;
      });
    } else if (direction === "vertical") {
      const maxW = Math.max(...images.map(i => i.w));
      const totalH = images.reduce((s, i) => s + Math.round(i.h * maxW / i.w), 0) + gap * (images.length - 1);
      canvas.width = maxW; canvas.height = totalH;
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, maxW, totalH);
      let y = 0;
      images.forEach(img => {
        const scale = maxW / img.w;
        const dh = Math.round(img.h * scale);
        const htmlImg = new Image(); htmlImg.src = img.url;
        ctx.drawImage(htmlImg, 0, y, maxW, dh);
        y += dh + gap;
      });
    } else {
      /* Grid: 2-kolon */
      const cols = 2;
      const rows = Math.ceil(images.length / cols);
      const cellW = Math.max(...images.map(i => i.w));
      const cellH = Math.max(...images.map(i => i.h));
      canvas.width = cellW * cols + gap * (cols - 1);
      canvas.height = cellH * rows + gap * (rows - 1);
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      images.forEach((img, idx) => {
        const col = idx % cols, row = Math.floor(idx / cols);
        const x = col * (cellW + gap), y = row * (cellH + gap);
        const htmlImg = new Image(); htmlImg.src = img.url;
        const scale = Math.min(cellW / img.w, cellH / img.h);
        const dw = img.w * scale, dh = img.h * scale;
        ctx.drawImage(htmlImg, x + (cellW - dw) / 2, y + (cellH - dh) / 2, dw, dh);
      });
    }

    canvas.toBlob(b => {
      if (b) { setResultUrl(URL.createObjectURL(b)); setResultSize(b.size); }
    }, format, 0.92);
  };

  const reset = () => {
    images.forEach(i => URL.revokeObjectURL(i.url));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImages([]); setResultUrl(null);
  };

  return (
    <div className="space-y-5">
      {/* Ayarlar */}
      <div className="p-4 rounded-xl border space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Düzenleme</label>
            <div className="flex gap-1.5">
              {([
                { v: "horizontal" as Direction, l: "Yatay" },
                { v: "vertical"   as Direction, l: "Dikey" },
                { v: "grid"       as Direction, l: "2 Kolon" },
              ]).map(d => (
                <button key={d.v} onClick={() => setDirection(d.v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: direction === d.v ? "#818CF8" : "transparent",
                    color: direction === d.v ? "#fff" : "var(--color-text-2)",
                    border: `1px solid ${direction === d.v ? "#818CF8" : "var(--color-border)"}`,
                  }}>
                  {d.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Aralık: {gap}px</label>
            <input type="range" min={0} max={60} step={4} value={gap} onChange={e => setGap(Number(e.target.value))}
              className="w-28 h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#818CF8" }} />
          </div>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Arkaplan</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
              className="w-16 h-8 rounded-lg cursor-pointer border" style={{ borderColor: "var(--color-border)" }} />
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        className="border-2 border-dashed rounded-xl py-10 text-center cursor-pointer hover:opacity-80 transition-all"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="text-3xl mb-2">🖼️</div>
        <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Görselleri buraya sürükle</p>
        <p className="text-xs" style={{ color: "var(--color-text-3)" }}>JPG, PNG, WebP — max 10 görsel</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only"
          onChange={e => e.target.files && addFiles(e.target.files)} />
      </div>

      {/* Görsel listesi */}
      {images.length > 0 && (
        <div className="space-y-1.5">
          {images.map((img, i) => (
            <div key={img.id} className="flex items-center gap-2 p-2 rounded-lg border"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <img src={img.url} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
              <span className="text-xs font-mono w-5 text-center shrink-0" style={{ color: "var(--color-text-3)" }}>{i+1}</span>
              <p className="text-sm flex-1 truncate" style={{ color: "var(--color-text)" }}>{img.file.name}</p>
              <span className="text-xs shrink-0 font-mono" style={{ color: "var(--color-text-3)" }}>{img.w}×{img.h}</span>
              <div className="flex gap-0.5">
                <button onClick={() => moveUp(i)} disabled={i===0} className="p-1 rounded disabled:opacity-20" style={{ color: "var(--color-text-3)" }}>▲</button>
                <button onClick={() => moveDown(i)} disabled={i===images.length-1} className="p-1 rounded disabled:opacity-20" style={{ color: "var(--color-text-3)" }}>▼</button>
                <button onClick={() => remove(img.id)} className="p-1 rounded" style={{ color: "var(--color-text-3)" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sonuç */}
      {resultUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>Görseller birleştirildi</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{images.length} görsel · {formatSize(resultSize)}</p>
          </div>
          <div className="flex gap-2">
            <a href={resultUrl} download={`birlestir.${format === "image/jpeg" ? "jpg" : "png"}`}
              className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80" style={{ background: "#10B981", color: "#fff" }}>
              İndir
            </a>
            <button onClick={reset} className="px-3 py-2 rounded-lg text-xs hover:opacity-70"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-2)" }}>
              Sıfırla
            </button>
          </div>
        </div>
      )}

      {images.length >= 2 && !resultUrl && (
        <div className="flex gap-3 items-center">
          <div className="flex gap-1.5">
            {(["image/jpeg","image/png"] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: format === f ? "#818CF8" : "transparent",
                  color: format === f ? "#fff" : "var(--color-text-2)",
                  border: `1px solid ${format === f ? "#818CF8" : "var(--color-border)"}`,
                }}>
                {f === "image/jpeg" ? "JPG" : "PNG"}
              </button>
            ))}
          </div>
          <button onClick={merge} className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ background: "#818CF8", color: "#fff" }}>
            {images.length} Görseli Birleştir
          </button>
        </div>
      )}
    </div>
  );
}
