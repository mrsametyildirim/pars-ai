import type { Metadata } from "next";
import Link from "next/link";
import ImageConvertLoader from "@/components/tools/image/ImageConvertLoader";

export const metadata: Metadata = {
  title: "WebP → JPG Dönüştür — Ücretsiz Online WebP JPG Çevirici",
  description:
    "WebP görsellerini JPG formatına dönüştür. Toplu işlem, kalite ayarı, tarayıcıda çalışır. Sunucuya yükleme gerekmez.",
  keywords: ["webp jpg", "webp dönüştür", "webp to jpg", "webp jpeg çevir"],
};

export default function WebpToJpgPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">

        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>WebP → JPG</span>
        </nav>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H2v6"/><path d="M2 3l7 7"/><path d="M16 21h6v-6"/><path d="M22 21l-7-7"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>
              WebP → JPG Dönüştür
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              WebP dosyalarını JPG&apos;ye çevir. Toplu işlem, kalite seçimi, tarayıcında çalışır.
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
          accept="image/webp,.webp"
          targetFormat="image/jpeg"
          targetExt="jpg"
          defaultQuality={92}
          accentColor="#818CF8"
        />

        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>
            WebP → JPG Hakkında
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "Neden WebP'yi JPG'ye çevirmeli?",
                a: "WebP tüm platformlarda desteklenmez. E-posta, eski uygulama ve bazı yazıcılar JPG gerektiriyor olabilir."
              },
              {
                q: "Kalite kaybı olur mu?",
                a: "JPG kayıplı bir formattır. %90+ kalite ayarında fark genellikle gözle ayırt edilemez."
              },
              {
                q: "Şeffaflık ne olur?",
                a: "JPG şeffaflığı desteklemez. WebP'nin şeffaf kısımları beyaz arka planla doldurulur."
              },
              {
                q: "Birden fazla dosya dönüştürebilir miyim?",
                a: "Evet. Aynı anda 30 dosyaya kadar toplu dönüşüm desteklenir. Tümünü bir tıkla indir."
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
