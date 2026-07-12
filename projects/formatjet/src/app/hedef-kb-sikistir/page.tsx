import type { Metadata } from "next";
import Link from "next/link";
import TargetSizeLoader from "@/components/tools/image/TargetSizeLoader";

export const metadata: Metadata = {
  title: "Hedef KB'ye Sıkıştır — Görseli Belirli Boyuta Küçült",
  description:
    "Görseli istediğin KB veya MB hedefine sıkıştır. 50KB, 100KB, 200KB seçenekleri veya özel boyut girişi. Tarayıcıda çalışır.",
  keywords: ["görsel kb sıkıştır", "compress image to kb", "hedef boyut", "200kb sıkıştır", "belirli boyut"],
};

export default function HedefKbSikistirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "var(--color-accent)" }}>Hedef KB&apos;ye Sıkıştır</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.15)", color: "var(--color-accent)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Hedef KB&apos;ye Sıkıştır</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Görseli tam istediğin boyuta sıkıştır. Form yüklemeleri, e-posta ve sosyal medya sınırları için ideal.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>20 görsel</strong></span>
          <button className="font-medium hover:underline" style={{ color: "var(--color-accent)" }}>Pro&apos;ya geç →</button>
        </div>
        <TargetSizeLoader />
      </div>
    </div>
  );
}
