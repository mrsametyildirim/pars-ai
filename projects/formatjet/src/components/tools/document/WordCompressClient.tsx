"use client";

import { useState, useRef } from "react";

const accentColor = "#3B82F6";

async function compressImage(data: Uint8Array, mime: string, quality: number): Promise<Uint8Array> {
  return new Promise((resolve) => {
    const blob = new Blob([data as unknown as BlobPart], { type: mime });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(outBlob => {
        if (!outBlob) { resolve(data); return; }
        outBlob.arrayBuffer().then(ab => resolve(new Uint8Array(ab)));
      }, "image/jpeg", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(data); };
    img.src = url;
  });
}

async function compressDocx(file: File, quality: number): Promise<Blob> {
  const JSZip    = (await import("jszip")).default;
  const ab       = await file.arrayBuffer();
  const zip      = await JSZip.loadAsync(ab);
  const imgPaths = Object.keys(zip.files).filter(p =>
    p.startsWith("word/media/") && p.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
  );

  for (const path of imgPaths) {
    const ext  = path.split(".").pop()!.toLowerCase();
    const data = await zip.file(path)!.async("uint8array");
    if (ext === "jpg" || ext === "jpeg" || ext === "png") {
      const mime        = ext === "png" ? "image/png" : "image/jpeg";
      const compressed  = await compressImage(data, mime, quality);
      if (compressed.length < data.length) {
        const newPath = path.replace(/\.[^.]+$/, ".jpg");
        zip.remove(path);
        zip.file(newPath, compressed);
        // update document.xml references
        const docXml = await zip.file("word/document.xml")!.async("text");
        const imgName = path.split("/").pop()!;
        const newName = newPath.split("/").pop()!;
        if (imgName !== newName) {
          zip.file("word/document.xml", docXml.replaceAll(imgName, newName));
        }
      }
    }
  }

  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
}

export default function WordCompressClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [quality, setQuality]   = useState(0.7);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult]     = useState<{ url: string; origSize: number; newSize: number } | null>(null);
  const [error, setError]       = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  async function compress() {
    if (!file) return;
    setLoading(true); setError(""); setResult(null); setProgress(30);
    try {
      const blob = await compressDocx(file, quality);
      setProgress(90);
      const url  = URL.createObjectURL(blob);
      setResult({ url, origSize: file.size, newSize: blob.size });
      setProgress(100);
    } catch (e) {
      setError("Sıkıştırma başarısız: " + (e instanceof Error ? e.message : ""));
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  }

  const reduction = result ? Math.round((1 - result.newSize / result.origSize) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) setFile(f); }}
          style={{ border:`2px dashed ${border}`,borderRadius:"16px",padding:"3rem 2rem",textAlign:"center",cursor:"pointer",background:surface }}
          onMouseEnter={e=>(e.currentTarget.style.borderColor=accentColor)}
          onMouseLeave={e=>(e.currentTarget.style.borderColor=border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin:"0 auto 1rem" }}>
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
          </svg>
          <p style={{ color:textPri,fontWeight:500,marginBottom:"0.25rem" }}>DOCX dosyasını sürükle veya tıkla</p>
          <p style={{ color:textTer,fontSize:"0.8rem" }}>Görsel içeren belgeler için en iyi sonuç</p>
          <input ref={inputRef} type="file" accept=".doc,.docx" style={{ display:"none" }}
            onChange={e => { const f=e.target.files?.[0]; if(f) { setFile(f); setResult(null); } }} />
        </div>
      ) : (
        <>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.875rem 1rem",background:surface,borderRadius:"12px",border:`1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586l5.414 5.414V19a2 2 0 0 1-2 2z"/></svg>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ color:textPri,fontSize:"0.875rem",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</p>
              <p style={{ color:textTer,fontSize:"0.75rem" }}>{(file.size/1024).toFixed(0)} KB</p>
            </div>
            <button onClick={() => { setFile(null); setResult(null); setError(""); }} style={{ background:"none",border:"none",cursor:"pointer",color:textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.4rem" }}>
              <label style={{ color:textSec,fontSize:"0.8rem" }}>Görsel Kalitesi</label>
              <span style={{ color:textTer,fontSize:"0.75rem",fontFamily:"monospace" }}>{Math.round(quality*100)}%</span>
            </div>
            <input type="range" min={30} max={95} value={Math.round(quality*100)}
              onChange={e => setQuality(Number(e.target.value)/100)}
              style={{ width:"100%",accentColor }} />
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:"0.25rem" }}>
              <span style={{ color:textTer,fontSize:"0.72rem" }}>Küçük dosya</span>
              <span style={{ color:textTer,fontSize:"0.72rem" }}>Yüksek kalite</span>
            </div>
          </div>

          {error && <div style={{ padding:"0.75rem 1rem",background:`${accentColor}18`,borderRadius:"10px",color:accentColor,fontSize:"0.85rem" }}>{error}</div>}

          {result && (
            <div style={{ padding:"1rem",background:"rgba(16,185,129,0.08)",borderRadius:"12px",border:"1px solid rgba(16,185,129,0.3)" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem" }}>
                <p style={{ color:"#10B981",fontWeight:600,fontSize:"0.9rem" }}>
                  {reduction > 0 ? `%${reduction} küçültüldü` : "Dosya boyutu değişmedi"}
                </p>
                <a href={result.url} download={file.name.replace(/\.docx?$/i,"-sikistirilmis.docx")}
                  style={{ padding:"0.4rem 0.875rem",background:"#10B981",color:"#fff",borderRadius:"8px",textDecoration:"none",fontSize:"0.85rem",fontWeight:500 }}>
                  İndir
                </a>
              </div>
              <div style={{ display:"flex",gap:"1.5rem" }}>
                <div>
                  <p style={{ color:textTer,fontSize:"0.72rem" }}>Orijinal</p>
                  <p style={{ color:textPri,fontSize:"0.85rem",fontWeight:500 }}>{(result.origSize/1024).toFixed(0)} KB</p>
                </div>
                <div>
                  <p style={{ color:textTer,fontSize:"0.72rem" }}>Sıkıştırılmış</p>
                  <p style={{ color:"#10B981",fontSize:"0.85rem",fontWeight:500 }}>{(result.newSize/1024).toFixed(0)} KB</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.35rem" }}>
                <span style={{ color:textSec,fontSize:"0.8rem" }}>Görseller sıkıştırılıyor…</span>
                <span style={{ color:textTer,fontSize:"0.75rem" }}>{progress}%</span>
              </div>
              <div style={{ height:"4px",background:border,borderRadius:"4px",overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${progress}%`,background:accentColor,borderRadius:"4px",transition:"width 0.3s" }} />
              </div>
            </div>
          )}

          {!result && (
            <button onClick={compress} disabled={loading} style={{
              padding:"0.875rem",borderRadius:"12px",border:"none",background:accentColor,
              color:"#fff",cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",
              fontSize:"0.9rem",fontWeight:600,opacity:loading?0.7:1,
            }}>
              {loading ? "Sıkıştırılıyor…" : "Sıkıştır ve İndir"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
