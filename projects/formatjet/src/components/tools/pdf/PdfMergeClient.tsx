"use client";

import { useState, useRef, useCallback } from "react";

const MAX_FILES = 10;
const MAX_BYTES = 25 * 1024 * 1024;

type PdfFile = {
  id:   string;
  file: File;
  name: string;
  size: number;
};

function formatSize(bytes: number): string {
  if (bytes < 1024)    return `${bytes} B`;
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function PdfMergeClient() {
  const [files,       setFiles]       = useState<PdfFile[]>([]);
  const [dragOver,    setDragOver]    = useState(false);
  const [dragId,      setDragId]      = useState<string | null>(null);
  const [progress,    setProgress]    = useState<number | null>(null);
  const [resultUrl,   setResultUrl]   = useState<string | null>(null);
  const [resultMeta,  setResultMeta]  = useState("");
  const [error,       setError]       = useState<string | null>(null);

  const fileInputRef    = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const dragOverIdRef   = useRef<string | null>(null);

  /* ── Dosya ekleme ── */
  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const errs: string[] = [];
    const next = [...files];

    Array.from(incoming).forEach(f => {
      if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return;
      if (next.length >= MAX_FILES) { errs.push(`Maksimum ${MAX_FILES} dosya.`); return; }
      if (f.size > MAX_BYTES)       { errs.push(`"${f.name}" 25 MB sınırını aşıyor.`); return; }
      if (next.find(x => x.name === f.name && x.size === f.size)) return;
      next.push({ id: crypto.randomUUID(), file: f, name: f.name, size: f.size });
    });

    if (errs.length) setError(errs[0]);
    setFiles(next);
  }, [files]);

  /* ── Drop zone ── */
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  /* ── Sıralama (drag-sort) ── */
  function onItemDragStart(id: string) { setDragId(id); }
  function onItemDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    dragOverIdRef.current = overId;
  }
  function onItemDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    setFiles(prev => {
      const arr  = [...prev];
      const from = arr.findIndex(f => f.id === dragId);
      const to   = arr.findIndex(f => f.id === targetId);
      if (from < 0 || to < 0) return arr;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
    setDragId(null);
  }

  /* ── Birleştir ── */
  async function merge() {
    if (files.length < 2) return;
    setProgress(5);
    setError(null);
    setResultUrl(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      const step   = 90 / files.length;

      for (let i = 0; i < files.length; i++) {
        const buf  = await files[i].file.arrayBuffer();
        const doc  = await PDFDocument.load(buf);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
        setProgress(5 + (i + 1) * step);
      }

      setProgress(98);
      const bytes = await merged.save();
      const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url   = URL.createObjectURL(blob);

      const totalSize = files.reduce((s, f) => s + f.size, 0);
      setResultMeta(`${files.length} dosya birleştirildi · ${formatSize(bytes.byteLength)} (${formatSize(totalSize)} kaynak)`);
      setResultUrl(url);
      setProgress(100);
    } catch {
      setError("Birleştirme sırasında hata oluştu. Dosyaların geçerli PDF olduğunu kontrol edin.");
      setProgress(null);
    }
  }

  /* ── Sıfırla ── */
  function reset() {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFiles([]);
    setResultUrl(null);
    setProgress(null);
    setError(null);
    setResultMeta("");
  }

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */

  /* Sonuç paneli */
  if (resultUrl) {
    return (
      <div className="rounded-xl border p-8 text-center" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(16,185,129,0.15)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF hazır!</h2>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-2)" }}>{resultMeta}</p>
        <div className="flex items-center justify-center gap-3">
          <a
            href={resultUrl}
            download="birlesik.pdf"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "var(--color-accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            İndir
          </a>
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg text-sm border transition-all hover:opacity-80"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-2)", background: "var(--color-surface-2)" }}
          >
            Yeni birleştirme
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className="rounded-xl border-2 border-dashed cursor-pointer transition-all p-8 text-center"
        style={{
          borderColor: dragOver ? "var(--color-accent)" : "var(--color-border-2)",
          background:  dragOver ? "var(--color-accent-muted)" : "var(--color-surface)",
        }}
      >
        <input ref={fileInputRef} type="file" multiple accept=".pdf,application/pdf" className="hidden" onChange={e => addFiles(e.target.files)} />
        {files.length === 0 ? (
          <>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(232,69,69,0.12)", color: "#E84545" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
              PDF&apos;leri buraya sürükle veya tıkla
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
              Birden fazla dosya seçebilirsin · Maks. 25 MB/dosya
            </p>
          </>
        ) : (
          <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
            Daha fazla PDF eklemek için tıkla veya sürükle
          </p>
        )}
      </div>

      {/* Hata */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm" style={{ background: "rgba(232,69,69,0.1)", color: "#E84545", border: "1px solid rgba(232,69,69,0.2)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
          <button onClick={() => setError(null)} className="ml-auto opacity-60 hover:opacity-100">×</button>
        </div>
      )}

      {/* Dosya listesi */}
      {files.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          {files.map((f, i) => (
            <div
              key={f.id}
              draggable
              onDragStart={() => onItemDragStart(f.id)}
              onDragEnd={() => setDragId(null)}
              onDragOver={e => onItemDragOver(e, f.id)}
              onDrop={e => onItemDrop(e, f.id)}
              className="flex items-center gap-3 px-4 py-3 border-b last:border-0 cursor-grab active:cursor-grabbing transition-all"
              style={{
                borderColor: "var(--color-border)",
                background: dragId === f.id ? "var(--color-surface-3)" : (i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-2)"),
                opacity: dragId === f.id ? 0.4 : 1,
              }}
            >
              {/* Sıra no */}
              <span className="font-mono text-xs w-5 text-center shrink-0" style={{ color: "var(--color-text-3)" }}>
                {i + 1}
              </span>

              {/* Drag handle */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0" style={{ color: "var(--color-text-3)" }}>
                <path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
              </svg>

              {/* PDF ikon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E84545" strokeWidth="1.8" strokeLinecap="round" className="shrink-0">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>

              {/* İsim */}
              <span className="flex-1 text-sm truncate" style={{ color: "var(--color-text)" }}>{f.name}</span>

              {/* Boyut */}
              <span className="font-mono text-xs shrink-0" style={{ color: "var(--color-text-3)" }}>{formatSize(f.size)}</span>

              {/* Sil */}
              <button
                onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))}
                className="shrink-0 p-1 rounded transition-all hover:opacity-80"
                style={{ color: "var(--color-text-3)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* Daha fazla ekle */}
          {files.length < MAX_FILES && (
            <div className="px-4 py-2.5 border-t" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
              <button
                onClick={() => addMoreInputRef.current?.click()}
                className="flex items-center gap-2 text-xs transition-colors hover:opacity-80"
                style={{ color: "var(--color-text-2)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Daha fazla PDF ekle ({files.length}/{MAX_FILES})
              </button>
              <input ref={addMoreInputRef} type="file" multiple accept=".pdf,application/pdf" className="hidden" onChange={e => addFiles(e.target.files)} />
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      {progress !== null && progress < 100 && (
        <div className="rounded-full overflow-hidden h-1.5" style={{ background: "var(--color-border)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: "var(--color-accent)" }}
          />
        </div>
      )}

      {/* Birleştir butonu */}
      {files.length > 0 && !resultUrl && (
        <button
          onClick={merge}
          disabled={files.length < 2 || (progress !== null && progress < 100)}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2"
          style={{ background: "var(--color-accent)" }}
        >
          {progress !== null && progress < 100 ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" opacity=".3" /><path d="M21 12a9 9 0 0 0-9-9" />
              </svg>
              Birleştiriliyor... {Math.round(progress)}%
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
              </svg>
              {files.length < 2 ? "En az 2 PDF ekle" : `${files.length} PDF'i Birleştir`}
            </>
          )}
        </button>
      )}
    </div>
  );
}
