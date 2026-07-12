"use client";

import dynamic from "next/dynamic";

const loading = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-sm animate-pulse" style={{ color: "var(--color-text-3)" }}>Araç yükleniyor...</div>
  </div>
);

const PdfWatermarkClient     = dynamic(() => import("./PdfWatermarkClient"),     { ssr: false, loading });
const PdfPageNumbersClient   = dynamic(() => import("./PdfPageNumbersClient"),   { ssr: false, loading });
const PdfCropClient          = dynamic(() => import("./PdfCropClient"),          { ssr: false, loading });
const PdfGrayscaleClient     = dynamic(() => import("./PdfGrayscaleClient"),     { ssr: false, loading });
const PdfRepairClient        = dynamic(() => import("./PdfRepairClient"),        { ssr: false, loading });
const PdfHeaderFooterClient  = dynamic(() => import("./PdfHeaderFooterClient"),  { ssr: false, loading });
const PdfMetadataClient      = dynamic(() => import("./PdfMetadataClient"),      { ssr: false, loading });
const PdfResizeClient        = dynamic(() => import("./PdfResizeClient"),        { ssr: false, loading });
const PdfExtractTextClient   = dynamic(() => import("./PdfExtractTextClient"),   { ssr: false, loading });
const PdfExtractImagesClient = dynamic(() => import("./PdfExtractImagesClient"), { ssr: false, loading });

export function PdfWatermarkLoader()     { return <PdfWatermarkClient />; }
export function PdfPageNumbersLoader()   { return <PdfPageNumbersClient />; }
export function PdfCropLoader()          { return <PdfCropClient />; }
export function PdfGrayscaleLoader()     { return <PdfGrayscaleClient />; }
export function PdfRepairLoader()        { return <PdfRepairClient />; }
export function PdfHeaderFooterLoader()  { return <PdfHeaderFooterClient />; }
export function PdfMetadataLoader()      { return <PdfMetadataClient />; }
export function PdfResizeLoader()        { return <PdfResizeClient />; }
export function PdfExtractTextLoader()   { return <PdfExtractTextClient />; }
export function PdfExtractImagesLoader() { return <PdfExtractImagesClient />; }
