import type { Metadata } from "next";
import Link from "next/link";
import HeicToJpgLoader from "@/components/tools/image/HeicToJpgLoader";

export const metadata: Metadata = {
  title: "HEIC → JPG Dönüştür — iPhone Fotoğraflarını JPG'ye Çevir",
  description:
    "iPhone ve iPad HEIC/HEIF fotoğraflarını JPG, PNG veya WebP formatına dönüştür. Toplu dönüştürme, tarayıcıda çalışır, sunucuya yükleme gerekmez.",
  keywords: ["heic jpg", "heic dönüştür", "iphone fotoğraf dönüştür", "heic to jpg", "heif jpg"],
};

export default function HeicToJpgPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "var(--color-accent)" }}>HEIC → JPG</span>
        </nav>

        {/* Sayfa başlığı */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.15)", color: "var(--color-accent)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>
              <path d="M9 12h6m-3-3v6"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>
              HEIC → JPG Dönüştür
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              iPhone ve iPad&apos;inize ait HEIC fotoğraflarını JPG, PNG veya WebP&apos;ye çevir. Tamamen tarayıcıda.
            </p>
          </div>
        </div>

        {/* Limit çubuğu */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>
            Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>20 dosya</strong>
          </span>
          <button className="font-medium hover:underline" style={{ color: "var(--color-accent)" }}>
            Pro&apos;ya geç →
          </button>
        </div>

        {/* Araç */}
        <HeicToJpgLoader />

        {/* Bilgi */}
        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>
            HEIC Formatı Hakkında
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "HEIC nedir?",
                a: "Apple'ın iOS 11'den itibaren kullandığı görsel formatıdır. JPG'ye göre yarı boyutta aynı kaliteyi sunar ancak birçok platform desteklemez."
              },
              {
                q: "Neden JPG'ye çevirmeli?",
                a: "Windows, Android, sosyal medya ve web'in büyük çoğunluğu HEIC desteklemez. JPG evrensel uyumluluk sunar."
              },
              {
                q: "Görsellerim güvende mi?",
                a: "Evet. Tüm dönüştürme işlemi tarayıcınızda gerçekleşir. Fotoğraflarınız asla sunucumuza yüklenmez."
              },
              {
                q: "HEIF ile HEIC farkı?",
                a: "HEIF konteyner formatıdır, HEIC ise içindeki HEVC kodekli görsel dosyasıdır. Her ikisi de bu araçla dönüştürülür."
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
