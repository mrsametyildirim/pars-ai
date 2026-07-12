"use client";

import { useState, useRef } from "react";

const accentColor = "#10B981";

export default function VocalSeparatorClient() {
  const [file, setFile]   = useState<File | null>(null);
  const [error]           = useState("");
  const inputRef          = useRef<HTMLInputElement>(null);

  const surface = "var(--color-surface)";
  const border  = "var(--color-border)";
  const textPri = "var(--color-text)";
  const textSec = "var(--color-text-2)";
  const textTer = "var(--color-text-3)";

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1.5rem" }}>
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) setFile(f); }}
          style={{ border:`2px dashed ${border}`,borderRadius:"16px",padding:"3rem 2rem",textAlign:"center",cursor:"pointer",background:surface }}
          onMouseEnter={e=>(e.currentTarget.style.borderColor=accentColor)}
          onMouseLeave={e=>(e.currentTarget.style.borderColor=border)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" style={{ margin:"0 auto 1rem" }}>
            <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3m-3 0h6"/>
          </svg>
          <p style={{ color:textPri,fontWeight:500,marginBottom:"0.25rem" }}>Ses dosyasını sürükle veya tıkla</p>
          <p style={{ color:textTer,fontSize:"0.8rem" }}>MP3, WAV, OGG, FLAC · Maks 50 MB</p>
          <input ref={inputRef} type="file" accept=".mp3,.wav,.ogg,.flac,audio/*" style={{ display:"none" }}
            onChange={e => { const f=e.target.files?.[0]; if(f) setFile(f); }} />
        </div>
      ) : (
        <>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.875rem 1rem",background:surface,borderRadius:"12px",border:`1px solid ${border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
            </svg>
            <div style={{ flex:1,minWidth:0 }}>
              <p style={{ color:textPri,fontSize:"0.875rem",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</p>
              <p style={{ color:textTer,fontSize:"0.75rem" }}>{(file.size/1024/1024).toFixed(1)} MB</p>
            </div>
            <button onClick={() => setFile(null)} style={{ background:"none",border:"none",cursor:"pointer",color:textSec }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </>
      )}

      {error && <div style={{ padding:"0.75rem 1rem",background:`${accentColor}18`,borderRadius:"10px",color:accentColor,fontSize:"0.85rem" }}>{error}</div>}

      {/* Technical limitation notice */}
      <div style={{ padding:"1.25rem",background:`${accentColor}08`,borderRadius:"14px",border:`1px solid ${accentColor}25` }}>
        <div style={{ display:"flex",gap:"0.75rem",alignItems:"flex-start" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink:0,marginTop:"2px" }}>
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
          <div>
            <p style={{ color:textPri,fontWeight:600,fontSize:"0.9rem",marginBottom:"0.4rem" }}>Vokal Ayırma — Tarayıcı Kısıtlaması</p>
            <p style={{ color:textSec,fontSize:"0.82rem",lineHeight:1.6 }}>
              Profesyonel vokal ayırma (Demucs / Spleeter) ~300 MB ağırlıklı sinir ağı modeli gerektirir.
              Bu model tarayıcıda yüklenmek için çok büyük.
            </p>
            <div style={{ marginTop:"0.75rem",display:"flex",flexDirection:"column",gap:"0.4rem" }}>
              <p style={{ color:textSec,fontSize:"0.82rem",fontWeight:500 }}>Önerilen ücretsiz alternatifler:</p>
              <p style={{ color:textTer,fontSize:"0.8rem" }}>• <strong style={{ color:textSec }}>LALAL.AI</strong> — tarayıcıda vokal/enstrüman ayırma</p>
              <p style={{ color:textTer,fontSize:"0.8rem" }}>• <strong style={{ color:textSec }}>Audacity + Noise Reduction</strong> — yerel uygulama</p>
              <p style={{ color:textTer,fontSize:"0.8rem" }}>• <strong style={{ color:textSec }}>Google Colab + Demucs</strong> — bulut tabanlı ücretsiz</p>
            </div>
          </div>
        </div>
      </div>

      <button disabled style={{
        padding:"0.875rem",borderRadius:"12px",border:"none",background:accentColor,
        color:"#fff",cursor:"not-allowed",fontFamily:"inherit",
        fontSize:"0.9rem",fontWeight:600,opacity:0.4,
      }}>
        Vokal ve Enstrüman Ayır
      </button>
      <p style={{ color:textTer,fontSize:"0.75rem",textAlign:"center" }}>
        Bu araç sunucu tabanlı AI gerektirdiğinden şu anda kullanılamamaktadır.
      </p>
    </div>
  );
}
