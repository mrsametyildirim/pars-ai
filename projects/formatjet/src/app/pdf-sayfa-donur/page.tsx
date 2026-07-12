import type { Metadata } from "next";
import Link from "next/link";
import PdfPageRotateLoader from "@/components/tools/pdf/PdfPageRotateLoader";

export const metadata: Metadata = {
  title: "PDF Sayfa Döndür — Ücretsiz Online PDF Döndürme | FormatJet",
  description: "PDF sayfalarını 90°, 180° veya 270° döndür. Tüm sayfalar veya seçili sayfalar. Tarayıcında çalışır.",
  keywords: ["pdf döndür", "rotate pdf", "pdf sayfa döndür", "pdf rotate pages"],
};

export default function PdfSayfaDonurPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Sayfa Döndür</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Sayfa Döndür</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Tüm sayfaları veya seçili sayfaları 90°, 180° veya 270° döndür.
            </p>
          </div>
        </div>
        <PdfPageRotateLoader />
      </div>
    </div>
  );
}
