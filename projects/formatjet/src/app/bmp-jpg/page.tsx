import type { Metadata } from "next";
import Link from "next/link";
import { BmpToJpgLoader } from "@/components/tools/image/ImageNewLoaders";

export const metadata: Metadata = {
  title: "BMP → JPG Dönüştür — Ücretsiz Online Araç",
  description: "BMP bitmap dosyalarını JPG formatına dönüştür. Dosya boyutunu küçült, kalite ayarı.",
  keywords: ["bmp jpg", "bmp jpeg", "bitmap jpg dönüştür", "bmp to jpg"],
};

export default function BmpJpgPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>BMP → JPG</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.12)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>BMP → JPG</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>BMP bitmap dosyalarını JPG&apos;ye dönüştür. Dosya boyutunu önemli ölçüde küçültür.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>30 görsel</strong></span>
          <button className="font-medium hover:underline" style={{ color: "#818CF8" }}>Pro&apos;ya geç →</button>
        </div>
        <BmpToJpgLoader />
      </div>
    </div>
  );
}
