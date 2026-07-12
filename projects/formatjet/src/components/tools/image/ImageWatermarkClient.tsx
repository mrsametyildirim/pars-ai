"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Position = "top-left"|"top-center"|"top-right"|"center-left"|"center"|"center-right"|"bottom-left"|"bottom-center"|"bottom-right";

const POSITIONS: { v: Position; icon: string }[] = [
  { v: "top-left",      icon: "↖" }, { v: "top-center",    icon: "↑" }, { v: "top-right",     icon: "↗" },
  { v: "center-left",   icon: "←" }, { v: "center",        icon: "✛" }, { v: "center-right",  icon: "→" },
  { v: "bottom-left",   icon: "↙" }, { v: "bottom-center", icon: "↓" }, { v: "bottom-right",  icon: "↘" },
];

function getCoords(pos: Position, iw: number, ih: number, pad: number): [number, number] {
  const [vert, horiz] = pos.split("-") as string[];
  const x = horiz === "right" ? iw - pad : horiz === "center" || pos === "center" ? iw / 2 : pad;
  const y = vert  === "bottom" ? ih - pad : vert  === "center" || pos === "center" ? ih / 2 : pad;
  return [x, y];
}

function textAlign(pos: Position): CanvasTextAlign {
  if (pos.includes("right"))  return "right";
  if (pos.includes("left"))   return "left";
  return "center";
}

function formatSize(b: number) {
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function ImageWatermarkClient() {
  const [file,      setFile]      = useState<File | null>(null);
  const [imgUrl,    setImgUrl]    = useState<string | null>(null);
  const [natW,      setNatW]      = useState(0);
  const [natH,      setNatH]      = useState(0);
  const [text,      setText]      = useState("FormatJet");
  const [fontSize,  setFontSize]  = useState(48);
  const [opacity,   setOpacity]   = useState(70);
  const [color,     setColor]     = useState("#ffffff");
  const [position,  setPosition]  = useState<Position>("bottom-right");
  const [format,    setFormat]    = useState<"image/jpeg"|"image/png">("image/jpeg");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize,setResultSize]= useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setResultUrl(null);
    const url = URL.createObjectURL(f);
    setFile(f); setImgUrl(url);
    const img = new Image();
    img.onload = () => { setNatW(img.naturalWidth); setNatH(img.naturalHeight); };
    img.src = url;
  }, []);

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgUrl || !natW) return;
    const maxW = 600;
    const scale = Math.min(1, maxW / natW);
    const dw = natW * scale, dh = natH * scale;
    canvas.width = dw; canvas.height = dh;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, dw, dh);
      const scaledFont = Math.round(fontSize * scale);
      ctx.font = `bold ${scaledFont}px sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity / 100;
      ctx.textAlign = textAlign(position);
      ctx.textBaseline = "middle";
      const pad = 16 * scale;
      const [x, y] = getCoords(position, dw, dh, pad + scaledFont / 2);
      /* Shadow for legibility */
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4 * scale;
      ctx.fillText(text || "Filigran", x, y);
      ctx.globalAlpha = 1;
    };
    img.src = imgUrl;
  }, [imgUrl, natW, natH, text, fontSize, opacity, color, position]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  const apply = () => {
    if (!imgUrl || !natW) return;
    const canvas = document.createElement("canvas");
    canvas.width = natW; canvas.height = natH;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity / 100;
      ctx.textAlign = textAlign(position);
      ctx.textBaseline = "middle";
      const pad = 24;
      const [x, y] = getCoords(position, natW, natH, pad + fontSize / 2);
      ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 6;
      ctx.fillText(text || "Filigran", x, y);
      ctx.globalAlpha = 1;
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

  return (
    <div className="space-y-5">
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]); }}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer hover:opacity-80 transition-all"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="text-4xl mb-3">🔖</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsel yükle ve filigran ekle</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>JPG, PNG, WebP</p>
          <input ref={inputRef} type="file" accept="image/*" className="sr-only"
            onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Ayarlar */}
          <div className="p-4 rounded-xl border space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>Filigran Metni</label>
                <input type="text" value={text} onChange={e => setText(e.target.value)} maxLength={80}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>Yazı Boyutu: {fontSize}px</label>
                <input type="range" min={12} max={200} step={4} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#818CF8" }} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>Opaklık: %{opacity}</label>
                <input type="range" min={10} max={100} step={5} value={opacity} onChange={e => setOpacity(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#818CF8" }} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>Renk</label>
                <input type="color" value={color} onChange={e => setColor(e.target.value)}
                  className="w-full h-9 rounded-lg cursor-pointer border"
                  style={{ borderColor: "var(--color-border)" }} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "var(--color-text-3)" }}>Konum</label>
                <div className="grid grid-cols-3 gap-1">
                  {POSITIONS.map(p => (
                    <button key={p.v} onClick={() => setPosition(p.v)}
                      className="h-8 text-sm rounded flex items-center justify-center transition-all"
                      style={{
                        background: position === p.v ? "#818CF8" : "var(--color-bg)",
                        color: position === p.v ? "#fff" : "var(--color-text-2)",
                        border: `1px solid ${position === p.v ? "#818CF8" : "var(--color-border)"}`,
                      }}>
                      {p.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Önizleme canvas */}
          <div className="rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: "#111", maxHeight: "50vh" }}>
            <canvas ref={canvasRef} className="max-w-full max-h-[50vh] object-contain" />
          </div>

          {/* Format */}
          <div className="flex gap-2">
            {(["image/jpeg","image/png"] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: format === f ? "#818CF8" : "transparent",
                  color: format === f ? "#fff" : "var(--color-text-2)",
                  border: `1px solid ${format === f ? "#818CF8" : "var(--color-border)"}`,
                }}>
                {f === "image/jpeg" ? "JPG" : "PNG"}
              </button>
            ))}
            <button onClick={reset} className="ml-auto px-3 py-1.5 rounded-lg text-xs hover:opacity-70"
              style={{ color: "var(--color-text-3)", border: "1px solid var(--color-border)" }}>
              Sıfırla
            </button>
          </div>
        </div>
      )}

      {/* Sonuç */}
      {resultUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>Filigran eklendi</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{natW}×{natH} · {formatSize(resultSize)}</p>
          </div>
          <a href={resultUrl} download={file?.name.replace(/\.[^.]+$/, "") + `-filigran.${format === "image/jpeg" ? "jpg" : "png"}`}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80" style={{ background: "#10B981", color: "#fff" }}>
            İndir
          </a>
        </div>
      )}

      {file && (
        <button onClick={apply}
          className="w-full py-3 rounded-xl text-sm font-semibold"
          style={{ background: "#818CF8", color: "#fff" }}>
          Filigranı Uygula ve İndir
        </button>
      )}
    </div>
  );
}
