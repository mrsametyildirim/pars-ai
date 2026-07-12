"use client";

import { useState, useRef } from "react";

const accentColor = "#818CF8";

export default function BackgroundRemoveClient() {
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]   = useState("");
  const [error, setError]     = useState("");
  const inputRef              = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  function selectFile(f: File) {
    setFile(f);
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  async function removeBackground() {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(10);
    setStatus("AI modeli yükleniyor… (ilk kullanımda ~30 MB)");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      setProgress(40);
      setStatus("Arka plan kaldırılıyor…");

      const blob = await removeBackground(file, {
        publicPath: "/bgremoval/",
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 60) + 30;
            setProgress(Math.min(pct, 90));
          }
        },
      });

      const url = URL.createObjectURL(blob);
      setResult(url);
      setProgress(100);
      setStatus("Tamamlandı!");
    } catch (e: unknown) {
      setError("Arka plan kaldırılamadı. Lütfen tekrar deneyin.");
      console.error(e);
    } finally {
      setLoading(false);
      setTimeout(() => { if (!error) { setStatus(""); setProgress(0); } }, 2000);
    }
  }

  function download() {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = file.name.replace(/\.[^.]+$/, "") + "_no_bg.png";
    a.click();
  }

  function reset() {
    if (result) URL.revokeObjectURL(result);
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    setStatus("");
    setProgress(0);
  }

  const checkerStyle: React.CSSProperties = {
    backgroundImage: "linear-gradient(45deg, #888 25%, transparent 25%), linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%), linear-gradient(-45deg, transparent 75%, #888 75%)",
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
    backgroundColor: "#ccc",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) selectFile(f); }}
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Görsel sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>JPG, PNG, WebP · Maksimum 10 MB</p>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) selectFile(f); }} />
        </div>
      ) : (
        <>
          {/* Preview area */}
          {(preview || result) && (
            <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: "1rem" }}>
              {preview && (
                <div>
                  <p style={{ color: textTer, fontSize: "0.75rem", marginBottom: "0.35rem" }}>Orijinal</p>
                  <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${border}` }}>
                    <img src={preview} alt="orijinal" style={{ width: "100%", height: "200px", objectFit: "contain", background: "#f0f0f0", display: "block" }} />
                  </div>
                </div>
              )}
              {result && (
                <div>
                  <p style={{ color: textTer, fontSize: "0.75rem", marginBottom: "0.35rem" }}>Arka plan kaldırıldı</p>
                  <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${border}`, ...checkerStyle }}>
                    <img src={result} alt="sonuç" style={{ width: "100%", height: "200px", objectFit: "contain", display: "block" }} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: surface, borderRadius: "10px", border: `1px solid ${border}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}

          {loading && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>{status}</span>
                <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress > 0 ? progress + "%" : ""}</span>
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.5s" }} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            {!result ? (
              <button onClick={removeBackground} disabled={loading} style={{
                flex: 1, padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
                color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "İşleniyor…" : "Arka Planı Kaldır"}
              </button>
            ) : (
              <>
                <button onClick={download} style={{
                  flex: 1, padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
                  color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 600,
                }}>
                  PNG İndir (Şeffaf)
                </button>
                <button onClick={() => { setResult(null); setFile(null); setPreview(null); }} style={{
                  padding: "0.875rem 1.25rem", borderRadius: "12px", border: `1px solid ${border}`,
                  background: surface, color: textSec, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem",
                }}>
                  Yeni
                </button>
              </>
            )}
          </div>

          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            AI modeli tarayıcınızda çalışır. Görseliniz asla sunucuya gönderilmez. İlk kullanımda ~30 MB model indirilir.
          </p>
        </>
      )}
    </div>
  );
}
