"use client";

import { useState, useRef } from "react";

const accentColor = "#818CF8";

type FilterType = "grayscale" | "sepia" | "invert" | "brightness" | "contrast" | "blur";

const FILTERS: { value: FilterType; label: string; hasIntensity: boolean; defaultVal: number; min: number; max: number; unit: string }[] = [
  { value: "grayscale",  label: "Gri Ton",     hasIntensity: false, defaultVal: 100, min: 0, max: 100, unit: "%" },
  { value: "sepia",      label: "Sepia",        hasIntensity: false, defaultVal: 100, min: 0, max: 100, unit: "%" },
  { value: "invert",     label: "Ters Çevir",   hasIntensity: false, defaultVal: 100, min: 0, max: 100, unit: "%" },
  { value: "brightness", label: "Parlaklık",    hasIntensity: true,  defaultVal: 150, min: 50, max: 250, unit: "%" },
  { value: "contrast",   label: "Kontrast",     hasIntensity: true,  defaultVal: 150, min: 50, max: 250, unit: "%" },
  { value: "blur",       label: "Bulanıklaştır",hasIntensity: true,  defaultVal: 3,   min: 1, max: 20, unit: "px" },
];

export default function ImageFilterClient() {
  const [file, setFile]     = useState<File | null>(null);
  const [filter, setFilter] = useState<FilterType>("grayscale");
  const [intensity, setIntensity] = useState(100);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  const curFilter = FILTERS.find(f => f.value === filter)!;

  function selectFile(f: File) {
    setFile(f); setResultUrl(null); setError("");
    const url = URL.createObjectURL(f);
    setPreview(url);
    setIntensity(curFilter.defaultVal);
  }

  function selectFilter(f: FilterType) {
    setFilter(f);
    setResultUrl(null);
    const cfg = FILTERS.find(x => x.value === f)!;
    setIntensity(cfg.defaultVal);
  }

  async function apply() {
    if (!file || !preview) return;
    setLoading(true); setError(""); setResultUrl(null);
    try {
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload  = () => res();
        img.onerror = () => rej(new Error("Görsel yüklenemedi"));
        img.src = preview;
      });

      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      const val = curFilter.hasIntensity ? intensity : 100;
      const filterStr = filter === "blur"
        ? `blur(${val}px)`
        : `${filter}(${val}%)`;

      ctx.filter = filterStr;
      ctx.drawImage(img, 0, 0);
      ctx.filter = "none";

      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), file.type.includes("png") ? "image/png" : "image/jpeg", 0.93));
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("İşlem başarısız: " + (e instanceof Error ? e.message : ""));
    }
    setLoading(false);
  }

  const ext = file?.name.split(".").pop() ?? "png";
  const downloadName = file ? file.name.replace(/\.[^.]+$/, `-filtreli.${ext}`) : "output.png";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) selectFile(f); }}
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9 2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9 2.83-2.83"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Görseli sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>JPG, PNG, WebP</p>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) selectFile(f); }} />
        </div>
      ) : (
        <>
          {(preview || resultUrl) && (
            <div style={{ textAlign: "center" }}>
              <img src={resultUrl ?? preview!} alt="Önizleme"
                style={{ maxWidth: "100%", maxHeight: "260px", borderRadius: "12px", objectFit: "contain",
                  filter: !resultUrl ? (filter === "blur" ? `blur(${Math.min(intensity, 8)}px)` : `${filter}(${intensity}%)`) : "none" }} />
            </div>
          )}

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label style={{ color: textSec, fontSize: "0.8rem", display: "block", marginBottom: "0.5rem" }}>Filtre</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem" }}>
                {FILTERS.map(f => (
                  <button key={f.value} onClick={() => selectFilter(f.value)} style={{
                    padding: "0.5rem", borderRadius: "8px",
                    border: `1px solid ${filter === f.value ? accentColor : border}`,
                    background: filter === f.value ? `${accentColor}1A` : "transparent",
                    color: filter === f.value ? accentColor : textSec,
                    cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit",
                  }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {curFilter.hasIntensity && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <label style={{ color: textSec, fontSize: "0.78rem" }}>Yoğunluk</label>
                  <span style={{ color: textTer, fontSize: "0.75rem", fontFamily: "monospace" }}>{intensity}{curFilter.unit}</span>
                </div>
                <input type="range" min={curFilter.min} max={curFilter.max} value={intensity}
                  onChange={e => { setIntensity(Number(e.target.value)); setResultUrl(null); }}
                  style={{ width: "100%", accentColor }} />
              </div>
            )}
          </div>

          {error && <p style={{ color: "#E84545", fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: "#E8454512", borderRadius: "8px" }}>{error}</p>}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={() => { setFile(null); setPreview(null); setResultUrl(null); }} style={{
              padding: "0.7rem 1rem", borderRadius: "10px", border: `1px solid ${border}`,
              background: "transparent", color: textSec, cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem",
            }}>Değiştir</button>

            {resultUrl ? (
              <a href={resultUrl} download={downloadName} style={{
                flex: 1, padding: "0.875rem", borderRadius: "12px", background: "#10B981",
                color: "#fff", textAlign: "center", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600,
              }}>İndir</a>
            ) : (
              <button onClick={apply} disabled={loading} style={{
                flex: 1, padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
                color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.6 : 1,
              }}>
                {loading ? "Uygulanıyor…" : "Filtre Uygula"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
