import type { Metadata } from "next";
import Link from "next/link";
import PdfCompressLoader from "@/components/tools/pdf/PdfCompressLoader";

export const metadata: Metadata = {
  title: "PDF Sıkıştır — Ücretsiz Online PDF Boyut Küçültme",
  description:
    "PDF dosyasının boyutunu tarayıcında küçült. Sunucuya yükleme gerekmez, güvenli ve ücretsiz. Birden fazla PDF toplu sıkıştırma desteklenir.",
  keywords: ["pdf sıkıştır", "pdf küçült", "compress pdf", "pdf boyut azalt", "pdf optimize"],
};

export default function PdfSikistirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">

        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF Sıkıştır</span>
        </nav>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>
              PDF Sıkıştır
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              PDF boyutunu küçült. Seviyeyi seç, toplu işlem yap, tarayıcında indir.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz: en fazla <strong style={{ color: "var(--color-text)" }}>10 dosya</strong>, her biri <strong style={{ color: "var(--color-text)" }}>50 MB</strong></span>
          <button className="font-medium hover:underline" style={{ color: "#E84545" }}>Pro&apos;ya geç →</button>
        </div>

        <PdfCompressLoader />

        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>PDF Sıkıştırma Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "Nasıl çalışır?", a: "PDF yapısı yeniden organize edilir, gereksiz nesneler ve meta veriler temizlenir. İşlem tamamen tarayıcıda gerçekleşir." },
              { q: "Ne kadar küçülür?", a: "Sıkıştırma oranı PDF içeriğine bağlıdır. Çok sayıda görsel içeren PDF'ler genellikle %20-60 küçülür." },
              { q: "Kalite etkileniyor mu?", a: "Metin ve vektör içerik kalitesi korunur. Görsel ağırlıklı PDF'ler için 'Baskı Kalitesi' seviyesini kullanın." },
              { q: "Dosyalarım güvende mi?", a: "Evet. Tüm işlem tarayıcınızda yapılır, PDF'ler sunucumuza yüklenmez." },
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
