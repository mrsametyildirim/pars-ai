"use client";

import { useState, useRef } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const accentColor = "#F05A28";

type Rotation = "90cw" | "90ccw" | "180" | "flip-h" | "flip-v";

const ROTATIONS: { value: Rotation; label: string; icon: string }[] = [
  { value: "90cw",   label: "90° Saat Yönünde",    icon: "↻" },
  { value: "90ccw",  label: "90° Saat Tersine",     icon: "↺" },
  { value: "180",    label: "180°",                 icon: "↕" },
  { value: "flip-h", label: "Yatay Ayna",           icon: "⇄" },
  { value: "flip-v", label: "Dikey Ayna",           icon: "⇅" },
];

function buildVf(rot: Rotation): string {
  switch (rot) {
    case "90cw":   return "transpose=1";
    case "90ccw":  return "transpose=2";
    case "180":    return "transpose=1,transpose=1";
    case "flip-h": return "hflip";
    case "flip-v": return "vflip";
  }
}

export default function VideoRotateClient() {
  const [file, setFile]   = useState<File | null>(null);
  const [rotation, setRotation] = useState<Rotation>("90cw");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function process() {
    if (!file) return;
    setLoading(true); setError(""); setResultUrl(null); setProgress(5);
    try {
      const ffmpeg = await getFFmpeg();
      ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 88) + 5));

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
      const input = `input.${ext}`;
      await ffmpeg.writeFile(input, await fetchFile(file));

      await ffmpeg.exec([
        "-i", input,
        "-vf", buildVf(rotation),
        "-c:v", "libx264",
        "-c:a", "copy",
        "-preset", "fast",
        "output.mp4",
      ]);

      setProgress(95);
      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data as unknown as BlobPart], { type: "video/mp4" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      await ffmpeg.deleteFile(input).catch(() => {});
      await ffmpeg.deleteFile("output.mp4").catch(() => {});
      setProgress(100);
    } catch (e) {
      setError("İşlem başarısız: " + (e instanceof Error ? e.message.slice(0, 80) : ""));
    }
    setLoading(false);
  }

  const downloadName = file ? file.name.replace(/\.[^.]+$/, `-dondurulen.mp4`) : "output.mp4";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Video dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>MP4, MOV, AVI, MKV, WebM</p>
          <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setResultUrl(null); } }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setResultUrl(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "12px", padding: "1rem" }}>
            <label style={{ color: textSec, fontSize: "0.8rem", display: "block", marginBottom: "0.5rem" }}>Döndürme / Ayna</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
              {ROTATIONS.map(r => (
                <button key={r.value} onClick={() => { setRotation(r.value); setResultUrl(null); }} style={{
                  padding: "0.6rem", borderRadius: "8px",
                  border: `1px solid ${rotation === r.value ? accentColor : border}`,
                  background: rotation === r.value ? `${accentColor}1A` : "transparent",
                  color: rotation === r.value ? accentColor : textSec,
                  cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  <span style={{ fontSize: "1.1rem" }}>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>Video işleniyor…</span>
                <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress}%</span>
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}

          {error && <p style={{ color: "#E84545", fontSize: "0.85rem", padding: "0.6rem 0.875rem", background: "#E8454512", borderRadius: "8px" }}>{error}</p>}

          {resultUrl && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px" }}>
              <p style={{ color: "#10B981", fontWeight: 600, fontSize: "0.9rem" }}>Video döndürüldü!</p>
              <a href={resultUrl} download={downloadName}
                style={{ padding: "0.45rem 1rem", background: "#10B981", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                İndir
              </a>
            </div>
          )}

          <button onClick={process} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "İşleniyor…" : "Döndür / Aynala"}
          </button>
        </>
      )}
    </div>
  );
}
