"use client";

import { useState, useRef } from "react";
import { fetchFile } from "@ffmpeg/util";

type AudioFormat = "mp3" | "wav" | "aac";
type Quality     = "128k" | "192k" | "320k";

const QUALITY_LABELS: Record<Quality, string> = {
  "128k": "128 kbps — Standart",
  "192k": "192 kbps — Yüksek",
  "320k": "320 kbps — Maksimum",
};

export default function VideoToMp3Client() {
  const [file, setFile]         = useState<File | null>(null);
  const [format, setFormat]     = useState<AudioFormat>("mp3");
  const [quality, setQuality]   = useState<Quality>("192k");
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState("");
  const [error, setError]       = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);

  const accentColor = "#F05A28";

  const accept = ".mp4,.mov,.avi,.mkv,.webm,video/*";

  async function convert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(0);
    setStatus("FFmpeg yükleniyor…");
    try {
      const { getFFmpeg } = await import("@/lib/ffmpeg");
      const ffmpeg = await getFFmpeg();

      setStatus("Dosya işleniyor…");
      const onProgress = ({ progress: p }: { progress: number }) => setProgress(Math.round(p * 100));
      ffmpeg.on("progress", onProgress);

      const inputName  = "input" + file.name.slice(file.name.lastIndexOf("."));
      const outputName = "output." + format;

      ffmpeg.writeFile(inputName, await fetchFile(file));

      const ffArgs: string[] = ["-i", inputName];
      if (format === "mp3") {
        ffArgs.push("-vn", "-c:a", "libmp3lame", "-b:a", quality);
      } else if (format === "wav") {
        ffArgs.push("-vn", "-c:a", "pcm_s16le");
      } else {
        ffArgs.push("-vn", "-c:a", "aac", "-b:a", quality);
      }
      ffArgs.push(outputName);

      await ffmpeg.exec(ffArgs);

      const data = await ffmpeg.readFile(outputName);
      const mime = format === "wav" ? "audio/wav" : format === "aac" ? "audio/aac" : "audio/mpeg";
      const blob = new Blob([data as unknown as BlobPart], { type: mime });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.[^.]+$/, "") + "." + format;
      a.click();
      URL.revokeObjectURL(url);

      ffmpeg.deleteFile(inputName);
      ffmpeg.deleteFile(outputName);
      ffmpeg.off("progress", onProgress);

      setStatus("Tamamlandı!");
      setProgress(100);
    } catch (e: unknown) {
      setError("Dönüştürme başarısız. Dosyanın geçerli bir video olduğundan emin olun.");
      console.error(e);
    } finally {
      setLoading(false);
      setTimeout(() => { setStatus(""); setProgress(0); }, 3000);
    }
  }

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          style={{
            border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem",
            textAlign: "center", cursor: "pointer", background: surface,
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Video dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>MP4, MOV, AVI, MKV, WebM · Maksimum 500 MB</p>
          <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setError(""); setStatus(""); setProgress(0); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Format selection */}
          <div>
            <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Ses Formatı</label>
            <div style={{ display: "flex", background: surface, borderRadius: "10px", border: `1px solid ${border}`, padding: "3px", gap: "3px" }}>
              {(["mp3", "wav", "aac"] as AudioFormat[]).map(f => (
                <button key={f} onClick={() => setFormat(f)} style={{
                  flex: 1, padding: "0.5rem", borderRadius: "7px", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: "0.8rem", fontWeight: 500, textTransform: "uppercase",
                  background: format === f ? accentColor : "transparent",
                  color: format === f ? "#fff" : textSec,
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Quality selection (not for WAV) */}
          {format !== "wav" && (
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Kalite</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {(Object.entries(QUALITY_LABELS) as [Quality, string][]).map(([q, label]) => (
                  <label key={q} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", padding: "0.6rem 0.75rem", borderRadius: "8px", border: `1.5px solid ${quality === q ? accentColor : border}`, background: quality === q ? `${accentColor}10` : surface }}>
                    <input type="radio" name="quality" value={q} checked={quality === q} onChange={() => setQuality(q)} style={{ accentColor }} />
                    <span style={{ color: textPri, fontSize: "0.85rem" }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: "0.75rem 1rem", background: "rgba(240,90,40,0.1)", borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>
          )}

          {(loading || progress > 0) && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>{status}</span>
                <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress > 0 ? progress + "%" : ""}</span>
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.3s" }} />
              </div>
            </div>
          )}

          <button onClick={convert} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Dönüştürülüyor…" : `${format.toUpperCase()} Olarak İndir`}
          </button>
          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            İşlem tarayıcınızda gerçekleşir. İlk kullanımda ~7 MB WASM dosyası yüklenir.
          </p>
        </>
      )}
    </div>
  );
}
