"use client";

import { useState, useRef } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const accentColor = "#818CF8";

export default function ImagesToGifClient() {
  const [files, setFiles]   = useState<File[]>([]);
  const [fps, setFps]       = useState(5);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError]   = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  function addFiles(newFiles: FileList | File[]) {
    const arr = Array.from(newFiles).filter(f => f.type.startsWith("image/"));
    setFiles(prev => [...prev, ...arr].slice(0, 30));
    setResultUrl(null);
  }

  function removeFile(i: number) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setResultUrl(null);
  }

  async function makeGif() {
    if (files.length < 2) { setError("En az 2 görsel seçin"); return; }
    setLoading(true); setError(""); setResultUrl(null); setProgress(5);
    try {
      const ffmpeg = await getFFmpeg();
      ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 85) + 5));

      for (let i = 0; i < files.length; i++) {
        const name = `frame${String(i).padStart(3, "0")}.jpg`;
        await ffmpeg.writeFile(name, await fetchFile(files[i]));
      }

      await ffmpeg.exec([
        "-framerate", String(fps),
        "-i", "frame%03d.jpg",
        "-vf", "scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
        "-loop", "0",
        "output.gif",
      ]);

      setProgress(95);
      const data    = await ffmpeg.readFile("output.gif");
      const blob    = new Blob([data as unknown as BlobPart], { type: "image/gif" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));

      for (let i = 0; i < files.length; i++) {
        await ffmpeg.deleteFile(`frame${String(i).padStart(3, "0")}.jpg`).catch(() => {});
      }
      await ffmpeg.deleteFile("output.gif").catch(() => {});
      setProgress(100);
    } catch (e) {
      setError("GIF oluşturma başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "2rem", textAlign: "center", cursor: "pointer", background: surface }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 0.75rem" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.2rem" }}>Görselleri sürükle veya tıkla</p>
        <p style={{ color: textTer, fontSize: "0.78rem" }}>JPG, PNG, WebP · Maks. 30 kare</p>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
          onChange={e => { if (e.target.files) addFiles(e.target.files); }} />
      </div>

      {files.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "0.5rem" }}>
            {files.map((f, i) => (
              <div key={i} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", background: surface, border: `1px solid ${border}`, aspectRatio: "1" }}>
                <img src={URL.createObjectURL(f)} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => removeFile(i)} style={{
                  position: "absolute", top: "3px", right: "3px", width: "18px", height: "18px",
                  borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px",
                }}>×</button>
                <div style={{ position: "absolute", bottom: "2px", left: "3px", color: "rgba(255,255,255,0.8)", fontSize: "9px", fontFamily: "monospace" }}>{i + 1}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <label style={{ color: textSec, fontSize: "0.8rem" }}>Kare Hızı (FPS)</label>
              <span style={{ color: textTer, fontSize: "0.75rem", fontFamily: "monospace" }}>{fps} fps</span>
            </div>
            <input type="range" min={1} max={20} step={1} value={fps} onChange={e => setFps(Number(e.target.value))} style={{ width: "100%", accentColor }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.2rem" }}>
              <span style={{ color: textTer, fontSize: "0.72rem" }}>Yavaş</span>
              <span style={{ color: textTer, fontSize: "0.72rem" }}>Hızlı</span>
            </div>
          </div>

          {loading && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>GIF oluşturuluyor…</span>
                <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress}%</span>
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}

          {error && <p style={{ color: "#E84545", fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: "#E8454512", borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <img src={resultUrl} alt="GIF Sonuç" style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain", borderRadius: "8px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>{files.length} kare · {fps} fps</p>
                <a href={resultUrl} download="animation.gif"
                  style={{ padding: "0.45rem 1rem", background: "#10B981", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                  GIF İndir
                </a>
              </div>
            </div>
          )}

          <button onClick={makeGif} disabled={loading || files.length < 2} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: (loading || files.length < 2) ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: (loading || files.length < 2) ? 0.6 : 1,
          }}>
            {loading ? "Oluşturuluyor…" : `GIF Oluştur (${files.length} kare)`}
          </button>
        </>
      )}
    </div>
  );
}
