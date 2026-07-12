import type { Metadata } from "next";
import Link from "next/link";
import PdfPageOrganizeLoader from "@/components/tools/pdf/PdfPageOrganizeLoader";

export const metadata: Metadata = {
  title: "PDF Sayfa Sırala — Ücretsiz Online PDF Düzenleme | FormatJet",
  description: "PDF sayfalarını sürükle-bırak ile yeniden sırala, sayfa kaldır, ters çevir. Tarayıcında çalışır.",
  keywords: ["pdf sayfa sırala", "organize pdf", "pdf düzenle", "reorder pdf pages", "pdf sayfa yeniden sırala"],
};

export default function PdfSayfaSiralaPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Sayfa Sırala</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Sayfa Sırala</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Sürükle-bırak ile sayfaları yeniden sırala. Sayfaları kaldır, ters çevir, kaydet.
            </p>
          </div>
        </div>
        <PdfPageOrganizeLoader />
      </div>
    </div>
  );
}
