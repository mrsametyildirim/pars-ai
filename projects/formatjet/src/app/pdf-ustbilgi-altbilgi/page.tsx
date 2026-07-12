import type { Metadata } from "next";
import Link from "next/link";
import { PdfHeaderFooterLoader } from "@/components/tools/pdf/PdfEditLoaders";

export const metadata: Metadata = {
  title: "PDF Üst/Alt Bilgi Ekle — Header Footer Araç",
  description: "PDF sayfalarına üst bilgi (header) ve alt bilgi (footer) ekle. Sayfa numarası seçeneğiyle birlikte.",
  keywords: ["pdf header footer", "pdf üst bilgi", "pdf alt bilgi", "pdf başlık ekle"],
};

export default function PdfUstbilgiAltbilgiPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>Üst/Alt Bilgi Ekle</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.12)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Üst/Alt Bilgi Ekle</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>PDF sayfalarına header ve footer ekle. Sayfa numarası seçeneği dahil.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · Tüm sayfalar işlenir</span>
          <button className="font-medium hover:underline" style={{ color: "#E84545" }}>Pro&apos;ya geç →</button>
        </div>
        <PdfHeaderFooterLoader />
      </div>
    </div>
  );
}
