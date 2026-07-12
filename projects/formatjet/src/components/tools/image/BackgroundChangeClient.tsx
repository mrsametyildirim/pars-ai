"use client";

import { useState, useRef } from "react";

type BgMode = "color" | "image" | "transparent";

const PRESET_COLORS = [
  "#FFFFFF", "#F8FAFC", "#000000", "#1E293B",
  "#EFF6FF", "#FEF2F2", "#F0FDF4", "#FFF7ED",
  "#E0E7FF", "#FDF4FF", "#ECFDF5", "#FFFBEB",
];

const accentColor = "#818CF8";

export default function BackgroundChangeClient() {
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [fgBlob, setFgBlob]     = useState<Blob | null>(null);
  const [bgMode, setBgMode]     = useState<BgMode>("color");
  const [bgColor, setBgColor]   = useState("#FFFFFF");
  const [bgFile, setBgFile]     = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [result, setResult]     = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState<"upload" | "remove" | "compose">("upload");
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState("");
  const [error, setError]       = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);
  const bgInputRef              = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  function selectFile(f: File) {
    setFile(f);
    setFgBlob(null);
    setResult(null);
    setError("");
    setStep("remove");
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
      const { removeBackground: removeBg } = await import("@imgly/background-removal");
      setProgress(30);
      setStatus("Arka plan kaldırılıyor…");
      const blob = await removeBg(file, {
        publicPath: "/bgremoval/",
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) setProgress(Math.min(Math.round((current / total) * 60) + 30, 90));
        },
      });
      setFgBlob(blob);
      setProgress(100);
      setStatus("Arka plan kaldırıldı!");
      setStep("compose");
    } catch {
      setError("Arka plan kaldırılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
      setTimeout(() => { setStatus(""); setProgress(0); }, 2000);
    }
  }

  async function compose() {
    if (!fgBlob) return;
    setLoading(true);
    setStatus("Yeni arka plan uygulanıyor…");
    try {
      const fgUrl = URL.createObjectURL(fgBlob);
      const fgImg = await loadImage(fgUrl);
      URL.revokeObjectURL(fgUrl);

      const canvas = document.createElement("canvas");
      canvas.width  = fgImg.naturalWidth;
      canvas.height = fgImg.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      if (bgMode === "transparent") {
        ctx.drawImage(fgImg, 0, 0);
      } else if (bgMode === "color") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(fgImg, 0, 0);
      } else if (bgMode === "image" && bgFile) {
        const bgUrl = URL.createObjectURL(bgFile);
        const bgImg = await loadImage(bgUrl);
        URL.revokeObjectURL(bgUrl);
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(fgImg, 0, 0);
      }

      canvas.toBlob(blob => {
        if (!blob) return;
        if (result) URL.revokeObjectURL(result);
        setResult(URL.createObjectURL(blob));
        setLoading(false);
        setStatus("");
      }, bgMode === "transparent" ? "image/png" : "image/jpeg", 0.95);
    } catch {
      setError("Birleştirme başarısız.");
      setLoading(false);
    }
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function download() {
    if (!result || !file) return;
    const ext = bgMode === "transparent" ? ".png" : ".jpg";
    const a = document.createElement("a");
    a.href = result;
    a.download = file.name.replace(/\.[^.]+$/, "") + "_new_bg" + ext;
    a.click();
  }

  function reset() {
    if (result) URL.revokeObjectURL(result);
    setFile(null); setPreview(null); setFgBlob(null);
    setBgFile(null); setBgPreview(null); setResult(null);
    setError(""); setStatus(""); setProgress(0); setStep("upload");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {step === "upload" && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) selectFile(f); }}
          style={{ border: `2px dashed ${border}`, borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", cursor: "pointer", background: surface }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 1rem" }}>
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
          <p style={{ color: textPri, fontWeight: 500, marginBottom: "0.25rem" }}>Görsel sürükle veya tıkla</p>
          <p style={{ color: textTer, fontSize: "0.8rem" }}>JPG, PNG, WebP · Maksimum 10 MB</p>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) selectFile(f); }} />
        </div>
      )}

      {(step === "remove" || step === "compose") && (
        <>
          {/* Dosya bilgisi */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: surface, borderRadius: "10px", border: `1px solid ${border}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: textPri, fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file?.name}</p>
              <p style={{ color: textTer, fontSize: "0.75rem" }}>{file ? (file.size / 1024 / 1024).toFixed(1) + " MB" : ""}</p>
            </div>
            <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: textSec, padding: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Step adımları */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[
              { key: "remove", label: "1. Arka Planı Kaldır" },
              { key: "compose", label: "2. Yeni Arka Plan Seç" },
            ].map(s => (
              <div key={s.key} style={{
                flex: 1, padding: "0.5rem", textAlign: "center", borderRadius: "8px", fontSize: "0.75rem",
                background: step === s.key ? `${accentColor}18` : surface,
                border: `1px solid ${step === s.key ? accentColor : border}`,
                color: step === s.key ? accentColor : textTer,
              }}>
                {s.label}
              </div>
            ))}
          </div>

          {/* Önizleme */}
          {(preview || result) && (
            <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: "1rem" }}>
              {preview && (
                <div>
                  <p style={{ color: textTer, fontSize: "0.75rem", marginBottom: "0.35rem" }}>Orijinal</p>
                  <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${border}` }}>
                    <img src={preview} alt="orijinal" style={{ width: "100%", height: "180px", objectFit: "contain", background: "#f0f0f0", display: "block" }} />
                  </div>
                </div>
              )}
              {result && (
                <div>
                  <p style={{ color: textTer, fontSize: "0.75rem", marginBottom: "0.35rem" }}>Sonuç</p>
                  <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${border}` }}>
                    <img src={result} alt="sonuç" style={{ width: "100%", height: "180px", objectFit: "contain", background: bgColor, display: "block" }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <div style={{ padding: "0.75rem 1rem", background: `${accentColor}18`, borderRadius: "10px", color: accentColor, fontSize: "0.85rem" }}>{error}</div>}

          {loading && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ color: textSec, fontSize: "0.8rem" }}>{status}</span>
                {progress > 0 && <span style={{ color: textTer, fontSize: "0.75rem" }}>{progress}%</span>}
              </div>
              <div style={{ height: "4px", background: border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: accentColor, borderRadius: "4px", transition: "width 0.5s" }} />
              </div>
            </div>
          )}

          {step === "remove" && !fgBlob && (
            <button onClick={removeBackground} disabled={loading} style={{
              padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
              color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              fontSize: "0.9rem", fontWeight: 600, opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "İşleniyor…" : "Arka Planı Kaldır"}
            </button>
          )}

          {step === "compose" && fgBlob && (
            <>
              {/* Arka plan modu */}
              <div>
                <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Arka Plan Türü</label>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {([["color", "Renk"], ["image", "Görsel"], ["transparent", "Şeffaf"]] as [BgMode, string][]).map(([mode, label]) => (
                    <button key={mode} onClick={() => { setBgMode(mode); setResult(null); }} style={{
                      flex: 1, padding: "0.5rem", borderRadius: "8px", border: `1px solid ${bgMode === mode ? accentColor : border}`,
                      background: bgMode === mode ? `${accentColor}18` : surface, color: bgMode === mode ? accentColor : textSec,
                      fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
                    }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {bgMode === "color" && (
                <div>
                  <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Arka Plan Rengi</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.6rem" }}>
                    {PRESET_COLORS.map(c => (
                      <button key={c} onClick={() => { setBgColor(c); setResult(null); }} style={{
                        width: "28px", height: "28px", borderRadius: "6px",
                        background: c, border: `2px solid ${bgColor === c ? accentColor : border}`,
                        cursor: "pointer", flexShrink: 0,
                      }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="color" value={bgColor} onChange={e => { setBgColor(e.target.value); setResult(null); }}
                      style={{ width: "36px", height: "36px", borderRadius: "6px", border: `1px solid ${border}`, cursor: "pointer", padding: "1px" }} />
                    <span style={{ color: textSec, fontSize: "0.85rem", fontFamily: "monospace" }}>{bgColor}</span>
                  </div>
                </div>
              )}

              {bgMode === "image" && (
                <div>
                  <label style={{ display: "block", color: textSec, fontSize: "0.8rem", marginBottom: "0.4rem" }}>Arka Plan Görseli</label>
                  {!bgFile ? (
                    <button onClick={() => bgInputRef.current?.click()} style={{
                      width: "100%", padding: "1rem", borderRadius: "10px", border: `2px dashed ${border}`,
                      background: surface, color: textSec, cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem",
                    }}>
                      Arka plan görseli seç
                    </button>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {bgPreview && <img src={bgPreview} alt="bg" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px" }} />}
                      <span style={{ color: textPri, fontSize: "0.85rem", flex: 1 }}>{bgFile.name}</span>
                      <button onClick={() => { setBgFile(null); setBgPreview(null); setResult(null); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: textSec }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  )}
                  <input ref={bgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setBgFile(f); setResult(null);
                    const r = new FileReader();
                    r.onload = ev => setBgPreview(ev.target?.result as string);
                    r.readAsDataURL(f);
                  }} />
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                {!result ? (
                  <button onClick={compose} disabled={loading || (bgMode === "image" && !bgFile)} style={{
                    flex: 1, padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
                    color: "#fff", cursor: (loading || (bgMode === "image" && !bgFile)) ? "not-allowed" : "pointer",
                    fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 600, opacity: (loading || (bgMode === "image" && !bgFile)) ? 0.7 : 1,
                  }}>
                    {loading ? "Uygulanıyor…" : "Arka Planı Uygula"}
                  </button>
                ) : (
                  <>
                    <button onClick={download} style={{
                      flex: 1, padding: "0.875rem", borderRadius: "12px", border: "none", background: accentColor,
                      color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 600,
                    }}>
                      {bgMode === "transparent" ? "PNG İndir (Şeffaf)" : "Görsel İndir"}
                    </button>
                    <button onClick={() => setResult(null)} style={{
                      padding: "0.875rem 1.25rem", borderRadius: "12px", border: `1px solid ${border}`,
                      background: surface, color: textSec, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem",
                    }}>
                      Değiştir
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          <p style={{ color: textTer, fontSize: "0.75rem", textAlign: "center" }}>
            AI modeli tarayıcınızda çalışır. Görseller sunucuya gönderilmez. İlk kullanımda ~30 MB model indirilir.
          </p>
        </>
      )}
    </div>
  );
}
