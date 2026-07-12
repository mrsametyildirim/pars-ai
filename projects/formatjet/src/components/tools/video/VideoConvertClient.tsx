"use client";

import { useState, useRef } from "react";
import { fetchFile } from "@ffmpeg/util";

type VideoFormat = "mp4" | "mp3" | "gif" | "webm" | "avi" | "mov";
type VideoQuality = "high" | "medium" | "low";

interface Props {
  inputFormats: string[];
  outputFormat: VideoFormat;
  accentColor?: string;
}

const QUALITY_MAP: Record<VideoQuality, { label: string; crf: string }> = {
  high:   { label: "Yüksek Kalite",  crf: "18" },
  medium: { label: "Orta Kalite",    crf: "23" },
  low:    { label: "Düşük (Küçük)",  crf: "28" },
};

function buildArgs(inputName: string, outputName: string, outputFormat: VideoFormat, quality: VideoQuality): string[] {
  const args = ["-i", inputName];
  const { crf } = QUALITY_MAP[quality];

  if (outputFormat === "mp4") {
    args.push("-c:v", "libx264", "-crf", crf, "-preset", "fast", "-c:a", "aac", "-movflags", "+faststart");
  } else if (outputFormat === "mp3") {
    args.push("-vn", "-c:a", "libmp3lame", "-b:a", "192k");
  } else if (outputFormat === "gif") {
    args.push("-vf", "fps=10,scale=640:-1:flags=lanczos", "-loop", "0");
  } else if (outputFormat === "webm") {
    args.push("-c:v", "libvpx-vp9", "-crf", crf, "-b:v", "0", "-c:a", "libopus");
  } else {
    args.push("-c:v", "libx264", "-crf", crf, "-preset", "fast", "-c:a", "aac");
  }

  args.push(outputName);
  return args;
}

const MIME: Record<VideoFormat, string> = {
  mp4:  "video/mp4",
  mp3:  "audio/mpeg",
  gif:  "image/gif",
  webm: "video/webm",
  avi:  "video/x-msvideo",
  mov:  "video/quicktime",
};

export default function VideoConvertClient({ inputFormats, outputFormat, accentColor = "#F05A28" }: Props) {
  const [file, setFile]         = useState<File | null>(null);
  const [quality, setQuality]   = useState<VideoQuality>("medium");
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState("");
  const [error, setError]       = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);

  const acceptStr = inputFormats.map(f => "." + f).join(",") + ",video/*";

  const showQuality = outputFormat !== "mp3" && outputFormat !== "gif";

  async function convert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(0);
    setStatus("FFmpeg yükleniyor…");
    try {
      const { getFFmpeg } = await import("@/lib/ffmpeg");
      const ffmpeg = await getFFmpeg();

      setStatus("Dönüştürülüyor…");
      const onProgress = ({ progress: p }: { progress: number }) => setProgress(Math.round(p * 100));
      ffmpeg.on("progress", onProgress);

      const ext        = file.name.slice(file.name.lastIndexOf("."));
      const inputName  = "input" + ext;
      const outputName = "output." + outputFormat;

      ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(buildArgs(inputName, outputName, outputFormat, quality));

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], { type: MIME[outputFormat] });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.[^.]+$/, "") + "." + outputFormat;
      a.click();
      URL.revokeObjectURL(url);

      ffmpeg.deleteFile(inputName);
      ffmpeg.deleteFile(outputName);
      ffmpeg.off("progress", onProgress);

      setStatus("Tamamlandı!");
      setProgress(100);
    } catch (e: unknown) {
      setError("Dönüştürme başarısız oldu. Dosyanın geçerli bir video olduğundan emin olun.");
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
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Video dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>{inputFormats.map(f => f.toUpperCase()).join(", ")} · Maksimum 500 MB</p>
          <input ref={inputRef} type="file" accept={acceptStr} style={{ display: "none" }}
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

          {showQuality && (
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Kalite</label>
              <div style={{ display: "flex", background: surface, borderRadius: "10px", border: `1px solid ${border}`, padding: "3px", gap: "3px" }}>
                {(Object.entries(QUALITY_MAP) as [VideoQuality, { label: string; crf: string }][]).map(([q, { label }]) => (
                  <button key={q} onClick={() => setQuality(q)} style={{
                    flex: 1, padding: "0.5rem 0.25rem", borderRadius: "7px", border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: "0.75rem", fontWeight: 500,
                    background: quality === q ? accentColor : "transparent",
                    color: quality === q ? "#fff" : textSec,
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>
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
            {loading ? "Dönüştürülüyor…" : `${outputFormat.toUpperCase()} Olarak İndir`}
          </button>
          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            İşlem tamamen tarayıcınızda gerçekleşir. İlk kullanımda ~7 MB WASM dosyası yüklenir.
          </p>
        </>
      )}
    </div>
  );
}
