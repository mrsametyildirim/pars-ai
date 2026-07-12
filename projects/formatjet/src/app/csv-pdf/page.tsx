import type { Metadata } from "next";
import Link from "next/link";
import { CsvToPdfLoader } from "@/components/tools/document/DocumentNewLoaders";

export const metadata: Metadata = {
  title: "CSV → PDF Tablo — Ücretsiz Online Araç",
  description: "CSV dosyasını tablo formatında PDF'e dönüştür. Yatay A4, başlık satırı, satır renklenme.",
  keywords: ["csv pdf", "csv tablo pdf", "csv dönüştür", "csv to pdf table"],
};

export default function CsvPdfPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#3B82F6" }}>CSV → PDF</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.12)", color: "#3B82F6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5z"/><path d="M9 3v5h10"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>CSV → PDF</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>CSV verisini tablo olarak PDF&apos;e aktar. Yatay A4, başlık satırı renkli.</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border mb-6 text-xs" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <span style={{ color: "var(--color-text-2)" }}>Ücretsiz · Tablo formatı otomatik</span>
          <button className="font-medium hover:underline" style={{ color: "#3B82F6" }}>Pro&apos;ya geç →</button>
        </div>
        <CsvToPdfLoader />
      </div>
    </div>
  );
}
