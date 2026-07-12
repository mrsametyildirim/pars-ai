import type { Metadata } from "next";
import Link from "next/link";
import ImageConvertLoader from "@/components/tools/image/ImageConvertLoader";

export const metadata: Metadata = {
  title: "PNG → JPG Dönüştür — Ücretsiz Online PNG JPG Çevirici",
  description:
    "PNG görsellerini JPG formatına dönüştür. Toplu işlem, kalite ayarı, tarayıcıda çalışır. Sunucuya yükleme gerekmez.",
  keywords: ["png jpg", "png dönüştür", "png to jpg", "png jpeg çevir"],
};

export default function PngToJpgPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">

        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>PNG → JPG</span>
        </nav>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H2v6"/><path d="M2 3l7 7"/><path d="M16 21h6v-6"/><path d="M22 21l-7-7"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>
              PNG → JPG Dönüştür
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              PNG dosyalarını JPG formatına çevir. Dosya boyutunu küçült, uyumluluğu artır.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>
            Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>30 görsel</strong>
          </span>
          <button className="font-medium hover:underline" style={{ color: "#818CF8" }}>Pro&apos;ya geç →</button>
        </div>

        <ImageConvertLoader
          accept="image/png,.png"
          targetFormat="image/jpeg"
          targetExt="jpg"
          defaultQuality={90}
          accentColor="#818CF8"
        />

        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>
            PNG → JPG Hakkında
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "PNG'yi neden JPG'ye çevirmeliyim?",
                a: "JPG dosyaları genellikle PNG'den çok daha küçüktür. Fotoğraflar için web, e-posta ve paylaşım JPG tercih eder."
              },
              {
                q: "Şeffaf arka plan ne olur?",
                a: "JPG şeffaflığı desteklemez. PNG'deki şeffaf alanlar otomatik olarak beyaz arka planla doldurulur."
              },
              {
                q: "Hangi kaliteyi seçmeliyim?",
                a: "Web için %85-90 idealdir. Baskı için %95+. Yüksek kalite = büyük dosya dengesi."
              },
              {
                q: "PNG daha kaliteli değil mi?",
                a: "PNG kayıpsız ama daha büyüktür. Ekran görüntüsü ve logo için PNG; fotoğraf için JPG daha uygundur."
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
