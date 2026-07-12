import type { Metadata } from "next";
import Link from "next/link";
import WordCompressLoader from "@/components/tools/document/WordCompressLoader";

export const metadata: Metadata = {
  title: "Word Sıkıştır — Ücretsiz Online Word Boyut Küçültme | FormatJet",
  description: "Word dosyasının boyutunu optimize et ve küçült. Yakında aktif.",
  keywords: ["word sıkıştır", "compress word", "word küçült", "docx boyut azalt"],
};

export default function WordSikistirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#3B82F6" }}>Word Sıkıştır</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Word Sıkıştır</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Word dosyanın boyutunu küçült, gömmeli görselleri optimize et.</p>
          </div>
        </div>
        <WordCompressLoader />
      </div>
    </div>
  );
}
