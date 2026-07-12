import type { Metadata } from "next";
import Link from "next/link";
import PdfMergeLoader from "@/components/tools/pdf/PdfMergeLoader";

export const metadata: Metadata = {
  title: "PDF Birleştir — Ücretsiz Online PDF Birleştirme",
  description:
    "Birden fazla PDF dosyasını tek bir belgede birleştir. Tarayıcıda çalışır, sunucuya yükleme gerekmez. Sıralı sürükle-bırak desteği.",
  keywords: ["pdf birleştir", "pdf merge", "pdf birleştirme", "merge pdf online"],
};

export default function PdfMergePage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">

        {/* Geri + Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "var(--color-accent)" }}>PDF Birleştir</span>
        </nav>

        {/* Sayfa başlığı */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>
              PDF Birleştir
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Birden fazla PDF&apos;i sürükleyerek sıraya koy ve tek dosyada birleştir. Tarayıcında, sunucuya yükleme olmadan.
            </p>
          </div>
        </div>

        {/* Limit çubuğu */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-4 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>
            Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>10 dosya</strong>, her biri <strong style={{ color: "var(--color-text)" }}>25 MB</strong>
          </span>
          <button className="font-medium hover:underline" style={{ color: "var(--color-accent)" }}>
            Pro&apos;ya geç →
          </button>
        </div>

        {/* Araç — sadece client-side */}
        <PdfMergeLoader />

        {/* SSS / Meta bilgi */}
        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>
            PDF Birleştirme Hakkında
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: "PDF dosyaları güvende mi?",
                a: "Evet. Birleştirme işlemi tamamen tarayıcında gerçekleşir. Dosyalar sunucumuza yüklenmez."
              },
              {
                q: "Kaç PDF birleştirebilirim?",
                a: "Ücretsiz planda en fazla 10 PDF, her biri 25 MB sınırıyla. Pro&apos;da limitsiz."
              },
              {
                q: "Sayfa sırası korunuyor mu?",
                a: "Evet. Sürükle-bırak ile sıralayabilirsin; birleştirmede o sıra esas alınır."
              },
              {
                q: "Hangi PDF sürümlerini destekler?",
                a: "PDF 1.0–2.0 arası tüm standart PDF dosyaları desteklenmektedir."
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
