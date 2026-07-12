/* ═══════════════════════════════════════════════════
   Görsel İşleme Kütüphanesi — Canvas API tabanlı
   Tüm görsel araçları bu utility'leri kullanır
   ═══════════════════════════════════════════════════ */

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export type CompressOptions = {
  quality:  number;      // 0-1 arası
  format:   OutputFormat;
  maxBytes?: number;     // hedef dosya boyutu (byte)
};

export type ResizeOptions = {
  width?:       number;
  height?:      number;
  keepAspect:   boolean;
  format?:      OutputFormat;
  quality?:     number;
};

/* Dosya boyutunu okunabilir formata çevir */
export function formatSize(bytes: number): string {
  if (bytes < 1024)    return `${bytes} B`;
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/* Görsel dosyasını HTMLImageElement'e yükle */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload  = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Görsel yüklenemedi")); };
    img.src = url;
  });
}

/* Canvas'ı Blob'a çevir */
export function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => { if (blob) resolve(blob); else reject(new Error("Blob oluşturulamadı")); },
      format,
      quality
    );
  });
}

/* Görsel sıkıştır — kaliteyi düşürerek */
export async function compressImage(file: File, opts: CompressOptions): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  if (!opts.maxBytes) {
    return canvasToBlob(canvas, opts.format, opts.quality);
  }

  /* Hedef boyuta sıkıştırma — kaliteyi binary search ile bul */
  let lo = 0.05, hi = opts.quality, bestBlob: Blob | null = null;
  for (let i = 0; i < 8; i++) {
    const mid  = (lo + hi) / 2;
    const blob = await canvasToBlob(canvas, opts.format, mid);
    if (blob.size <= opts.maxBytes) {
      bestBlob = blob;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return bestBlob ?? canvasToBlob(canvas, opts.format, 0.1);
}

/* Görsel yeniden boyutlandır */
export async function resizeImage(file: File, opts: ResizeOptions): Promise<Blob> {
  const img = await loadImage(file);
  const format  = opts.format  ?? "image/jpeg";
  const quality = opts.quality ?? 0.88;

  let targetW = opts.width  ?? img.naturalWidth;
  let targetH = opts.height ?? img.naturalHeight;

  if (opts.keepAspect) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (opts.width && !opts.height) {
      targetH = Math.round(targetW / ratio);
    } else if (opts.height && !opts.width) {
      targetW = Math.round(targetH * ratio);
    } else if (opts.width && opts.height) {
      const rW = targetW / img.naturalWidth;
      const rH = targetH / img.naturalHeight;
      const r  = Math.min(rW, rH);
      targetW = Math.round(img.naturalWidth  * r);
      targetH = Math.round(img.naturalHeight * r);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width  = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return canvasToBlob(canvas, format, quality);
}

/* Format dönüştür (canvas) */
export async function convertFormat(file: File, targetFormat: OutputFormat, quality = 0.9): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;

  if (targetFormat === "image/jpeg") {
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return canvasToBlob(canvas, targetFormat, quality);
}

/* Blob'dan indirme linki oluştur */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* Dosya uzantısından output format */
export function mimeToExt(mime: OutputFormat): string {
  const map: Record<OutputFormat, string> = {
    "image/jpeg": "jpg",
    "image/png":  "png",
    "image/webp": "webp",
  };
  return map[mime] ?? "jpg";
}
