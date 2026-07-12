import type { Metadata } from "next";
import Link from "next/link";
import ImageCompressLoader from "@/components/tools/image/ImageCompressLoader";

export const metadata: Metadata = {
  title: "Görsel Sıkıştır — Ücretsiz Online Resim Sıkıştırma",
  description:
    "JPG, PNG ve WebP görsellerini kalite kaybı olmadan sıkıştır. Toplu işlem, kalite slider ve format dönüşümü. Tarayıcında çalışır, sunucuya yükleme gerekmez.",
  keywords: ["görsel sıkıştır", "resim sıkıştır", "compress image", "jpg sıkıştır", "png sıkıştır"],
};

export default function GoruselSikistirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Görsel Sıkıştır</span>
        </nav>

        {/* Sayfa başlığı */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>
              Görsel Sıkıştır
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Birden fazla görseli aynı anda sıkıştır. Kaliteyi kendin ayarla, tarayıcında işle.
            </p>
          </div>
        </div>

        {/* Limit çubuğu */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>
            Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>20 görsel</strong>, her biri <strong style={{ color: "var(--color-text)" }}>25 MB</strong>
          </span>
          <button className="font-medium hover:underline" style={{ color: "#818CF8" }}>
            Pro&apos;ya geç →
          </button>
        </div>

        {/* Araç */}
        <ImageCompressLoader />

        {/* Bilgi */}
        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>
            Görsel Sıkıştırma Hakkında
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "Görsellerim güvende mi?",
                a: "Evet. Sıkıştırma işlemi tamamen tarayıcında gerçekleşir. Görseller sunucumuza yüklenmez."
              },
              {
                q: "Hangi formatlar desteklenir?",
                a: "JPG, PNG, WebP, BMP ve TIFF dosyaları sıkıştırılabilir. Çıktı formatı JPG, PNG veya WebP olabilir."
              },
              {
                q: "Kalite kaç olmalı?",
                a: "Web için %75-85 idealdir. Fotoğraf arşivi için %85-90, sosyal medya için %70-80 önerilir."
              },
              {
                q: "WebP neden faydalı?",
                a: "WebP, JPG ve PNG'ye kıyasla %25-35 daha küçük dosya boyutu üretir. Modern tarayıcılar tam destekler."
              },
            ].map(item => (
              <div key={item.q} className="p-4 rounded-lg border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>{item.q}</h3>
                <p className="text-sm" style={{ color: "var(--color-text-2)" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
