import type { Metadata } from "next";
import Link from "next/link";
import ImageRotateLoader from "@/components/tools/image/ImageRotateLoader";

export const metadata: Metadata = {
  title: "Görsel Döndür — Ücretsiz Online Resim Döndürme",
  description: "Görseli 90°, 180°, 270° döndür veya yatay/dikey çevir. Toplu işlem, tarayıcıda çalışır.",
  keywords: ["görsel döndür", "resim döndür", "rotate image", "fotoğraf döndür", "ayna çevir"],
};

export default function GoruselDonurPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Görsel Döndür</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsel Döndür</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>90°, 180°, 270° döndür veya yatay/dikey çevir. Toplu işlem destekli.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>20 görsel</strong></span>
          <button className="font-medium hover:underline" style={{ color: "#818CF8" }}>Pro&apos;ya geç →</button>
        </div>
        <ImageRotateLoader />
      </div>
    </div>
  );
}
