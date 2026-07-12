"use client";

import dynamic from "next/dynamic";

const loading = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-sm animate-pulse" style={{ color: "var(--color-text-3)" }}>Araç yükleniyor...</div>
  </div>
);

const ImageConvertClient  = dynamic(() => import("./ImageConvertClient"),  { ssr: false, loading });
const ImagesToGifClient   = dynamic(() => import("./ImagesToGifClient"),   { ssr: false, loading });
const ImageFlipClient     = dynamic(() => import("./ImageFlipClient"),     { ssr: false, loading });
const ImageFilterClient   = dynamic(() => import("./ImageFilterClient"),   { ssr: false, loading });

const IMAGE_ACCENT = "#818CF8";

export function GifToJpgLoader() {
  return <ImageConvertClient accept="image/gif,.gif" targetFormat="image/jpeg" targetExt="jpg" defaultQuality={90} accentColor={IMAGE_ACCENT} />;
}

export function BmpToJpgLoader() {
  return <ImageConvertClient accept="image/bmp,.bmp" targetFormat="image/jpeg" targetExt="jpg" defaultQuality={90} accentColor={IMAGE_ACCENT} />;
}

export function TiffToJpgLoader() {
  return <ImageConvertClient accept="image/tiff,.tiff,.tif" targetFormat="image/jpeg" targetExt="jpg" defaultQuality={90} accentColor={IMAGE_ACCENT} />;
}

export function ImagesToGifLoader()  { return <ImagesToGifClient />; }
export function ImageFlipLoader()    { return <ImageFlipClient />; }
export function ImageFilterLoader()  { return <ImageFilterClient />; }
