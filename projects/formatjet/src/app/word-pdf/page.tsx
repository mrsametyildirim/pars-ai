import type { Metadata } from "next";
import Link from "next/link";
import WordToPdfLoader from "@/components/tools/document/WordToPdfLoader";

export const metadata: Metadata = {
  title: "Word → PDF — Ücretsiz Online Word'den PDF Dönüştürme | FormatJet",
  description: "Word (.docx) belgesini PDF'e dönüştür. Tarayıcıda çalışır, sunucuya gönderilmez.",
  keywords: ["word to pdf", "word pdf", "docx pdf", "word'den pdf"],
};

export default function WordPdfPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>Word → PDF</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Word → PDF</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Word (DOC/DOCX) belgesini yüksek kaliteli PDF olarak dışa aktar.</p>
          </div>
        </div>
        <WordToPdfLoader />
      </div>
    </div>
  );
}
