import type { Metadata } from "next";
import Link from "next/link";
import PdfToWordLoader from "@/components/tools/pdf/PdfToWordLoader";

export const metadata: Metadata = {
  title: "PDF → Word — Ücretsiz Online PDF'den Word Dönüştürme | FormatJet",
  description: "PDF dosyasını düzenlenebilir Word belgesine dönüştür. Yakında aktif.",
  keywords: ["pdf to word", "pdf word", "pdf docx", "convert pdf to word"],
};

export default function PdfWordPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#E84545" }}>PDF → Word</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(232,69,69,0.15)", color: "#E84545" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>PDF → Word</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>PDF dosyasını düzenlenebilir DOCX formatına dönüştür.</p>
          </div>
        </div>
        <PdfToWordLoader />
      </div>
    </div>
  );
}
