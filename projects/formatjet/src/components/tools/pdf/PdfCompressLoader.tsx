"use client";
import dynamic from "next/dynamic";

const PdfCompressClient = dynamic(() => import("./PdfCompressClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <div className="text-sm animate-pulse" style={{ color: "var(--color-text-3)" }}>Araç yükleniyor...</div>
    </div>
  ),
});

export default function PdfCompressLoader() {
  return <PdfCompressClient />;
}
