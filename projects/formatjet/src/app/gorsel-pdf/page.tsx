import type { Metadata } from "next";
import Link from "next/link";
import ImageToPdfLoader from "@/components/tools/pdf/ImageToPdfLoader";

export const metadata: Metadata = {
  title: "Görsel → PDF Dönüştür — JPG PNG'yi PDF'e Çevir",
  description:
    "JPG, PNG ve WebP görsellerini PDF'e dönüştür. Sayfa boyutu, yön ve kenar boşluğu seçeneği. Toplu işlem, tarayıcıda çalışır.",
  keywords: ["görsel pdf", "jpg pdf", "png pdf", "image to pdf", "fotoğraf pdf"],
};

export default function GoruselPdfPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">

        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>Görsel → PDF</span>
        </nav>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsel → PDF</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              JPG, PNG ve WebP görsellerinizi PDF dosyasına dönüştür. Sırayı kendin belirle.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>20 görsel</strong></span>
          <button className="font-medium hover:underline" style={{ color: "#E84545" }}>Pro&apos;ya geç →</button>
        </div>

        <ImageToPdfLoader />

        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>Görsel → PDF Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "Hangi görseller desteklenir?", a: "JPG, PNG, WebP ve BMP dahil olmak üzere tüm yaygın görsel formatları desteklenir." },
              { q: "Sırayı değiştirebilir miyim?", a: "Evet. Yükleme sonrası listede ▲▼ okları ile görselleri istediğin sıraya alabilirsin." },
              { q: "Sayfa boyutu ne seçilmeli?", a: "Baskı için A4 veya Letter. Görseli tam boyutunda korumak için 'Orijinal' seçeneğini kullan." },
              { q: "Kalite nasıl?", a: "Görseller PDF içine yüksek kalitede gömülür. JPEG sıkıştırma %92 kaliteyle yapılır." },
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
