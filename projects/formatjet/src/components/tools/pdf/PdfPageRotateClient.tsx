"use client";

import { useState, useRef } from "react";

type RotateAngle = 90 | 180 | 270;

function formatSize(b: number) {
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function PdfPageRotateClient() {
  const [file,       setFile]       = useState<File | null>(null);
  const [pageCount,  setPageCount]  = useState(0);
  const [pageRots,   setPageRots]   = useState<Record<number, RotateAngle>>({});
  const [globalAngle,setGlobalAngle]= useState<RotateAngle>(90);
  const [mode,       setMode]       = useState<"all"|"select">("all");
  const [selected,   setSelected]   = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl,  setResultUrl]  = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error,      setError]      = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setResultUrl(null); setError(""); setPageRots({}); setSelected([]);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc   = await PDFDocument.load(bytes);
      setFile(f); setPageCount(doc.getPageCount());
    } catch { setError("PDF okunamadı."); }
  };

  const togglePage = (p: number) =>
    setSelected(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p].sort((a,b)=>a-b));

  const setPageAngle = (p: number, angle: RotateAngle) =>
    setPageRots(prev => ({ ...prev, [p]: angle }));

  const rotate = async () => {
    if (!file) return;
    setProcessing(true); setError("");
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const bytes  = await file.arrayBuffer();
      const doc    = await PDFDocument.load(bytes);
      const pages  = doc.getPages();
      const targets = mode === "all"
        ? Array.from({ length: pageCount }, (_, i) => i + 1)
        : selected;
      targets.forEach(pNum => {
        const page = pages[pNum - 1];
        const angle = mode === "select" ? (pageRots[pNum] ?? globalAngle) : globalAngle;
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      });
      const outBytes = await doc.save();
      const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch { setError("Döndürme başarısız."); }
    setProcessing(false);
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null); setPageCount(0); setSelected([]); setPageRots({}); setResultUrl(null); setError("");
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]); }}
          className="border-2 border-dashed rounded-xl py-14 text-center cursor-pointer hover:opacity-80 transition-all"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="text-4xl mb-3">🔄</div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF yükle ve sayfaları döndür</p>
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
              style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: "var(--color-text)" }}>{file.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{formatSize(file.size)} · {pageCount} sayfa</p>
            </div>
            <button onClick={reset} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--color-text-3)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Açı seçimi (global) */}
          <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <label className="text-xs mb-2 block font-medium" style={{ color: "var(--color-text)" }}>Döndürme Açısı</label>
            <div className="flex gap-2">
              {([90, 180, 270] as RotateAngle[]).map(a => (
                <button key={a} onClick={() => setGlobalAngle(a)}
                  className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                  style={{
                    background: globalAngle === a ? "#E84545" : "transparent",
                    color: globalAngle === a ? "#fff" : "var(--color-text-2)",
                    border: `1px solid ${globalAngle === a ? "#E84545" : "var(--color-border)"}`,
                  }}>
                  <span>{a === 90 ? "↻" : a === 180 ? "↕" : "↺"}</span>
                  {a}°
                </button>
              ))}
            </div>
          </div>

          {/* Mod */}
          <div className="flex gap-2">
            <button onClick={() => setMode("all")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: mode==="all" ? "#E84545" : "transparent", color: mode==="all" ? "#fff" : "var(--color-text-2)", border: `1px solid ${mode==="all" ? "#E84545" : "var(--color-border)"}` }}>
              Tüm Sayfalar
            </button>
            <button onClick={() => setMode("select")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: mode==="select" ? "#E84545" : "transparent", color: mode==="select" ? "#fff" : "var(--color-text-2)", border: `1px solid ${mode==="select" ? "#E84545" : "var(--color-border)"}` }}>
              Sayfa Seç
            </button>
          </div>

          {mode === "select" && (
            <div>
              <p className="text-xs mb-2" style={{ color: "var(--color-text-3)" }}>Döndürülecek sayfaları seç:</p>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => togglePage(p)}
                    className="w-10 h-10 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: selected.includes(p) ? "#E84545" : "var(--color-surface)",
                      color: selected.includes(p) ? "#fff" : "var(--color-text-2)",
                      border: `1px solid ${selected.includes(p) ? "#E84545" : "var(--color-border)"}`,
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm px-4 py-2 rounded-lg" style={{ background: "rgba(232,69,69,0.1)", color: "#E84545" }}>{error}</p>
      )}

      {resultUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>Sayfalar döndürüldü</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{pageCount} sayfa · {formatSize(resultSize)}</p>
          </div>
          <a href={resultUrl} download={file?.name.replace(/\.pdf$/i, "-donuk.pdf")}
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80" style={{ background: "#10B981", color: "#fff" }}>
            İndir
          </a>
        </div>
      )}

      {file && !resultUrl && (
        <button onClick={rotate} disabled={processing || (mode === "select" && selected.length === 0)}
          className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ background: "#E84545", color: "#fff" }}>
          {processing ? "Döndürülüyor..." : mode === "all" ? `Tüm Sayfaları ${globalAngle}° Döndür` : selected.length > 0 ? `${selected.length} Sayfayı ${globalAngle}° Döndür` : "Sayfa Seç"}
        </button>
      )}
    </div>
  );
}
