import type { Metadata } from "next";
import Link from "next/link";
import { ImagesToGifLoader } from "@/components/tools/image/ImageNewLoaders";

export const metadata: Metadata = {
  title: "Görsellerden GIF Yap — Animasyonlu GIF Oluştur",
  description: "Birden fazla görsel yükle, animasyonlu GIF oluştur. FPS ayarı, 30 kareye kadar destek.",
  keywords: ["görsel gif yap", "resim gif", "animasyonlu gif", "images to gif", "gif oluştur"],
};

export default function GorselGifPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Görsellerden GIF</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.12)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsellerden GIF Yap</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Birden fazla görsel yükle, animasyonlu GIF oluştur. FPS ve kare sırası ayarlanabilir.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · En fazla 30 kare</span>
          <button className="font-medium hover:underline" style={{ color: "#818CF8" }}>Pro&apos;ya geç →</button>
        </div>
        <ImagesToGifLoader />
      </div>
    </div>
  );
}
