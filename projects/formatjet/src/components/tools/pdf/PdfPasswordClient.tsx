"use client";

import { useState, useRef } from "react";

type Mode = "add" | "remove";

function formatSize(b: number) {
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function PdfPasswordClient({ mode }: { mode: Mode }) {
  const [file,       setFile]       = useState<File | null>(null);
  const [password,   setPassword]   = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd,    setShowPwd]    = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultUrl,  setResultUrl]  = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error,      setError]      = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (f: File) => {
    setResultUrl(null); setError(""); setPassword(""); setConfirmPwd("");
    setFile(f);
  };

  const process = async () => {
    if (!file) return;
    if (mode === "add") {
      if (!password) { setError("Parola boş olamaz."); return; }
      if (password !== confirmPwd) { setError("Parolalar eşleşmiyor."); return; }
      if (password.length < 4) { setError("Parola en az 4 karakter olmalı."); return; }
    } else {
      if (!password) { setError("Mevcut parolayı girin."); return; }
    }
    setProcessing(true); setError("");
    try {
      const { PDFDocument } = await import("@cantoo/pdf-lib");
      const bytes = await file.arrayBuffer();

      if (mode === "add") {
        const doc     = await PDFDocument.load(bytes);
        const outBytes = await doc.save({
          userPassword:  password,
          ownerPassword: password + "_owner",
          permissions: {
            printing: "highResolution",
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: true,
            contentAccessibility: true,
            documentAssembly: false,
          },
        } as Parameters<typeof doc.save>[0]);
        const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        setResultUrl(URL.createObjectURL(blob));
        setResultSize(blob.size);
      } else {
        const doc    = await PDFDocument.load(bytes, { password } as Parameters<typeof PDFDocument.load>[1]);
        const outDoc = await PDFDocument.create();
        const copied = await outDoc.copyPages(doc, doc.getPageIndices());
        copied.forEach(p => outDoc.addPage(p));
        const outBytes = await outDoc.save();
        const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        setResultUrl(URL.createObjectURL(blob));
        setResultSize(blob.size);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("password") || msg.includes("Password") || msg.includes("encrypted")) {
        setError("Parola yanlış veya PDF şifreli değil.");
      } else {
        setError("İşlem başarısız: " + msg.slice(0, 100));
      }
    }
    setProcessing(false);
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null); setResultUrl(null); setError(""); setPassword(""); setConfirmPwd("");
  };

  const accentColor = mode === "add" ? "#E84545" : "#F05A28";
  const downloadName = file
    ? file.name.replace(/\.pdf$/i, mode === "add" ? "-korumalı.pdf" : "-acik.pdf")
    : "output.pdf";

  return (
    <div className="space-y-5">
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]); }}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer hover:opacity-80 transition-all"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="text-4xl mb-3">{mode === "add" ? "🔒" : "🔓"}</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            {mode === "add" ? "Şifrelemek istediğin PDF'i yükle" : "Şifreli PDF'i yükle"}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>veya tıkla seç</p>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only"
            onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Dosya bilgisi */}
          <div className="flex items-center gap-3 p-3 rounded-xl border"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${accentColor}1A`, color: accentColor }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{file.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{formatSize(file.size)}</p>
            </div>
            <button onClick={reset} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-text-3)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Parola girişi */}
          <div className="p-4 rounded-xl border space-y-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>
                {mode === "add" ? "Yeni Parola" : "Mevcut Parola"}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "add" ? "En az 4 karakter" : "PDF parolası"}
                  className="w-full px-3 py-2 pr-10 rounded-lg text-sm outline-none border"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                />
                <button onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--color-text-3)" }}>
                  {showPwd ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>
            {mode === "add" && (
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Parolayı Onayla</label>
                <input
                  type={showPwd ? "text" : "password"}
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Parolayı tekrar gir"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                />
              </div>
            )}
            {mode === "add" && (
              <div className="flex items-start gap-2 text-xs p-2 rounded-lg"
                style={{ background: "rgba(232,69,69,0.05)", border: "1px solid rgba(232,69,69,0.15)" }}>
                <span className="mt-0.5">⚠️</span>
                <span style={{ color: "var(--color-text-3)" }}>
                  Parolayı unutursanız PDF'i açamazsınız. Güvenli bir yerde saklayın.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm px-4 py-2.5 rounded-lg" style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>{error}</p>
      )}

      {resultUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>
              {mode === "add" ? "PDF şifrelendi" : "Parola kaldırıldı"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{formatSize(resultSize)}</p>
          </div>
          <a href={resultUrl} download={downloadName}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80" style={{ background: "#10B981", color: "#fff" }}>
            İndir
          </a>
        </div>
      )}

      {file && !resultUrl && (
        <button onClick={process} disabled={processing || !password}
          className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ background: accentColor, color: "#fff" }}>
          {processing ? "İşleniyor..." : mode === "add" ? "Parola Ekle ve İndir" : "Parolayı Kaldır"}
        </button>
      )}
    </div>
  );
}
