import type { Metadata } from "next";
import Link from "next/link";
import { ImageFlipLoader } from "@/components/tools/image/ImageNewLoaders";

export const metadata: Metadata = {
  title: "Görsel Ters Çevir — Ayna Yansıtma Aracı",
  description: "Görseli yatay veya dikey olarak ters çevir. Ayna etkisi, her ikisi seçeneği. Tarayıcıda çalışır.",
  keywords: ["görsel ters çevir", "resim ayna", "flip image", "görsel yansıt", "mirror image"],
};

export default function GorselTersPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Görsel Ters Çevir</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.12)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsel Ters Çevir</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Görseli yatay, dikey veya her iki yönde ayna gibi çevir.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · Önizleme dahil</span>
          <button className="font-medium hover:underline" style={{ color: "#818CF8" }}>Pro&apos;ya geç →</button>
        </div>
        <ImageFlipLoader />
      </div>
    </div>
  );
}
