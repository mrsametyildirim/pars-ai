"use client";

import { useState, useRef } from "react";

const accentColor = "#818CF8";

type Direction = "horizontal" | "vertical" | "both";

export default function ImageFlipClient() {
  const [file, setFile]   = useState<File | null>(null);
  const [dir, setDir]     = useState<Direction>("horizontal");
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  function selectFile(f: File) {
    setFile(f); setResultUrl(null); setError("");
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function flip() {
    if (!file) return;
    setLoading(true); setError(""); setResultUrl(null);
    try {
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("Görsel yüklenemedi"));
        img.src = preview!;
      });

      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      ctx.save();
      if (dir === "horizontal" || dir === "both") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      if (dir === "vertical" || dir === "both") {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
      }
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), file.type || "image/png", 0.95));
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("İşlem başarısız: " + (e instanceof Error ? e.message : ""));
    }
    setLoading(false);
  }

  const ext = file?.name.split(".").pop() ?? "png";
  const downloadName = file ? file.name.replace(/\.[^.]+$/, `-ters.${ext}`) : "output.png";

  const DIRS: { value: Direction; label: string; icon: string }[] = [
    { value: "horizontal", label: "Yatay (Ayna)", icon: "↔" },
    { value: "vertical",   label: "Dikey (Baş aşağı)", icon: "↕" },
    { value: "both",       label: "Her İkisi", icon: "⊕" },
  ];

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
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Görseli sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>JPG, PNG, WebP, GIF</p>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) selectFile(f); }} />
        </div>
      ) : (
        <>
          {preview && !resultUrl && (
            <div style={{ textAlign: "center" }}>
              <img src={preview} alt="Önizleme" style={{ maxWidth: "100%", maxHeight: "280px", borderRadius: "12px", objectFit: "contain" }} />
            </div>
          )}
          {resultUrl && (
            <div style={{ textAlign: "center" }}>
              <img src={resultUrl} alt="Sonuç" style={{ maxWidth: "100%", maxHeight: "280px", borderRadius: "12px", objectFit: "contain" }} />
            </div>
          )}

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "1rem" }}>
            <label style={{ color: textSec, fontSize: "0.8rem", display: "block", marginBottom: "0.5rem" }}>Çevirme Yönü</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {DIRS.map(d => (
                <button key={d.value} onClick={() => { setDir(d.value); setResultUrl(null); }} style={{
                  flex: 1, padding: "0.6rem 0.4rem", borderRadius: "8px",
                  border: `1px solid ${dir === d.value ? accentColor : border}`,
                  background: dir === d.value ? `${accentColor}1A` : "transparent",
                  color: dir === d.value ? accentColor : textSec,
                  cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit",
                }}>
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.2rem" }}>{d.icon}</div>
                  {d.label}
                </button>
              ))}
            </div>
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
              <button onClick={flip} disabled={loading} style={{
                flex: 1, padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
                color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.6 : 1,
              }}>
                {loading ? "İşleniyor…" : "Çevir"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
