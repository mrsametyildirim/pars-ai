import type { Metadata } from "next";
import Link from "next/link";
import PdfExtractLoader from "@/components/tools/pdf/PdfExtractLoader";

export const metadata: Metadata = {
  title: "PDF Sayfa Ayır — Ücretsiz Online PDF Sayfa Çıkarma | FormatJet",
  description: "PDF'den seçtiğin sayfaları tek bir dosyada birleştirerek çıkar. Ücretsiz, tarayıcıda çalışır.",
  keywords: ["pdf sayfa ayır", "extract pdf pages", "pdf sayfa çıkar", "pdf extract pages"],
};

export default function PdfSayfaAyirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Sayfa Ayır</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Sayfa Ayır</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Belirli sayfaları seçerek tek bir PDF dosyasında çıkar. Tarayıcıda çalışır, sunucuya gönderilmez.</p>
          </div>
        </div>
        <PdfExtractLoader />
      </div>
    </div>
  );
}
