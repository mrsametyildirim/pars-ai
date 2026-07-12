import type { Metadata } from "next";
import Link from "next/link";
import WordMergeLoader from "@/components/tools/document/WordMergeLoader";

export const metadata: Metadata = {
  title: "Word Birleştir — Ücretsiz Online Word Belgesi Birleştirme | FormatJet",
  description: "Birden fazla Word belgesini tek belgede birleştir. Yakında aktif.",
  keywords: ["word birleştir", "merge word", "word belgesi birleştir", "docx birleştir"],
};

export default function WordBirlestirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#3B82F6" }}>Word Birleştir</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Word Birleştir</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Birden fazla Word belgesini tek DOCX dosyasında birleştir.</p>
          </div>
        </div>
        <WordMergeLoader />
      </div>
    </div>
  );
}
