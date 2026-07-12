"use client";

import { useState, useRef } from "react";
import { fetchFile } from "@ffmpeg/util";

const accentColor = "#10B981";

export default function AudioVolumeClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [volume, setVolume]     = useState(100);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState("");
  const [error, setError]       = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  const volumeLabel = volume === 100 ? "Değişmedi" : volume > 100 ? `+${volume - 100}% (Yükseltildi)` : `-${100 - volume}% (Azaltıldı)`;

  async function process() {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(0);
    setStatus("FFmpeg yükleniyor…");
    try {
      const { getFFmpeg } = await import("@/lib/ffmpeg");
      const ffmpeg = await getFFmpeg();

      setStatus("Ses seviyesi ayarlanıyor…");
      const onProgress = ({ progress: p }: { progress: number }) => setProgress(Math.round(p * 100));
      ffmpeg.on("progress", onProgress);

      const ext        = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      const inputName  = "input" + ext;
      const isWav      = ext === ".wav";
      const outputName = isWav ? "output.wav" : "output.mp3";

      ffmpeg.writeFile(inputName, await fetchFile(file));

      const volumeFactor = (volume / 100).toFixed(2);
      const codecArgs = isWav ? ["-c:a", "pcm_s16le"] : ["-c:a", "libmp3lame", "-b:a", "192k"];
      await ffmpeg.exec(["-i", inputName, "-af", `volume=${volumeFactor}`, ...codecArgs, outputName]);

      const data = await ffmpeg.readFile(outputName);
      const mime = isWav ? "audio/wav" : "audio/mpeg";
      const blob = new Blob([data as unknown as BlobPart], { type: mime });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.[^.]+$/, "") + "_vol" + volume + (isWav ? ".wav" : ".mp3");
      a.click();
      URL.revokeObjectURL(url);

      ffmpeg.deleteFile(inputName);
      ffmpeg.deleteFile(outputName);
      ffmpeg.off("progress", onProgress);

      setStatus("Tamamlandı!");
      setProgress(100);
    } catch (e: unknown) {
      setError("İşlem başarısız oldu.");
      console.error(e);
    } finally {
      setLoading(false);
      setTimeout(() => { setStatus(""); setProgress(0); }, 3000);
    }
  }

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
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Ses dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>MP3, WAV, FLAC, AAC, M4A</p>
          <input ref={inputRef} type="file" accept=".mp3,.wav,.flac,.aac,.m4a,.ogg,audio/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
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

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label style={{ color: textSec, fontSize: "0.8rem" }}>Ses Seviyesi</label>
              <span style={{ color: volume !== 100 ? accentColor : textTer, fontSize: "0.8rem", fontFamily: "monospace" }}>
                {volume}% — {volumeLabel}
              </span>
            </div>
            <input
              type="range" min="10" max="300" step="5" value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              style={{ width: "100%", accentColor }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
              <span style={{ color: textTer, fontSize: "0.7rem" }}>10% (Sessiz)</span>
              <span style={{ color: textTer, fontSize: "0.7rem" }}>100% (Orijinal)</span>
              <span style={{ color: textTer, fontSize: "0.7rem" }}>300% (Maksimum)</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[25, 50, 75, 100, 150, 200].map(v => (
              <button key={v} onClick={() => setVolume(v)} style={{
                padding: "0.35rem 0.75rem", borderRadius: "6px", border: `1px solid ${volume === v ? accentColor : border}`,
                background: volume === v ? `${accentColor}18` : surface, color: volume === v ? accentColor : textSec,
                fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit",
              }}>
                {v}%
              </button>
            ))}
          </div>

          {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}

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

          <button onClick={process} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "İşleniyor…" : "Uygula ve İndir"}
          </button>
        </>
      )}
    </div>
  );
}
