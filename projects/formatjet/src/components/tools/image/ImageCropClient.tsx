"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Rect = { x: number; y: number; w: number; h: number };
type AspectRatio = "free" | "1:1" | "4:3" | "16:9" | "3:4" | "9:16" | "2:3" | "3:2";
const RATIOS: AspectRatio[] = ["free", "1:1", "4:3", "16:9", "3:4", "9:16", "2:3", "3:2"];

function ratioValue(r: AspectRatio): number | null {
  if (r === "free") return null;
  const [a, b] = r.split(":").map(Number);
  return a / b;
}

function formatSize(b: number) {
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function ImageCropClient() {
  const [file,     setFile]     = useState<File | null>(null);
  const [imgUrl,   setImgUrl]   = useState<string | null>(null);
  const [natW,     setNatW]     = useState(0);
  const [natH,     setNatH]     = useState(0);
  const [ratio,    setRatio]    = useState<AspectRatio>("free");
  const [format,   setFormat]   = useState<"image/jpeg"|"image/png">("image/jpeg");
  const [crop,     setCrop]     = useState<Rect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [dragging, setDragging] = useState<"move"|"se"|"sw"|"ne"|"nw"|null>(null);
  const [dragStart,setDragStart]= useState({ mx: 0, my: 0, cx: 0, cy: 0, cw: 0, ch: 0 });
  const [resultUrl,setResultUrl]= useState<string|null>(null);
  const [resultSize,setResultSize]=useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setResultUrl(null);
    const url = URL.createObjectURL(f);
    setFile(f); setImgUrl(url);
    const img = new Image();
    img.onload = () => {
      setNatW(img.naturalWidth); setNatH(img.naturalHeight);
      const rv = ratioValue(ratio);
      if (rv) {
        const newH = Math.min(0.8, 0.8 / rv);
        setCrop({ x: 0.1, y: 0.1, w: 0.8, h: Math.min(newH, 0.8) });
      } else {
        setCrop({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
      }
    };
    img.src = url;
  }, [ratio]);

  const applyRatio = (r: AspectRatio) => {
    setRatio(r);
    const rv = ratioValue(r);
    if (!rv) return;
    const imgRatio = natW / natH;
    const rv2 = rv / imgRatio;
    const cx = crop.x, cy = crop.y;
    const nw = Math.min(0.8, 1 - cx);
    const nh = nw / rv2 / imgRatio;
    if (nh > 0.001 && nh < 1) setCrop({ x: cx, y: cy, w: nw, h: Math.min(nh, 1 - cy) });
  };

  const getContainerRect = () => containerRef.current?.getBoundingClientRect();

  const onMouseDown = (e: React.MouseEvent, type: typeof dragging) => {
    e.preventDefault();
    setDragging(type);
    setDragStart({ mx: e.clientX, my: e.clientY, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h });
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const cr = getContainerRect();
      if (!cr) return;
      const dx = (e.clientX - dragStart.mx) / cr.width;
      const dy = (e.clientY - dragStart.my) / cr.height;
      const rv = ratioValue(ratio);
      const imgRatio = natW / natH;

      setCrop(prev => {
        if (dragging === "move") {
          return {
            x: Math.max(0, Math.min(1 - prev.w, dragStart.cx + dx)),
            y: Math.max(0, Math.min(1 - prev.h, dragStart.cy + dy)),
            w: prev.w, h: prev.h,
          };
        }
        let { x, y, w, h } = { x: dragStart.cx, y: dragStart.cy, w: dragStart.cw, h: dragStart.ch };
        if (dragging === "se") {
          w = Math.max(0.05, Math.min(1 - x, dragStart.cw + dx));
          h = rv ? w / rv / imgRatio : Math.max(0.05, Math.min(1 - y, dragStart.ch + dy));
        } else if (dragging === "sw") {
          w = Math.max(0.05, dragStart.cw - dx);
          x = Math.max(0, dragStart.cx + dragStart.cw - w);
          h = rv ? w / rv / imgRatio : Math.max(0.05, Math.min(1 - y, dragStart.ch + dy));
        } else if (dragging === "ne") {
          w = Math.max(0.05, Math.min(1 - x, dragStart.cw + dx));
          h = rv ? w / rv / imgRatio : Math.max(0.05, dragStart.ch - dy);
          y = rv ? dragStart.cy + dragStart.ch - h : Math.max(0, dragStart.cy + dragStart.ch - h);
        } else if (dragging === "nw") {
          w = Math.max(0.05, dragStart.cw - dx);
          x = Math.max(0, dragStart.cx + dragStart.cw - w);
          h = rv ? w / rv / imgRatio : Math.max(0.05, dragStart.ch - dy);
          y = rv ? dragStart.cy + dragStart.ch - h : Math.max(0, dragStart.cy + dragStart.ch - h);
        }
        h = Math.min(h, 1 - y);
        w = Math.min(w, 1 - x);
        return { x, y, w, h };
      });
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, dragStart, ratio, natW, natH]);

  const applyCrop = () => {
    if (!imgUrl) return;
    const img = new Image();
    img.onload = () => {
      const sx = Math.round(crop.x * img.naturalWidth);
      const sy = Math.round(crop.y * img.naturalHeight);
      const sw = Math.round(crop.w * img.naturalWidth);
      const sh = Math.round(crop.h * img.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = sw; canvas.height = sh;
      canvas.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      canvas.toBlob(b => {
        if (b) { setResultUrl(URL.createObjectURL(b)); setResultSize(b.size); }
      }, format, 0.92);
    };
    img.src = imgUrl;
  };

  const reset = () => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null); setImgUrl(null); setResultUrl(null);
  };

  const croppedW = Math.round(crop.w * natW);
  const croppedH = Math.round(crop.h * natH);

  return (
    <div className="space-y-5">
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]); }}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer hover:opacity-80 transition-all"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="text-4xl mb-3">✂️</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsel yükle ve kırp</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>JPG, PNG, WebP</p>
          <input ref={inputRef} type="file" accept="image/*" className="sr-only"
            onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* En-boy oranı */}
          <div className="p-3 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <label className="text-xs mb-2 block" style={{ color: "var(--color-text-3)" }}>En-Boy Oranı</label>
            <div className="flex flex-wrap gap-1.5">
              {RATIOS.map(r => (
                <button key={r} onClick={() => applyRatio(r)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: ratio === r ? "#818CF8" : "transparent",
                    color: ratio === r ? "#fff" : "var(--color-text-2)",
                    border: `1px solid ${ratio === r ? "#818CF8" : "var(--color-border)"}`,
                  }}>
                  {r === "free" ? "Serbest" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Kırp alanı */}
          <div
            ref={containerRef}
            className="relative rounded-xl overflow-hidden select-none"
            style={{ background: "#111", maxHeight: "60vh" }}>
            {imgUrl && (
              <img src={imgUrl} alt="" className="block w-full h-full object-contain pointer-events-none"
                style={{ maxHeight: "60vh" }} />
            )}
            {/* Karartma overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(0,0,0,0.5)" }} />
            {/* Crop box */}
            <div
              className="absolute border-2 cursor-move"
              style={{
                left: `${crop.x * 100}%`,
                top:  `${crop.y * 100}%`,
                width: `${crop.w * 100}%`,
                height: `${crop.h * 100}%`,
                borderColor: "#fff",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
              }}
              onMouseDown={e => onMouseDown(e, "move")}>
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} style={{ border: "1px solid rgba(255,255,255,0.3)" }} />
                ))}
              </div>
              {/* Handles */}
              {(["nw","ne","sw","se"] as const).map(pos => (
                <div key={pos}
                  className="absolute w-4 h-4 border-2 border-white"
                  style={{
                    background: "#fff",
                    ...(pos.includes("n") ? { top: -5 } : { bottom: -5 }),
                    ...(pos.includes("w") ? { left: -5 } : { right: -5 }),
                    cursor: `${pos}-resize`,
                  }}
                  onMouseDown={e => { e.stopPropagation(); onMouseDown(e, pos); }}
                />
              ))}
            </div>
          </div>

          {/* Bilgi + format */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm font-mono" style={{ color: "var(--color-text-2)" }}>
              {croppedW} × {croppedH} px
            </div>
            <div className="flex gap-1.5 ml-auto">
              {(["image/jpeg","image/png"] as const).map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: format === f ? "#818CF8" : "transparent",
                    color: format === f ? "#fff" : "var(--color-text-2)",
                    border: `1px solid ${format === f ? "#818CF8" : "var(--color-border)"}`,
                  }}>
                  {f === "image/jpeg" ? "JPG" : "PNG"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sonuç */}
      {resultUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>Görsel kırpıldı</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{croppedW}×{croppedH} · {formatSize(resultSize)}</p>
          </div>
          <div className="flex gap-2">
            <a href={resultUrl} download={file?.name.replace(/\.[^.]+$/, "") + `-kirpilmis.${format === "image/jpeg" ? "jpg" : "png"}`}
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

      {file && (
        <button onClick={applyCrop}
          className="w-full py-3 rounded-xl text-sm font-semibold"
          style={{ background: "#818CF8", color: "#fff" }}>
          Kırpmayı Uygula
        </button>
      )}
    </div>
  );
}
