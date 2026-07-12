import type { Metadata } from "next";
import Link from "next/link";
import PdfOcrLoader from "@/components/tools/pdf/PdfOcrLoader";

export const metadata: Metadata = {
  title: "PDF OCR — Taranmış PDF'den Metin Çıkar | FormatJet",
  description: "Taranmış PDF'deki metni OCR teknolojisiyle tanı, kopyala veya .txt olarak indir. Tarayıcıda çalışır, ücretsiz.",
  keywords: ["pdf ocr", "taranmış pdf", "scanned pdf", "pdf metin tanı", "aranabilir pdf", "tesseract"],
};

export default function PdfOcrPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF OCR</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl font-medium" style={{ color: "var(--color-text)" }}>PDF OCR</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>Metin Tanıma</span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Taranmış PDF'deki metni tanı ve kopyalanabilir .txt dosyası olarak indir. Türkçe dahil 5 dil desteklenir.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: "🔍", title: "5 Dil Desteği", desc: "Türkçe, İngilizce, Almanca, Fransızca, İspanyolca" },
            { icon: "📄", title: "Çok Sayfalı", desc: "Tüm PDF sayfaları otomatik taranır" },
            { icon: "🔒", title: "Gizlilik", desc: "Dosyan hiçbir sunucuya gönderilmez" },
          ].map(f => (
            <div key={f.title} className="p-3 rounded-xl border text-center" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-text)" }}>{f.title}</p>
              <p className="text-xs" style={{ color: "var(--color-text-3)" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <PdfOcrLoader />
      </div>
    </div>
  );
}
