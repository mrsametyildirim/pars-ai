"use client";

import { useState, useRef } from "react";
import { fetchFile } from "@ffmpeg/util";

type FPS  = "8" | "10" | "15" | "20";
type Size = "320" | "480" | "640" | "original";

const FPS_LABELS:  Record<FPS,  string> = { "8": "8 fps", "10": "10 fps", "15": "15 fps", "20": "20 fps" };
const SIZE_LABELS: Record<Size, string> = { "320": "320px", "480": "480px", "640": "640px", "original": "Orijinal" };

const accentColor = "#F05A28";

export default function VideoGifClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [fps, setFps]           = useState<FPS>("10");
  const [size, setSize]         = useState<Size>("640");
  const [startTime, setStart]   = useState("");
  const [duration, setDuration] = useState("");
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

  async function convert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(0);
    setStatus("FFmpeg yükleniyor…");
    try {
      const { getFFmpeg } = await import("@/lib/ffmpeg");
      const ffmpeg = await getFFmpeg();

      setStatus("GIF oluşturuluyor…");
      const onProgress = ({ progress: p }: { progress: number }) => setProgress(Math.round(p * 100));
      ffmpeg.on("progress", onProgress);

      const ext       = file.name.slice(file.name.lastIndexOf("."));
      const inputName = "input" + ext;
      ffmpeg.writeFile(inputName, await fetchFile(file));

      const scaleFilter = size === "original" ? "flags=lanczos" : `scale=${size}:-1:flags=lanczos`;
      const vfFilter = `fps=${fps},${scaleFilter},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;

      const args = ["-i", inputName];
      if (startTime) args.push("-ss", startTime);
      if (duration)  args.push("-t",  duration);
      args.push("-vf", vfFilter, "-loop", "0", "output.gif");

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile("output.gif");
      const blob = new Blob([data as unknown as BlobPart], { type: "image/gif" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.[^.]+$/, "") + ".gif";
      a.click();
      URL.revokeObjectURL(url);

      ffmpeg.deleteFile(inputName);
      ffmpeg.deleteFile("output.gif");
      ffmpeg.off("progress", onProgress);

      setStatus("Tamamlandı!");
      setProgress(100);
    } catch (e: unknown) {
      setError("GIF oluşturulamadı. Dosyanın geçerli bir video olduğundan emin olun.");
      console.error(e);
    } finally {
      setLoading(false);
      setTimeout(() => { setStatus(""); setProgress(0); }, 3000);
    }
  }

  function TimeInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
      <div style={{ flex: 1 }}>
        <label style={{ display: "block", color: textSec, fontSize: "0.75rem", marginBottom: "0.3rem" }}>{label}</label>
        <input
          type="text" value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: `1px solid ${border}`, background: surface, color: textPri, fontFamily: "monospace", fontSize: "0.85rem", boxSizing: "border-box" }}
        />
      </div>
    );
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
            <path d="M4 12v3a1 1 0 0 0 1 1h4m4 0h4a1 1 0 0 0 1-1v-3M4 12V9a1 1 0 0 1 1-1h4m4 0h4a1 1 0 0 1 1 1v3M4 12h16M9 8V5m6 3V5"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Video dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>MP4, MOV, AVI, WebM</p>
          <input ref={inputRef} type="file" accept=".mp4,.mov,.avi,.webm,video/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 12v3a1 1 0 0 0 1 1h4m4 0h4a1 1 0 0 0 1-1v-3M4 12V9a1 1 0 0 1 1-1h4m4 0h4a1 1 0 0 1 1 1v3M4 12h16M9 8V5m6 3V5"/>
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

          {/* FPS */}
          <div>
            <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>FPS (Kare Hızı)</label>
            <div style={{ display: "flex", background: surface, borderRadius: "10px", border: `1px solid ${border}`, padding: "3px", gap: "3px" }}>
              {(Object.entries(FPS_LABELS) as [FPS, string][]).map(([f, label]) => (
                <button key={f} onClick={() => setFps(f)} style={{
                  flex: 1, padding: "0.45rem", borderRadius: "7px", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 500,
                  background: fps === f ? accentColor : "transparent",
                  color: fps === f ? "#fff" : textSec,
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Genişlik</label>
            <div style={{ display: "flex", background: surface, borderRadius: "10px", border: `1px solid ${border}`, padding: "3px", gap: "3px" }}>
              {(Object.entries(SIZE_LABELS) as [Size, string][]).map(([s, label]) => (
                <button key={s} onClick={() => setSize(s)} style={{
                  flex: 1, padding: "0.45rem", borderRadius: "7px", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 500,
                  background: size === s ? accentColor : "transparent",
                  color: size === s ? "#fff" : textSec,
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Time range */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <TimeInput label="Başlangıç" value={startTime} onChange={setStart} placeholder="00:00:05" />
            <TimeInput label="Süre (saniye)" value={duration} onChange={setDuration} placeholder="5" />
          </div>
          <p style={{ color: textTer, fontSize: "0.73rem", marginTop: "-0.75rem" }}>Boş bırakılırsa videonun tamamı kullanılır. Büyük dosyalar için süre sınırı önerilir.</p>

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
            {loading ? "GIF Oluşturuluyor…" : "GIF Olarak İndir"}
          </button>
          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            Uzun videolar büyük GIF oluşturur. 5–10 saniyelik kliplerle başlamanız önerilir.
          </p>
        </>
      )}
    </div>
  );
}
