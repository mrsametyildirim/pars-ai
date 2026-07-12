"use client";

import { useState, useRef } from "react";
import { fetchFile } from "@ffmpeg/util";

const accentColor = "#F05A28";

export default function VideoConcatClient() {
  const [files, setFiles]       = useState<File[]>([]);
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

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    setFiles(prev => [...prev, ...Array.from(newFiles)]);
  }

  function removeFile(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  }

  function moveFile(idx: number, dir: -1 | 1) {
    setFiles(prev => {
      const next = [...prev];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }

  async function concat() {
    if (files.length < 2) { setError("En az 2 video dosyası eklemelisiniz."); return; }
    setLoading(true);
    setError("");
    setProgress(0);
    setStatus("FFmpeg yükleniyor…");
    try {
      const { getFFmpeg } = await import("@/lib/ffmpeg");
      const ffmpeg = await getFFmpeg();

      setStatus("Videolar birleştiriliyor…");
      const onProgress = ({ progress: p }: { progress: number }) => setProgress(Math.round(p * 100));
      ffmpeg.on("progress", onProgress);

      let concatContent = "";
      for (let i = 0; i < files.length; i++) {
        const name = `input_${i}.mp4`;
        ffmpeg.writeFile(name, await fetchFile(files[i]));
        concatContent += `file '${name}'\n`;
        setStatus(`Dosya ${i + 1}/${files.length} yükleniyor…`);
      }

      const encoder = new TextEncoder();
      ffmpeg.writeFile("concat.txt", encoder.encode(concatContent));

      await ffmpeg.exec([
        "-f", "concat", "-safe", "0",
        "-i", "concat.txt",
        "-c:v", "libx264", "-crf", "23", "-preset", "fast",
        "-c:a", "aac",
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data as unknown as BlobPart], { type: "video/mp4" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = "birlestir.mp4";
      a.click();
      URL.revokeObjectURL(url);

      for (let i = 0; i < files.length; i++) ffmpeg.deleteFile(`input_${i}.mp4`);
      ffmpeg.deleteFile("concat.txt");
      ffmpeg.deleteFile("output.mp4");
      ffmpeg.off("progress", onProgress);

      setStatus("Tamamlandı!");
      setProgress(100);
    } catch (e: unknown) {
      setError("Birleştirme başarısız. Tüm dosyaların aynı çözünürlük ve codec'te olduğundan emin olun.");
      console.error(e);
    } finally {
      setLoading(false);
      setTimeout(() => { setStatus(""); setProgress(0); }, 3000);
    }
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
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 0.75rem" }}>
          <path d="M12 5v14M5 12l7-7 7 7"/>
        </svg>
        <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Video dosyaları ekle</p>
        <p style={{ color: textTer, fontSize: "0.8rem" }}>Birden fazla dosya seçilebilir · MP4, MOV, AVI, MKV</p>
        <input ref={inputRef} type="file" accept=".mp4,.mov,.avi,.mkv,.webm,video/*" multiple style={{ display: "none" }}
          onChange={e => addFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ color: textSec, fontSize: "0.8rem" }}>Sıralama (yukarıdan aşağıya birleştirilir)</p>
          {files.map((f, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.875rem", background: surface, borderRadius: "10px", border: `1px solid ${border}` }}>
              <span style={{ color: textTer, fontSize: "0.75rem", fontFamily: "monospace", minWidth: "1.2rem" }}>{idx + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: textPri, fontSize: "0.83rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
                <p style={{ color: textTer, fontSize: "0.7rem" }}>{(f.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button onClick={() => moveFile(idx, -1)} disabled={idx === 0}
                style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", color: textSec, opacity: idx === 0 ? 0.3 : 1, padding: "2px 4px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </button>
              <button onClick={() => moveFile(idx, 1)} disabled={idx === files.length - 1}
                style={{ background: "none", border: "none", cursor: idx === files.length - 1 ? "default" : "pointer", color: textSec, opacity: idx === files.length - 1 ? 0.3 : 1, padding: "2px 4px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              </button>
              <button onClick={() => removeFile(idx)}
                style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "2px 4px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
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

      <button onClick={concat} disabled={loading || files.length < 2} style={{
        padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
        color: "#fff", cursor: (loading || files.length < 2) ? "not-allowed" : "pointer", fontFamily: "inherit",
        fontSize: "0.9rem", fontWeight: 600, opacity: (loading || files.length < 2) ? 0.6 : 1,
      }}>
        {loading ? "Birleştiriliyor…" : `${files.length} Videoyu Birleştir`}
      </button>
      <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
        En iyi sonuç için aynı çözünürlük ve format kullanan videolar önerilir.
      </p>
    </div>
  );
}
