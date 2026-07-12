"use client";

import { useState, useRef } from "react";
import { fetchFile } from "@ffmpeg/util";

const accentColor = "#F05A28";

function parseTime(t: string): number | null {
  if (!t.trim()) return null;
  const parts = t.split(":").reverse();
  let secs = 0;
  const multipliers = [1, 60, 3600];
  for (let i = 0; i < parts.length; i++) {
    const v = parseFloat(parts[i]);
    if (isNaN(v)) return null;
    secs += v * multipliers[i];
  }
  return secs;
}

export default function VideoTrimClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [startStr, setStart]    = useState("");
  const [endStr, setEnd]        = useState("");
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

  async function trim() {
    if (!file) return;
    const startSec = parseTime(startStr);
    const endSec   = parseTime(endStr);
    if (startSec === null || endSec === null) {
      setError("Geçerli bir zaman giriniz. Örnek: 00:00:10 veya 10");
      return;
    }
    if (endSec <= startSec) {
      setError("Bitiş zamanı başlangıçtan büyük olmalı.");
      return;
    }
    setLoading(true);
    setError("");
    setProgress(0);
    setStatus("FFmpeg yükleniyor…");
    try {
      const { getFFmpeg } = await import("@/lib/ffmpeg");
      const ffmpeg = await getFFmpeg();

      setStatus("Kırpılıyor…");
      const onProgress = ({ progress: p }: { progress: number }) => setProgress(Math.round(p * 100));
      ffmpeg.on("progress", onProgress);

      const ext        = file.name.slice(file.name.lastIndexOf("."));
      const inputName  = "input" + ext;
      const outputName = "output.mp4";

      ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec([
        "-i", inputName,
        "-ss", String(startSec),
        "-to", String(endSec),
        "-c:v", "libx264", "-crf", "23", "-preset", "fast",
        "-c:a", "aac",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], { type: "video/mp4" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.[^.]+$/, "") + "_trim.mp4";
      a.click();
      URL.revokeObjectURL(url);

      ffmpeg.deleteFile(inputName);
      ffmpeg.deleteFile(outputName);
      ffmpeg.off("progress", onProgress);

      setStatus("Tamamlandı!");
      setProgress(100);
    } catch (e: unknown) {
      setError("Kırpma başarısız oldu.");
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
            <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/>
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Video dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>MP4, MOV, AVI, MKV, WebM</p>
          <input ref={inputRef} type="file" accept=".mp4,.mov,.avi,.mkv,.webm,video/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/>
              <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
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

          <div style={{ display: "flex", gap: "1rem" }}>
            {[
              { label: "Başlangıç", value: startStr, onChange: setStart, hint: "örn: 00:00:10" },
              { label: "Bitiş",     value: endStr,   onChange: setEnd,   hint: "örn: 00:01:30" },
            ].map(({ label, value, onChange, hint }) => (
              <div key={label} style={{ flex: 1 }}>
                <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.35rem" }}>{label}</label>
                <input
                  type="text" value={value} placeholder={hint}
                  onChange={e => onChange(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: `1px solid ${border}`, background: surface, color: textPri, fontFamily: "monospace", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
              </div>
            ))}
          </div>
          <p style={{ color: textTer, fontSize: "0.73rem", marginTop: "-0.75rem" }}>
            Format: ss:dd:sn veya saniye cinsinden (örn: 90 = 1:30)
          </p>

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

          <button onClick={trim} disabled={loading} style={{
            padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Kırpılıyor…" : "Kırp ve İndir"}
          </button>
        </>
      )}
    </div>
  );
}
