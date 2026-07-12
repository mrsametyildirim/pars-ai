import type { Metadata } from "next";
import Link from "next/link";
import ImageConvertLoader from "@/components/tools/image/ImageConvertLoader";

export const metadata: Metadata = {
  title: "JPG → PNG Dönüştür — Ücretsiz Online JPG PNG Çevirici",
  description:
    "JPG görsellerini şeffaflık destekli PNG formatına dönüştür. Toplu işlem, tarayıcıda çalışır, sunucuya yükleme gerekmez.",
  keywords: ["jpg to png", "jpg png", "jpeg png dönüştür", "png şeffaf"],
};

export default function JpgToPngPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>JPG → PNG</span>
        </nav>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H2v6"/><path d="M2 3l7 7"/><path d="M16 21h6v-6"/><path d="M22 21l-7-7"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>
              JPG → PNG Dönüştür
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              JPG dosyalarını kayıpsız PNG formatına çevir. Şeffaflık desteği, toplu işlem.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>30 görsel</strong></span>
          <button className="font-medium hover:underline" style={{ color: "#818CF8" }}>Pro&apos;ya geç →</button>
        </div>

        <ImageConvertLoader
          accept="image/jpeg,image/jpg,.jpg,.jpeg"
          targetFormat="image/png"
          targetExt="png"
          defaultQuality={95}
          accentColor="#818CF8"
        />

        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>JPG → PNG Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "PNG neden daha iyi?", a: "PNG kayıpsız sıkıştırma kullanır. Logo, ekran görüntüsü ve şeffaf arka plan gerektiren görseller için idealdir." },
              { q: "Dosya boyutu büyür mü?", a: "Evet, PNG genellikle JPG'den daha büyüktür çünkü kayıpsız formattır. Ama kalite tam korunur." },
              { q: "Şeffaflık eklenir mi?", a: "JPG şeffaflık içermez. Dönüştürme sonrası PNG şeffaflığı manuel olarak düzenleyici programla eklenebilir." },
              { q: "Toplu dönüştürme var mı?", a: "Evet, aynı anda 30 dosyaya kadar toplu dönüştürme desteklenir." },
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
