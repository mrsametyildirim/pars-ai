import type { Metadata } from "next";
import Link from "next/link";
import ImageConvertLoader from "@/components/tools/image/ImageConvertLoader";

export const metadata: Metadata = {
  title: "Görsel → WebP Dönüştür — JPG PNG'yi WebP'ye Çevir",
  description:
    "JPG ve PNG görsellerinizi web için optimize WebP formatına dönüştür. Daha küçük boyut, aynı kalite. Toplu işlem destekli.",
  keywords: ["jpg to webp", "png to webp", "webp dönüştür", "görsel webp", "web optimizasyon"],
};

export default function GoruselWebpPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#10B981" }}>JPG/PNG → WebP</span>
        </nav>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>
              JPG / PNG → WebP Dönüştür
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Görsellerinizi WebP formatına çevirerek web sitenizi hızlandır. %25-35 daha küçük dosya boyutu.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>30 görsel</strong></span>
          <button className="font-medium hover:underline" style={{ color: "#10B981" }}>Pro&apos;ya geç →</button>
        </div>

        <ImageConvertLoader
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          targetFormat="image/webp"
          targetExt="webp"
          defaultQuality={85}
          accentColor="#10B981"
        />

        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>WebP Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "WebP neden daha iyi?", a: "Google tarafından geliştirilen WebP, JPG'ye göre %25-35, PNG'ye göre %26 daha küçük dosya boyutu üretir. Hem şeffaflık hem animasyonu destekler." },
              { q: "Hangi tarayıcılar destekler?", a: "Chrome, Firefox, Safari, Edge ve Opera'nın tamamı WebP destekler. Kullanıcıların %95'inden fazlası uyumlu tarayıcı kullanır." },
              { q: "Kalite ne kadar düşer?", a: "%80-90 kalite ayarında JPG'den ayırt edilemez. SEO ve sayfa hızı için Google WebP kullanımını öneriyor." },
              { q: "WebP'yi geri dönüştürebilir miyim?", a: "Evet. WebP → JPG aracımızla WebP dosyalarını tekrar JPG formatına dönüştürebilirsiniz." },
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
