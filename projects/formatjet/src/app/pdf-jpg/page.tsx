import type { Metadata } from "next";
import Link from "next/link";
import PdfToJpgLoader from "@/components/tools/pdf/PdfToJpgLoader";

export const metadata: Metadata = {
  title: "PDF → JPG — Ücretsiz Online PDF'den Görsel Dönüştürme | FormatJet",
  description: "PDF sayfalarını yüksek kaliteli JPG veya PNG görsel olarak dışa aktar. Tarayıcıda çalışır.",
  keywords: ["pdf to jpg", "pdf jpg", "pdf görsel", "pdf sayfaları görsel", "pdf to image"],
};

export default function PdfJpgPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF → JPG</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2H6a2 2 0 0 1-2 2v12a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF → JPG</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>PDF sayfalarını JPG veya PNG görsel olarak dışa aktar. Her sayfa ayrı dosya. Tarayıcıda çalışır.</p>
          </div>
        </div>
        <PdfToJpgLoader />
      </div>
    </div>
  );
}
