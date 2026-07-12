import type { Metadata } from "next";
import Link from "next/link";
import ImageResizeLoader from "@/components/tools/image/ImageResizeLoader";

export const metadata: Metadata = {
  title: "Görsel Boyutlandır — Ücretsiz Online Resim Yeniden Boyutlandırma",
  description:
    "Görselleri piksel veya yüzde olarak yeniden boyutlandır. En-boy oranı kilidi, hazır ölçüler ve toplu işlem. Tarayıcında çalışır.",
  keywords: ["görsel boyutlandır", "resim boyutlandır", "resize image", "görsel küçült", "görsel büyüt"],
};

export default function GoruselBoyutlandirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Görsel Boyutlandır</span>
        </nav>

        {/* Sayfa başlığı */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 21H3"/><path d="M21 3v18"/><path d="M7 17 17 7"/><path d="M7 7h10v10"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>
              Görsel Boyutlandır
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Piksel veya yüzde ile yeniden boyutlandır. HD, FHD, 4K hazır ölçüler ve toplu işlem.
            </p>
          </div>
        </div>

        {/* Limit çubuğu */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>
            Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>10 görsel</strong>
          </span>
          <button className="font-medium hover:underline" style={{ color: "#818CF8" }}>
            Pro&apos;ya geç →
          </button>
        </div>

        {/* Araç */}
        <ImageResizeLoader />

        {/* Bilgi */}
        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>
            Görsel Boyutlandırma Hakkında
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "En-boy oranı kilidi ne işe yarar?",
                a: "Aktifken genişlik veya yükseklik girince diğer boyut otomatik hesaplanır. Görselin bozulmamasını sağlar."
              },
              {
                q: "Yüzde modu nedir?",
                a: "Orijinal boyutun yüzdesine göre küçültür veya büyütür. %50 = yarı boyut, %200 = iki kat büyütme."
              },
              {
                q: "Büyütmek kaliteyi düşürür mü?",
                a: "Evet. Görsel büyütme piksel interpole ettiğinden netlik kaybolabilir. Mümkünse orijinal yüksek çözünürlüklü görsel kullanın."
              },
              {
                q: "Toplu işlem nasıl çalışır?",
                a: "Birden fazla görsel yüklendiğinde aynı boyut ayarları hepsine uygulanır. Her görsel orijinal adıyla kaydedilir."
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
