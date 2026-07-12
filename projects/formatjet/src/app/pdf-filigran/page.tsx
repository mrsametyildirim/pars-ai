import type { Metadata } from "next";
import Link from "next/link";
import { PdfWatermarkLoader } from "@/components/tools/pdf/PdfEditLoaders";

export const metadata: Metadata = {
  title: "PDF Filigran Ekle — Ücretsiz Online Watermark",
  description: "PDF dosyalarına metin filigranı ekle. Saydamlık, açı ve boyut ayarlanabilir. Tarayıcıda çalışır.",
  keywords: ["pdf filigran", "pdf watermark", "pdf gizli", "pdf damgala"],
};

export default function PdfFiligranPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Filigran Ekle</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.12)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586l5.414 5.414V19a2 2 0 0 1-2 2z"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF Filigran Ekle</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>PDF sayfalarına metin filigranı ekle. Saydamlık, açı ve boyutu ayarla.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · Tüm sayfalar işlenir</span>
          <button className="font-medium hover:underline" style={{ color: "#E84545" }}>Pro&apos;ya geç →</button>
        </div>
        <PdfWatermarkLoader />
      </div>
    </div>
  );
}
