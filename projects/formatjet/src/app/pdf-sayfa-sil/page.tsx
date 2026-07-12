import type { Metadata } from "next";
import Link from "next/link";
import PdfPageDeleteLoader from "@/components/tools/pdf/PdfPageDeleteLoader";

export const metadata: Metadata = {
  title: "PDF Sayfa Sil — Ücretsiz Online PDF Sayfa Kaldırma | FormatJet",
  description: "PDF'den istenmeyen sayfaları kalıcı olarak sil. Tek tek veya aralık girerek çoklu sayfa silme. Tarayıcında çalışır.",
  keywords: ["pdf sayfa sil", "delete pdf pages", "pdf sayfa kaldır", "remove pdf pages"],
};

export default function PdfSayfaSilPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Sayfa Sil</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Sayfa Sil</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              PDF sayfalarına tıklayarak veya sayfa numarası girerek seç ve kalıcı olarak sil.
            </p>
          </div>
        </div>
        <PdfPageDeleteLoader />
      </div>
    </div>
  );
}
