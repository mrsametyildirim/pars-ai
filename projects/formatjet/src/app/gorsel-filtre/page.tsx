import type { Metadata } from "next";
import Link from "next/link";
import { ImageFilterLoader } from "@/components/tools/image/ImageNewLoaders";

export const metadata: Metadata = {
  title: "Görsel Filtre Uygula — Gri Sepia Parlaklık",
  description: "Görsele filtre uygula: gri ton, sepia, ters çevir, parlaklık, kontrast, bulanıklaştır. Canlı önizleme.",
  keywords: ["görsel filtre", "resim filtre", "image filter", "görsel gri ton", "görsel sepia"],
};

export default function GorselFiltrePage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Görsel Filtre</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.12)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsel Filtre Uygula</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Gri ton, sepia, ters çevir, parlaklık, kontrast, bulanıklaştır. Canlı önizleme.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · 6 filtre seçeneği</span>
          <button className="font-medium hover:underline" style={{ color: "#818CF8" }}>Pro&apos;ya geç →</button>
        </div>
        <ImageFilterLoader />
      </div>
    </div>
  );
}
