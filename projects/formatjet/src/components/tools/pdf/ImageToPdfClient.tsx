"use client";

import { useState, useRef, useCallback } from "react";

type ImgFile = { id: string; file: File; url: string; w: number; h: number };
type PageSize = "a4" | "letter" | "original";
type Orientation = "portrait" | "landscape";

const PAGE_SIZES: Record<PageSize, [number, number]> = {
  a4:       [595.28, 841.89],
  letter:   [612, 792],
  original: [0, 0],
};

function formatSize(b: number) {
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function ImageToPdfClient() {
  const [images,      setImages]      = useState<ImgFile[]>([]);
  const [pageSize,    setPageSize]    = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin,      setMargin]      = useState(20);
  const [dragOver,    setDragOver]    = useState(false);
  const [processing,  setProcessing]  = useState(false);
  const [resultUrl,   setResultUrl]   = useState<string | null>(null);
  const [resultSize,  setResultSize]  = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    arr.slice(0, 20 - images.length).forEach(file => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImages(prev => [
          ...prev,
          { id: `${Date.now()}-${Math.random()}`, file, url, w: img.naturalWidth, h: img.naturalHeight },
        ]);
      };
      img.src = url;
    });
  }, [images.length]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const moveUp   = (i: number) => { if (i === 0) return; const a = [...images]; [a[i-1],a[i]] = [a[i],a[i-1]]; setImages(a); };
  const moveDown = (i: number) => { if (i === images.length-1) return; const a = [...images]; [a[i],a[i+1]] = [a[i+1],a[i]]; setImages(a); };
  const remove   = (id: string) => setImages(prev => { const img = prev.find(i => i.id === id); if (img) URL.revokeObjectURL(img.url); return prev.filter(i => i.id !== id); });

  const buildPdf = async () => {
    if (!images.length) return;
    setProcessing(true);
    setResultUrl(null);
    try {
      const { PDFDocument, rgb } = await import("pdf-lib");
      const pdf = await PDFDocument.create();

      for (const imgf of images) {
        const bytes = await imgf.file.arrayBuffer();
        let pdfImg;
        if (imgf.file.type === "image/png") {
          pdfImg = await pdf.embedPng(bytes);
        } else {
          /* Her şeyi JPEG olarak gömebilmek için canvas üzerinden geçir */
          const canvas = document.createElement("canvas");
          canvas.width = imgf.w; canvas.height = imgf.h;
          const ctx = canvas.getContext("2d")!;
          const bmp = await createImageBitmap(imgf.file);
          ctx.drawImage(bmp, 0, 0);
          const jpegBytes = await new Promise<Uint8Array>((res, rej) =>
            canvas.toBlob(b => b ? b.arrayBuffer().then(ab => res(new Uint8Array(ab))).catch(rej) : rej("blob"), "image/jpeg", 0.92)
          );
          pdfImg = await pdf.embedJpg(jpegBytes);
        }

        let [pw, ph] = PAGE_SIZES[pageSize];
        if (pageSize === "original") { pw = imgf.w; ph = imgf.h; }
        else if (orientation === "landscape") { [pw, ph] = [ph, pw]; }

        const page = pdf.addPage([pw, ph]);
        const m = pageSize === "original" ? 0 : margin;
        const area = { w: pw - 2 * m, h: ph - 2 * m };
        const scale = Math.min(area.w / imgf.w, area.h / imgf.h);
        const dw = imgf.w * scale;
        const dh = imgf.h * scale;
        page.drawImage(pdfImg, { x: m + (area.w - dw) / 2, y: m + (area.h - dh) / 2, width: dw, height: dh });
      }

      const outBytes = await pdf.save();
      const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const download = () => {
    if (!resultUrl) return;
    const name = images.length === 1
      ? images[0].file.name.replace(/\.[^.]+$/, "") + ".pdf"
      : "gorsel-birlesik.pdf";
    const a = document.createElement("a"); a.href = resultUrl; a.download = name; a.click();
  };

  return (
    <div className="space-y-5">

      {/* Ayarlar */}
      <div className="p-4 rounded-xl border space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Sayfa Boyutu</label>
            <div className="flex gap-1.5">
              {(["a4","letter","original"] as PageSize[]).map(s => (
                <button key={s} onClick={() => setPageSize(s)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                  style={{ background: pageSize === s ? "#E84545" : "transparent", color: pageSize === s ? "#fff" : "var(--color-text-2)", border: `1px solid ${pageSize === s ? "#E84545" : "var(--color-border)"}` }}>
                  {s === "a4" ? "A4" : s === "letter" ? "Letter" : "Orijinal"}
                </button>
              ))}
            </div>
          </div>
          {pageSize !== "original" && (
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Yön</label>
              <div className="flex gap-1.5">
                {(["portrait","landscape"] as Orientation[]).map(o => (
                  <button key={o} onClick={() => setOrientation(o)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{ background: orientation === o ? "#E84545" : "transparent", color: orientation === o ? "#fff" : "var(--color-text-2)", border: `1px solid ${orientation === o ? "#E84545" : "var(--color-border)"}` }}>
                    {o === "portrait" ? "Dikey" : "Yatay"}
                  </button>
                ))}
              </div>
            </div>
          )}
          {pageSize !== "original" && (
            <div className="flex-1 min-w-32">
              <label className="text-xs mb-1.5 block" style={{ color: "var(--color-text-3)" }}>Kenar boşluğu: {margin}pt</label>
              <input type="range" min={0} max={60} step={5} value={margin} onChange={e => setMargin(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#E84545" }} />
            </div>
          )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => images.length < 20 && inputRef.current?.click()}
        className="border-2 border-dashed rounded-xl py-10 text-center cursor-pointer transition-all"
        style={{ borderColor: dragOver ? "#E84545" : "var(--color-border)", background: dragOver ? "rgba(232,69,69,0.05)" : "var(--color-surface)" }}>
        <div className="text-3xl mb-2">🖼️</div>
        <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Görselleri buraya sürükle</p>
        <p className="text-xs" style={{ color: "var(--color-text-3)" }}>JPG, PNG, WebP — sıra sürükleyerek değiştirilebilir</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only"
          onChange={e => e.target.files && addFiles(e.target.files)} />
      </div>

      {/* Görsel listesi + sıralama */}
      {images.length > 0 && (
        <div className="space-y-1.5">
          {images.map((img, i) => (
            <div key={img.id} className="flex items-center gap-2 p-2 rounded-lg border"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <img src={img.url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
              <span className="text-xs font-mono w-5 text-center shrink-0" style={{ color: "var(--color-text-3)" }}>{i+1}</span>
              <p className="text-sm flex-1 truncate" style={{ color: "var(--color-text)" }}>{img.file.name}</p>
              <span className="text-xs shrink-0" style={{ color: "var(--color-text-3)" }}>{img.w}×{img.h}</span>
              <div className="flex gap-0.5 shrink-0">
                <button onClick={() => moveUp(i)} disabled={i===0} className="p-1 rounded hover:opacity-70 disabled:opacity-20" style={{ color: "var(--color-text-3)" }}>▲</button>
                <button onClick={() => moveDown(i)} disabled={i===images.length-1} className="p-1 rounded hover:opacity-70 disabled:opacity-20" style={{ color: "var(--color-text-3)" }}>▼</button>
                <button onClick={() => remove(img.id)} className="p-1 rounded hover:opacity-70" style={{ color: "var(--color-text-3)" }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sonuç */}
      {resultUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#10B981" }}>PDF oluşturuldu</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>{images.length} görsel · {formatSize(resultSize)}</p>
          </div>
          <button onClick={download} className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80" style={{ background: "#10B981", color: "#fff" }}>
            İndir
          </button>
        </div>
      )}

      {/* Aksiyon */}
      {images.length > 0 && (
        <button onClick={buildPdf} disabled={processing}
          className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{ background: "#E84545", color: "#fff" }}>
          {processing ? "PDF oluşturuluyor..." : `${images.length} Görseli PDF'e Dönüştür`}
        </button>
      )}
    </div>
  );
}
