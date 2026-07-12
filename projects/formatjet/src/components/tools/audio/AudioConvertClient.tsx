"use client";

import { useState, useRef } from "react";
import { fetchFile } from "@ffmpeg/util";

type AudioFormat = "mp3" | "wav" | "aac" | "flac" | "ogg" | "m4a";
type BitRate      = "128k" | "192k" | "320k";

interface Props {
  inputFormats: string[];
  outputFormat?: AudioFormat;
  allowOutputSelect?: boolean;
  accentColor?: string;
}

const BITRATE_LABELS: Record<BitRate, string> = {
  "128k": "128 kbps — Standart",
  "192k": "192 kbps — Yüksek",
  "320k": "320 kbps — Maksimum",
};

const CODEC_MAP: Record<AudioFormat, string[]> = {
  mp3:  ["-c:a", "libmp3lame"],
  wav:  ["-c:a", "pcm_s16le"],
  aac:  ["-c:a", "aac"],
  flac: ["-c:a", "flac"],
  ogg:  ["-c:a", "libvorbis"],
  m4a:  ["-c:a", "aac", "-movflags", "+faststart"],
};

const MIME_MAP: Record<AudioFormat, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  aac: "audio/aac",
  flac: "audio/flac",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
};

const FORMAT_LABELS: Record<AudioFormat, string> = {
  mp3: "MP3", wav: "WAV", aac: "AAC", flac: "FLAC", ogg: "OGG", m4a: "M4A",
};

const ALL_FORMATS: AudioFormat[] = ["mp3", "wav", "aac", "flac", "ogg", "m4a"];

export default function AudioConvertClient({
  inputFormats,
  outputFormat: defaultOutput,
  allowOutputSelect = false,
  accentColor = "#10B981",
}: Props) {
  const [file, setFile]                 = useState<File | null>(null);
  const [outputFmt, setOutputFmt]       = useState<AudioFormat>(defaultOutput ?? "mp3");
  const [bitrate, setBitrate]           = useState<BitRate>("192k");
  const [loading, setLoading]           = useState(false);
  const [progress, setProgress]         = useState(0);
  const [status, setStatus]             = useState("");
  const [error, setError]               = useState("");
  const inputRef                        = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  const showBitrate = outputFmt !== "wav" && outputFmt !== "flac";
  const acceptStr   = inputFormats.map(f => "." + f).join(",") + ",audio/*";

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
      const outputName = "output." + outputFmt;

      ffmpeg.writeFile(inputName, await fetchFile(file));

      const codecArgs = [...CODEC_MAP[outputFmt]];
      if (showBitrate) codecArgs.push("-b:a", bitrate);

      await ffmpeg.exec(["-i", inputName, ...codecArgs, outputName]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], { type: MIME_MAP[outputFmt] });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name.replace(/\.[^.]+$/, "") + "." + outputFmt;
      a.click();
      URL.revokeObjectURL(url);

      ffmpeg.deleteFile(inputName);
      ffmpeg.deleteFile(outputName);
      ffmpeg.off("progress", onProgress);

      setStatus("Tamamlandı!");
      setProgress(100);
    } catch (e: unknown) {
      setError("Dönüştürme başarısız. Dosyanın geçerli bir ses dosyası olduğundan emin olun.");
      console.error(e);
    } finally {
      setLoading(false);
      setTimeout(() => { setStatus(""); setProgress(0); }, 3000);
    }
  }

  const audioIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  );

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
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Ses dosyasını sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>{inputFormats.map(f => f.toUpperCase()).join(", ")} · Maksimum 200 MB</p>
          <input ref={inputRef} type="file" accept={acceptStr} style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: surface, borderRadius: "12px", border: `1px solid ${border}` }}>
            <span style={{ color: accentColor }}>{audioIcon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => { setFile(null); setError(""); setStatus(""); setProgress(0); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {allowOutputSelect && (
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Çıktı Formatı</label>
              <div style={{ display: "flex", flexWrap: "wrap", background: surface, borderRadius: "10px", border: `1px solid ${border}`, padding: "3px", gap: "3px" }}>
                {ALL_FORMATS.map(f => (
                  <button key={f} onClick={() => setOutputFmt(f)} style={{
                    flex: "1 1 60px", padding: "0.45rem", borderRadius: "7px", border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: "0.8rem", fontWeight: 500, textTransform: "uppercase",
                    background: outputFmt === f ? accentColor : "transparent",
                    color: outputFmt === f ? "#fff" : textSec,
                  }}>
                    {FORMAT_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showBitrate && (
            <div>
              <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Kalite</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {(Object.entries(BITRATE_LABELS) as [BitRate, string][]).map(([b, label]) => (
                  <label key={b} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", padding: "0.55rem 0.75rem", borderRadius: "8px", border: `1.5px solid ${bitrate === b ? accentColor : border}`, background: bitrate === b ? `${accentColor}10` : surface }}>
                    <input type="radio" name="bitrate" value={b} checked={bitrate === b} onChange={() => setBitrate(b)} style={{ accentColor }} />
                    <span style={{ color: textPri, fontSize: "0.84rem" }}>{label}</span>
                  </label>
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
            {loading ? "Dönüştürülüyor…" : `${FORMAT_LABELS[outputFmt]} Olarak İndir`}
          </button>
          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            İşlem tarayıcınızda gerçekleşir. İlk kullanımda ~7 MB WASM dosyası yüklenir.
          </p>
        </>
      )}
    </div>
  );
}
